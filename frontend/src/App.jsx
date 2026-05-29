import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import FormularioItem from "./components/FormularioItem";
import ListaItems from "./components/ListaItems";
import PanelFiltros from "./components/PanelFiltros";
import GraficaActividad from "./components/graficas/GraficaActividad";
import GraficaCategorias from "./components/graficas/GraficaCategorias";
import GraficaIntensidad from "./components/graficas/GraficaIntensidad";
import { CATEGORIAS } from "./utils/categorias";
import { itemsReducer, estadoInicial } from "./reducers/itemsReducer";
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

  const [state, dispatch] = useReducer(itemsReducer, estadoInicial);
  const { lista, filtroCategoria, filtroEstado, busqueda } = state;

  const [itemEditando, setItemEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [segundos, setSegundos] = useState(0);

  // useRef uso 1: focus en el input de nombre para agregar sesión
  const nombreInputRef = useRef(null);

  // useRef uso 2: ID del setInterval guardado sin provocar re-render
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSegundos((s) => s + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Recarga con HIDRATAR cuando cambia el modo
  useEffect(() => {
    async function cargar() {
      const data = await obtenerItems();
      dispatch({ type: "HIDRATAR", payload: data });
    }
    cargar();
  }, [obtenerItems]);

  useEffect(() => {
    const handler = (evento) => {
      if (evento.altKey && (evento.key === "n" || evento.key === "N")) {
        evento.preventDefault();
        nombreInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ─── useMemo: lista filtrada y estadísticas ───────────────────

  const listaFiltrada = useMemo(() => {
    return lista
      .filter((item) => item.activo)
      .filter((item) =>
        filtroCategoria === "todas" || item.categoriaId === filtroCategoria
      )
      .filter((item) =>
        filtroEstado === "todos" || item.estado === filtroEstado
      )
      .filter((item) =>
        item.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
  }, [lista, filtroCategoria, filtroEstado, busqueda]);

  const sesionesCompletadas = useMemo(
    () => listaFiltrada.filter((item) => item.estado === "completado").length,
    [listaFiltrada]
  );

  const minutosTotales = useMemo(
    () =>
      listaFiltrada.reduce(
        (total, item) => total + Number(item.atributos?.duracionMinutos ?? 0),
        0
      ),
    [listaFiltrada]
  );

  const progresoSemanal = Math.min(
    Math.round((minutosTotales / usuario.preferencias.objetivoSemanal) * 100),
    100
  );

  // ─── useCallback: handlers pasados a componentes hijos ────────

  const manejarEditar = useCallback((item) => {
    setItemEditando(item);
    setMensaje("");
  }, []);

  const manejarArchivar = useCallback(
    async (id) => {
      await eliminarItem(id);
      dispatch({ type: "ELIMINAR", payload: id, fecha: new Date().toISOString() });
      setMensaje("Sesión archivada correctamente.");
    },
    [eliminarItem]
  );

  const manejarCambiarEstado = useCallback((id, nuevoEstado) => {
    dispatch({ type: "CAMBIAR_ESTADO", payload: { id, estado: nuevoEstado } });
  }, []);

  const manejarRegistrarActividad = useCallback((id) => {
    dispatch({
      type: "REGISTRAR_ACTIVIDAD",
      payload: {
        id,
        registro: { fecha: new Date().toISOString(), tipo: "actividad" },
      },
    });
  }, []);

  // ─── Funciones async que coordinan storage + reducer ─────────

  async function agregarItem(item) {
    const guardado = await guardarItem(item);
    if (guardado) {
      dispatch({ type: "AGREGAR", payload: guardado });
      setMensaje("Sesión agregada correctamente.");
      nombreInputRef.current?.focus();
    }
  }

  async function actualizarItem(itemActualizado) {
    const guardado = await guardarItem(itemActualizado);
    if (guardado) {
      dispatch({ type: "ACTUALIZAR", payload: guardado });
      setItemEditando(null);
      setMensaje("Sesión actualizada correctamente.");
    }
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
              <span>{listaFiltrada.length}</span>
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

      <PanelFiltros
        filtroCategoria={filtroCategoria}
        filtroEstado={filtroEstado}
        busqueda={busqueda}
        dispatch={dispatch}
      />

      <section className="seccion-graficas" aria-label="Visualización de entrenamientos">
        <GraficaActividad items={listaFiltrada} />
        <GraficaCategorias items={listaFiltrada} />
        <GraficaIntensidad items={listaFiltrada} />
      </section>

      <section className="crud-layout" aria-label="CRUD de sesiones">
        <FormularioItem
          ref={nombreInputRef}
          itemEditando={itemEditando}
          onAgregar={agregarItem}
          onActualizar={actualizarItem}
          onCancelarEdicion={cancelarEdicion}
        />

        <ListaItems
          items={listaFiltrada}
          categorias={CATEGORIAS}
          onEditar={manejarEditar}
          onArchivar={manejarArchivar}
          onCambiarEstado={manejarCambiarEstado}
          onRegistrarActividad={manejarRegistrarActividad}
        />
      </section>
    </main>
  );
}

export default App;
