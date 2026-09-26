# CRUD REST - Estudiantes

Actividad práctica Semana 8 · Desarrollo Fullstack · CORHUILA
CRUD REST completo (entity, repository, service, controller) para el recurso **Estudiante**.

## Arquitectura (capas)

```
model/         -> Estudiante.java (entity)
repository/    -> EstudianteRepository.java (Spring Data JPA)
service/       -> EstudianteService.java (interfaz) + service/impl/EstudianteServiceImpl.java (lógica)
controller/    -> EstudianteController.java (endpoints REST)
exception/     -> manejo de errores (404, validaciones)
```

## Requisitos

- Java 17+
- Maven 3.8+ (o usa el wrapper `./mvnw` si lo agregas)

## Cómo ejecutar

```bash
mvn spring-boot:run
```

La app queda disponible en `http://localhost:8080`.
Base de datos H2 en memoria (no requiere instalación); consola en `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:estudiantesdb`, usuario: `sa`, sin contraseña).

Al iniciar se cargan 2 estudiantes de ejemplo (`data.sql`).

## Endpoints REST

| Acción      | Método HTTP | URL                       | Código de éxito |
|-------------|-------------|---------------------------|------------------|
| Crear       | POST        | `/api/estudiantes`        | 201 Created      |
| Listar      | GET         | `/api/estudiantes`        | 200 OK           |
| Obtener uno | GET         | `/api/estudiantes/{id}`   | 200 OK           |
| Actualizar  | PUT         | `/api/estudiantes/{id}`   | 200 OK           |
| Borrar      | DELETE      | `/api/estudiantes/{id}`   | 204 No Content   |

URLs con sustantivo (`estudiantes`) en plural, sin verbos, y el método HTTP indica la acción, tal como pide la guía.

### Cuerpo (JSON) esperado para crear/actualizar

```json
{
  "nombre": "Mario",
  "apellido": "Rojas",
  "email": "mario.rojas@correo.com",
  "programa": "Ingeniería de Sistemas",
  "semestre": 4
}
```

## Evidencia de pruebas

### Opción A: pruebas automatizadas (recomendado)

```bash
mvn test
```

`src/test/java/.../EstudianteControllerTest.java` ejercita el CRUD completo end-to-end
(crear → listar → obtener → actualizar → borrar → confirmar 404) usando MockMvc.
La salida de la consola con "BUILD SUCCESS" y los tests en verde es la evidencia.

### Opción B: pruebas manuales con curl

```bash
# Crear
curl -X POST http://localhost:8080/api/estudiantes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mario","apellido":"Rojas","email":"mario.rojas@correo.com","programa":"Ingeniería de Sistemas","semestre":4}'

# Listar
curl http://localhost:8080/api/estudiantes

# Obtener por id
curl http://localhost:8080/api/estudiantes/1

# Actualizar
curl -X PUT http://localhost:8080/api/estudiantes/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mario","apellido":"Rojas Londoño","email":"mario.rojas@correo.com","programa":"Ingeniería de Sistemas","semestre":5}'

# Borrar
curl -X DELETE http://localhost:8080/api/estudiantes/1
```

### Opción C: archivo `requests.http`

Incluido en la raíz del proyecto. Ábrelo en VS Code con la extensión **REST Client**
(o en IntelliJ, que lo soporta nativo) y ejecuta cada petición con un clic; las respuestas
y sus códigos HTTP (201, 200, 204, 404) quedan visibles como evidencia.

## Entrega (según la guía)

1. Haz fork del repositorio de la clase y clónalo.
2. Copia esta carpeta del proyecto dentro de `08-week/` en tu fork.
3. `git add .`
4. `git commit -m "Entrega semana 08"`
5. `git push`
