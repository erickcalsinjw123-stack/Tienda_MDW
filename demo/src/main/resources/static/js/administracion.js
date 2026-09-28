const categorias = ["Tecnología", "Prearmados", "Componentes"];

// Lista local que representa los productos administrados en esta pantalla.
let productos = [];

const alerta = document.getElementById("alerta");
const listaProductos = document.getElementById("listaProductos");
const formProducto = document.getElementById("formProducto");
const productoIndex = document.getElementById("productoIndex");
const nombreInput = document.getElementById("nombre");
const categoriaInput = document.getElementById("categoria");
const precioInput = document.getElementById("precio");
const imagenInput = document.getElementById("imagen");
const descripcionInput = document.getElementById("descripcion");
const buscarProducto = document.getElementById("buscarProducto");
const filtrarCategoria = document.getElementById("filtrarCategoria");
const tituloFormulario = document.getElementById("tituloFormulario");

function mostrarAlerta(mensaje, tipo) {
  // Presenta el resultado de una operación usando las clases de Bootstrap.
  alerta.className = "alert alert-" + tipo + " mt-3";
  alerta.textContent = mensaje;
  alerta.classList.remove("d-none");
}

function ocultarAlerta() {
  // Oculta el mensaje actual antes de iniciar otra operación.
  alerta.classList.add("d-none");
}

function limpiarFormulario() {
  // Restablece el formulario al modo "nuevo producto".
  formProducto.reset();
  productoIndex.value = "";
  tituloFormulario.textContent = "Nuevo producto";
  ocultarAlerta();
}

function cargarProductosIniciales() {
  // Lee los productos renderizados por Thymeleaf desde sus atributos data-*.
  productos = [...document.querySelectorAll(".producto-item")].map(item => ({
    nombre: item.dataset.nombre,
    categoria: item.dataset.categoria,
    precio: Number(item.dataset.precio),
    imagen: item.dataset.imagen,
    descripcion: item.dataset.descripcion
  }));
  mostrarProductos();
}

function mostrarProductos() {
  // Agrupa y dibuja las tarjetas actuales junto con sus acciones.
  listaProductos.innerHTML = "";

  categorias.forEach(categoria => {
    const termino = buscarProducto.value.trim().toLowerCase();
    const categoriaSeleccionada = filtrarCategoria.value;
    const items = productos.filter(producto => {
      const coincideTexto = `${producto.nombre} ${producto.descripcion}`.toLowerCase().includes(termino);
      const coincideCategoria = !categoriaSeleccionada || producto.categoria === categoriaSeleccionada;
      return producto.categoria === categoria && coincideTexto && coincideCategoria;
    });

    if (items.length === 0) return;

    let color = "bg-secondary";
    if (categoria === "Prearmados") color = "bg-primary";
    if (categoria === "Componentes") color = "bg-success";

    let contenido = `
      <div class="col-12">
        <div class="card border-0 shadow-sm overflow-hidden">
          <div class="card-header ${color} text-white">
            <h3 class="h5 mb-0">${categoria}</h3>
          </div>
          <div class="card-body">
            <div class="row g-3">
    `;

    items.forEach(producto => {
      const index = productos.indexOf(producto);

      contenido += `
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card h-100 border-0 shadow-sm">
            <div class="img-box">
              <img src="${producto.imagen}" alt="${producto.nombre}" style="max-width:100%; max-height:180px; object-fit:contain;">
            </div>
            <div class="card-body d-flex flex-column">
              <h4 class="h6">${producto.nombre}</h4>
              <p class="small text-muted mb-3">${producto.descripcion}</p>

              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="fw-bold text-primary">$${Number(producto.precio).toFixed(2)}</span>
                </div>

                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-primary flex-fill editar-btn" data-index="${index}">
                    Editar
                  </button>
                  <button class="btn btn-sm btn-outline-danger flex-fill eliminar-btn" data-index="${index}">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    contenido += `
            </div>
          </div>
        </div>
      </div>
    `;

    listaProductos.insertAdjacentHTML("beforeend", contenido);
  });

  document.querySelectorAll(".editar-btn").forEach(boton => {
    boton.addEventListener("click", function () {
      const index = Number(this.dataset.index);
      editarProducto(index);
    });
  });

  document.querySelectorAll(".eliminar-btn").forEach(boton => {
    boton.addEventListener("click", function () {
      const index = Number(this.dataset.index);
      eliminarProducto(index);
    });
  });

  actualizarResumen();
}

function actualizarResumen() {
  const categoriasActivas = new Set(productos.map(producto => producto.categoria));
  const promedio = productos.length ? productos.reduce((total, producto) => total + producto.precio, 0) / productos.length : 0;
  document.getElementById("totalProductos").textContent = productos.length;
  document.getElementById("totalCategorias").textContent = categoriasActivas.size;
  document.getElementById("precioPromedio").textContent = `S/ ${promedio.toFixed(2)}`;
}

function guardarProducto(event) {
  // Valida y guarda un producto nuevo o los cambios de uno existente.
  event.preventDefault();

  const producto = {
    nombre: nombreInput.value.trim(),
    categoria: categoriaInput.value,
    precio: Number(precioInput.value),
    imagen: imagenInput.value.trim(),
    descripcion: descripcionInput.value.trim()
  };

  if (!producto.nombre || !producto.imagen || !producto.descripcion || !producto.precio) {
    mostrarAlerta("Completa todos los campos.", "danger");
    return;
  }

  const index = productoIndex.value;

  if (index === "") {
    productos.push(producto);
    mostrarAlerta("Producto agregado correctamente.", "success");
  } else {
    productos[Number(index)] = producto;
    mostrarAlerta("Producto actualizado correctamente.", "warning");
  }

  mostrarProductos();
  limpiarFormulario();
}

function editarProducto(index) {
  // Carga los datos seleccionados dentro del formulario.
  const producto = productos[index];

  productoIndex.value = index;
  nombreInput.value = producto.nombre;
  categoriaInput.value = producto.categoria;
  precioInput.value = producto.precio;
  imagenInput.value = producto.imagen;
  descripcionInput.value = producto.descripcion;
  tituloFormulario.textContent = "Editar producto";

  mostrarAlerta("Editando producto seleccionado.", "info");
  nombreInput.focus();
}

function eliminarProducto(index) {
  // Elimina el producto de la lista local y actualiza la vista.
  productos.splice(index, 1);
  mostrarProductos();
  mostrarAlerta("Producto eliminado.", "danger");
}

// Eventos de las acciones principales de administración.
document.getElementById("btnNuevo").addEventListener("click", limpiarFormulario);
document.getElementById("btnCancelar").addEventListener("click", limpiarFormulario);
formProducto.addEventListener("submit", guardarProducto);
buscarProducto.addEventListener("input", mostrarProductos);
filtrarCategoria.addEventListener("change", mostrarProductos);

document.addEventListener("DOMContentLoaded", cargarProductosIniciales);