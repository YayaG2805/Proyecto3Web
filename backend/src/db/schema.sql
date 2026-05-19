CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoriaId TEXT,
  estado TEXT,
  puntuacion REAL,
  fechaRegistro TEXT,
  fechaActividad TEXT,
  notas TEXT,
  atributos TEXT,
  activo INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS registros (
  id TEXT PRIMARY KEY,
  itemId TEXT REFERENCES items(id),
  fecha TEXT,
  valor REAL,
  notas TEXT
);
