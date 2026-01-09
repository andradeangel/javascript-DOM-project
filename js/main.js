const soundMenu = new Audio("./assets/audio/swooshMenu.mp3");

function menuSwitch() {
    const switchMenu = document.getElementById("options");
    const logoText = document.getElementById("logoText");
    const navbar = document.getElementById("navbar");
    const btn = document.getElementsByClassName("btn-101")[0];

    switchMenu.classList.toggle("show");
    logoText.classList.toggle("navbarOpen");
    navbar.classList.toggle("navbarStyle");
    btn.classList.toggle("btnStyle");


    if (switchMenu.classList.contains("show")) {
        document.getElementById("icon").innerHTML = "close";
        soundMenu.play();
    } else {
        document.getElementById("icon").innerHTML = "menu";
        soundMenu.play();
    }
}