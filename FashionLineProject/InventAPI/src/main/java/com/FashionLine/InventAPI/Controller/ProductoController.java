package com.FashionLine.InventAPI.Controller;

import org.springframework.web.bind.annotation.RestController;

import com.FashionLine.InventAPI.Model.Producto;
import com.FashionLine.InventAPI.Service.ProductoService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductoController {

    @Autowired
    ProductoService productoService;

    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    @GetMapping("/filtrar-categoria")
    public List<Producto> getProductosByCategoria(@RequestParam(name="categoria",required = true) String categoria) {
        return productoService.getProductosByCategoria(categoria);
    }

    
    @GetMapping("/filtrar-categoria-orden-stock")
    public List<Producto> getProductosByCategoriaStockAsc(@RequestParam(name="categoria",required = true) String categoria) {
        return productoService.getProductosByCategoriaStockAsc(categoria);
    }


    @GetMapping("/orden-stock")
    public List<Producto> getProductosOrderByStockAsc() {
        return productoService.getProductosOrderByStockAsc();
    }


    @GetMapping("/categorias")
    public List<String> getCategorias() {
        return productoService.getCategorias();
    }

    @GetMapping("/buscar-nombre")
    public ResponseEntity<Producto> getProductoByNombre(@RequestParam String nombre) {
        Optional<Producto> producto = productoService.getProductoByNombre(nombre);
        return producto.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/buscar-id")
    public ResponseEntity<Producto> getProductoById(@RequestParam String id) {
        Optional<Producto> producto = productoService.getProductoById(id);
        return producto.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

     // Endpoint para agregar un nuevo producto
    @PostMapping("/agregar")
    public ResponseEntity<Producto> createProducto(@Valid @RequestBody Producto producto) {
        Producto createdProducto = productoService.createProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProducto);
    }

    // Endpoint para actualizar un producto
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable String id,@Valid @RequestBody Producto producto) {
        Optional<Producto> updatedProducto = productoService.updateProducto(id, producto);
        return updatedProducto.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Endpoint para eliminar un producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable String id) {
        boolean isDeleted = productoService.deleteProducto(id);
        return isDeleted ? ResponseEntity.status(HttpStatus.NO_CONTENT).build()
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
