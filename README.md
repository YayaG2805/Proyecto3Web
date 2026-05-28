
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

## Fase 3 — useReducer, Recharts y Optimizacion

### useReducer — 7 acciones puras

`src/reducers/itemsReducer.js` centraliza todo el estado de la lista. El reducer es una función pura: no llama a `fetch`, no lee `Date.now()`, no toca `localStorage`. Todo valor externo (fechas, payloads) entra por la acción.

| Acción | Qué hace |
| --- | --- |
| `HIDRATAR` | Reemplaza la lista completa con datos de la fuente activa |
| `AGREGAR` | Inserta un item nuevo al inicio de la lista |
| `ACTUALIZAR` | Reemplaza el item cuyo id coincide |
| `ELIMINAR` | Marca el item como `activo: false` (archivado) |
| `CAMBIAR_ESTADO` | Cambia el campo `estado` del item (planeado → completado → omitido) |
| `FILTRAR` | Actualiza los campos de filtro (`filtroCategoria`, `filtroEstado`, `busqueda`) |
| `LIMPIAR_FILTROS` | Resetea todos los filtros a sus valores por defecto |
| `REGISTRAR_ACTIVIDAD` | Agrega una entrada al array `historial` del item |

### useMemo y useCallback

`listaFiltrada` se calcula con `useMemo([lista, filtroCategoria, filtroEstado, busqueda])`. Solo se recalcula cuando cambia alguno de esos cuatro valores, no en cada render.

Los handlers `manejarEditar`, `manejarArchivar`, `manejarCambiarEstado` y `manejarRegistrarActividad` están envueltos en `useCallback`. Como `ItemCard` está memoizado con `React.memo`, las referencias estables evitan re-renders innecesarios al agregar o actualizar otro item de la lista.

### PanelFiltros

`src/components/PanelFiltros.jsx` despacha acciones `FILTRAR` directamente al reducer. Contiene:

- Input de búsqueda por nombre (filtra en tiempo real)
- Select de categoría
- Select de estado
- Botón "Limpiar filtros" (solo visible cuando hay algún filtro activo)

### Gráficas Recharts

Las tres gráficas reciben `listaFiltrada` como prop, así que responden a los filtros en tiempo real.

| Componente | Tipo | Qué muestra |
| --- | --- | --- |
| `GraficaActividad` | BarChart | Sesiones y minutos por día — últimos 7 días |
| `GraficaCategorias` | PieChart | Distribución porcentual por categoría |
| `GraficaIntensidad` | BarChart | Duración promedio (min) por nivel de intensidad |

### Mi gráfica original — GraficaIntensidad

La gráfica de duración promedio por intensidad fue mi aporte original para esta fase. La elegí porque en entrenamiento no es obvio cómo se relacionan la intensidad y el tiempo: alguien podría suponer que sesiones de alta intensidad duran más, pero en mi caso es al revés — las sesiones de baja intensidad tienden a ser cardio largo (60–90 min) mientras que las de alta intensidad son circuitos densos de 30–45 min.

El color de cada barra refleja la intensidad: verde `#22c55e` para baja, naranja `#f97316` para media y rojo `#ef4444` para alta. Usé `LabelList` para mostrar el valor directamente sobre cada barra y `Cell` para aplicar el color individualmente. El tooltip incluye también la cantidad de sesiones que alimentan ese promedio, porque un promedio de 1 sesión no vale igual que uno de 10.

### Mis 3 decisiones tecnicas — Fase 3

**1. Reducer puro sin efectos secundarios**

El reducer nunca genera fechas ni IDs. La acción `ELIMINAR` recibe la fecha de archivado como `accion.fecha`. La acción `REGISTRAR_ACTIVIDAD` recibe el objeto registro ya construido. Esto hace el reducer testeable sin mocks: dado un estado y una acción, la salida es siempre determinista.

**2. Charts reciben listaFiltrada, no lista completa**

Las tres gráficas no acceden al estado global ni al contexto. Solo reciben `items` como prop. Al pasarles `listaFiltrada` (ya procesada por `useMemo`), el comportamiento es automático: filtrar por categoría o estado actualiza las gráficas sin ningún código extra en los componentes de gráfica.

**3. Estado del ciclo de estado en ItemCard, no en App**

El objeto `ESTADOS_CICLO` que define la transición `planeado → completado → omitido → planeado` vive en `ItemCard.jsx`. La tarjeta sabe cuál es el siguiente estado; App solo recibe `(id, nuevoEstado)` y despacha `CAMBIAR_ESTADO`. Esta separación mantiene la lógica de presentación en el componente de presentación.

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

