import { useCallback, useState } from "react";
import { StorageContext } from "./StorageContext";

const LS_KEY = "items";

export function StorageProvider({ children }) {
  const [modo, setModoEstado] = useState(
    () => localStorage.getItem("modo") || "local"
  );
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  function setModo(nuevoModo) {
    setModoEstado(nuevoModo);
    localStorage.setItem("modo", nuevoModo);
  }

  // El único if(modo === "api") de toda la app vive aquí
  const obtenerItems = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      if (modo === "api") {
        const res = await fetch(`${API_URL}/api/items`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } else {
        const guardado = localStorage.getItem(LS_KEY);
        return guardado ? JSON.parse(guardado) : [];
      }
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setCargando(false);
    }
  }, [modo, API_URL]);

  const guardarItem = useCallback(async (item) => {
    // Maneja crear y actualizar: detecta si el id ya existe en el origen
    setCargando(true);
    setError(null);
    try {
      if (modo === "api") {
        // Intenta PUT; si el item no existe en la API (404) cae a POST
        const resPut = await fetch(`${API_URL}/api/items/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (resPut.status === 404) {
          const resPost = await fetch(`${API_URL}/api/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
          if (!resPost.ok) throw new Error(`HTTP ${resPost.status}`);
          return await resPost.json();
        }
        if (!resPut.ok) throw new Error(`HTTP ${resPut.status}`);
        return await resPut.json();
      } else {
        const items = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
        const existe = items.some((i) => i.id === item.id);
        const nuevos = existe
          ? items.map((i) => (i.id === item.id ? item : i))
          : [item, ...items];
        localStorage.setItem(LS_KEY, JSON.stringify(nuevos));
        return item;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setCargando(false);
    }
  }, [modo, API_URL]);

  const eliminarItem = useCallback(async (id) => {
    setCargando(true);
    setError(null);
    try {
      if (modo === "api") {
        const res = await fetch(`${API_URL}/api/items/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } else {
        // Archivar en local = marcar activo: false
        const items = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
        const nuevos = items.map((item) =>
          item.id === id
            ? { ...item, activo: false, fechaActividad: new Date().toISOString() }
            : item
        );
        localStorage.setItem(LS_KEY, JSON.stringify(nuevos));
        return { ok: true };
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setCargando(false);
    }
  }, [modo, API_URL]);

  return (
    <StorageContext.Provider
      value={{ modo, setModo, cargando, error, obtenerItems, guardarItem, eliminarItem }}
    >
      {children}
    </StorageContext.Provider>
  );
}
