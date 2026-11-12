package com.urbanstyle.service;

import com.urbanstyle.model.Producto;
import com.urbanstyle.repo.ProductoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductoService {
    private final ProductoRepository repo;

    public ProductoService(ProductoRepository repo) { this.repo = repo; }

    public List<Producto> listar() { return repo.findAll(); }

    public Producto crear(Producto p) {
        if (p.getNombre() == null || p.getNombre().isBlank())
            throw new IllegalArgumentException("El nombre es obligatorio");
        if (p.getPrecio() <= 0)
            throw new IllegalArgumentException("El precio debe ser mayor que 0");
        return repo.save(p);
    }
}
