emailjs.init({
    publicKey: "C2ARKmwyDV96pbQUM"
});

const form = document.querySelector("#contact-form");
form.addEventListener("submit", function(event) {
    event.preventDefault();

    emailjs.sendForm(
        "service_s3ds3y1",
        "template_ur2udlt",
        form
    )
    .then(function() {
        console.log("Correo enviado correctamente");
    })
    .catch(function(error) {
        console.log("Error al enviar:", error);
    });

});