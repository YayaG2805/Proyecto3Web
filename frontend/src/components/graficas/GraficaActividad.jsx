import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

// Gráfica 1: actividad de los últimos 7 días
// Muestra cuántas sesiones y cuántos minutos hubo cada día
export default function GraficaActividad({ items }) {
  const hoy = new Date();

  const datos = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - (6 - i));
    const fechaStr = fecha.toISOString().split("T")[0];
    const etiqueta = fecha.toLocaleDateString("es-GT", {
      weekday: "short",
      day: "numeric",
    });

    const sesiones = items.filter(
      (item) => item.fechaActividad?.split("T")[0] === fechaStr
    );

    return {
      dia: etiqueta,
      Sesiones: sesiones.length,
      Minutos: sesiones.reduce(
        (t, item) => t + Number(item.atributos?.duracionMinutos ?? 0),
        0
      ),
    };
  });

  return (
    <div className="grafica-contenedor">
      <h3 className="grafica-titulo">Actividad — últimos 7 días</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datos} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="dia"
            tick={{ fill: "var(--color-muted)", fontSize: 11 }}
          />
          <YAxis tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              borderRadius: "6px",
            }}
          />
          <Legend wrapperStyle={{ color: "var(--color-muted)", fontSize: 12 }} />
          <Bar
            dataKey="Sesiones"
            fill="var(--color-accent)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Minutos"
            fill="var(--color-muted)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
