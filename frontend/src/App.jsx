import { useEffect, useMemo, useRef, useState } from "react";
import FormularioItem from "./components/FormularioItem";
import ListaItems from "./components/ListaItems";
import { CATEGORIAS } from "./utils/categorias";
import { useStorage } from "./context/useStorage";
import { useTheme } from "./context/useTheme";
import { useUser } from "./context/useUser";

function formatearTiempo(segundos) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function App() {
  const { modo, setModo, cargando, error, obtenerItems, guardarItem, eliminarItem } =
    useStorage();
  const { tema, toggleTema } = useTheme();
  const { usuario } = useUser();

  const [items, setItems] = useState([]);
  const [itemEditando, setItemEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [segundos, setSegundos] = useState(0);

  // useRef uso 1: referencia al input de nombre para focus programático
  const nombreInputRef = useRef(null);

  // useRef uso 2: ID del setInterval — no causa re-render al guardarse
  const intervalRef = useRef(null);

  // Contador de tiempo activo en la sesión
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSegundos((s) => s + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Recarga items cuando cambia el modo (obtenerItems cambia con modo)
  useEffect(() => {
    async function cargar() {
      const data = await obtenerItems();
      setItems(data.filter((item) => item.activo));
    }
    cargar();
  }, [obtenerItems]);

  // Atajo Ctrl+N para enfocar el input de nombre
  useEffect(() => {
    const handler = (evento) => {
      if (evento.ctrlKey && (evento.key === "n" || evento.key === "N")) {
        evento.preventDefault();
        nombreInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  async function recargarItems() {
    const data = await obtenerItems();
    setItems(data.filter((item) => item.activo));
  }

  async function agregarItem(item) {
    await guardarItem(item);
    await recargarItems();
    setMensaje("Sesión agregada correctamente.");
    nombreInputRef.current?.focus();
  }

  async function actualizarItem(itemActualizado) {
    await guardarItem(itemActualizado);
    await recargarItems();
    setItemEditando(null);
    setMensaje("Sesión actualizada correctamente.");
  }

  async function archivarItem(id) {
    await eliminarItem(id);
    await recargarItems();
    setMensaje("Sesión archivada correctamente.");
  }

  function iniciarEdicion(item) {
    setItemEditando(item);
    setMensaje("");
  }

  function cancelarEdicion() {
    setItemEditando(null);
    setMensaje("");
  }

  const sesionesCompletadas = useMemo(
    () => items.filter((item) => item.estado === "completado").length,
    [items]
  );

  const minutosTotales = useMemo(
    () =>
      items.reduce(
        (total, item) => total + Number(item.atributos?.duracionMinutos ?? 0),
        0
      ),
    [items]
  );

  const progresoSemanal = Math.min(
    Math.round((minutosTotales / usuario.preferencias.objetivoSemanal) * 100),
    100
  );

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <h1>Iron Diary</h1>
          <p className="hero-saludo">
            Hola, {usuario.nombre} — Objetivo semanal:{" "}
            {usuario.preferencias.objetivoSemanal}{" "}
            {usuario.preferencias.unidadRegistro}
          </p>
          <div
            className="progreso-semanal"
            aria-label={`Progreso semanal: ${progresoSemanal}%`}
            title={`${minutosTotales} / ${usuario.preferencias.objetivoSemanal} min`}
          >
            <div
              className="progreso-barra"
              style={{ width: `${progresoSemanal}%` }}
            />
          </div>
          <p className="sesion-timer">Sesión activa: {formatearTiempo(segundos)}</p>
        </div>

        <div className="hero-controles">
          <div className="summary-board" aria-label="Resumen de sesiones">
            <div>
              <span>{items.length}</span>
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

          <div className="toolbar">
            <button
              className="button ghost"
              type="button"
              onClick={toggleTema}
              title="Cambiar tema (T)"
            >
              {tema === "oscuro" ? "☀ Claro" : "☾ Oscuro"}
            </button>

            <div className="modo-switch" role="group" aria-label="Modo de datos">
              <button
                className={`button ${modo === "local" ? "primary" : "ghost"}`}
                type="button"
                onClick={() => setModo("local")}
              >
                Local
              </button>
              <button
                className={`button ${modo === "api" ? "primary" : "ghost"}`}
                type="button"
                onClick={() => setModo("api")}
              >
                API
              </button>
            </div>
          </div>
        </div>
      </header>

      {cargando && (
        <p className="status-message status-cargando">Cargando...</p>
      )}
      {error && (
        <p className="status-message status-error">Error: {error}</p>
      )}
      {!cargando && !error && mensaje && (
        <p className="status-message">{mensaje}</p>
      )}

      <section className="crud-layout" aria-label="CRUD de sesiones">
        <FormularioItem
          ref={nombreInputRef}
          itemEditando={itemEditando}
          onAgregar={agregarItem}
          onActualizar={actualizarItem}
          onCancelarEdicion={cancelarEdicion}
        />

        <ListaItems
          items={items}
          categorias={CATEGORIAS}
          onEditar={iniciarEdicion}
          onArchivar={archivarItem}
        />
      </section>
    </main>
  );
}

export default App;
