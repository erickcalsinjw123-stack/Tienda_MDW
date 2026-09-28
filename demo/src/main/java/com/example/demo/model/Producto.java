package com.example.demo.model;

import java.util.List;

public class Producto {
    private static int siguienteId = 1;

    private final int id;
    private final String nombre;
    private final String categoria;
    private final double precio;
    private final String imagen;
    private final String descripcion;
    private final List<String> especificaciones;

    public Producto(String nombre, String categoria, double precio,
                    String imagen, String descripcion, List<String> especificaciones) {
        this.id = siguienteId++;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.imagen = imagen;
        this.descripcion = descripcion;
        this.especificaciones = List.copyOf(especificaciones);
    }

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public String getCategoria() { return categoria; }
    public double getPrecio() { return precio; }
    public String getImagen() { return imagen; }
    public String getDescripcion() { return descripcion; }
    public List<String> getEspecificaciones() { return especificaciones; }
}