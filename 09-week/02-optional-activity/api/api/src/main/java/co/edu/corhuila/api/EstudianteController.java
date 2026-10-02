package co.edu.corhuila.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Tag(name = "Estudiantes", description = "Operaciones sobre estudiantes")
@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {

    private final EstudianteRepository repo;

    public EstudianteController(EstudianteRepository repo) {
        this.repo = repo;
    }

    @Operation(summary = "Listar todos los estudiantes")
    @GetMapping
    public List<Estudiante> listar() {
        return repo.findAll();
    }

    @Operation(summary = "Obtener un estudiante por ID (404 si no existe)")
    @GetMapping("/{id}")
    public Estudiante obtener(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudiante no encontrado"));
    }

    @Operation(summary = "Crear un estudiante (400 si los datos son inválidos)")
    @PostMapping
    public ResponseEntity<Estudiante> crear(@Valid @RequestBody Estudiante e) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(e));
    }
}