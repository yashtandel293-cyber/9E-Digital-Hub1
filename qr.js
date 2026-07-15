let allStudents = [];

fetch("data/students.json")
.then(response => response.json())
.then(students => {

    allStudents = students;

    displayQR(students);

});

function displayQR(students){

    const container = document.getElementById("qrContainer");

    container.innerHTML = "";

    students.forEach(student=>{

        const profileURL =
        `https://yashtandel293-cyber.github.io/9E-Digital-Hub1/profile.html?gr=${student.gr}`;

        container.innerHTML += `

        <div class="col-md-6 col-lg-4">

            <div class="card p-4 text-center h-100 shadow-sm qr-card">

                <img src="Photos/${student.photo}"
                class="student-photo mb-3">

                <h5>${student.name}</h5>

                <div class="student-info">

<p>
<i class="fa-solid fa-hashtag"></i>
Roll No : <b>${student.roll}</b>
</p>

<p>
<i class="fa-solid fa-id-card"></i>
GR No : <b>${student.gr}</b>
</p>

<p>
<i class="fa-solid fa-school"></i>
Class : <b>9-E</b>
</p>

</div>

                <div id="qr-${student.gr}"
                class="d-flex justify-content-center mb-3"></div>

            </div>

        </div>
        
        `;

        setTimeout(()=>{

            new QRCode(document.getElementById(`qr-${student.gr}`),{

                text: profileURL,

                width:180,

                height:180

            });

        },0);

    });

}
document.getElementById("printAllBtn").addEventListener("click", () => {

setTimeout(() => {

    window.print();

},1000);

});