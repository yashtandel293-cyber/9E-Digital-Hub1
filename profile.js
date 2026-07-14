const params = new URLSearchParams(window.location.search);

const gr = params.get("gr");

fetch("data/students.json")
.then(response => response.json())
.then(students => {

const student = students.find(s => String(s.gr) === String(gr));

const profile = document.getElementById("studentProfile");

profile.innerHTML = `

<div class="row justify-content-center">

<div class="col-lg-10">

<div class="dashboard-card p-5">

<div class="row align-items-center">

<div class="col-lg-4 text-center">

<img src="Photos/${student.photo}" class="profile-photo">

<h2 class="profile-name mt-4">

${student.name}

</h2>

<div class="mt-3">

<span class="badge bg-success fs-6">

<i class="fa-solid fa-user"></i>

${student.gender}

</span>

</div>

<div class="mt-4">

<a href="students.html" class="btn btn-light btn-lg rounded-pill px-4">

<i class="fa-solid fa-arrow-left"></i>

Back to Students

</a>

</div>

</div>

<div class="col-md-8">

<h4 class="mb-4">

Student Information

</h4>

<div class="row g-3">

<div class="col-md-6">
<div class="info-card">
<i class="fa-solid fa-id-card"></i>
<h6>Roll No</h6>
<p>${student.roll}</p>
</div>
</div>

<div class="col-md-6">
<div class="info-card">
<i class="fa-solid fa-fingerprint"></i>
<h6>GR No</h6>
<p>${student.gr}</p>
</div>
</div>

<div class="col-md-6">
<div class="info-card">
<i class="fa-solid fa-cake-candles"></i>
<h6>Date of Birth</h6>
<p>${student.dob}</p>
</div>
</div>

<div class="col-md-6">
<div class="info-card">
<i class="fa-solid fa-book"></i>
<h6>Favourite Subject</h6>
<p>${student.subject}</p>
</div>
</div>

<div class="col-md-6">
<div class="info-card">
<i class="fa-solid fa-futbol"></i>
<h6>Favourite Sport</h6>
<p>${student.sport}</p>
</div>
</div>

<div class="col-md-6">
<div class="info-card">
<i class="fa-solid fa-rocket"></i>
<h6>Dream Career</h6>
<p>${student.dream}</p>
</div>
</div>

</div>
<div class="row mt-4">

    <div class="col-md-6">

        <div class="card shadow border-0 rounded-4">

            <div class="card-body">

                <h4>
                    <i class="fa-solid fa-comment text-primary"></i>
                    About Me
                </h4>

                <hr>

                <p class="fs-5">

                    ${student.about}

                </p>

            </div>

        </div>

    </div>

    <div class="col-md-6">

        <div class="card shadow border-0 rounded-4">

            <div class="card-body">

                <h4>

                    <i class="fa-solid fa-trophy text-warning"></i>

                    Achievement

                </h4>

                <hr>

                <p class="fs-5">

                    No Achievement Yet

                </p>

            </div>

        </div>

    </div>

</div>
</div>

</div>

</div>

</div>

</div>

`;

});