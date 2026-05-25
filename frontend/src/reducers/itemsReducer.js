// Reducer puro: sin fetch, sin Date.now(), sin mutaciones al estado anterior.
// Todas las fechas y datos externos llegan como parte de la acción.

export const estadoInicial = {
  lista: [],
  filtroCategoria: "todas",
  filtroEstado: "todos",
  busqueda: "",
};

export function itemsReducer(estado, accion) {
  switch (accion.type) {
    case "HIDRATAR":
      // Carga inicial del array de items desde API o LocalStorage
      return { ...estado, lista: accion.payload };

    case "AGREGAR":
      // Añade el item nuevo al inicio de la lista
      return { ...estado, lista: [accion.payload, ...estado.lista] };

    case "ACTUALIZAR":
      // Reemplaza el item por su versión editada
      return {
        ...estado,
        lista: estado.lista.map((item) =>
          item.id === accion.payload.id ? accion.payload : item
        ),
      };

    case "ELIMINAR":
      // Archiva el item — la fecha de archivado viene en la acción, no se genera aquí
      return {
        ...estado,
        lista: estado.lista.map((item) =>
          item.id === accion.payload
            ? { ...item, activo: false, fechaActividad: accion.fecha }
            : item
        ),
      };

    case "CAMBIAR_ESTADO":
      return {
        ...estado,
        lista: estado.lista.map((item) =>
          item.id === accion.payload.id
            ? { ...item, estado: accion.payload.estado }
            : item
        ),
      };

    case "FILTRAR":
      // Actualiza uno o más filtros activos
      return { ...estado, ...accion.payload };

    case "LIMPIAR_FILTROS":
      return {
        ...estado,
        filtroCategoria: "todas",
        filtroEstado: "todos",
        busqueda: "",
      };

    case "REGISTRAR_ACTIVIDAD":
      // Agrega un registro al historial local del item
      return {
        ...estado,
        lista: estado.lista.map((item) =>
          item.id === accion.payload.id
            ? {
                ...item,
                historial: [
                  ...(item.historial ?? []),
                  accion.payload.registro,
                ],
              }
            : item
        ),
      };

    default:
      return estado;
  }
}
