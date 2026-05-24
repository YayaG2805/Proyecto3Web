
**App:** Iron Diary  
**Nombre:** Diego Guevara  
**Carnet:** 24128  
**Curso:** Sistemas y Tecnologias Web

Descripcion

Mi Bitacora de Entrenamiento es un proyecto para registrar sesiones de entrenamiento fisico. La aplicacion permite guardar entrenamientos con categoria, estado, puntuacion, duracion, intensidad, ejercicios, volumen total, notas y si hubo PR.

## Tema elegido

Entrenamiento fisico.

## Arquitectura de 3 entidades

 Entidad / Descripcion 

 Item /Sesion de entrenamiento. 
 Registro /Minutos de sesion asociados a un item. 
 Categorias / Fuerza, Cardio, Flexibilidad y Deportes. 

## Fase 1

En esta fase se entregan dos piezas funcionando de forma independiente:

- Frontend con React, Vite, useState, useEffect y LocalStorage.
- Backend con Node.js, Express, CORS, PostgreSQL y SQL crudo.

El frontend y el backend no estan conectados todavia.

## Tecnologias usadas

- React 18
- Vite
- JavaScript
- CSS puro con variables
- Node.js
- Express
- PostgreSQL
- pg
- cors
- dotenv

## Estructura de carpetas

```txt
fase1-mi-bitacora-entrenamiento/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormularioItem.jsx
│   │   │   ├── ListaItems.jsx
│   │   │   └── ItemCard.jsx
│   │   ├── services/
│   │   │   └── localStorageService.js
│   │   ├── utils/
│   │   │   └── categorias.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   │   └── items.js
│   │   └── db/
│   │       ├── index.js
│   │       └── schema.sql
│   ├── package.json
│   └── .env.example
├── docs/
│   └── mis-primeros-items.png
├── README.md
└── .gitignore
```

## Como correr el frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend funciona con LocalStorage. No hace llamadas al backend en Fase 1.

## Como correr el backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Antes de correrlo, se debe crear la base de datos en PostgreSQL.

## Como crear la base de datos en pgAdmin4

1. Abrir pgAdmin4.
2. Conectarse al servidor local de PostgreSQL.
3. Crear una base de datos nueva.
4. Nombre recomendado:

```txt
fase1_items
```

5. Editar `backend/.env` con los datos reales de la instalacion local.

El archivo `.env` no se sube al repositorio porque contiene datos privados.

## Variables de entorno

```txt
PORT=3000
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=fase1_items
```

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/health` | Verifica que la API funciona. |
| GET | `/api/items` | Devuelve todos los items activos. |
| GET | `/api/items/:id` | Devuelve un item por id. |
| POST | `/api/items` | Crea un item nuevo. |
| PUT | `/api/items/:id` | Actualiza un item existente. |
| DELETE | `/api/items/:id` | Archiva un item con `activo = 0`. |
| POST | `/api/items/:id/registro` | Crea un registro de minutos para un item. |

## Campos del item

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | string | UUID del item. |
| nombre | string | Nombre de la sesion. |
| categoriaId | string | Categoria de entrenamiento. |
| estado | string | planeado, completado u omitido. |
| puntuacion | number/null | Puntuacion de 0 a 10. |
| fechaRegistro | string ISO | Fecha de creacion. |
| fechaActividad | string ISO | Fecha de ultima actividad. |
| notas | string | Observaciones libres. |
| atributos | object | Datos especificos de entrenamiento. |
| activo | boolean | Indica si se muestra en la lista activa. |

## Atributos del item

```js
{
  duracionMinutos: number,
  intensidad: "baja" | "media" | "alta",
  ejercicios: string[],
  volumenTotal: number,
  pr: boolean
}
```

## Campos del registro

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | string | UUID del registro. |
| itemId | string | Id del item relacionado. |
| fecha | string ISO | Fecha del registro. |
| valor | number | Minutos de sesion. |
| notas | string | Observaciones del registro. |

## Mis primeros Items

La captura debe mostrar al menos 3 sesiones reales:

- Push Day
- Pierna pesada
- Cardio zona 2

![Mis primeros items](./docs/mis-primeros-items.png)

## Fase 2 — Contextos y Modo Híbrido

### StorageContext

`src/context/StorageProvider.jsx` abstrae el origen de datos. Los componentes no saben si están leyendo de LocalStorage o de la API. Solo llaman funciones del contexto.

Funciones expuestas:

| Función | Descripción |
| --- | --- |
| `obtenerItems()` | Devuelve los items activos del origen activo |
| `guardarItem(item)` | Crea o actualiza un item según si el id ya existe |
| `eliminarItem(id)` | Archiva el item (activo = false en local, DELETE en API) |
| `modo` | `"local"` o `"api"` |
| `setModo(modo)` | Cambia el modo y persiste en localStorage |
| `cargando` | true mientras hay una operación en curso |
| `error` | mensaje del último error, null si no hay |

El único `if (modo === "api")` de toda la app vive dentro de `StorageProvider`. Ningún componente tiene esa condición.

Para cambiar entre modos hay dos botones en el header (Local / API). Al cambiar, la lista se actualiza automáticamente con los datos del nuevo origen.

### ThemeContext

`src/context/ThemeProvider.jsx` maneja el tema claro/oscuro.

- Persiste el tema en `localStorage` entre sesiones.
- Aplica el tema con `document.body.setAttribute("data-theme", tema)`.
- Expone `{ tema, toggleTema }`.

### UserContext

`src/context/UserProvider.jsx` expone los datos del usuario.

```js
{
  nombre: "Diego",
  preferencias: {
    tema: "entrenamiento",
    objetivoSemanal: 300,
    unidadRegistro: "minutos"
  }
}
```

El header muestra el saludo y una barra de progreso hacia el objetivo semanal de minutos.

### Atajos de teclado

| Atajo | Acción |
| --- | --- |
| `T` | Cambia entre tema claro y oscuro |
| `Ctrl + N` | Enfoca el input de nombre para agregar sesión |

Ambos usan `addEventListener` con cleanup `removeEventListener` en el return del `useEffect`.

### usos de useRef

**Uso 1 — focus en input de nombre:**
`const nombreInputRef = useRef(null)` en App.jsx. La referencia se pasa a `FormularioItem` vía `forwardRef`. Después de agregar una sesión, se llama `nombreInputRef.current?.focus()`. El atajo Ctrl+N también usa esta misma referencia.

**Uso 2 — ID de setInterval:**
`const intervalRef = useRef(null)` en App.jsx guarda el ID del `setInterval` del contador de sesión. No causa re-render al actualizarse. Se limpia con `clearInterval(intervalRef.current)` en el cleanup del `useEffect`.

### Cómo probar modo local

```bash
cd frontend
npm install
npm run dev
```

1. Seleccionar el botón **Local** en el header (es el modo por defecto).
2. Crear sesiones — se guardan en `localStorage["items"]`.
3. Recargar la página y verificar que persisten.
4. Revisar `localStorage["modo"]` en DevTools.

### Cómo probar modo API

1. Levantar el backend primero (`cd backend && npm run dev`).
2. Crear `frontend/.env` copiando `frontend/.env.example`.
3. Seleccionar el botón **API** en el header.
4. Crear, editar y archivar sesiones — van a PostgreSQL.
5. Verificar con `GET http://localhost:3000/api/items`.

