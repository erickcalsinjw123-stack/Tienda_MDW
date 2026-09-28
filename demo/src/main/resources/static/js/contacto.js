document.addEventListener('DOMContentLoaded', () => {
    // La página de contacto es la única que necesita estos elementos.
    const form = document.getElementById('formContacto');
    const alerta = document.getElementById('alertaContacto');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        // Simula el envío y evita recargar la página mientras no existe backend de mensajes.
        event.preventDefault();
        alerta.className = 'alert alert-success mt-3';
        alerta.textContent = 'Mensaje enviado correctamente. Te responderemos pronto.';
        alerta.classList.remove('d-none');
        form.reset();
    });
});
