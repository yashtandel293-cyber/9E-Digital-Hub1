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
