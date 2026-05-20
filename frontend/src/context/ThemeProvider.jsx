import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(
    () => localStorage.getItem("tema") || "oscuro"
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  // Atajo T para cambiar tema — cleanup obligatorio para no acumular listeners
  useEffect(() => {
    const handler = (evento) => {
      const tag = evento.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (evento.key === "t" || evento.key === "T") {
        setTema((actual) => (actual === "claro" ? "oscuro" : "claro"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function toggleTema() {
    setTema((actual) => (actual === "claro" ? "oscuro" : "claro"));
  }

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
}
