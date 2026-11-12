package com.urbanstyle;

import com.urbanstyle.model.Producto;
import com.urbanstyle.model.Usuario;
import com.urbanstyle.repo.ProductoRepository;
import com.urbanstyle.repo.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Datos semilla: usuario admin / admin123 y algunos productos. */
@Component
public class DataSeeder implements CommandLineRunner {
    private final UsuarioRepository usuarios;
    private final ProductoRepository productos;
    private final PasswordEncoder encoder;

    public DataSeeder(UsuarioRepository u, ProductoRepository p, PasswordEncoder e) {
        this.usuarios = u; this.productos = p; this.encoder = e;
    }

    @Override
    public void run(String... args) {
        if (usuarios.count() == 0)
            usuarios.save(new Usuario("admin", encoder.encode("admin123"), "ADMIN"));
        if (productos.count() == 0) {
            productos.save(new Producto("Camiseta oversize", 59900));
            productos.save(new Producto("Jean slim fit", 129900));
            productos.save(new Producto("Chaqueta bomber", 189900));
            productos.save(new Producto("Tenis urbanos", 249900));
        }
    }
}
