package com.example.demo.controller;

import com.example.demo.model.Producto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Controller
public class TechStoreController {
    private final List<Producto> productos = new ArrayList<>();

    public TechStoreController() {
        productos.add(new Producto("Iphone 12", "Tecnología", 899, "/img/Iphone12.png", "128GB / 8GB RAM",
            Arrays.asList("Pantalla Super Retina XDR", "Almacenamiento: 128GB", "Memoria RAM: 8GB", "Conectividad 5G")));
        productos.add(new Producto("Reloj Inteligente", "Tecnología", 149, "/img/RelojInteligente.png", "Pantalla AMOLED y batería de 96h",
            Arrays.asList("Pantalla AMOLED", "Batería: hasta 96 horas", "Monitoreo deportivo", "Bluetooth")));
        productos.add(new Producto("Micrófono Profesional", "Tecnología", 199, "/img/MicrofonoProfesional.png", "Audio claro para streaming y grabación",
            Arrays.asList("Conexión USB", "Soporte de 1.5m", "Patrón cardioide", "Ideal para streaming")));
        productos.add(new Producto("Audífonos Ergonómicos", "Tecnología", 129, "/img/AudicularesErgonomicos.png", "Sonido premium con cancelación",
            Arrays.asList("Cancelación de ruido", "Conexión Bluetooth", "Micrófono integrado", "Diseño ergonómico")));
        productos.add(new Producto("PlayStation 5 Pro", "Tecnología", 1699, "/img/PlayStation5.png", "Consola de última generación",
            Arrays.asList("SSD de alta velocidad", "Resolución hasta 4K", "1TB de almacenamiento", "Control inalámbrico")));
        productos.add(new Producto("Laptop ASUS", "Prearmados", 1299, "/img/LaptopASUS.png", "Ideal para trabajo y estudio",
            Arrays.asList("Pantalla Full HD", "16GB RAM", "SSD 512GB", "Procesador Intel Core i5")));
        productos.add(new Producto("Workstation 3D", "Prearmados", 1799, "/img/Workstation3D.png", "Diseñada para render y diseño 3D",
            Arrays.asList("32GB RAM", "SSD 1TB", "GPU dedicada", "Recomendada para diseño 3D")));
        productos.add(new Producto("PC Office Pro", "Prearmados", 949, "/img/PCOfficePro.png", "Rendimiento para oficina y multitarea",
            Arrays.asList("16GB RAM", "SSD 512GB", "Wi-Fi", "Uso empresarial y académico")));
        productos.add(new Producto("PC Gamer Ryzen 7", "Prearmados", 1699, "/img/PCGamerRyzen7.png", "Gaming y edición sin límites",
            Arrays.asList("Ryzen 7", "32GB RAM", "SSD 1TB", "Tarjeta gráfica dedicada")));
        productos.add(new Producto("Mini PC Compact", "Prearmados", 799, "/img/MiniPCCompact.png", "Potencia compacta y silenciosa",
            Arrays.asList("16GB RAM", "SSD 512GB", "Diseño compacto", "Bajo consumo energético")));
        productos.add(new Producto("Procesador Ryzen 5 5600", "Componentes", 229, "/img/ProcesadorRyzen55600.png", "6 núcleos / 12 hilos",
            Arrays.asList("6 núcleos", "12 hilos", "Socket AM4", "Arquitectura Zen 3")));
        productos.add(new Producto("RTX 4060", "Componentes", 599, "/img/TarjetaGraficaRTX4060.png", "Ray tracing y 1080p ultra",
            Arrays.asList("8GB GDDR6", "Ray Tracing", "DLSS", "Ideal para gaming 1080p")));
        productos.add(new Producto("Memoria RAM 32GB", "Componentes", 189, "/img/MemoriaRAM32GB.png", "DDR4 3200MHz",
            Arrays.asList("Capacidad: 32GB", "Tipo: DDR4", "Velocidad: 3200MHz", "Kit de memoria")));
        productos.add(new Producto("SSD 1TB", "Componentes", 119, "/img/AlmacenamientoSSD1TB.png", "Velocidad y espacio para todo",
            Arrays.asList("Capacidad: 1TB", "Lectura: hasta 3500MB/s", "Formato M.2", "Alta velocidad")));
        productos.add(new Producto("Placa Base B550", "Componentes", 249, "/img/PlacabaseB550.png", "Compatibilidad total con Ryzen",
            Arrays.asList("Chipset B550", "Socket AM4", "Compatible con Ryzen", "Wi-Fi integrado")));
        productos.add(new Producto("Prueba 1", "Tecnología", 100, "/img/FuentePoder.png", "1231111",
            Arrays.asList("Producto tecnológico")));
    }

    @GetMapping({"/"})
    public String inicio(Model model) {
        model.addAttribute("productosDestacados", productos.subList(0, Math.min(5, productos.size())));
        return "index";
    }

    @GetMapping("/catalogo")
    public String catalogo(Model model) {
        Map<String, List<Producto>> productosPorCategoria = new LinkedHashMap<>();
        productos.forEach(producto -> productosPorCategoria
            .computeIfAbsent(producto.getCategoria(), categoria -> new ArrayList<>())
            .add(producto));
        model.addAttribute("productosPorCategoria", productosPorCategoria);
        return "catalogo";
    }

    @GetMapping("/productos/{id}")
    public String detalleProducto(@PathVariable int id, Model model) {
        productos.stream()
            .filter(producto -> producto.getId() == id)
            .findFirst()
            .ifPresent(producto -> model.addAttribute("producto", producto));
        model.addAttribute("titulo", "Detalle del producto");
        return "productos/detalle";
    }

    @GetMapping({"/contacto"})
    public String contacto() {
        return "contacto";
    }

    @GetMapping({"/iniciarSesion"})
    public String iniciarSesion() {
        return "iniciarSesion";
    }

    @GetMapping({"/registro"})
    public String registro() {
        return "registro";
    }

    @GetMapping({"/administracion"})
    public String administracion(Model model) {
        model.addAttribute("productos", productos);
        return "administracion";
    }
}
