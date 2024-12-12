package com.FashionLine.InventAPI.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FashionLine.InventAPI.Model.Producto;
import com.FashionLine.InventAPI.Repository.ProductoRepository;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Crear un nuevo producto
    public Producto createProducto(Producto producto) {
        return productoRepository.save(producto);
    }

   
    // Obtener todos los productos
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    // Buscar productos por categoría
    public List<Producto> getProductosByCategoria(String categoria) {
        return productoRepository.findByCategoria(categoria);
    }
    
    // Buscar productos por categoría y ordenados por stock
    public List<Producto> getProductosByCategoriaStockAsc(String categoria) {
        return productoRepository.findByCategoriaAndOrderByStockAsc(categoria);
    }

    // Listar productos por stock ascendente
    public List<Producto> getProductosOrderByStockAsc() {
        return productoRepository.findAllByOrderByStockAsc();
    }

    // Buscar un producto por nombre
    public Optional<Producto> getProductoByNombre(String nombre) {
        return productoRepository.findByNombre(nombre);
    }

     // Buscar un producto por id
     public Optional<Producto> getProductoById(String id) {
        return productoRepository.findById(id);
    }

    // Obtener todas las categorías distintas
    public List<Producto> getAllCategorias() {
       return productoRepository.findDistinctCategorias();
    }

    public List<String> getCategorias() {
        // Obtienes todos los productos pero solo extraes el campo "categoria"
        List<Producto> productos = productoRepository.findDistinctCategorias();
        
        // Mapear los productos a solo la categoría
        return productos.stream()
                         .map(Producto::getCategoria)
                         .distinct()  // Para evitar categorías duplicadas
                         .collect(Collectors.toList());
    }    

    // Actualizar un producto
    public Optional<Producto> updateProducto(String id, Producto producto) {
        Optional<Producto> existingProducto = productoRepository.findById(id);

        if (existingProducto.isPresent()) {
            
            Producto updatedProducto = new Producto(id, producto.getNombre(),
                                        producto.getDescripcion(), producto.getTalla(), 
                                        producto.getCategoria() , producto.getPrecio(), 
                                        producto.getStock());

            // Guardamos los cambios en la base de datos
            return Optional.of(productoRepository.save(updatedProducto));
        }
        return Optional.empty();
    }

    // Eliminar un producto
    public boolean deleteProducto(String id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
