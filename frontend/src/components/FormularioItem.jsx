import { forwardRef, useEffect, useState } from "react";
import { CATEGORIAS } from "../utils/categorias";

const ESTADOS = ["planeado", "completado", "omitido"];
const INTENSIDADES = ["baja", "media", "alta"];

const FORMULARIO_INICIAL = {
  nombre: "",
  categoriaId: "",
  estado: "planeado",
  puntuacion: "",
  duracionMinutos: "",
  intensidad: "media",
  ejercicios: "",
  volumenTotal: "0",
  pr: false,
  notas: ""
};

function itemAFormulario(item) {
  return {
    nombre: item.nombre ?? "",
    categoriaId: item.categoriaId ?? "",
    estado: item.estado ?? "planeado",
    puntuacion: item.puntuacion ?? "",
    duracionMinutos: item.atributos?.duracionMinutos ?? "",
    intensidad: item.atributos?.intensidad ?? "media",
    ejercicios: item.atributos?.ejercicios?.join(", ") ?? "",
    volumenTotal: item.atributos?.volumenTotal ?? "0",
    pr: Boolean(item.atributos?.pr),
    notas: item.notas ?? ""
  };
}

function validarFormulario(formulario) {
  const errores = {};
  const puntuacion = formulario.puntuacion === "" ? null : Number(formulario.puntuacion);
  const duracionMinutos = Number(formulario.duracionMinutos);
  const volumenTotal = Number(formulario.volumenTotal);

  if (!formulario.nombre.trim()) {
    errores.nombre = "El nombre es obligatorio.";
  }

  if (!formulario.categoriaId) {
    errores.categoriaId = "Selecciona una categoria.";
  }

  if (!formulario.estado) {
    errores.estado = "Selecciona un estado.";
  }

  if (
    formulario.puntuacion !== "" &&
    (Number.isNaN(puntuacion) || puntuacion < 0 || puntuacion > 10)
  ) {
    errores.puntuacion = "La puntuacion debe estar entre 0 y 10.";
  }

  if (Number.isNaN(duracionMinutos) || duracionMinutos <= 0) {
    errores.duracionMinutos = "La duracion debe ser mayor que 0.";
  }

  if (!formulario.intensidad) {
    errores.intensidad = "Selecciona una intensidad.";
  }

  if (Number.isNaN(volumenTotal) || volumenTotal < 0) {
    errores.volumenTotal = "El volumen total debe ser 0 o mayor.";
  }

  return errores;
}

function convertirEjercicios(valor) {
  return valor
    .split(",")
    .map((ejercicio) => ejercicio.trim())
    .filter(Boolean);
}

