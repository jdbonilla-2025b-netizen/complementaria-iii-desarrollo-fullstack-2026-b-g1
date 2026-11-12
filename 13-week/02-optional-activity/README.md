# Semana 13 · Pruebas de la aplicación

## Backend (JUnit 5 + Mockito + MockMvc)
```bash
cd backend && mvn test
```
- `ProductoServiceTest` (unitaria): camino feliz + **errores/límite**: precio 0, precio negativo, nombre vacío.
- `AuthFlowTest` (integración del endpoint): sin token 401, token inválido 401, login incorrecto 401, con token 200.

## Frontend (Vitest + Testing Library)
```bash
cd frontend && npm install && npm test
```
- `Login.test.jsx` (componente): login correcto, **error de credenciales** y **campos vacíos** (límite).
