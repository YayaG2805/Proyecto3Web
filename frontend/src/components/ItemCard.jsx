function formatearFecha(fechaIso) {
  if (!fechaIso) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(fechaIso));
}

function ItemCard({ item, categorias, onEditar, onArchivar }) {
  const categoria = categorias.find((actual) => actual.id === item.categoriaId);
  const atributos = item.atributos ?? {};
  const ejercicios = atributos.ejercicios ?? [];

  return (
    <article className="item-card">
      <div className="item-card-header">
        <div>
          <p
            className="category-pill"
            style={{ "--category-color": categoria?.color ?? "#94a3b8" }}
          >
            <span>{categoria?.emoji ?? "•"}</span>
            {categoria?.nombre ?? "Sin categoria"}
          </p>
          <h2>{item.nombre}</h2>
        </div>
        <span className={`state-badge state-${item.estado}`}>{item.estado}</span>
      </div>

      <dl className="metric-grid">
        <div>
          <dt>Puntuacion</dt>
          <dd>{item.puntuacion ?? "Sin nota"}</dd>
        </div>
        <div>
          <dt>Duracion</dt>
          <dd>{atributos.duracionMinutos ?? 0} min</dd>
        </div>
        <div>
          <dt>Intensidad</dt>
          <dd>{atributos.intensidad ?? "sin dato"}</dd>
        </div>
        <div>
          <dt>Volumen</dt>
          <dd>{atributos.volumenTotal ?? 0}</dd>
        </div>
      </dl>

      <div className="card-section">
        <h3>Ejercicios</h3>
        {ejercicios.length > 0 ? (
          <ul className="exercise-list">
            {ejercicios.map((ejercicio) => (
              <li key={ejercicio}>{ejercicio}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">Sin ejercicios registrados.</p>
        )}
      </div>

      <div className="card-section">
        <h3>Notas</h3>
        <p>{item.notas || "Sin notas."}</p>
      </div>

      <div className="card-footer">
        <div>
          <p className="pr-label">{atributos.pr ? "PR registrado" : "Sin PR"}</p>
          <p className="date-label">Actividad: {formatearFecha(item.fechaActividad)}</p>
          <p className="date-label">Registro: {formatearFecha(item.fechaRegistro)}</p>
        </div>
        <div className="card-actions">
          <button className="button secondary" type="button" onClick={() => onEditar(item)}>
            Editar
          </button>
          <button
            className="button danger"
            type="button"
            onClick={() => onArchivar(item.id)}
          >
            Archivar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ItemCard;
