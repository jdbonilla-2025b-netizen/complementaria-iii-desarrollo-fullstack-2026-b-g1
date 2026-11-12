package com.urbanstyle.web;

import com.urbanstyle.repo.UsuarioRepository;
import com.urbanstyle.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    public record LoginRequest(String username, String password) {}

    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UsuarioRepository usuarios, PasswordEncoder encoder, JwtService jwt) {
        this.usuarios = usuarios; this.encoder = encoder; this.jwt = jwt;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req.username() == null || req.password() == null)
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        return usuarios.findByUsername(req.username())
                .filter(u -> encoder.matches(req.password(), u.getPassword()))
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(
                        Map.of("token", jwt.generar(u.getUsername()), "username", u.getUsername())))
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas")));
    }
}
