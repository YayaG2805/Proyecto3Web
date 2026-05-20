import { useState } from "react";
import { UserContext } from "./UserContext";

const USUARIO_INICIAL = {
  nombre: "Diego",
  preferencias: {
    tema: "entrenamiento",
    objetivoSemanal: 300,
    unidadRegistro: "minutos",
  },
};

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(USUARIO_INICIAL);

  function actualizarUsuario(cambios) {
    setUsuario((actual) => ({ ...actual, ...cambios }));
  }

  return (
    <UserContext.Provider value={{ usuario, actualizarUsuario }}>
      {children}
    </UserContext.Provider>
  );
}
