package com.FashionLine.InventAPI.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data // Genera getters, setters, toString, equals, y hashCode
@RequiredArgsConstructor // Constructor con argumentos para los atributos `final` o `@NonNull`
@AllArgsConstructor // Constructor con todos los atributos
@Document(collection = "productos") // Define la colección en MongoDB
public class Producto {

    @Id
    private String id;

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String nombre;

    private String descripcion;

    private String talla;

    @NotBlank(message = "La categoría del producto es obligatoria.")
    private  String categoria; // Atributo obligatorio

    @NotNull(message = "El precio no puede ser nulo.")
    @Min(value = 0, message = "El precio debe ser mayor o igual a 0.")
    private Double precio; // Atributo obligatorio

    @NotNull(message = "La cantidad en stock no puede ser nula.")
    @Min(value = 0, message = "La cantidad en stock debe ser mayor o igual a 0.")
    private int stock; // Atributo obligatorio

}
