let currentStep = 1;
const totalSteps = 8;

// Navegación
function nextScreen() {
    if (currentStep < totalSteps) {
        document.getElementById(`screen${currentStep}`).classList.remove('active');
        currentStep++;
        document.getElementById(`screen${currentStep}`).classList.add('active');
        updateProgress();
        
        if(currentStep === 2) logicScreen2();
        if(currentStep === 3) logicScreen3();
        if(currentStep === 5) initMemoryGame();
        if(currentStep === 6) initMazeGame();
    }
}

function updateProgress() {
    const percentage = (currentStep / totalSteps) * 100;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
}

function startExperience() {
    const music = document.getElementById('bg-music');
    music.play().catch(() => console.log("Audio waiting for interaction"));
    nextScreen();
}

// Pantalla 2: Tiempo
function logicScreen2() {
    const btn = document.getElementById('btn-next-2');
    const msg = document.getElementById('msg-2');
    setTimeout(() => {
        msg.innerText = "¡Gracias por leer, mi vida! 💖";
        btn.style.display = 'inline-block';
    }, 10000);
}

// Pantalla 3: Quiz
const misPreguntas = [
    { question: "¿Qué día te pedí que fueras mi novia?", 
        options: ["10 de mayo", "26 de enero", "5 de octubre", "11 de julio"], 
        correct: 2 },
    { question: "¿Cuál es mi comida favorita?", 
        options: ["Hamburguesa", "Picada", "Choripapa", "Pizza"], 
        correct: 0 },
    { question: "¿Dónde nos vimos despues de hablarnos por chat?", 
        options: ["En el parque", "En la Plazuela", "En la cancha del ISER", "En el cine"], 
        correct: 2 },
    { question: "¿Qué es lo que más me gusta de ti?", 
        options: ["Tu sonrisa", "Tus ojos", "Tu corazón", "¡Todo de ti!"], 
        correct: 3 },
    { question: "¿Hacia donde fue nuestro primer viaje juntos?", 
        options: ["Hacia Bucaramanga", "Hacia Cucutá", "Hacia Negavita", "Hacia Cubará"], 
        correct: 1 },
    { question: "¿Que te di cuando te pedi que fueras mi novia en tu casa?", 
        options: ["Aretes", "Ropa", "Una cadena", "Un peluche de stitch"], 
        correct: 3 },
    { question: "¿Qué te gusta que te haga mientras duermes?", 
        options: ["Mimos", "Rascarte la espalda", "Consertirte", "Todas las anteriores"], 
        correct: 3 }
];
let indicePreguntaActual = 0;

// 1. Definimos las frases motivadoras (una por cada pregunta)
const frasesAlentadoras = [
    "Exacto, ese día mi vida cambió.",
    "Eso es, sabía que te acordarías perfectamente.",
    "Si, un lugar que siempre recordaré.",
    "Era logica esa respuesta.",
    "Exacto, ese dia visitamos a tu mamá.",
    "Claro, a ti te gusta mucho ese personaje.",
    "Siempre te gusta que te este consintiendo mientras duermes."
];

// 3. LÓGICA PANTALLA 3: EL QUIZ MODIFICADO CON MENSAJES
function logicScreen3() {
    const quizData = misPreguntas[indicePreguntaActual];
    const questionElement = document.getElementById('quiz-question');
    const container = document.getElementById('quiz-options');
    const feedback = document.getElementById('msg-3');

    questionElement.innerText = quizData.question;
    container.innerHTML = ''; 
    feedback.innerText = "";

    quizData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = "btn btn-outline-danger rounded-pill py-2 fw-bold mb-2 w-100";
        
        btn.onclick = () => {
            if (idx === quizData.correct) {
                // --- RESPUESTA CORRECTA ---
                
                // Mostramos el mensaje alentador correspondiente a la pregunta
                feedback.innerText = frasesAlentadoras[indicePreguntaActual];

                // Bloqueamos los botones para que lea el mensaje sin distracciones
                const botones = container.querySelectorAll('button');
                botones.forEach(b => b.disabled = true);
                
                // Ponemos el botón en verde para confirmar el acierto
                btn.classList.replace('btn-outline-danger', 'btn-success');
                btn.style.color = "white";

                if (indicePreguntaActual < misPreguntas.length - 1) {
                    // Si hay más preguntas, esperamos 1.5 segundos y cargamos la siguiente
                    indicePreguntaActual++;
                    setTimeout(logicScreen3, 1500); 
                } else {
                    // Si es la última, esperamos un poco y mostramos el botón final del quiz
                    setTimeout(() => {
                        feedback.innerText = "¡Increíble! Respondiste todas bien. 😍";
                        container.innerHTML = "";
                        document.getElementById('btn-next-3').style.display = 'inline-block';
                    }, 1500);
                }
            } else {
                // --- RESPUESTA INCORRECTA ---
                feedback.innerText = "Intenta otra vez, mi amor 💖";
                btn.classList.add('shake'); 
                setTimeout(() => btn.classList.remove('shake'), 500);
            }
        };
        container.appendChild(btn);
    });
}
// 4. LÓGICA PANTALLA 4: ENCONTRAR CORAZÓN
function checkHeart(isCorrect) {
    const msg = document.getElementById('msg-4');
    const btn = document.getElementById('btn-next-4');
    
    if(isCorrect) {
        msg.innerText = "¡SIII! Encontraste mi corazón verdadero. 💖";
        btn.style.display = 'inline-block';
        // Convertir todos los corazones en rojos
        document.querySelectorAll('.heart-box').forEach(h => h.innerText = '💖');
    } else {
        msg.innerText = "Este corazón está vacío... ¡busca otro! 🧐";
        event.target.style.opacity = '0.2';
        event.target.style.pointerEvents = 'none';
    }
}


