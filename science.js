// ==========================
// 9E Digital Hub — Maths Puzzle & Science Virtual Lab
// ==========================

/* ---------- MAGIC SQUARE ---------- */
document.getElementById('checkMagicSquare').addEventListener('click', () => {
    const cells = document.querySelectorAll('.ms-cell');
    let allCorrect = true;
    cells.forEach(cell => {
        if (cell.value.trim() !== cell.dataset.answer) {
            allCorrect = false;
            cell.style.borderColor = '#dc2626';
        } else {
            cell.style.borderColor = '#16a34a';
        }
    });
    const result = document.getElementById('magicSquareResult');
    if (allCorrect) {
        result.textContent = '✅ સાચું! તમે Magic Square ઉકેલી લીધું!';
        result.className = 'lab-result correct';
    } else {
        result.textContent = '❌ ફરી પ્રયત્ન કરો — કોઈ ખાનું ખોટું છે.';
        result.className = 'lab-result wrong';
    }
});

/* ---------- NUMBER SEQUENCE ---------- */
const SEQUENCE_ANSWER = 42; // 2,6,12,20,30,42 (differences 4,6,8,10,12)

document.getElementById('checkSequence').addEventListener('click', () => {
    const input = document.getElementById('sequenceInput');
    const result = document.getElementById('sequenceResult');
    if (Number(input.value) === SEQUENCE_ANSWER) {
        result.textContent = '✅ સાચું! પેટર્ન: n(n+1)';
        result.className = 'lab-result correct';
    } else {
        result.textContent = '❌ ફરી પ્રયત્ન કરો.';
        result.className = 'lab-result wrong';
    }
});

document.getElementById('sequenceHint').addEventListener('click', () => {
    const hint = document.getElementById('sequenceHintText');
    hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
});

/* ---------- LOGIC RIDDLE ---------- */
document.getElementById('revealRiddle').addEventListener('click', (e) => {
    const answer = document.getElementById('riddleAnswer');
    const visible = answer.style.display !== 'none';
    answer.style.display = visible ? 'none' : 'block';
    e.target.innerHTML = visible
        ? '<i class="fa-solid fa-eye"></i> જવાબ જુઓ'
        : '<i class="fa-solid fa-eye-slash"></i> જવાબ છુપાવો';
});

/* ---------- SIMPLE PENDULUM ---------- */
const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const periodValue = document.getElementById('periodValue');
const playBtn = document.getElementById('pendulumPlay');
const resetBtn = document.getElementById('pendulumReset');

const PIVOT_X = 170;
const PIVOT_Y = 30;
const G = 981; // cm/s^2
const AMPLITUDE = Math.PI / 6; // 30 degrees

let lengthPx = 100; // used directly as pixel length for drawing + physics (simplified scale)
let angle = AMPLITUDE;
let time = 0;
let isPlaying = false;
let animId = null;

function updatePeriodDisplay() {
    const L_m = lengthPx / 100; // treat cm as "unit length" for formula display
    const T = 2 * Math.PI * Math.sqrt(L_m / 9.81);
    periodValue.textContent = T.toFixed(2);
}

function drawPendulum(theta) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bobX = PIVOT_X + lengthPx * Math.sin(theta);
    const bobY = PIVOT_Y + lengthPx * Math.cos(theta);

    // support
    ctx.fillStyle = '#334155';
    ctx.fillRect(PIVOT_X - 40, PIVOT_Y - 12, 80, 8);

    // string
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PIVOT_X, PIVOT_Y);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // pivot dot
    ctx.fillStyle = '#0b3d91';
    ctx.beginPath();
    ctx.arc(PIVOT_X, PIVOT_Y, 4, 0, Math.PI * 2);
    ctx.fill();

    // bob
    ctx.fillStyle = '#f4b400';
    ctx.beginPath();
    ctx.arc(bobX, bobY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8a6500';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function animate() {
    const L_m = lengthPx / 100;
    const omega = Math.sqrt(9.81 / L_m);
    time += 0.02;
    angle = AMPLITUDE * Math.cos(omega * time);
    drawPendulum(angle);
    animId = requestAnimationFrame(animate);
}

lengthSlider.addEventListener('input', () => {
    lengthPx = Number(lengthSlider.value);
    lengthValue.textContent = lengthPx;
    updatePeriodDisplay();
    if (!isPlaying) drawPendulum(AMPLITUDE);
});

playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        animate();
    } else {
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
        cancelAnimationFrame(animId);
    }
});

