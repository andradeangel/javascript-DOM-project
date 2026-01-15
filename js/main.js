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

// ============================================
// EFECTO MATRIX
// ============================================

(function () {
    const canvas = document.getElementById('matrix-canvas');

    // Esperar a que el DOM esté completamente cargado
    if (!canvas) {
        console.warn('Canvas matrix-canvas no encontrado');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Ajustar el tamaño del canvas al contenedor
    function resizeCanvas() {
        const portada = canvas.parentElement;
        canvas.width = portada.offsetWidth;
        canvas.height = portada.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Caracteres para el efecto Matrix
    // Incluye letras, números y caracteres japoneses (katakana)
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const chars = matrixChars.split('');

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    // Array para almacenar la posición Y de cada columna
    const drops = [];

    // Inicializar las gotas en posiciones aleatorias
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100); // Empezar en posiciones negativas para efecto escalonado
    }

    // Función para dibujar el efecto Matrix
    function drawMatrix() {
        // Limpiar el canvas completamente para mantener transparencia
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Configurar fuente
        ctx.font = fontSize + 'px monospace';

        // Dibujar los caracteres con efecto de rastro
        for (let i = 0; i < drops.length; i++) {
            const x = i * fontSize;
            const currentY = drops[i];

            // Longitud del rastro (número de caracteres en la cola)
            const trailLength = 20;

            // Dibujar el rastro completo de la columna
            for (let j = 0; j < trailLength; j++) {
                const y = (currentY - j) * fontSize;

                // Solo dibujar si está dentro del canvas
                if (y > 0 && y < canvas.height) {
                    // Calcular opacidad: más brillante en la cabeza (j=0), más tenue en la cola
                    const opacity = (trailLength - j) / trailLength;
                    const rootStyles = getComputedStyle(document.documentElement);
                    const starColor = rootStyles.getPropertyValue('--starColor').trim();
                    // El primer carácter (cabeza) es blanco brillante, el resto verde
                    if (j === 0) {
                        // Cabeza de la columna: blanco brillante
                        ctx.fillStyle = starColor;
                    } else {
                        // Resto de la cola: verde con opacidad decreciente
                        ctx.fillStyle = `rgba(0, 195, 255, ${opacity * 0.9})`;
                    }

                    // Seleccionar un carácter aleatorio
                    const char = chars[Math.floor(Math.random() * chars.length)];

                    // Dibujar el carácter
                    ctx.fillText(char, x, y);
                }
            }

            // Resetear la gota cuando llega al final o aleatoriamente
            if (currentY * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            // Incrementar la posición Y
            drops[i]++;
        }
    }

    // Animar el efecto Matrix
    function animate() {
        drawMatrix();
        requestAnimationFrame(animate);
    }

    // Iniciar la animación
    animate();

    // Ajustar el número de columnas cuando se redimensiona la ventana
    window.addEventListener('resize', function () {
        const newColumns = canvas.width / fontSize;

        // Ajustar el array de gotas si cambió el número de columnas
        if (newColumns > drops.length) {
            for (let i = drops.length; i < newColumns; i++) {
                drops[i] = Math.floor(Math.random() * -100);
            }
        } else if (newColumns < drops.length) {
            drops.length = Math.floor(newColumns);
        }
    });
})();
