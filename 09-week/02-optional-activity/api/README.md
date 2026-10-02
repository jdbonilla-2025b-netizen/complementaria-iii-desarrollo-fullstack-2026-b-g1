# Semana 9 · Documentar y probar la API

**Asignatura:** Desarrollo Fullstack · Ingeniería de Sistemas · Corhuila
**Unidad 2:** Backend, API REST y persistencia · **Periodo:** 2026-B
**Estudiante:** NOMBRE COMPLETO AQUÍ
**GitHub:** @USUARIO_GITHUB_AQUÍ

---

## 1. Descripción

API REST sencilla para gestionar **estudiantes**, construida con Spring Boot. Se documentó con **Swagger (springdoc-openapi)** y se probó con **Postman**, incluyendo casos de error (400 y 404).

## 2. Tecnologías

- Java 17
- Spring Boot (Gradle)
- Spring Web, Spring Data JPA, Validation
- Base de datos H2 en memoria
- springdoc-openapi (Swagger UI)
- Postman

## 3. Cómo ejecutar el proyecto

Desde la carpeta que contiene `gradlew`:

```powershell
.\gradlew bootRun
```

La API queda disponible en `http://localhost:8080`.

## 4. Swagger

Con la API corriendo:

- Interfaz: `http://localhost:8080/swagger-ui.html` (redirige a `/swagger-ui/index.html`)
- Definición OpenAPI (JSON): `http://localhost:8080/v3/api-docs`

![Swagger UI](evidencias/swagger-ui.png)

## 5. Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/estudiantes` | Lista todos los estudiantes |
| GET | `/api/estudiantes/{id}` | Obtiene un estudiante por ID (404 si no existe) |
| POST | `/api/estudiantes` | Crea un estudiante (400 si los datos son inválidos) |

**Modelo `Estudiante`:**

```json
{
  "id": 1,
  "nombre": "Ana Pérez",
  "programa": "Ingeniería de Sistemas"
}
```

Los campos `nombre` y `programa` son obligatorios (`@NotBlank`).

## 6. Pruebas en Postman

| # | Petición | Body | Código obtenido |
|---|----------|------|-----------------|
| 1 | `POST /api/estudiantes` | `{"nombre":"Ana Pérez","programa":"Ingeniería de Sistemas"}` | **201 Created** |
| 2 | `GET /api/estudiantes` | — | **200 OK** |
| 3 | `GET /api/estudiantes/9999` | — | **404 Not Found** |
| 4 | `POST /api/estudiantes` | `{"nombre":"","programa":""}` | **400 Bad Request** |

### Evidencias

**1. POST válido (201)**
![POST 201](evidencias/postman-post-201.png)

**2. GET listado (200)**
![GET 200](evidencias/postman-get-200.png)

**3. GET con ID inexistente (404)**
![GET 404](evidencias/postman-get-404.png)

**4. POST con datos inválidos (400)**
![POST 400](evidencias/postman-post-400.png)

La colección completa está en [`postman-collection.json`](postman-collection.json) (se puede importar en Postman con *Import*).

## 7. Interpretación de los códigos HTTP

| Código | Significado | Por qué ocurrió aquí |
|--------|-------------|----------------------|
| **200 OK** | La petición se procesó correctamente. | El `GET` devolvió la lista de estudiantes guardados. |
| **201 Created** | Se creó un recurso nuevo. | El `POST` con datos válidos guardó al estudiante y devolvió su `id`. |
| **400 Bad Request** | La petición es incorrecta por parte del cliente. | El `POST` envió `nombre` y `programa` vacíos, y la validación `@NotBlank` lo rechazó. |
| **404 Not Found** | El recurso solicitado no existe. | No hay ningún estudiante con `id = 9999`. |

En general, los códigos **2xx** indican éxito y los **4xx** indican un error del cliente (datos inválidos o recurso inexistente).

## 8. Estructura de la entrega

```
09-week/
├── README.md
├── postman-collection.json
├── evidencias/
│   ├── swagger-ui.png
│   ├── postman-post-201.png
│   ├── postman-get-200.png
│   ├── postman-get-404.png
│   └── postman-post-400.png
└── api/            (proyecto Spring Boot, sin la carpeta build/)
```

## 9. Notas

- La base de datos H2 es **en memoria**: los datos se pierden al reiniciar la API.
- Consola H2 disponible en `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:testdb`).