resetBtn.addEventListener('click', () => {
    isPlaying = false;
    cancelAnimationFrame(animId);
    time = 0;
    angle = AMPLITUDE;
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
    drawPendulum(AMPLITUDE);
});

// Initial draw
updatePeriodDisplay();
drawPendulum(AMPLITUDE);

/* ---------- SIMPLE CIRCUIT ---------- */
const switchBtn = document.getElementById('switchToggle');
const bulb = document.getElementById('bulbCircle');
const lever = document.getElementById('switchLever');
const circuitStatus = document.getElementById('circuitStatus');

let switchOn = false;

switchBtn.addEventListener('click', () => {
    switchOn = !switchOn;
    if (switchOn) {
        bulb.classList.add('bulb-on');
        lever.setAttribute('x2', '250');
        lever.setAttribute('y2', '140');
        switchBtn.innerHTML = '<i class="fa-solid fa-power-off"></i> Switch OFF';
        circuitStatus.textContent = 'Switch ON — Circuit is closed, current વહે છે, bulb ચાલુ છે!';
    } else {
        bulb.classList.remove('bulb-on');
        lever.setAttribute('x2', '250');
        lever.setAttribute('y2', '120');
        switchBtn.innerHTML = '<i class="fa-solid fa-power-off"></i> Switch ON';
        circuitStatus.textContent = 'Switch OFF — Circuit is open, current વહેતો નથી, bulb બંધ છે.';
    }
});

/* ==========================
   GEOMETRY CHALLENGE
========================== */
const geometryQuestions = [
    { a: 50, b: 60, c: 70 },
    { a: 90, b: 40, c: 50 },
    { a: 35, b: 75, c: 70 },
    { a: 45, b: 90, c: 45 },
    { a: 60, b: 60, c: 60 }
];
let geoIndex = 0;
let geoScore = 0;
let geoTotal = 0;

function renderGeometryQuestion() {
    const q = geometryQuestions[geoIndex];
    document.getElementById('geoAngleA').textContent = q.a + '°';
    document.getElementById('geoAngleB').textContent = q.b + '°';
    document.getElementById('geoAngleC').textContent = '?';
    document.getElementById('geometryInput').value = '';
    document.getElementById('geometryResult').textContent = '';
}

document.getElementById('checkGeometry').addEventListener('click', () => {
    const q = geometryQuestions[geoIndex];
    const input = Number(document.getElementById('geometryInput').value);
    const result = document.getElementById('geometryResult');
    geoTotal++;
    if (input === q.c) {
        geoScore++;
        result.textContent = '✅ સાચું!';
        result.className = 'lab-result correct';
    } else {
        result.textContent = `❌ ખોટું. સાચો જવાબ: ${q.c}°`;
        result.className = 'lab-result wrong';
    }
    document.getElementById('geometryScore').textContent = `Score: ${geoScore} / ${geoTotal}`;
});

document.getElementById('nextGeometry').addEventListener('click', () => {
    geoIndex = (geoIndex + 1) % geometryQuestions.length;
    renderGeometryQuestion();
});

renderGeometryQuestion();

/* ==========================
   SUDOKU (4x4)
========================== */
const sudokuSolution = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1]
];
// true = prefilled/disabled, false = editable
const sudokuMask = [
    [true, false, true, false],
    [false, true, false, true],
    [true, false, true, false],
    [false, true, false, true]
];

function buildSudoku() {
    const grid = document.getElementById('sudokuGrid');
    grid.innerHTML = '';
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.className = 'sudoku-cell';
            input.dataset.answer = sudokuSolution[r][c];
            if (sudokuMask[r][c]) {
                input.value = sudokuSolution[r][c];
                input.disabled = true;
            }
            grid.appendChild(input);
        }
    }
}
buildSudoku();

document.getElementById('checkSudoku').addEventListener('click', () => {
    const cells = document.querySelectorAll('.sudoku-cell');
    let allCorrect = true;
    cells.forEach(cell => {
        if (cell.value.trim() !== cell.dataset.answer) {
            allCorrect = false;
            cell.style.borderColor = '#dc2626';
            cell.style.border = '2px solid #dc2626';
        } else {
            cell.style.border = '2px solid #16a34a';
        }
    });
    const result = document.getElementById('sudokuResult');
    if (allCorrect) {
        result.textContent = '✅ સાચું! Sudoku ઉકેલાઈ ગયું!';
        result.className = 'lab-result correct';
    } else {
        result.textContent = '❌ કોઈક ખાનું ખોટું છે — ફરી પ્રયત્ન કરો.';
        result.className = 'lab-result wrong';
    }
});

