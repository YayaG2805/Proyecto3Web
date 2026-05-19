import { randomUUID } from "node:crypto";
import { Router } from "express";
import { query } from "../db/index.js";

const router = Router();

function asyncHandler(controller) {
  return (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
}

function parseAtributos(atributos) {
  if (!atributos) {
    return {};
  }

  if (typeof atributos === "object") {
    return atributos;
  }

  try {
    return JSON.parse(atributos);
  } catch {
    return {};
  }
}

function serializarItem(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    nombre: row.nombre,
    categoriaId: row.categoriaid,
    estado: row.estado,
    puntuacion: row.puntuacion,
    fechaRegistro: row.fecharegistro,
    fechaActividad: row.fechaactividad,
    notas: row.notas,
    atributos: parseAtributos(row.atributos),
    activo: row.activo === 1
  };
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT *
       FROM items
       WHERE activo = 1
       ORDER BY fechaRegistro DESC`
    );

    res.json(result.rows.map(serializarItem));
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = await query("SELECT * FROM items WHERE id = $1", [
      req.params.id
    ]);
    const item = serializarItem(result.rows[0]);

    if (!item) {
      return res.status(404).json({ error: "Item no encontrado" });
    }

    res.json(item);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      id = randomUUID(),
      nombre,
      categoriaId = null,
      estado = "planeado",
      puntuacion = null,
      fechaRegistro = new Date().toISOString(),
      fechaActividad = new Date().toISOString(),
      notas = "",
      atributos = {}
    } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const result = await query(
      `INSERT INTO items (
        id,
        nombre,
        categoriaId,
        estado,
        puntuacion,
        fechaRegistro,
        fechaActividad,
        notas,
        atributos,
        activo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1)
      RETURNING *`,
      [
        id,
        nombre.trim(),
        categoriaId,
        estado,
        puntuacion,
        fechaRegistro,
        fechaActividad,
        notas,
        JSON.stringify(atributos)
      ]
    );

    res.status(201).json(serializarItem(result.rows[0]));
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const existente = await query("SELECT * FROM items WHERE id = $1", [
      req.params.id
    ]);

    if (existente.rowCount === 0) {
      return res.status(404).json({ error: "Item no encontrado" });
    }

    const itemActual = serializarItem(existente.rows[0]);
    const {
      nombre = itemActual.nombre,
      categoriaId = itemActual.categoriaId,
      estado = itemActual.estado,
      puntuacion = itemActual.puntuacion,
      notas = itemActual.notas,
      atributos = itemActual.atributos,
      activo = itemActual.activo
    } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const result = await query(
      `UPDATE items
       SET nombre = $1,
           categoriaId = $2,
           estado = $3,
           puntuacion = $4,
           fechaActividad = $5,
           notas = $6,
           atributos = $7,
           activo = $8
       WHERE id = $9
       RETURNING *`,
      [
        nombre.trim(),
        categoriaId,
        estado,
        puntuacion,
        new Date().toISOString(),
        notas,
        JSON.stringify(atributos),
        activo ? 1 : 0,
        req.params.id
      ]
    );

    res.json(serializarItem(result.rows[0]));
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = await query(
      `UPDATE items
       SET activo = 0,
           fechaActividad = $1
       WHERE id = $2
       RETURNING *`,
      [new Date().toISOString(), req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Item no encontrado" });
    }

    res.json({
      ok: true,
      message: "Item archivado correctamente",
      item: serializarItem(result.rows[0])
    });
  })
);

router.post(
  "/:id/registro",
  asyncHandler(async (req, res) => {
    const item = await query("SELECT id FROM items WHERE id = $1", [
      req.params.id
    ]);

    if (item.rowCount === 0) {
      return res.status(404).json({ error: "Item no encontrado" });
    }

    const valor = Number(req.body.valor);
    const notas = req.body.notas ?? "";

    if (Number.isNaN(valor)) {
      return res.status(400).json({ error: "El valor debe ser numerico" });
    }

    const result = await query(
      `INSERT INTO registros (id, itemId, fecha, valor, notas)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [randomUUID(), req.params.id, new Date().toISOString(), valor, notas]
    );

    res.status(201).json({
      id: result.rows[0].id,
      itemId: result.rows[0].itemid,
      fecha: result.rows[0].fecha,
      valor: result.rows[0].valor,
      notas: result.rows[0].notas
    });
  })
);

export default router;
