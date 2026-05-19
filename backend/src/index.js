import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { initDb } from "./db/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "API funcionando" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((error, req, res, next) => {
  res.status(500).json({
    error: "Error interno del servidor",
    detail: error.message
  });
});

async function startServer() {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`API escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar la base de datos:", error.message);
    process.exit(1);
  }
}

startServer();
