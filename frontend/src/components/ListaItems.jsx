import ItemCard from "./ItemCard";

function ListaItems({ items, categorias, onEditar, onArchivar }) {
  if (items.length === 0) {
    return (
      <section className="empty-state">
        <h2>No hay sesiones activas</h2>
        <p>Agrega tu primer entrenamiento para empezar la bitacora.</p>
      </section>
    );
  }

  return (
    <section className="items-list" aria-label="Sesiones activas">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          categorias={categorias}
          onEditar={onEditar}
          onArchivar={onArchivar}
        />
      ))}
    </section>
  );
}

export default ListaItems;
