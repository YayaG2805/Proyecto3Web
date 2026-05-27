import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { CATEGORIAS } from "../../utils/categorias";

// Gráfica 2: distribución de sesiones por categoría
export default function GraficaCategorias({ items }) {
  const datos = CATEGORIAS.map((cat) => ({
    name: `${cat.emoji} ${cat.nombre}`,
    value: items.filter((item) => item.categoriaId === cat.id).length,
    fill: cat.color,
  })).filter((d) => d.value > 0);

  if (datos.length === 0) {
    return (
      <div className="grafica-contenedor grafica-vacia">
        <h3 className="grafica-titulo">Distribución por categoría</h3>
        <p>Sin datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="grafica-contenedor">
      <h3 className="grafica-titulo">Distribución por categoría</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={datos}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ percent }) =>
              percent > 0 ? `${Math.round(percent * 100)}%` : ""
            }
          >
            {datos.map((entrada, index) => (
              <Cell key={`cell-${index}`} fill={entrada.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              borderRadius: "6px",
            }}
          />
          <Legend wrapperStyle={{ color: "var(--color-muted)", fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
