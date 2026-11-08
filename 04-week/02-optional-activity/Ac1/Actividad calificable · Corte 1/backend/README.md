# UrbanStyle Backend (API)

API REST de solo lectura con Node.js + Express. Los productos viven en `data/products.json` y las imágenes se sirven desde `../frontend/img`.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `server.js` | Rutas, CORS, archivos estáticos y manejo de errores |
| `catalog.js` | Lee `products.json`, valida los parámetros y arma las respuestas |
| `data/products.json` | El catálogo |

## Ejecutar

```bash
cd backend
npm install
npm start        # http://localhost:3000
```

## Endpoints

`GET /health` · `GET /api/v1/products` · `GET /api/v1/products/:id` · `GET /api/v1/categories`

Parámetros de `/api/v1/products`: `page`, `limit` (máx. 100), `category`, `tipo`, `search`, `sort` (`price_asc` o `price_desc`). La documentación completa está en el `README.md` de la raíz del proyecto.