// forwardRef permite que App.jsx controle el focus del input de nombre (useRef uso 1)
const FormularioItem = forwardRef(function FormularioItem(
  { itemEditando, onAgregar, onActualizar, onCancelarEdicion },
  ref
) {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    setFormulario(itemEditando ? itemAFormulario(itemEditando) : FORMULARIO_INICIAL);
    setErrores({});
  }, [itemEditando]);

  function actualizarCampo(evento) {
    const { name, value, type, checked } = evento.target;
    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    const erroresValidacion = validarFormulario(formulario);
    setErrores(erroresValidacion);

    if (Object.keys(erroresValidacion).length > 0) {
      return;
    }

    const fechaActual = new Date().toISOString();
    const item = {
      id: itemEditando?.id ?? crypto.randomUUID(),
      nombre: formulario.nombre.trim(),
      categoriaId: formulario.categoriaId,
      estado: formulario.estado,
      puntuacion:
        formulario.puntuacion === "" ? null : Number(formulario.puntuacion),
      fechaRegistro: itemEditando?.fechaRegistro ?? fechaActual,
      fechaActividad: fechaActual,
      notas: formulario.notas.trim(),
      atributos: {
        duracionMinutos: Number(formulario.duracionMinutos),
        intensidad: formulario.intensidad,
        ejercicios: convertirEjercicios(formulario.ejercicios),
        volumenTotal: Number(formulario.volumenTotal),
        pr: formulario.pr
      },
      activo: itemEditando?.activo ?? true
    };

    if (itemEditando) {
      onActualizar(item);
    } else {
      onAgregar(item);
    }

    setFormulario(FORMULARIO_INICIAL);
    setErrores({});
  }

  function manejarCancelar() {
    setFormulario(FORMULARIO_INICIAL);
    setErrores({});
    onCancelarEdicion();
  }

  return (
    <form className="item-form" onSubmit={manejarEnvio}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">Sesion</p>
          <h2>{itemEditando ? "Editar entrenamiento" : "Nueva sesion"}</h2>
        </div>
        {itemEditando && (
          <button className="button ghost" type="button" onClick={manejarCancelar}>
            Cancelar
          </button>
        )}
      </div>

      <label>
        Nombre
        <input
          ref={ref}
          name="nombre"
          value={formulario.nombre}
          onChange={actualizarCampo}
          placeholder="Push Day"
        />
        {errores.nombre && <span className="field-error">{errores.nombre}</span>}
      </label>

      <div className="form-grid">
        <label>
          Categoria
          <select
            name="categoriaId"
            value={formulario.categoriaId}
            onChange={actualizarCampo}
          >
            <option value="">Seleccionar</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.emoji} {categoria.nombre}
              </option>
            ))}
          </select>
          {errores.categoriaId && (
            <span className="field-error">{errores.categoriaId}</span>
          )}
        </label>

        <label>
          Estado
          <select name="estado" value={formulario.estado} onChange={actualizarCampo}>
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          {errores.estado && <span className="field-error">{errores.estado}</span>}
        </label>
      </div>

      <div className="form-grid">
        <label>
          Puntuacion
          <input
            name="puntuacion"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={formulario.puntuacion}
            onChange={actualizarCampo}
            placeholder="8"
          />
          {errores.puntuacion && (
            <span className="field-error">{errores.puntuacion}</span>
          )}
        </label>

        <label>
          Duracion minutos
          <input
            name="duracionMinutos"
            type="number"
            min="1"
            value={formulario.duracionMinutos}
            onChange={actualizarCampo}
            placeholder="60"
          />
          {errores.duracionMinutos && (
            <span className="field-error">{errores.duracionMinutos}</span>
          )}
        </label>
      </div>

      <div className="form-grid">
        <label>
          Intensidad
          <select
            name="intensidad"
            value={formulario.intensidad}
            onChange={actualizarCampo}
          >
            {INTENSIDADES.map((intensidad) => (
              <option key={intensidad} value={intensidad}>
                {intensidad}
              </option>
            ))}
          </select>
          {errores.intensidad && (
            <span className="field-error">{errores.intensidad}</span>
          )}
        </label>

        <label>
          Volumen total
          <input
            name="volumenTotal"
            type="number"
            min="0"
            value={formulario.volumenTotal}
            onChange={actualizarCampo}
            placeholder="3200"
          />
          {errores.volumenTotal && (
            <span className="field-error">{errores.volumenTotal}</span>
          )}
        </label>
      </div>

      <label>
        Ejercicios
        <input
          name="ejercicios"
          value={formulario.ejercicios}
          onChange={actualizarCampo}
          placeholder="press banca, press militar, fondos"
        />
      </label>

      <label>
        Notas
        <textarea
          name="notas"
          rows="4"
          value={formulario.notas}
          onChange={actualizarCampo}
          placeholder="Observaciones libres de la sesion"
        />
      </label>

      <label className="checkbox-field">
        <input
          name="pr"
          type="checkbox"
          checked={formulario.pr}
          onChange={actualizarCampo}
        />
        Hubo PR en esta sesion
      </label>

      <button className="button primary" type="submit">
        {itemEditando ? "Guardar cambios" : "Crear sesion"}
      </button>
    </form>
  );
});

export default FormularioItem;
