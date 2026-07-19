// ==========================
// 9E Digital Hub — Seating Poster (Print Version)
// ==========================

const benchMap = {
    bench1: [14,15,16],
    bench2: [17,18,19],
    bench3: [53,54,55],
    bench4: [70,71,72],

    bench5: [11,12,13],
    bench6: [20,21,22],
    bench7: [50,51,52],
    bench8: [67,68,69],

    bench9: [9,10],
    bench10: [23,24,25],
    bench11: [47,48,49],
    bench12: [64,65,66],

    bench13: [6,7,8],
    bench14: [26,27,30],
    bench15: [44,45,46],
    bench16: [61,62,63],

    bench17: [3,4,5],
    bench18: [31,32,33],
    bench19: [41,42,43],
    bench20: [58,59,60],

    bench21: [1,2],
    bench22: [35,36,37],
    bench23: [38,39,40],
    bench24: [56,57]
};

const posterGrid = document.getElementById('posterGrid');

fetch('data/students.json')
    .then(res => {
        if (!res.ok) throw new Error('students.json not found');
        return res.json();
    })
    .then(students => {
        students.sort((a, b) => a.roll - b.roll);
        renderPoster(students);
    })
    .catch(err => {
        posterGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#dc2626;font-weight:700;padding:1in;">Student data load thai shakyu nathi. (${err.message})</div>`;
        console.error(err);
    });

function renderPoster(students) {
    posterGrid.innerHTML = '';

    Object.keys(benchMap).forEach(benchId => {
        const cell = document.createElement('div');
        cell.className = 'poster-bench';

        benchMap[benchId].forEach(roll => {
            const student = students.find(s => Number(s.roll) === roll);
            if (!student) return;

            const seat = document.createElement('div');
            seat.className = 'poster-seat';
            seat.innerHTML = `
                <span class="seat-roll">${roll}</span>
                <span class="seat-name">${student.name}</span>
            `;
            cell.appendChild(seat);
        });

        posterGrid.appendChild(cell);
    });
}

document.getElementById('printBtn').addEventListener('click', () => window.print());
