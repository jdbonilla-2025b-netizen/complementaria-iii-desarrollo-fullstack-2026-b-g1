# GameZone · Reserva de turnos y consolas (Corte 3)

App fullstack para un local gamer: el usuario inicia sesión y ve las consolas con sus turnos
disponibles. API en **Node.js + Express** protegida con **JWT**, frontend en **HTML + JavaScript**,
**CORS** configurado, pruebas automáticas y **Docker**.

- **Autor:** `<TU NOMBRE COMPLETO>` · **GitHub:** `<TU_USUARIO>`

## Estructura

```
backend/    app.js (API Express + JWT + CORS) y app.test.js
frontend/   index.html, app.js, api.js (lógica) y api.test.js
start.js    levanta la API (3000) y el frontend (5173)
Dockerfile
```

## Endpoints

| Método | Ruta            | Protegido | Descripción                                   |
|--------|-----------------|-----------|-----------------------------------------------|
| POST   | `/api/login`    | No        | `{username, password}` devuelve `{token}`      |
| GET    | `/api/consoles` | **Sí**    | Consolas y turnos. Header `Authorization: Bearer <token>` |
| GET    | `/api/health`   | No        | Estado del servicio                            |

Usuario de prueba: `gamer` / `1234`.

## Cómo ejecutar

```bash
npm install
npm start        # abre http://localhost:5173
npm test         # pruebas de backend y frontend
```

### Con Docker

```bash
docker build -t gamezone .
docker run --rm -p 3000:3000 -p 5173:5173 -e JWT_SECRET=un-secreto-largo gamezone
```

## CORS

Frontend (5173) y API (3000) son orígenes distintos. La API usa el paquete `cors` y solo permite
el origen del frontend (variable `WEB_ORIGIN`), con los headers `Authorization` y `Content-Type`.

## Versionado

Commits pequeños y descriptivos: `feat: login con JWT`, `feat: endpoint protegido`,
`test: pruebas de backend`, `feat: frontend`, `chore: Dockerfile`, `docs: README`.

## Security & run

The API uses JSON Web Tokens (JWT) for authentication. The client sends its username and password to `POST /api/login`, and the server checks them against a hashed password and returns a signed token that expires after one hour. For every request to a protected endpoint such as `/api/consoles`, the frontend sends the token in the `Authorization: Bearer <token>` header, and the server answers with a 401 status if the token is missing, forged, or expired. CORS is restricted to the frontend origin, so browsers on other sites cannot call the API. The tests run with `npm test` and cover the backend (valid login, wrong password, missing or forged token, CORS preflight) and the frontend (successful login and error handling using a mocked fetch). To run everything in a container, build the image with `docker build -t gamezone .`, start it with `docker run -p 3000:3000 -p 5173:5173 -e JWT_SECRET=your-secret gamezone`, and open `http://localhost:5173`.
