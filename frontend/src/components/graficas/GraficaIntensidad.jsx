import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell, LabelList
} from "recharts";

// Gráfica original: duración promedio por nivel de intensidad
// La elegí porque en entrenamiento es interesante ver si entrenas más tiempo
// cuando la intensidad es baja o cuando es alta. En mi caso las sesiones de
// intensidad baja suelen ser cardio largo, y las de alta son más cortas pero densas.
const COLORES_INTENSIDAD = {
  Baja: "#22c55e",
  Media: "#f97316",
  Alta: "#ef4444",
};

export default function GraficaIntensidad({ items }) {
  const datos = ["baja", "media", "alta"].map((nivel) => {
    const sesiones = items.filter(
      (item) => item.atributos?.intensidad === nivel
    );
    const totalMinutos = sesiones.reduce(
      (t, item) => t + Number(item.atributos?.duracionMinutos ?? 0),
      0
    );
    const promedio = sesiones.length
      ? Math.round(totalMinutos / sesiones.length)
      : 0;
    const etiqueta = nivel.charAt(0).toUpperCase() + nivel.slice(1);

    return {
      intensidad: etiqueta,
      "Minutos promedio": promedio,
      sesiones: sesiones.length,
    };
  });

  return (
    <div className="grafica-contenedor">
      <h3 className="grafica-titulo">Duración promedio por intensidad</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datos} margin={{ top: 20, right: 16, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="intensidad"
            tick={{ fill: "var(--color-muted)", fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: "var(--color-muted)", fontSize: 11 }}
            unit=" min"
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              borderRadius: "6px",
            }}
            formatter={(value, name, props) => [
              `${value} min (${props.payload.sesiones} sesiones)`,
              name,
            ]}
          />
          <Legend wrapperStyle={{ color: "var(--color-muted)", fontSize: 12 }} />
          <Bar dataKey="Minutos promedio" radius={[4, 4, 0, 0]}>
            {datos.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORES_INTENSIDAD[entry.intensidad]}
              />
            ))}
            <LabelList
              dataKey="Minutos promedio"
              position="top"
              style={{ fill: "var(--color-muted)", fontSize: 11 }}
              formatter={(v) => (v > 0 ? `${v}m` : "")}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
