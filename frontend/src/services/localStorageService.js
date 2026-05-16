const STORAGE_KEY = "items";

export function obtenerItems() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

export function guardarItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
