// Interacciones básicas de inicio de sesión y registro.
// No utiliza base de datos ni backend: solo simula el proceso para la entrega.

document.addEventListener('DOMContentLoaded', () => {
    // Se buscan ambos formularios porque este script se comparte entre login y registro.
    const loginForm = document.getElementById('formLogin');
    const registroForm = document.getElementById('formRegistro');

    if (loginForm) {
        // Validación y respuesta visual del formulario de inicio de sesión.
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const correo = document.getElementById('correo').value.trim();
            const password = document.getElementById('password').value;
            const alerta = document.getElementById('alertaLogin');

            if (!correo || !password) {
                mostrarAlerta(alerta, 'Completa todos los campos.', 'danger');
                return;
            }

            if (password.length < 6) {
                mostrarAlerta(alerta, 'La contraseña debe tener mínimo 6 caracteres.', 'danger');
                return;
            }

            mostrarAlerta(alerta, 'Inicio de sesión correcto. Bienvenido a TechStore.', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    if (registroForm) {
        // Validación del registro antes de simular el envío de los datos.
        registroForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const password = document.getElementById('password').value;
            const confirmar = document.getElementById('confirmar').value;
            const terminos = document.getElementById('terminos').checked;
            const alerta = document.getElementById('alertaRegistro');

            if (!nombre || !apellido || !correo || !telefono || !password || !confirmar) {
                mostrarAlerta(alerta, 'Completa todos los campos.', 'danger');
                return;
            }

            if (password.length < 6) {
                mostrarAlerta(alerta, 'La contraseña debe tener mínimo 6 caracteres.', 'danger');
                return;
            }

            if (password !== confirmar) {
                mostrarAlerta(alerta, 'Las contraseñas no coinciden.', 'danger');
                return;
            }

            if (!terminos) {
                mostrarAlerta(alerta, 'Debes aceptar los términos y condiciones.', 'danger');
                return;
            }

            mostrarAlerta(alerta, 'Registro realizado correctamente. Ahora puedes iniciar sesión.', 'success');
            registroForm.reset();

            setTimeout(() => {
                window.location.href = 'iniciarSesion.html';
            }, 1200);
        });
    }

    function mostrarAlerta(elemento, mensaje, tipo) {
        // Reutiliza un mismo bloque de alerta cambiando su estilo y mensaje.
        elemento.className = `alert alert-${tipo}`;
        elemento.textContent = mensaje;
        elemento.classList.remove('d-none');
    }
});
