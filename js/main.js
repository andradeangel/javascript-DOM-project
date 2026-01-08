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
        document.body.style.overflow = "hidden";
        // document.getElementsByClassName("btn-101")[0].style.backgroundColor = "var(--fifthColor)";
        // document.getElementsByClassName("btn-101")[0].style.boxShadow = "3px 3px 5px rgba(0, 0, 0, 0.37), -3px -3px 5px rgba(0, 0, 0, 0.37)";
        document.getElementById("icon").innerHTML = "close";
    } else {
        document.body.style.overflow = "auto";
        document.getElementById("icon").innerHTML = "menu";
        // document.getElementById("logo-text").style.color = "var(--textColor)";
    }
}