import { useContext } from "react";
import { StorageContext } from "./StorageContext";

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error("useStorage debe usarse dentro de StorageProvider");
  return ctx;
}
