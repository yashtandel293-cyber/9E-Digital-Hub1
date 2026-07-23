// ==========================
// 9E Digital Hub — Today's Attendance View
// ==========================

const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbz1ZmEfXkCS82cOrlZZwQeqatvXwzxiHygUDL0bsiMfT19uA6161JGaEVvFgPo_MoEM0g/exec";

const statusEl = document.getElementById('attStatus');
const contentEl = document.getElementById('attContent');
const dateLabel = document.getElementById('dateLabel');
const presentTotal = document.getElementById('presentTotal');
const absentTotal = document.getElementById('absentTotal');
const presentList = document.getElementById('presentList');
const absentList = document.getElementById('absentList');

function loadAttendance() {
    statusEl.style.display = 'block';
    contentEl.style.display = 'none';

    Promise.all([
        fetch('data/students.json').then(r => r.json()),
        fetch(SHEET_API_URL).then(r => r.json())
    ])
        .then(([students, sheetData]) => {
            students.sort((a, b) => a.roll - b.roll);
            const presentRolls = new Set(sheetData.present.map(p => String(p.roll)));

            dateLabel.textContent = `Date: ${sheetData.date}`;

            const presentStudents = sheetData.present.slice().sort((a, b) => Number(a.roll) - Number(b.roll));
            const absentStudents = students.filter(s => !presentRolls.has(String(s.roll)));

            presentTotal.textContent = presentStudents.length;
            absentTotal.textContent = absentStudents.length;

            presentList.innerHTML = presentStudents.length
                ? presentStudents.map(p => `
                    <div class="att-row">
                        <span class="att-roll">${p.roll}</span>
                        <span>${p.name}</span>
                        <span class="att-time">${p.time || ''}</span>
                    </div>`).join('')
                : '<div class="att-empty">હજુ કોઈ scan થયું નથી.</div>';

            absentList.innerHTML = absentStudents.length
                ? absentStudents.map(s => `
                    <div class="att-row">
                        <span class="att-roll">${s.roll}</span>
                        <span>${s.name}</span>
                    </div>`).join('')
                : '<div class="att-empty">બધા વિદ્યાર્થી હાજર છે! 🎉</div>';

            statusEl.style.display = 'none';
            contentEl.style.display = 'flex';
        })
        .catch(err => {
            statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Attendance load thai shakyu nathi. (${err.message})`;
            console.error(err);
        });
}

document.getElementById('refreshBtn').addEventListener('click', loadAttendance);

loadAttendance();
