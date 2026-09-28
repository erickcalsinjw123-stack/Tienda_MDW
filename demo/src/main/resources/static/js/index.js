const CARRITO_KEY = "techstore_carrito";

// Estado temporal del catálogo, producto abierto y carrito del navegador.
let productos = [];
let carrito = [];
let productoSeleccionado = null;
let modalDetalle;
let modalCarrito;

function imagenFallback(producto) {
    // Genera una imagen SVG local cuando la ruta original no está disponible.
    const texto = encodeURIComponent((producto.nombre || "Producto").substring(0, 18));
    return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="100%" height="100%" fill="%23f1f5f9"/><rect x="45" y="45" width="510" height="360" rx="24" fill="%23e2e8f0"/><text x="300" y="220" text-anchor="middle" font-family="Arial" font-size="34" font-weight="bold" fill="%23475569">${texto}</text><text x="300" y="265" text-anchor="middle" font-family="Arial" font-size="20" fill="%2364758b">TechStore</text></svg>`;
}

function prepararImagen(img, producto) {
    // Conecta el fallback al evento de error de cada imagen.
    img.onerror = () => {
        img.onerror = null;
        img.src = imagenFallback(producto);
    };
}

function cargarProductos() {
    // Convierte los atributos data-* generados por Thymeleaf en objetos JavaScript.
    productos = [...document.querySelectorAll(".producto-item")].map(item => ({
        nombre: item.dataset.nombre,
        categoria: item.dataset.categoria,
        precio: Number(item.dataset.precio),
        imagen: item.dataset.imagen,
        descripcion: item.dataset.descripcion,
        especificaciones: item.dataset.especificaciones ? item.dataset.especificaciones.split("|") : []
    }));
    mostrarProductos();
}

function mostrarProductos() {
    // Activa imágenes seguras y botones de detalle para cada tarjeta.
    document.querySelectorAll(".producto-item").forEach((item, index) => {
        const producto = productos[index];
        const imagen = item.querySelector("img");
        if (imagen) prepararImagen(imagen, producto);
        item.querySelector(".detalle-btn")?.addEventListener("click", event => {
            event.preventDefault();
            abrirDetalle(index);
        });
    });
}

function abrirDetalle(index) {
    // Copia los datos del producto seleccionado al modal de detalle.
    productoSeleccionado = productos[index];
    if (!productoSeleccionado) return;
    document.getElementById("detalleTitulo").textContent = "Detalle del producto";
    document.getElementById("detalleNombre").textContent = productoSeleccionado.nombre;
    document.getElementById("detalleCategoria").textContent = productoSeleccionado.categoria;
    document.getElementById("detalleDescripcion").textContent = productoSeleccionado.descripcion || "";
    document.getElementById("detallePrecio").textContent = `S/${Number(productoSeleccionado.precio).toFixed(2)}`;
    const img = document.getElementById("detalleImagen");
    img.src = productoSeleccionado.imagen;
    img.alt = productoSeleccionado.nombre;
    prepararImagen(img, productoSeleccionado);
    const lista = document.getElementById("detalleEspecificaciones");
    lista.innerHTML = "";
    (productoSeleccionado.especificaciones || []).forEach(e => {
        const li = document.createElement("li");
        li.className = "list-group-item px-0";
        li.innerHTML = `<span class="me-2 text-primary">✓</span>${e}`;
        lista.appendChild(li);
    });
    modalDetalle.show();
}

function cargarCarrito() {
    // Recupera el carrito guardado en localStorage sin romper si está corrupto.
    try {
        const guardado = JSON.parse(localStorage.getItem(CARRITO_KEY));
        carrito = Array.isArray(guardado) ? guardado : [];
    } catch (e) {
        carrito = [];
    }
    actualizarContador();
}

function guardarCarrito() {
    // Persiste los cambios y actualiza el contador visible en la navegación.
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    actualizarContador();
}

function agregarAlCarrito(producto) {
    if (!producto) return;

    // Se identifica por nombre para agrupar unidades del mismo producto.
    const existente = carrito.find(item => item.nombre === producto.nombre);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({
            nombre: producto.nombre,
            precio: Number(producto.precio) || 0,
            imagen: producto.imagen || "",
            cantidad: 1
        });
    }

    guardarCarrito();
    renderCarrito();
    mostrarToast(`${producto.nombre} agregado al carrito.`);
}

function renderCarrito() {
    // Redibuja las filas del modal y calcula subtotales y total de compra.
    const lista = document.getElementById("listaCarrito");
    const vacio = document.getElementById("carritoVacio");
    const total = document.getElementById("totalCarrito");
    if (!lista || !vacio || !total) return;

    lista.innerHTML = "";

    if (carrito.length === 0) {
        vacio.classList.remove("d-none");
        total.textContent = "S/0.00";
        return;
    }

    vacio.classList.add("d-none");
    let totalCompra = 0;

    carrito.forEach((item, index) => {
        const precio = Number(item.precio) || 0;
        const cantidad = Number(item.cantidad) || 1;
        const subtotal = precio * cantidad;
        totalCompra += subtotal;

        const fila = document.createElement("div");
        fila.className = "carrito-item border rounded-3 p-3 mb-3";
        fila.innerHTML = `<div class="row align-items-center g-3"><div class="col-3 col-sm-2 text-center"><img class="carrito-imagen" src="${item.imagen}" alt="${item.nombre}"></div><div class="col-9 col-sm-4"><h6 class="mb-1">${item.nombre}</h6><small class="text-muted">S/${precio.toFixed(2)} c/u</small></div><div class="col-7 col-sm-4"><div class="input-group input-group-sm cantidad-control"><button class="btn btn-outline-secondary btn-restar">−</button><input class="form-control text-center" value="${cantidad}" readonly><button class="btn btn-outline-secondary btn-sumar">+</button></div></div><div class="col-5 col-sm-2 text-end"><div class="fw-bold text-primary mb-2">S/${subtotal.toFixed(2)}</div><button class="btn btn-sm btn-outline-danger btn-eliminar">Eliminar</button></div></div>`;
        prepararImagen(fila.querySelector("img"), item);
        fila.querySelector(".btn-restar").addEventListener("click", () => cambiarCantidad(index, -1));
        fila.querySelector(".btn-sumar").addEventListener("click", () => cambiarCantidad(index, 1));
        fila.querySelector(".btn-eliminar").addEventListener("click", () => eliminarDelCarrito(index));
        lista.appendChild(fila);
    });

    total.textContent = `S/${totalCompra.toFixed(2)}`;
}

function cambiarCantidad(index, cambio) {
    // Incrementa o reduce unidades; elimina la fila cuando llega a cero.
    if (!carrito[index]) return;
    carrito[index].cantidad = (Number(carrito[index].cantidad) || 1) + cambio;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    guardarCarrito();
    renderCarrito();
}

function eliminarDelCarrito(index) {
    // Elimina un producto completo del carrito.
    carrito.splice(index, 1);
    guardarCarrito();
    renderCarrito();
}

function vaciarCarrito() {
    // Borra todos los productos guardados en la sesión del navegador.
    carrito = [];
    guardarCarrito();
    renderCarrito();
}

function actualizarContador() {
    // Suma las cantidades de todas las líneas del carrito.
    const contador = document.getElementById("contadorCarrito");
    if (!contador) return;
    const cantidad = carrito.reduce((total, item) => total + (Number(item.cantidad) || 0), 0);
    contador.textContent = cantidad;
}

function mostrarToast(mensaje) {
    // Muestra una notificación Bootstrap sin interrumpir la navegación.
    const toast = document.getElementById("toastCarrito");
    const mensajeElemento = document.getElementById("toastMensaje");
    if (!toast || !mensajeElemento || typeof bootstrap === "undefined") return;
    mensajeElemento.textContent = mensaje;
    bootstrap.Toast.getOrCreateInstance(toast, { delay: 2200 }).show();
}

document.addEventListener("DOMContentLoaded", () => {
    // Inicializa modales, botones y datos cuando el HTML ya está disponible.
    modalDetalle = new bootstrap.Modal(document.getElementById("modalDetalle"));
    modalCarrito = new bootstrap.Modal(document.getElementById("modalCarrito"));

    document.getElementById("btnAgregarDetalle").addEventListener("click", () => {
        if (!productoSeleccionado) return;
        agregarAlCarrito(productoSeleccionado);
        modalDetalle.hide();
    });

    document.getElementById("btnCarrito").addEventListener("click", event => {
        event.preventDefault();
        // Siempre muestra el contenido actual del carrito al abrirlo.
        renderCarrito();
        modalCarrito.show();
    });

    document.getElementById("btnVaciarCarrito").addEventListener("click", () => {
        if (carrito.length === 0) return;
        vaciarCarrito();
    });

    document.getElementById("btnFinalizarCompra").addEventListener("click", () => {
        if (!carrito.length) {
            mostrarToast("Agrega al menos un producto para continuar.");
            return;
        }
        mostrarToast("Compra preparada. Puedes continuar con el proceso de pago.");
    });

    cargarProductos();
    cargarCarrito();
    renderCarrito();
});
