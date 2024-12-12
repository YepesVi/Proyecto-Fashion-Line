package com.FashionLine.InventAPI.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.FashionLine.InventAPI.Model.Producto;

public interface ProductoRepository extends MongoRepository< Producto , String > {

    // Buscar productos por categoría
    List<Producto> findByCategoria(String categoria);

    // Listar todos los productos ordenados por stock de manera ascendente
    List<Producto> findAllByOrderByStockAsc();

    // Buscar un producto por nombre
    Optional<Producto> findByNombre(String nombre);

    // Buscar productos por categoría y ordenarlos por stock ascendente (consulta personalizada con @Query)
    @Query("{ 'categoria': ?0 }")
    List<Producto> findByCategoriaAndOrderByStockAsc(String categoria);

     // Obtener todas las categorías distintas
     @Query(value = "{}", fields = "{ 'categoria' : 1 , '_id' : 0 }")
     List<Producto> findDistinctCategorias();

}
