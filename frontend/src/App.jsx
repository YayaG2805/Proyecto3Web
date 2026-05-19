import { useEffect, useMemo, useState } from "react";
import FormularioItem from "./components/FormularioItem";
import ListaItems from "./components/ListaItems";
import { CATEGORIAS } from "./utils/categorias";

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
  }, [items]);

  const itemsActivos = useMemo(
    () => items.filter((item) => item.activo),
    [items]
  );

  const sesionesCompletadas = useMemo(
    () => itemsActivos.filter((item) => item.estado === "completado").length,
    [itemsActivos]
  );

  const minutosTotales = useMemo(
    () =>
      itemsActivos.reduce(
        (total, item) => total + Number(item.atributos?.duracionMinutos ?? 0),
        0
      ),
    [itemsActivos]
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
    setMensaje("");
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <h1>Iron Diary</h1>
        </div>

        <div className="summary-board" aria-label="Resumen de sesiones">
          <div>
            <span>{itemsActivos.length}</span>
            <p>Activas</p>
          </div>
          <div>
            <span>{sesionesCompletadas}</span>
            <p>Completadas</p>
          </div>
          <div>
            <span>{minutosTotales}</span>
            <p>Minutos</p>
          </div>
        </div>
      </header>

      {mensaje && <p className="status-message">{mensaje}</p>}

      <section className="crud-layout" aria-label="CRUD de sesiones">
        <FormularioItem
          itemEditando={itemEditando}
          onAgregar={agregarItem}
          onActualizar={actualizarItem}
          onCancelarEdicion={cancelarEdicion}
        />

        <ListaItems
          items={itemsActivos}
          categorias={CATEGORIAS}
          onEditar={iniciarEdicion}
          onArchivar={archivarItem}
        />
      </section>
    </main>
  );
}

export default App;