/* ==========================
   MENTAL MATHS
========================== */
let mentalAnswer = 0;
let mentalScore = 0;
let mentalTotal = 0;

function generateMentalQuestion() {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b;
    if (op === '+') {
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        mentalAnswer = a + b;
    } else if (op === '-') {
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * a);
        mentalAnswer = a - b;
    } else {
        a = Math.floor(Math.random() * 11) + 2;
        b = Math.floor(Math.random() * 11) + 2;
        mentalAnswer = a * b;
    }
    document.getElementById('mentalQuestion').textContent = `${a} ${op} ${b} = ?`;
    document.getElementById('mentalInput').value = '';
    document.getElementById('mentalResult').textContent = '';
}

document.getElementById('checkMental').addEventListener('click', () => {
    const input = Number(document.getElementById('mentalInput').value);
    const result = document.getElementById('mentalResult');
    mentalTotal++;
    if (input === mentalAnswer) {
        mentalScore++;
        result.textContent = '✅ સાચું!';
        result.className = 'lab-result correct';
    } else {
        result.textContent = `❌ ખોટું. સાચો જવાબ: ${mentalAnswer}`;
        result.className = 'lab-result wrong';
    }
    document.getElementById('mentalScore').textContent = `Score: ${mentalScore} / ${mentalTotal}`;
});

document.getElementById('nextMental').addEventListener('click', generateMentalQuestion);

generateMentalQuestion();

/* ==========================
   SOLAR SYSTEM
========================== */
const planetFacts = {
    sun: { name: '☀️ સૂર્ય (Sun)', fact: 'સૂર્ય એ આપણી સૌરમંડળનો કેન્દ્ર છે અને એક તારો છે.' },
    mercury: { name: '☿ બુધ (Mercury)', fact: 'સૂર્યની સૌથી નજીકનો અને સૌથી નાનો ગ્રહ.' },
    venus: { name: '♀ શુક્ર (Venus)', fact: 'સૌથી ગરમ ગ્રહ, જાડું વાદળોભર્યું વાતાવરણ ધરાવે છે.' },
    earth: { name: '🌍 પૃથ્વી (Earth)', fact: 'જીવન ધરાવતો એકમાત્ર જાણીતો ગ્રહ.' },
    mars: { name: '♂ મંગળ (Mars)', fact: '"લાલ ગ્રહ" તરીકે ઓળખાય છે, આયર્ન ઓક્સાઇડને કારણે.' },
    jupiter: { name: '♃ ગુરુ (Jupiter)', fact: 'સૌરમંડળનો સૌથી મોટો ગ્રહ.' },
    saturn: { name: '♄ શનિ (Saturn)', fact: 'સુંદર રિંગ્સ (વલયો) માટે પ્રખ્યાત.' },
    uranus: { name: '⛢ યુરેનસ (Uranus)', fact: 'આ ગ્રહ પોતાની ધરી પર બાજુ તરફ ઝૂકેલો ફરે છે.' },
    neptune: { name: '♆ નેપ્ચ્યુન (Neptune)', fact: 'સૂર્યથી સૌથી દૂરનો ગ્રહ, તીવ્ર પવનો ધરાવે છે.' }
};

document.querySelectorAll('.planet-dot').forEach(dot => {
    dot.addEventListener('click', () => {
        const p = planetFacts[dot.dataset.planet];
        document.getElementById('solarInfo').innerHTML = `<strong>${p.name}</strong><p>${p.fact}</p>`;
    });
});

/* ==========================
   MICROSCOPE
========================== */
const microscopeSlider = document.getElementById('microscopeSlider');
const microscopeZoom = document.getElementById('microscopeZoom');
const microscopeZoomValue = document.getElementById('microscopeZoomValue');
const microscopeLabel = document.getElementById('microscopeLabel');

microscopeSlider.addEventListener('input', () => {
    const zoom = Number(microscopeSlider.value);
    microscopeZoomValue.textContent = zoom;
    microscopeZoom.style.transform = `scale(${zoom})`;

    document.querySelectorAll('.mic-detail').forEach(d => {
        d.style.opacity = zoom >= 4 ? '1' : '0';
    });

    if (zoom <= 2) {
        microscopeLabel.textContent = `${zoom}× — સંપૂર્ણ કોષ (Cell) દેખાય છે`;
    } else if (zoom <= 5) {
        microscopeLabel.textContent = `${zoom}× — ન્યુક્લિયસ (Nucleus) સ્પષ્ટ દેખાય છે`;
    } else {
        microscopeLabel.textContent = `${zoom}× — કોષની અંદરની Organelles વિગતવાર દેખાય છે`;
    }
});

