// ==========================
// 9E Digital Hub
// Seating Plan - Part 1
// ==========================

let students = [];

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

// Load Students
fetch("data/students.json")
.then(response => response.json())
.then(data => {

    students = data;

    students.sort((a, b) => a.roll - b.roll);

    createSeats();

});

// ----------------------------
// Create Seating Cards
// ----------------------------

function createSeats() {

    Object.keys(benchMap).forEach(benchId => {

        const bench = document.getElementById(benchId);

        if (!bench) return;

        bench.innerHTML = "";

        benchMap[benchId].forEach(roll => {

            const student = students.find(s => Number(s.roll) === roll);

            if (!student) return;

            const div = document.createElement("div");

            div.className = "student";

            div.innerHTML = `
                <span class="roll-no">${roll}</span>
                <span class="student-name">${student.name.split(" ")[0]}</span>
            `;

            div.onclick = () => openProfile(student.gr);

            bench.appendChild(div);

        });

    });

}

function openProfile(gr){

    window.location.href =
    `profile.html?gr=${gr}`;

}