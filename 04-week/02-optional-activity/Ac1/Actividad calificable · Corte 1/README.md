# UrbanStyle E-Commerce

Aplicación full-stack de una tienda de ropa urbana (camisas, pantalones, sacos, shorts y zapatos). El **backend** es una API REST propia hecha con Node.js + Express; el **frontend** está construido con React (vía Babel standalone, sin build tools) y CSS puro, y consume esa API con `fetch`.

## Overview

UrbanStyle is a full-stack e-commerce application for a streetwear clothing store. The backend is a custom read-only REST API built with Node.js and Express that serves the product catalog from a JSON file, along with the product images. The frontend, built with React and vanilla CSS, consumes the API using `fetch` to retrieve each product's title, price, image, category and description, instead of relying on hardcoded content or third-party services. The app properly handles the three key states of an asynchronous request: a loading state with a spinner while the data is being fetched, an error state with a retry button if the request fails (for example, when the API is offline), and a success state that renders the product catalog once the data arrives. Users can browse products by category, sort by price, view individual product details and add items to a shopping cart. The interface is responsive and follows a minimalist, dark-and-neutral visual style inspired by modern streetwear e-commerce brands.

## Tecnologías

| Parte | Tecnología |
|---|---|
| Backend | Node.js, Express |
| Datos | Archivo JSON (`backend/data/products.json`) |
| Frontend | React 18 (CDN + Babel standalone), CSS puro |
| Consumo de datos | `fetch` nativo |

## Estructura del proyecto

```
├── backend/
│   ├── data/
│   │   └── products.json   # Catálogo de productos
│   ├── server.js           # Rutas, CORS y archivos estáticos (Express)
│   ├── catalog.js          # Lógica de consulta y validación del catálogo
│   └── package.json        # Dependencias del backend (express)
├── frontend/
│   ├── img/                # Imágenes de productos y del banner
│   ├── index.html          # Punto de entrada, carga React y Babel
│   ├── app.jsx             # Lógica y componentes de React
│   └── style.css           # Estilos
├── .vscode/launch.json
├── package.json
└── README.md
```

## Cómo ejecutarlo

### Requisitos

- [Node.js](https://nodejs.org) instalado (incluye `npm`).
- Conexión a internet solo para cargar React, Babel y las fuentes desde CDN.

### Pasos

1. Clona este repositorio (o tu fork) y abre la carpeta del proyecto en VS Code.
2. Abre una terminal y enciende la API:

   ```bash
   cd backend
   npm install
   npm start
   ```

   Debe aparecer: `UrbanStyle API lista en http://localhost:3000`. **Deja esta terminal abierta.**
3. Abre la tienda de cualquiera de estas dos formas:
   - Directamente en **http://localhost:3000** (el servidor también sirve el frontend), o
   - Con la extensión **Live Server**: clic derecho sobre `frontend/index.html` → **Open with Live Server**.

> ⚠️ Importante: si la API no está encendida, la tienda mostrará la pantalla de error con el botón "Reintentar". Tampoco funciona abriendo `index.html` con doble clic (protocolo `file://`).

## API propia

- **URL base:** `http://localhost:3000/api/v1`
- API de solo lectura (métodos `GET`), con respuestas en formato JSON.
- Sigue las convenciones REST del repositorio de documentación (`u-e-docs`, carpeta `07-api`); el contrato completo está en `07-api/contracts/openapi/catalog.yaml`.

### Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Comprueba que la API está funcionando |
| GET | `/api/v1/products` | Página de productos (`{ data, meta }`) |
| GET | `/api/v1/products/:id` | Un producto por id |
| GET | `/api/v1/categories` | Categorías con su cantidad de productos |
| GET | `/images/<archivo>` | Imágenes de los productos (carpeta `frontend/img`) |

### Parámetros de `/api/v1/products` (opcionales)

| Parámetro | Ejemplo | Qué hace |
|---|---|---|
| `page` | `?page=2` | Página (por defecto 1) |
| `limit` | `?limit=100` | Productos por página (por defecto 20, máximo 100) |
| `category` | `?category=zapatos` | Filtra por categoría |
| `tipo` | `?tipo=Sneakers` | Filtra por tipo |
| `search` | `?search=urbano` | Busca por nombre |
| `sort` | `?sort=price_asc` / `price_desc` | Ordena por precio |

El frontend pide `?limit=100`, el máximo permitido, para traer el catálogo completo en una sola página.

### Ejemplo de respuesta (`GET /api/v1/products`)

```json
{
  "data": [
    {
      "id": 1,
      "title": "Camisa Urbana",
      "price": 119900,
      "image": "http://localhost:3000/images/camisa.png",
      "category": "camisas",
      "tipo": "Casual",
      "description": "Camisa de corte urbano para el día a día, cómoda y fácil de combinar."
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
}
```

### Errores

Todos los errores usan la forma `{ "error": "CODIGO", "message": "...", "details": [...] }`.

| Estado | `error` | Cuándo |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Un parámetro está fuera de rango, repetido o no es un número (`details` indica cuál) |
| 404 | `NOT_FOUND` | El producto o la ruta no existen |
| 500 | `INTERNAL_ERROR` | Fallo inesperado del servidor |

### Modelo de producto

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | número | Identificador único |
| `title` | texto | Nombre del producto |
| `price` | número | Precio en pesos colombianos (COP), sin decimales |
| `image` | texto | URL completa de la imagen (en el archivo se guarda como `/images/<archivo>`) |
| `category` | texto | `camisas`, `pantalones`, `sacos`, `shorts` o `zapatos` |
| `tipo` | texto | Subtipo del producto (por ejemplo `Casual`, `Sneakers`) |
| `description` | texto | Descripción corta |

### Agregar productos

1. Copia la imagen a `frontend/img/`.
2. Agrega un objeto en `backend/data/products.json` con `"image": "/images/nombre-del-archivo.png"`.
3. No hace falta reiniciar el servidor.

## Estados manejados

| Estado | Qué se ve |
|---|---|
| Cargando | Spinner + "Cargando catálogo…" |
| Error | Mensaje de error + botón "Reintentar" (por ejemplo, si la API está apagada) |
| Datos listos | Catálogo completo, filtros, detalle de producto y carrito funcionando |

---
Actividad calificable · Corte 1 — Frontend que consume una API · Semana 4