/* ==========================
   MAGNETISM
========================== */
const toggleFieldBtn = document.getElementById('toggleField');
const fieldLines = document.getElementById('fieldLines');
const flipPolesBtn = document.getElementById('flipPoles');
const magnetN = document.getElementById('magnetN');
const magnetS = document.getElementById('magnetS');
const labelN = document.getElementById('labelN');
const labelS = document.getElementById('labelS');
const compassNeedle = document.getElementById('compassNeedle');
const magnetismStatus = document.getElementById('magnetismStatus');

let fieldShown = false;
let polesFlipped = false;

toggleFieldBtn.addEventListener('click', () => {
    fieldShown = !fieldShown;
    fieldLines.classList.toggle('show', fieldShown);
    toggleFieldBtn.innerHTML = fieldShown
        ? '<i class="fa-solid fa-wave-square"></i> Hide Field Lines'
        : '<i class="fa-solid fa-wave-square"></i> Show Field Lines';
});

flipPolesBtn.addEventListener('click', () => {
    polesFlipped = !polesFlipped;
    if (polesFlipped) {
        magnetN.setAttribute('fill', '#1769d1');
        magnetS.setAttribute('fill', '#dc2626');
        labelN.textContent = 'S';
        labelS.textContent = 'N';
        compassNeedle.style.transform = 'rotate(180deg)';
        magnetismStatus.textContent = 'Compass needle N pole તરફ (જમણે) નિર્દેશ કરે છે.';
    } else {
        magnetN.setAttribute('fill', '#dc2626');
        magnetS.setAttribute('fill', '#1769d1');
        labelN.textContent = 'N';
        labelS.textContent = 'S';
        compassNeedle.style.transform = 'none';
        magnetismStatus.textContent = 'Compass needle N pole તરફ (ડાબે) નિર્દેશ કરે છે.';
    }
});

/* ==========================
   REFLECTION (Law of Reflection)
========================== */
const reflectionCanvas = document.getElementById('reflectionCanvas');
const rCtx = reflectionCanvas.getContext('2d');
const reflectionSlider = document.getElementById('reflectionSlider');
const reflectionAngleValue = document.getElementById('reflectionAngleValue');
const reflectionAngleEcho = document.getElementById('reflectionAngleEcho');

function drawReflection(angleDeg) {
    const w = reflectionCanvas.width;
    const h = reflectionCanvas.height;
    rCtx.clearRect(0, 0, w, h);

    const mirrorY = h - 30;
    const pointX = w / 2;

    // mirror surface
    rCtx.strokeStyle = '#334155';
    rCtx.lineWidth = 4;
    rCtx.beginPath();
    rCtx.moveTo(20, mirrorY);
    rCtx.lineTo(w - 20, mirrorY);
    rCtx.stroke();

    // normal (dashed)
    rCtx.setLineDash([5, 5]);
    rCtx.strokeStyle = '#94a3b8';
    rCtx.lineWidth = 2;
    rCtx.beginPath();
    rCtx.moveTo(pointX, mirrorY);
    rCtx.lineTo(pointX, 20);
    rCtx.stroke();
    rCtx.setLineDash([]);

    const rad = (angleDeg * Math.PI) / 180;
    const L = mirrorY - 30;

    // incident ray (from top-left down to point)
    const incX = pointX - L * Math.sin(rad);
    const incY = mirrorY - L * Math.cos(rad);
    rCtx.strokeStyle = '#dc2626';
    rCtx.lineWidth = 3;
    rCtx.beginPath();
    rCtx.moveTo(incX, incY);
    rCtx.lineTo(pointX, mirrorY);
    rCtx.stroke();

    // reflected ray (from point up to top-right)
    const refX = pointX + L * Math.sin(rad);
    const refY = mirrorY - L * Math.cos(rad);
    rCtx.strokeStyle = '#16a34a';
    rCtx.lineWidth = 3;
    rCtx.beginPath();
    rCtx.moveTo(pointX, mirrorY);
    rCtx.lineTo(refX, refY);
    rCtx.stroke();

    // point of incidence
    rCtx.fillStyle = '#0b3d91';
    rCtx.beginPath();
    rCtx.arc(pointX, mirrorY, 4, 0, Math.PI * 2);
    rCtx.fill();
}

reflectionSlider.addEventListener('input', () => {
    const angle = Number(reflectionSlider.value);
    reflectionAngleValue.textContent = angle;
    reflectionAngleEcho.textContent = angle;
    drawReflection(angle);
});

drawReflection(40);
