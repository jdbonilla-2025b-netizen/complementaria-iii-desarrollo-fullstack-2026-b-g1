# UrbanStyle · Proyecto integrado (Semana 15)

Tienda UrbanStyle: **React (Vite) + API Spring Boot 3 + JWT + PostgreSQL**, todo con Docker Compose.

## Arquitectura
```
Navegador ──> frontend (nginx :3000) ──> backend (Spring Boot :8080) ──> db (PostgreSQL :5432)
                                         JWT en cabecera Authorization: Bearer
```

## Despliegue local (paso a paso)
Requisitos: Docker Desktop.
```bash
cp .env.example .env        # edita las contraseñas y el JWT_SECRET
docker compose up --build
```
- Frontend: http://localhost:3000
- API: http://localhost:8080
- Usuario semilla: `admin` / `admin123` (se crea al primer arranque junto con 4 productos)

Detener: `docker compose down` (agrega `-v` para borrar también los datos de la BD).

## Variables de entorno
| Variable | Uso | Por defecto |
|---|---|---|
| `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Credenciales de PostgreSQL | urbanstyle / urban / urban123 |
| `JWT_SECRET` | Firma de los JWT (mín. 32 caracteres) | valor de desarrollo |
| `CORS_ORIGINS` | Orígenes permitidos por el backend | `http://localhost:3000` (en compose) |
| `VITE_API_URL` | URL de la API, se fija al **construir** el frontend | `http://localhost:8080` |

Los secretos reales van en `.env` (ignorado por git); `.env.example` solo trae valores de ejemplo.

## Verificar el flujo extremo a extremo
1. Abre http://localhost:3000 → inicia sesión con `admin` / `admin123`.
2. Se muestra la lista de productos (viene de PostgreSQL vía API con JWT).
3. Por consola: `curl -i http://localhost:8080/api/productos` → **401**; con el token → **200**.

## Pruebas
- Backend: `cd backend && mvn test`
- Frontend: `cd frontend && npm install && npm test`

## Desplegar en la nube (opcional)
Las mismas imágenes sirven en cualquier VPS con Docker: clonar el repo, crear `.env`, cambiar `VITE_API_URL` en
`docker-compose.yml` por la URL pública de la API y `CORS_ORIGINS` por la URL pública del frontend, y ejecutar `docker compose up -d --build`.
