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
        <p className="eyebrow">Fase 1</p>
        <h1>Mi Bitacora de Entrenamiento</h1>
        <p className="subtitle">
          Fase 1 — useState + useEffect + Backend Express
        </p>
        <p className="phase-note">
          Frontend funcionando con LocalStorage. Backend separado para Fase 1.
        </p>
      </header>

      {mensaje && <p className="status-message">{mensaje}</p>}

      <div className="crud-layout">
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
      </div>
    </main>
  );
}

export default App;
