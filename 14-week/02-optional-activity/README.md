# Semana 14 · Contenerizar con Docker

Dockerfile multi-etapa para el backend (`backend/Dockerfile`) y para el frontend (`frontend/Dockerfile`).

## Backend
```bash
cd backend
docker build -t urbanstyle-api .
docker run --rm -p 8080:8080 urbanstyle-api
```
Verificar que responde desde el contenedor (debe dar 401 sin token y 200 con token):
```bash
curl -i http://localhost:8080/api/productos
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Frontend
```bash
cd frontend
docker build -t urbanstyle-web .
docker run --rm -p 3000:80 urbanstyle-web      # http://localhost:3000
```
Para que el frontend en `:3000` pueda llamar a la API, arranca el backend con `-e CORS_ORIGINS=http://localhost:3000`.

> Evidencia: agrega aquí capturas de `docker ps` y de la respuesta del curl.
