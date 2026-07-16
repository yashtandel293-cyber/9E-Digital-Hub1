// ==========================
// 9E Digital Hub
// Seating Plan - Part 1
// ==========================

let students = [];

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

    const grid = document.getElementById("seatingGrid");
    grid.innerHTML = "";

    benches.forEach((bench, index) => {

        const benchCard = document.createElement("div");
        benchCard.className = "bench-card";

        let html = `
            <div class="bench-title">
                🪑 Bench ${index + 1}
            </div>
        `;

        bench.forEach(roll => {

            const student = students.find(s => s.roll == roll);

            if(student){

                html += `
                    <div class="bench-student"
                         onclick="openProfile(${student.gr})">

                        <span class="roll-no">${roll}</span>

                        <span class="student-name">
                            ${student.name.split(" ")[0]}
                        </span>

                    </div>
                `;

            }

        });

        benchCard.innerHTML = html;

        grid.appendChild(benchCard);

    });

}
function openProfile(gr){

    window.location.href =
    `profile.html?gr=${gr}`;

}