// ==========================================
// COMPORTAMIENTO DEL MENU
// ==========================================
const soundMenu = new Audio("./assets/audio/swooshMenu.mp3");

function menuSwitch() {
    const switchMenu = document.getElementById("options");
    const logoText = document.getElementById("logoText");
    const navbar = document.getElementById("navbar");
    const btn = document.getElementsByClassName("btn-101")[0];
    const icon = document.getElementById("icon");

    switchMenu.classList.toggle("show");
    logoText.classList.toggle("navbarOpen");
    navbar.classList.toggle("navbarStyle");
    btn.classList.toggle("btnStyle");

    soundMenu.currentTime = 0;
    soundMenu.play();

    icon.innerHTML = switchMenu.classList.contains("show") ? "close" : "menu";
}

// ============================================
// EFECTO MATRIX
// ============================================
(function () {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    // Obtiene el contexto 2D del canvas
    const ctx = canvas.getContext('2d');

    // Obtiene los estilos CSS del documento
    const rootStyles = getComputedStyle(document.documentElement);
    const starColor = rootStyles.getPropertyValue('--starColor').trim() || "#00c3ff";

    // String con todos los caracteres que pueden aparecer en el efecto Matrix
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const chars = matrixChars.split('');
    const fontSize = 16;

    // Número de columnas de caracteres (se calcula después)
    let columns = 0;

    // Array que almacena la posición Y de cada columna
    let drops = [];
    let mouse = { x: undefined, y: undefined };

    // Evento que se dispara cuando el mouse se mueve sobre el canvas
    canvas.addEventListener('mousemove', (event) => {
        // Obtener las dimensiones y posición del canvas en la pantalla
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    // Evento que se dispara cuando el mouse sale del canvas
    canvas.addEventListener('mouseleave', () => {
        // Resetear las coordenadas del mouse a undefined
        mouse.x = undefined;
        mouse.y = undefined;
    });

    function resizeCanvas() {
        const section = document.querySelector('.portada-section');
        if (section) {
            // Si existe la sección, usar sus dimensiones
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;
        } else {
            // Si no existe usar el tamaño de la ventana completa
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Calcular cuántas columnas caben en el ancho del canvas
        columns = Math.floor(canvas.width / fontSize);

        // Reiniciar el array de gotas
        drops = [];

        // Crear una "gota" para cada columna
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -100);
        }
    }

    // Ejecutar la función una vez al cargar y redimenciona
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    //Dibujo de Matrix
    function drawMatrix() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + 'px monospace';

        // Iterar por cada columna
        for (let i = 0; i < drops.length; i++) {
            // Calcular la posición X base de esta columna
            const baseX = i * fontSize;

            // Posición Y actual de la "cabeza" de esta columna
            const currentY = drops[i];
            // Longitud del rastro (cuántos caracteres se dibujan por columna)
            const trailLength = 20;

            // Dibujar cada carácter del rastro
            for (let j = 0; j < trailLength; j++) {
                // Calcular la posición Y de este carácter en el rastro
                const baseY = (currentY - j) * fontSize;
                // Solo dibujar si el carácter está visible en el canvas
                if (baseY > 0 && baseY < canvas.height) {
                    // Calcular la opacidad basada en la posición en el rastro
                    const opacity = (trailLength - j) / trailLength;
                    // Variables para el desplazamiento y escala
                    let offsetX = 0;  // Desplazamiento horizontal
                    let offsetY = 0;  // Desplazamiento vertical
                    let scale = 1;    // Escala del carácter (1 = tamaño normal)

                    // Solo aplicar efecto si el mouse está sobre el canvas
                    if (mouse.x !== undefined && mouse.y !== undefined) {
                        // Diferencia en X (puede ser positiva o negativa)
                        const dx = baseX - mouse.x;
                        // Diferencia en Y (puede ser positiva o negativa)
                        const dy = baseY - mouse.y;
                        // Calcular distancia euclidiana usando el teorema de Pitágoras
                        // distance = √(dx² + dy²)
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        // Radio de influencia del efecto magneto (en píxeles)
                        const magnetRadius = 200;

                        // Si el carácter está dentro del radio de influencia
                        if (distance < magnetRadius) {
                            // Calcular la fuerza de repulsión (0 a 1)
                            const force = (magnetRadius - distance) / magnetRadius;
                            // Intensidad del empuje (en píxeles)
                            const pushStrength = 100;

                            // Calcular el ángulo de repulsión
                            // Math.atan2(dy, dx) devuelve el ángulo en radianes
                            // Este ángulo apunta desde el mouse hacia el carácter
                            const angle = Math.atan2(dy, dx);

                            // Calcular el desplazamiento en X usando coseno
                            // Math.cos(angle) da la componente X del vector unitario
                            // Multiplicamos por force (0-1) y pushStrength (100)
                            offsetX = Math.cos(angle) * force * pushStrength;

                            // Calcular el desplazamiento en Y usando seno
                            // Math.sin(angle) da la componente Y del vector unitario
                            offsetY = Math.sin(angle) * force * pushStrength;

                            // Calcular la escala (caracteres más grandes cerca del mouse)
                            // Si force=1: scale = 1 + (1 * 0.5) = 1.5 (150% del tamaño)
                            // Si force=0.5: scale = 1 + (0.5 * 0.5) = 1.25 (125% del tamaño)
                            scale = 1 + (force * 0.5);
                        }
                    }

                    // Aplicar el desplazamiento a la posición base
                    const x = baseX + offsetX;
                    const y = baseY + offsetY;

                    // Calcular distancia desde la posición FINAL al mouse
                    const dx = mouse.x - x;
                    const dy = mouse.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Radio de iluminación
                    const lightRadius = 100;

                    // Guardar el estado actual del contexto
                    // Esto permite aplicar transformaciones temporales
                    ctx.save();

                    // Si hay escala, aplicarla
                    if (scale !== 1) {
                        // Mover el origen al punto (x, y)
                        ctx.translate(x, y);
                        // Aplicar la escala
                        ctx.scale(scale, scale);
                        // Mover el origen de vuelta
                        ctx.translate(-x, -y);
                    }

                    if (j === 0) {
                        // Si es la cabeza de la columna (j=0)
                        // Usar el color principal
                        ctx.fillStyle = starColor;
                    } else {
                        // Si es parte del rastro
                        // Si el mouse está cerca, iluminar en blanco
                        if (mouse.x !== undefined && distance < lightRadius) {
                            // Calcular brillo basado en distancia
                            // Si distance=0: brightness = 1 - 0/100 = 1.0 (muy brillante)
                            // Si distance=50: brightness = 1 - 50/100 = 0.5 (medio brillo)
                            // Si distance=100: brightness = 1 - 100/100 = 0.0 (sin brillo)
                            const brightness = 1 - (distance / lightRadius);

                            // Color blanco con opacidad combinada
                            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * brightness})`;
                        } else {
                            // Color azul normal con opacidad
                            // opacity * 0.8 hace que el rastro sea un poco más tenue
                            ctx.fillStyle = `rgba(0, 195, 255, ${opacity * 0.8})`;
                        }
                    }

                    // Seleccionar un carácter aleatorio del array
                    // Math.random() genera un número entre 0 y 1
                    // Math.random() * chars.length genera entre 0 y la longitud del array
                    // Math.floor redondea hacia abajo para obtener un índice válido
                    const char = chars[Math.floor(Math.random() * chars.length)];
                    // Dibujar el carácter en la posición (x, y)
                    ctx.fillText(char, x, y);
                    ctx.restore();
                }
            }

            // Si la columna llegó al final del canvas
            if (currentY * fontSize > canvas.height && Math.random() > 0.975) {
                // Resetear la posición a 0 (arriba)
                // Math.random() > 0.975 significa que solo hay 2.5% de probabilidad
                drops[i] = 0;
            }

            // Incrementar la posición Y de la columna (hacerla caer)
            drops[i] += 0.3;
        }

        // Solo dibujar si el mouse está sobre el canvas
        if (mouse.x !== undefined && mouse.y !== undefined) {
            // Círculo exterior (área de influencia)
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 30, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 195, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Círculo interior (cursor principal)
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
            // Crear gradiente radial (del centro hacia afuera)
            const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 20);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // Centro blanco
            gradient.addColorStop(1, 'rgba(0, 195, 255, 0.4)');   // Borde azul
            ctx.fillStyle = gradient;
            ctx.fill();

            // Punto central
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.fill();
        }
    }

    function animate() {
        drawMatrix();

        // Solicitar al navegador que llame a animate() en el próximo frame
        requestAnimationFrame(animate);
    }
    animate();

})(); // Fin de la IIFE - Se ejecuta inmediatamente

// ============================================
// ORDENAMIENTO DEL ABOUT
// ============================================
