import { useEffect, useMemo, useState } from "react";
import { guardarItems } from "./services/localStorageService";
import { CATEGORIAS } from "./utils/categorias";

function crearItemInicial() {
  const fechaActual = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    nombre: "Push Day",
    categoriaId: "fuerza",
    estado: "planeado",
    puntuacion: null,
    fechaRegistro: fechaActual,
    fechaActividad: fechaActual,
    notas: "Sesion base para verificar el modelo del item.",
    atributos: {
      duracionMinutos: 60,
      intensidad: "media",
      ejercicios: ["press banca", "press militar", "fondos"],
      volumenTotal: 3200,
      pr: false
    },
    activo: true
  };
}

function App() {
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem("items");
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });
  const [itemEditando, setItemEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
    guardarItems(items);
  }, [items]);

  const itemsActivos = useMemo(
    () => items.filter((item) => item.activo),
    [items]
  );

  function agregarItem(item) {
    setItems((itemsActuales) => [item, ...itemsActuales]);
    setMensaje("Sesion agregada correctamente.");
  }

  function actualizarItem(itemActualizado) {
    setItems((itemsActuales) =>
      itemsActuales.map((item) =>
        item.id === itemActualizado.id ? itemActualizado : item
      )
    );
    setItemEditando(null);
    setMensaje("Sesion actualizada correctamente.");
  }

  function archivarItem(id) {
    setItems((itemsActuales) =>
      itemsActuales.map((item) =>
        item.id === id
          ? {
              ...item,
              activo: false,
              fechaActividad: new Date().toISOString()
            }
          : item
      )
    );
    setMensaje("Sesion archivada correctamente.");
  }

  function iniciarEdicion(item) {
    setItemEditando(item);
    setMensaje("");
  }

  function cancelarEdicion() {
    setItemEditando(null);
    setMensaje("Edicion cancelada.");
  }

  function agregarSesionDemo() {
    agregarItem(crearItemInicial());
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Fase 1</p>
        <h1>Mi Bitacora de Entrenamiento</h1>
        <p className="subtitle">
          Frontend preparado con modelo de items, categorias y persistencia en
          LocalStorage.
        </p>
      </section>

      <section className="setup-panel" aria-label="Estado del modelo">
        <div>
          <h2>Modelo listo para el CRUD</h2>
          <p>
            Items activos: <strong>{itemsActivos.length}</strong>
          </p>
          <p>
            Item en edicion:{" "}
            <strong>{itemEditando ? itemEditando.nombre : "ninguno"}</strong>
          </p>
          {mensaje && <p className="status-message">{mensaje}</p>}
        </div>

        <div className="setup-actions">
          <button type="button" onClick={agregarSesionDemo}>
            Agregar sesion demo
          </button>
          <button
            type="button"
            onClick={() => itemsActivos[0] && iniciarEdicion(itemsActivos[0])}
            disabled={itemsActivos.length === 0}
          >
            Probar edicion
          </button>
          <button
            type="button"
            onClick={() =>
              itemEditando
                ? actualizarItem({
                    ...itemEditando,
                    estado: "completado",
                    fechaActividad: new Date().toISOString()
                  })
                : cancelarEdicion()
            }
            disabled={!itemEditando}
          >
            Marcar completado
          </button>
          <button
            type="button"
            onClick={() => itemsActivos[0] && archivarItem(itemsActivos[0].id)}
            disabled={itemsActivos.length === 0}
          >
            Probar archivo
          </button>
          <button type="button" onClick={cancelarEdicion}>
            Cancelar edicion
          </button>
        </div>

        <ul className="category-list">
          {CATEGORIAS.map((categoria) => (
            <li key={categoria.id} style={{ "--category-color": categoria.color }}>
              <span>{categoria.emoji}</span>
              {categoria.nombre}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