```bash
# frontend/.env
VITE_API_URL=http://localhost:3000
```

---

## Mi paleta de colores

### Tema claro

| Variable | Hex | Uso |
| --- | --- | --- |
| `--color-bg` | `#f7f7f8` | Fondo principal |
| `--color-surface` | `#ffffff` | Cards y formulario |
| `--color-text` | `#1a1a1a` | Texto principal |
| `--color-accent` | `#f46e53` | Botones, énfasis, borde izquierdo de cards |
| `--color-border` | `#e5e7eb` | Bordes de inputs y cards |
| `--color-muted` | `#6b7280` | Textos secundarios, etiquetas |

El fondo `#f7f7f8` no es blanco puro sino casi blanco con un toque frío. Quería que se sintiera como una hoja limpia de cuaderno de entrenamiento, no como una pantalla clínica. El acento `#f46e53` es naranja-rojo porque es el color que más asocio con esfuerzo físico real: se me viene a la mente el calor de una sesión pesada, no un azul corporativo.

### Tema oscuro

| Variable | Hex | Uso |
| --- | --- | --- |
| `--color-bg` | `#0f172a` | Fondo principal |
| `--color-surface` | `#1e293b` | Cards y formulario |
| `--color-text` | `#f1f5f9` | Texto principal |
| `--color-accent` | `#f97316` | Botones, énfasis, borde izquierdo de cards |
| `--color-border` | `#334155` | Bordes de inputs y cards |
| `--color-muted` | `#94a3b8` | Textos secundarios, etiquetas |

El azul muy oscuro `#0f172a` como fondo lo elegí porque es el que mejor aguanta sesiones de revisión nocturna sin cansar la vista, como cuando revisas tu entreno antes de dormir. Mantuve el acento en naranja `#f97316` (ligeramente más brillante que en claro) porque quería que los botones de acción siguieran destacando con la misma energía en ambos temas.

---

## Decisiones tecnicas

- Se uso `useState` con lazy initializer para leer LocalStorage solo al montar el componente.
- Se uso `useEffect` para sincronizar LocalStorage cada vez que cambia la lista de items.
- El frontend no usa Axios ni librerias externas de estado.
- El backend usa Express con CORS configurado desde variables de entorno.
- La base de datos usa PostgreSQL con SQL crudo y `pg`.
- Los items no se borran fisicamente; se archivan cambiando `activo` a `0`.
- `atributos` se guarda como JSON serializado en PostgreSQL y se devuelve como objeto.

## Checklist de pruebas

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- Crear 3 sesiones reales: Push Day, Pierna pesada y Cardio zona 2.
- Refrescar el navegador y confirmar que siguen guardadas.
- Editar una sesion.
- Archivar una sesion.
- Revisar LocalStorage en DevTools.

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Probar:

```txt
GET    http://localhost:3000/api/health
GET    http://localhost:3000/api/items
POST   http://localhost:3000/api/items
PUT    http://localhost:3000/api/items/:id
DELETE http://localhost:3000/api/items/:id
POST   http://localhost:3000/api/items/:id/registro
```

