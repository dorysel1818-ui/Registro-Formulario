
const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");
const boton = document.getElementById("btnEnviar");
const marcoEnvio = document.getElementById("marcoEnvio");
const campoFecha = document.getElementById("fecha");
let envioEnCurso = false;
let temporizadorRespuesta;

function actualizarFecha() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    campoFecha.value = `${hoy.getFullYear()}-${mes}-${dia}`;
}

actualizarFecha();

// Pega aquí la URL de tu aplicación web de Apps Script.
// Debe terminar en /exec, NO es el enlace de Google Sheets.
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzH6WMykjwG5h2PcJCHlwYpPuRwN-Z7fhJOvfKWKsqNLukLY3Zxxjvq2Axmw5q_nKQMcw/exec";

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    if (URL_APPS_SCRIPT === "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT") {
        mensaje.textContent = "Primero debes configurar la conexión.";
        mensaje.style.color = "red";
        return;
    }

    actualizarFecha();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const empresa = document.getElementById("empresa").value.trim();

    if (!nombre || !correo || !telefono || !empresa) {
        mensaje.textContent = "Complete todos los campos.";
        mensaje.style.color = "red";
        return;
    }

    // Preparar el envío al iframe oculto.
    formulario.action = URL_APPS_SCRIPT;
    formulario.method = "POST";
    formulario.target = "marcoEnvio";

    envioEnCurso = true;
    boton.disabled = true;
    boton.textContent = "Enviando...";
    mensaje.textContent = "";

    temporizadorRespuesta = window.setTimeout(function() {
        if (!envioEnCurso) {
            return;
        }

        envioEnCurso = false;
        boton.disabled = false;
        boton.textContent = "Enviar registro";
        mensaje.textContent =
            "No recibimos respuesta. Verifique si el registro se guardó antes de volver a enviarlo.";
        mensaje.style.color = "#b42318";
    }, 30000);

    const datos = new URLSearchParams({
        fecha: campoFecha.value,
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        empresa: empresa
    });

    fetch(URL_APPS_SCRIPT, {
        method: "POST",
        mode: "no-cors",
        body: datos
    }).then(function() {
        if (!envioEnCurso) {
            return;
        }

        window.clearTimeout(temporizadorRespuesta);
        envioEnCurso = false;
        mensaje.textContent = "¡Registro enviado correctamente!";
        mensaje.style.color = "green";
        formulario.reset();
        actualizarFecha();
        boton.disabled = false;
        boton.textContent = "Enviar registro";
    }).catch(function() {
        window.clearTimeout(temporizadorRespuesta);
        envioEnCurso = false;
        boton.disabled = false;
        boton.textContent = "Enviar registro";
        mensaje.textContent = "No se pudo enviar el registro.";
        mensaje.style.color = "#b42318";
    });
});
