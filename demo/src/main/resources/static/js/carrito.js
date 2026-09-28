// Actualiza el contador del carrito en cualquier página que use el fragmento header.
function actualizarContadorCarrito() {
    const contador = document.getElementById("contadorCarrito");
    if (!contador) return;

    try {
        const carrito = JSON.parse(localStorage.getItem("techstore_carrito")) || [];
        const cantidad = Array.isArray(carrito)
            ? carrito.reduce((total, item) => total + (Number(item.cantidad) || 0), 0)
            : 0;
        contador.textContent = cantidad;
    } catch (error) {
        contador.textContent = "0";
    }
}

actualizarContadorCarrito();

// Recalcula el valor al volver a una página guardada en el historial.
window.addEventListener("pageshow", actualizarContadorCarrito);

// Sincroniza el contador si el carrito cambia desde otra pestaña.
window.addEventListener("storage", event => {
    if (event.key === "techstore_carrito") {
        actualizarContadorCarrito();
    }
});
