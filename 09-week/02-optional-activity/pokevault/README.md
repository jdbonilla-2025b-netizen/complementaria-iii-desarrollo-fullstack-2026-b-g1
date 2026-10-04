# PokeVault

REST API en **Spring Boot** para gestionar una colección de cartas Pokémon. Usa arquitectura en capas (entity, repository, service, controller), persistencia con **JPA**, documentación con **Swagger** y una página de inicio minimalista. Es un proyecto monolítico: un solo servicio, sin microservicios.

## Tecnologías

- Java 21
- Spring Boot (Web, Data JPA, Validation)
- H2 Database (en memoria)
- springdoc-openapi (Swagger UI)
- Maven (con Maven Wrapper incluido)

## Cómo ejecutar

1. Requisito: tener instalado **JDK 21** (no hace falta instalar Maven ni una base de datos).
2. Clona el repositorio y entra a la carpeta del proyecto (donde está el `pom.xml`).
3. Ejecuta:
   - Windows (PowerShell): `.\mvnw.cmd spring-boot:run`
   - Mac / Linux: `./mvnw spring-boot:run`
4. Cuando veas `Started PokevaultApplication` en la consola, abre:
   - Página de inicio: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - OpenAPI (JSON): http://localhost:8080/v3/api-docs

> La base de datos H2 vive en memoria: los datos se borran cada vez que se reinicia la aplicación.

## Estructura del proyecto

```
pokevault
├── pom.xml
├── postman/                         Evidencia de pruebas con Postman
└── src/main
    ├── java/com/pokevault/pokevault
    │   ├── PokevaultApplication.java
    │   ├── config/        OpenApiConfig            (título y descripción de Swagger)
    │   ├── controller/    PokemonCardController    (endpoints REST)
    │   ├── entity/        PokemonCard              (entidad JPA + validaciones)
    │   ├── exception/     NotFoundException, GlobalExceptionHandler
    │   ├── repository/    PokemonCardRepository    (JpaRepository)
    │   └── service/       PokemonCardService       (lógica de negocio)
    └── resources
        ├── static/index.html                       (página de inicio)
        └── application.properties
```

## Modelo de datos: `PokemonCard`

| Campo | Tipo | Validación |
|---|---|---|
| `id` | Long | Autogenerado |
| `name` | String | Obligatorio, no vacío |
| `type` | String | Obligatorio, no vacío (Fire, Water, Grass...) |
| `hp` | Integer | Obligatorio, entre 10 y 500 |
| `rarity` | String | Obligatorio, no vacío (Common, Rare, Holo Rare...) |
| `setName` | String | Obligatorio, no vacío (Base Set, Jungle...) |
| `estimatedValue` | Double | Obligatorio, mayor o igual a 0 |

## Endpoints

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/api/cards` | Lista todas las cartas | 200 |
| GET | `/api/cards/{id}` | Obtiene una carta por id | 200, 404 |
| POST | `/api/cards` | Crea una carta nueva | 201, 400 |
| PUT | `/api/cards/{id}` | Actualiza una carta existente | 200, 400, 404 |
| DELETE | `/api/cards/{id}` | Elimina una carta | 204, 404 |

### Ejemplo de cuerpo (POST y PUT)

```json
{
  "name": "Charizard",
  "type": "Fire",
  "hp": 120,
  "rarity": "Holo Rare",
  "setName": "Base Set",
  "estimatedValue": 350.0
}
```

### Ejemplo de error 404

`GET /api/cards/999`

```json
{
  "timestamp": "2026-10-03T11:28:13.518",
  "status": 404,
  "error": "Not Found",
  "message": "Card not found with id 999"
}
```

### Ejemplo de error 400

`POST /api/cards` con `"name": ""` y `"hp": 5`

```json
{
  "timestamp": "2026-10-03T11:30:00.123",
  "status": 400,
  "error": "Bad Request",
  "messages": {
    "name": "name is required",
    "hp": "hp must be at least 10"
  }
}
```

## Documentación con Swagger

Con la aplicación corriendo, abre http://localhost:8080/swagger-ui.html. Desde ahí puedes probar los 5 endpoints con **Try it out → Execute**, sin necesidad de otras herramientas.

## Pruebas con Postman

La carpeta `postman/` contiene la evidencia de las pruebas de la colección **PokeVault API**, con los 5 endpoints del CRUD y dos casos de error:

| Petición | Método | URL | Resultado esperado |
|---|---|---|---|
| Create card | POST | `http://localhost:8080/api/cards` | 201 |
| Get all cards | GET | `http://localhost:8080/api/cards` | 200 |
| Get card by id | GET | `http://localhost:8080/api/cards/1` | 200 |
| Update card | PUT | `http://localhost:8080/api/cards/1` | 200 |
| **Error 404** | GET | `http://localhost:8080/api/cards/999` | 404 |
| **Error 400** | POST | `http://localhost:8080/api/cards` (datos inválidos) | 400 |
| Delete card | DELETE | `http://localhost:8080/api/cards/1` | 204 |

Orden recomendado: ejecutar primero *Create card* y dejar *Delete card* para el final.

## API reference

PokeVault exposes five REST endpoints under the `/api/cards` base path, and every request and response body uses JSON. `GET /api/cards` returns the full list of Pokémon cards stored in the collection, or an empty list if there are none. `GET /api/cards/{id}` returns a single card by its id, and it responds with a 404 Not Found error when no card exists with that id. `POST /api/cards` creates a new card from the JSON body and returns it with a 201 Created status, while invalid data, such as an empty name or an hp below 10, produces a 400 Bad Request response that lists each failing field. `PUT /api/cards/{id}` replaces all the fields of an existing card with the values in the request body and returns the updated card, responding with 404 if the id does not exist or 400 if the new data is invalid. `DELETE /api/cards/{id}` removes the card with the given id and returns 204 No Content, or 404 Not Found if that card does not exist.

## Autor

FULL_NAME: Juan Diego Bonilla Orozco GITHUB_USER: jdbonilla-2025b-netizen

Proyecto académico desarrollado con Spring Boot.
