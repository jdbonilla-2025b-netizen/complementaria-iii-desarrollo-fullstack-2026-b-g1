# Semana 12 · Integrar frontend y backend

Frontend React (Vite) que hace login, guarda el token y consume `/api/productos`.

## Ejecutar (dos terminales)
```bash
# Terminal 1 - API
cd backend && mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev      # http://localhost:5173
```
Credenciales: `admin` / `admin123`

## Qué resuelve
- **Login + token**: `Login.jsx` llama a `api.login`; `App.jsx` guarda el token en `localStorage`.
- **Consumo protegido**: `api.getProductos` envía `Authorization: Bearer <token>`; si responde 401 se cierra la sesión.
- **CORS**: configurado en el backend (`SecurityConfig`), orígenes permitidos por la variable `CORS_ORIGINS`
  (por defecto `http://localhost:5173` y `http://localhost:3000`).
- **Carga/error**: `Productos.jsx` muestra "Cargando..." y un mensaje si falla la API; `Login.jsx` muestra errores de credenciales.