// Pantalla 5: Memorama
function initMemoryGame() {
    const icons = ['❤️', '💖', '🌹', '✨', '🎁', '🍭'];
    const cardsData = [...icons, ...icons].sort(() => Math.random() - 0.5);
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    let firstCard, secondCard;
    let flippedCount = 0;
    let matchedCount = 0;

    cardsData.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.icon = icon;
        card.innerHTML = `<span class="icon">${icon}</span>`;
        card.onclick = function() {
            if (this.classList.contains('flipped') || flippedCount === 2) return;
            this.classList.add('flipped');
            if (!firstCard) { firstCard = this; flippedCount = 1; } 
            else {
                secondCard = this; flippedCount = 2;
                if (firstCard.dataset.icon === secondCard.dataset.icon) {
                    matchedCount++;
                    firstCard = null; secondCard = null; flippedCount = 0;
                    if (matchedCount === icons.length) document.getElementById('btn-next-5').style.display = 'inline-block';
                } else {
                    setTimeout(() => {
                        firstCard.classList.remove('flipped');
                        secondCard.classList.remove('flipped');
                        firstCard = null; secondCard = null; flippedCount = 0;
                    }, 1000);
                }
            }
        };
        grid.appendChild(card);
    });
}

// Pantalla 6: Laberinto Grande 10x10
function initMazeGame() {
    // 0 = Camino, 1 = Pared
    const maze = [
        [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 1, 1, 1, 1, 0] // El final es (9,9)
    ];
    
    let pos = { x: 0, y: 0 };
    let visited = new Set();
    const grid = document.getElementById('maze-grid');
    
    function draw() {
        grid.innerHTML = '';
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                cell.className = 'maze-cell';
                
                if (maze[y][x] === 1) {
                    cell.classList.add('wall');
                } else if (visited.has(`${x},${y}`)) {
                    cell.classList.add('visited');
                }

                if (x === 9 && y === 9) {
                    cell.innerHTML = '🏁';
                    cell.style.background = "#eaffea";
                }
                
                if (x === pos.x && y === pos.y) {
                    cell.innerHTML = '❤️';
                    cell.classList.add('maze-player');
                }
                
                grid.appendChild(cell);
            }
        }
    }

    window.movePlayer = (dx, dy) => {
        let nx = pos.x + dx;
        let ny = pos.y + dy;

        if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10 && maze[ny][nx] === 0) {
            visited.add(`${pos.x},${pos.y}`);
            pos = { x: nx, y: ny };
            draw();
            
            if (nx === 9 && ny === 9) {
                document.getElementById('btn-next-6').style.display = 'inline-block';
                grid.style.borderColor = "#4caf50";
            }
        } else {
            // Efecto visual de choque
            grid.style.animation = 'none';
            void grid.offsetWidth; // Truco para reiniciar animación
            grid.style.animation = 'shakeAnim 0.3s';
        }
    };

    draw();
}

// Extras
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart-particle');
    heart.innerHTML = '💖';
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 15 + 15 + "px";
    heart.style.animationDuration = Math.random() * 2 + 3 + "s";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
}
setInterval(createHeart, 100);

function toggleMusic() {
    const m = document.getElementById('bg-music');
    const i = document.getElementById('music-icon');
    if (m.paused) { m.play(); i.classList.replace('fa-play', 'fa-pause'); }
    else { m.pause(); i.classList.replace('fa-pause', 'fa-play'); }
}