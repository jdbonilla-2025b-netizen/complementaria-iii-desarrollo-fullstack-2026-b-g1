# Semana 11 · Proteger la API con JWT

API Spring Boot 3 (Java 17) con login que devuelve un JWT y endpoints protegidos.

## Ejecutar
```bash
cd backend
mvn spring-boot:run          # usa H2 en memoria por defecto
```
Usuario semilla: `admin` / `admin123`

## Probar el flujo (401 / 200)
```bash
# 1) Sin token -> 401
curl -i http://localhost:8080/api/productos

# 2) Login -> devuelve {"token":"...","username":"admin"}
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}'

# 3) Con token -> 200
curl -i http://localhost:8080/api/productos -H "Authorization: Bearer <TOKEN>"
```
Prueba automática: `mvn test` (clase `AuthFlowTest`: sin token 401, token inválido 401, login malo 401, con token 200).

## Piezas
- `JwtService`: genera y valida el token (HS256, expira en 1 h).
- `JwtAuthFilter`: lee `Authorization: Bearer ...` y autentica la petición.
- `SecurityConfig`: `/api/auth/**` público, todo lo demás exige token; sin token responde 401.
