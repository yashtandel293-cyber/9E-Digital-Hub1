// ===============================
// Birthday Module - Part 1
// ===============================

let students = [];

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

// --------------------
// Parse DOB
// --------------------

function parseDOB(dob){

    if(dob.includes("/")){

        const p = dob.split("/");

        return{

            day:Number(p[0]),

            month:Number(p[1]),

            year:Number(p[2])

        };

    }

    const d = dob.split(" ")[0].split("-");

    return{

        day:Number(d[2]),

        month:Number(d[1]),

        year:Number(d[0])

    };

}

// --------------------
// Format Date
// --------------------

function formatDOB(dob){

    const d = parseDOB(dob);

    return `${d.day} ${months[d.month-1]}`;

}

// --------------------
// Load JSON
// --------------------

fetch("data/students.json")

.then(res=>res.json())

.then(data=>{

    students = data;

    renderTodayBirthday();

});

// --------------------
// Today's Birthday
// --------------------

function renderTodayBirthday(){

    const box = document.getElementById("todayBirthday");

    const today = new Date();

    const day = today.getDate();

    const month = today.getMonth()+1;

    const birthdayStudents = students.filter(student=>{

        const dob = parseDOB(student.dob);

        return dob.day===day && dob.month===month;

    });

    if(birthdayStudents.length===0){

        box.innerHTML = `

        <div class="alert alert-warning text-center">

            <h4 class="mb-2">

                🎂 No Birthday Today

            </h4>

            <p class="mb-0">

                We will celebrate again soon ❤️

            </p>

        </div>

        `;

        return;

    }

    let html = `

    <h2 class="section-title">

        🎉 Today's Birthday

    </h2>

    <div class="row g-4">

    `;

    birthdayStudents.forEach(student=>{

        html += `

        <div class="col-md-4">

            <div class="birthday-card today-card">

                <img

                src="Photos/${student.photo}"

                class="birthday-photo"

                alt="${student.name}">

                <h4>

                    ${student.name}

                </h4>

                <p>

                    🎂 ${formatDOB(student.dob)}

                </p>

                <a

                href="profile.html?gr=${student.gr}"

                class="btn btn-warning">

                    View Profile

                </a>

            </div>

        </div>

        `;

    });

    html += "</div>";

    box.innerHTML = html;

}
// ===============================
// Birthday Module - Part 2
// ===============================

// --------------------
// Initialize Remaining Sections
// --------------------

fetch("data/students.json")
.then(res => res.json())
.then(data => {

    students = data;

    renderTodayBirthday();

    renderUpcomingBirthday();

    renderMonthWise();

});

// --------------------
// Upcoming Birthdays
// --------------------

function renderUpcomingBirthday(){

    const container = document.getElementById("upcomingBirthday");

    container.innerHTML = "";

    const today = new Date();

    let upcoming = [];

    students.forEach(student=>{

        const dob = parseDOB(student.dob);

        let nextBirthday = new Date(

            today.getFullYear(),

            dob.month-1,

            dob.day

        );

        if(nextBirthday < today){

            nextBirthday.setFullYear(today.getFullYear()+1);

        }

        const diff = Math.ceil(

            (nextBirthday - today) /

            (1000*60*60*24)

        );

        if(diff>0 && diff<=7){

            upcoming.push({

                ...student,

                daysLeft:diff

            });

        }

    });

    upcoming.sort((a,b)=>a.daysLeft-b.daysLeft);

    if(upcoming.length===0){

        container.innerHTML =

        `<div class="alert alert-info">

        No Upcoming Birthday

        </div>`;

        return;

    }

    upcoming.forEach(student=>{

        container.innerHTML += `

        <div class="col-md-4 col-lg-3">

            <div class="birthday-card">

                <img

                src="Photos/${student.photo}"

                class="birthday-photo">

                <h5>${student.name}</h5>

                <p>${formatDOB(student.dob)}</p>

                <span class="badge bg-success">

                    ${student.daysLeft} Day(s)

                </span>

            </div>

        </div>

        `;

    });

}

// --------------------
// Month Wise
// --------------------

function renderMonthWise(){

    const main = document.getElementById("monthContainer");

    main.innerHTML = "";

    for(let m=1;m<=12;m++){

        const monthStudents = students.filter(s=>{

            return parseDOB(s.dob).month===m;

        });

        monthStudents.sort((a,b)=>{

            return parseDOB(a.dob).day -

                   parseDOB(b.dob).day;

        });

        let html = `

        <div class="month-section">

        <h2 class="month-title">

        📅 ${months[m-1]}

        </h2>

        <div class="row g-4">

        `;

        monthStudents.forEach(student=>{

            html += `

            <div class="col-md-4 col-lg-3">

                <div class="birthday-card">

                    <img

                    src="Photos/${student.photo}"

                    class="birthday-photo">

                    <h5>${student.name}</h5>

                    <p>

                    🎂 ${formatDOB(student.dob)}

                    </p>

                    <a

                    href="profile.html?gr=${student.gr}"

                    class="btn btn-primary btn-sm">

                    View Profile

                    </a>

                </div>

            </div>

            `;

        });

        html += "</div></div>";

        main.innerHTML += html;

    }

}

// --------------------
// Search
// --------------------

const search = document.getElementById("birthdaySearch");

search.addEventListener("keyup",()=>{

    const keyword = search.value.toLowerCase();

    if(keyword===""){

        renderMonthWise();

        return;

    }

    const main = document.getElementById("monthContainer");

    main.innerHTML = "";

    const filtered = students.filter(student=>

        student.name

        .toLowerCase()

        .includes(keyword)

    );

    let html = `

    <div class="month-section">

    <h2 class="month-title">

    🔍 Search Result

    </h2>

    <div class="row g-4">

    `;

    filtered.forEach(student=>{

        html += `

        <div class="col-md-4 col-lg-3">

            <div class="birthday-card">

                <img

                src="Photos/${student.photo}"

                class="birthday-photo">

                <h5>${student.name}</h5>

                <p>

                🎂 ${formatDOB(student.dob)}

                </p>

                <a

                href="profile.html?gr=${student.gr}"

                class="btn btn-primary btn-sm">

                View Profile

                </a>

            </div>

        </div>

        `;

    });

    html += "</div></div>";

    main.innerHTML = html;

});