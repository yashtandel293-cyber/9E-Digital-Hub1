// ==========================
// 9E Digital Hub — Attendance Scanner
// ==========================

// PASTE your Google Apps Script Web App URL here:
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbz1ZmEfXkCS82cOrlZZwQeqatvXwzxiHygUDL0bsiMfT19uA6161JGaEVvFgPo_MoEM0g/exec";

let students = [];
let presentCount = 0;
let lastScannedGr = null;
let lastScanTime = 0;

const statusBox = document.getElementById('scanStatus');
const countEl = document.getElementById('presentCount');

fetch('data/students.json')
    .then(res => res.json())
    .then(data => { students = data; })
    .catch(err => console.error('students.json load error:', err));

function setStatus(type, iconClass, text) {
    statusBox.className = `scan-status ${type}`;
    statusBox.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${text}</span>`;
}

function extractGr(scannedText) {
    try {
        const url = new URL(scannedText);
        return url.searchParams.get('gr');
    } catch (e) {
        // not a full URL — maybe just "gr=123" or a raw number
        const match = scannedText.match(/gr=(\d+)/);
        if (match) return match[1];
        if (/^\d+$/.test(scannedText.trim())) return scannedText.trim();
        return null;
    }
}

function markAttendance(student) {
    setStatus('idle', 'fa-spinner fa-spin', `Marking ${student.name}...`);

    fetch(SHEET_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ roll: student.roll, name: student.name, gr: student.gr })
    })
        .then(res => res.json())
        .then(result => {
            if (result.status === 'success') {
                presentCount++;
                countEl.textContent = presentCount;
                setStatus('success', 'fa-circle-check', `✅ ${student.name} (Roll ${student.roll}) — Present marked!`);
            } else if (result.status === 'duplicate') {
                setStatus('duplicate', 'fa-triangle-exclamation', `⚠️ ${student.name} પહેલેથી હાજર mark થયેલ છે.`);
            } else {
                setStatus('error', 'fa-circle-xmark', 'કંઈક ખોટું થયું — ફરી પ્રયત્ન કરો.');
            }
        })
        .catch(err => {
            setStatus('error', 'fa-circle-xmark', 'Server સાથે જોડાણ ન થયું. Internet ચેક કરો.');
            console.error(err);
        });
}

function onScanSuccess(decodedText) {
    const now = Date.now();
    const gr = extractGr(decodedText);

    if (!gr) {
        setStatus('error', 'fa-circle-xmark', 'આ QR code ઓળખાયો નહીં.');
        return;
    }

    // avoid re-triggering the same QR repeatedly within 4 seconds
    if (gr === lastScannedGr && (now - lastScanTime) < 4000) return;
    lastScannedGr = gr;
    lastScanTime = now;

    const student = students.find(s => String(s.gr) === String(gr));
    if (!student) {
        setStatus('error', 'fa-circle-xmark', 'આ વિદ્યાર્થી data માં મળ્યો નહીં.');
        return;
    }

    markAttendance(student);
}

function onScanFailure() {
    // ignore — this fires continuously while no QR is in frame
}

const html5QrCode = new Html5Qrcode("reader");
html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    onScanSuccess,
    onScanFailure
).catch(err => {
    setStatus('error', 'fa-camera', 'Camera શરૂ ન થયો — permission આપો અથવા HTTPS પર ખોલો.');
    console.error(err);
});
