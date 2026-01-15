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

    const ctx = canvas.getContext('2d');

    // 1. Configuración de Variables (Fuera del loop para rendimiento)
    const rootStyles = getComputedStyle(document.documentElement);
    const starColor = rootStyles.getPropertyValue('--starColor').trim() || "#00c3ff";
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const chars = matrixChars.split('');
    const fontSize = 16;
    let columns = 0;
    let drops = [];

    // 2. Interacción con Mouse (AHORA DENTRO DEL SCOPE)
    let mouse = { x: undefined, y: undefined };

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        // Calcular coordenadas relativas al canvas, tomando en cuenta scroll
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;

        // Debug: descomentar para verificar coordenadas
        // console.log('Mouse:', Math.round(mouse.x), Math.round(mouse.y), 'Canvas:', Math.round(rect.width), Math.round(rect.height));
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // 3. Ajuste de Tamaño
    function resizeCanvas() {
        // Usar la sección completa como referencia, no solo .portada
        const section = document.querySelector('.portada-section');
        if (section) {
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;
        } else {
            // Fallback si no encuentra la sección
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -100);
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 4. Lógica de Dibujo con Efecto Magneto
    function drawMatrix() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const baseX = i * fontSize;
            const currentY = drops[i];
            const trailLength = 20;

            for (let j = 0; j < trailLength; j++) {
                const baseY = (currentY - j) * fontSize;

                if (baseY > 0 && baseY < canvas.height) {
                    const opacity = (trailLength - j) / trailLength;

                    // --- EFECTO MAGNETO: DISTORSIÓN ---
                    let offsetX = 0;
                    let offsetY = 0;
                    let scale = 1;

                    if (mouse.x !== undefined && mouse.y !== undefined) {
                        const dx = baseX - mouse.x;
                        const dy = baseY - mouse.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const magnetRadius = 200; // Radio de influencia del efecto magneto

                        if (distance < magnetRadius) {
                            // Calcular la fuerza de repulsión (más fuerte cerca del mouse)
                            const force = (magnetRadius - distance) / magnetRadius;
                            const pushStrength = 100; // Intensidad del empuje

                            // Calcular el ángulo de repulsión
                            const angle = Math.atan2(dy, dx);

                            // Aplicar desplazamiento en dirección opuesta al mouse
                            offsetX = Math.cos(angle) * force * pushStrength;
                            offsetY = Math.sin(angle) * force * pushStrength;

                            // Efecto de escala: caracteres más grandes cerca del mouse
                            scale = 1 + (force * 0.5);
                        }
                    }

                    // Aplicar el desplazamiento
                    const x = baseX + offsetX;
                    const y = baseY + offsetY;

                    // --- CÁLCULO DE ILUMINACIÓN ---
                    const dx = mouse.x - x;
                    const dy = mouse.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const lightRadius = 100; // Radio de iluminación

                    // Guardar el estado del contexto para transformaciones
                    ctx.save();

                    // Aplicar escala si hay efecto magneto
                    if (scale !== 1) {
                        ctx.translate(x, y);
                        ctx.scale(scale, scale);
                        ctx.translate(-x, -y);
                    }

                    if (j === 0) {
                        // Cabeza: color principal
                        ctx.fillStyle = starColor;
                    } else {
                        // Si el mouse está cerca, brilla en blanco
                        if (mouse.x !== undefined && distance < lightRadius) {
                            const brightness = 1 - (distance / lightRadius);
                            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * brightness})`;
                        } else {
                            // Color azul normal con opacidad
                            ctx.fillStyle = `rgba(0, 195, 255, ${opacity * 0.8})`;
                        }
                    }

                    const char = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(char, x, y);

                    // Restaurar el estado del contexto
                    ctx.restore();
                }
            }

            if (currentY * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i] += 0.3;
        }

        // Dibujar cursor personalizado para visualizar el área de efecto
        if (mouse.x !== undefined && mouse.y !== undefined) {
            // Círculo exterior (área de influencia)
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 30, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 195, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Círculo interior (cursor)
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 20);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 195, 255, 0.4)');
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
        requestAnimationFrame(animate);
    }

    animate();
})();