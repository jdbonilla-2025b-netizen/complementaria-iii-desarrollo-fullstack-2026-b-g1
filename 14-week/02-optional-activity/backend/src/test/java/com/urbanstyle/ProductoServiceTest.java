package com.urbanstyle;

import com.urbanstyle.model.Producto;
import com.urbanstyle.repo.ProductoRepository;
import com.urbanstyle.service.ProductoService;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProductoServiceTest {
    private final ProductoRepository repo = mock(ProductoRepository.class);
    private final ProductoService service = new ProductoService(repo);

    @Test
    void crear_productoValido_loGuarda() {
        Producto p = new Producto("Gorra", 35000);
        when(repo.save(p)).thenReturn(p);
        assertEquals("Gorra", service.crear(p).getNombre());
        verify(repo).save(p);
    }

    @Test
    void crear_precioCero_lanzaError() {          // caso límite
        assertThrows(IllegalArgumentException.class, () -> service.crear(new Producto("Gorra", 0)));
        verify(repo, never()).save(any());
    }

    @Test
    void crear_precioNegativo_lanzaError() {      // caso de error
        assertThrows(IllegalArgumentException.class, () -> service.crear(new Producto("Gorra", -5)));
    }

    @Test
    void crear_nombreVacio_lanzaError() {
        assertThrows(IllegalArgumentException.class, () -> service.crear(new Producto(" ", 100)));
    }
}
