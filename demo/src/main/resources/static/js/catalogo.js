document.addEventListener("DOMContentLoaded", () => {
    const busqueda = document.getElementById("busqueda");
    const categoria = document.getElementById("categoria");
    const precio = document.getElementById("precio");
    const orden = document.getElementById("orden");
    const items = [...document.querySelectorAll(".producto-item")];
    const grupos = [...document.querySelectorAll(".catalog-group")];
    const contador = document.getElementById("contadorResultados");
    const sinResultados = document.getElementById("sinResultados");

    function actualizarCatalogo() {
        const termino = busqueda.value.trim().toLowerCase();
        const categoriaElegida = categoria.value;
        const precioMaximo = Number(precio.value) || Infinity;
        const visibles = items.filter(item => {
            const coincideTexto = `${item.dataset.nombre} ${item.dataset.categoria}`.toLowerCase().includes(termino);
            const coincideCategoria = !categoriaElegida || item.dataset.categoria === categoriaElegida;
            const coincidePrecio = Number(item.dataset.precio) <= precioMaximo;
            const mostrar = coincideTexto && coincideCategoria && coincidePrecio;
            item.classList.toggle("d-none", !mostrar);
            return mostrar;
        });

        const ordenElegido = orden.value;
        visibles.sort((a, b) => {
            if (ordenElegido === "menor") return Number(a.dataset.precio) - Number(b.dataset.precio);
            if (ordenElegido === "mayor") return Number(b.dataset.precio) - Number(a.dataset.precio);
            if (ordenElegido === "nombre") return a.dataset.nombre.localeCompare(b.dataset.nombre);
            return 0;
        });
        visibles.forEach(item => item.parentElement.appendChild(item));
        grupos.forEach(grupo => {
            const tieneResultados = [...grupo.querySelectorAll(".producto-item")].some(item => !item.classList.contains("d-none"));
            grupo.classList.toggle("d-none", !tieneResultados);
        });
        contador.textContent = `${visibles.length} producto${visibles.length === 1 ? "" : "s"}`;
        sinResultados.classList.toggle("d-none", visibles.length > 0);
    }

    [busqueda, categoria, precio, orden].forEach(control => control.addEventListener("input", actualizarCatalogo));
    document.getElementById("limpiarFiltros").addEventListener("click", () => {
        busqueda.value = "";
        categoria.value = "";
        precio.value = "";
        orden.value = "relevancia";
        actualizarCatalogo();
    });
    actualizarCatalogo();
});
