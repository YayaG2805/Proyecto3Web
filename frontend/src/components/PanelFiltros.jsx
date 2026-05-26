import { CATEGORIAS } from "../utils/categorias";

const ESTADOS = ["planeado", "completado", "omitido"];

export default function PanelFiltros({ filtroCategoria, filtroEstado, busqueda, dispatch }) {
  const hayFiltros =
    filtroCategoria !== "todas" || filtroEstado !== "todos" || busqueda !== "";

  return (
    <div className="panel-filtros">
      <input
        className="filtro-busqueda"
        type="search"
        value={busqueda}
        onChange={(e) =>
          dispatch({ type: "FILTRAR", payload: { busqueda: e.target.value } })
        }
        placeholder="Buscar sesión..."
        aria-label="Buscar sesión"
      />

      <select
        className="filtro-select"
        value={filtroCategoria}
        onChange={(e) =>
          dispatch({ type: "FILTRAR", payload: { filtroCategoria: e.target.value } })
        }
        aria-label="Filtrar por categoría"
      >
        <option value="todas">Todas las categorías</option>
        {CATEGORIAS.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.emoji} {cat.nombre}
          </option>
        ))}
      </select>

      <select
        className="filtro-select"
        value={filtroEstado}
        onChange={(e) =>
          dispatch({ type: "FILTRAR", payload: { filtroEstado: e.target.value } })
        }
        aria-label="Filtrar por estado"
      >
        <option value="todos">Todos los estados</option>
        {ESTADOS.map((estado) => (
          <option key={estado} value={estado}>
            {estado}
          </option>
        ))}
      </select>

      {hayFiltros && (
        <button
          className="button ghost filtro-limpiar"
          type="button"
          onClick={() => dispatch({ type: "LIMPIAR_FILTROS" })}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
