emailjs.init({
    publicKey: "C2ARKmwyDV96pbQUM"
});

const form = document.querySelector("#contact-form");
const message = document.querySelector(".exit-message");
form.addEventListener("submit", function(event) {
    event.preventDefault();

    emailjs.sendForm(
        "service_s3ds3y1",
        "template_ur2udlt",
        form
    )
    .then(function() {
        console.log("Correo enviado correctamente");
        form.reset();

        message.style.height = "4rem";
        if (!window.matchMedia("(max-width: 600px)").matches) {
            form.style.height = "80%";
        }

        setTimeout(() => {
            message.style.height = "0";
            form.style.removeProperty("height");
        }, 5000);
    })
    .catch(function(error) {
        console.log("Error al enviar:", error);
    });
});