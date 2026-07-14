let allStudents = [];
fetch("data/students.json")
.then(response => response.json())
.then(students => {
    allStudents = students;
    displayStudents(students);
});

const container = document.getElementById("studentContainer");

function displayStudents(students){

const container = document.getElementById("studentContainer");

container.innerHTML = "";

students.forEach(student => {

container.innerHTML += `

<div class="col-md-6 col-lg-3">

<div class="card student-card h-100 text-center p-4">

<img src="Photos/${student.photo}" class="student-photo">

<h4>${student.name}</h4>

<p class="text-muted mb-1">
Roll No : ${student.roll}
</p>

<p class="text-muted">
GR No : ${student.gr}
</p>

<a href="profile.html?gr=${student.gr}" class="btn btn-primary mt-2">

View Profile

</a>

</div>

</div>

`;

});

}
document.getElementById("searchInput").addEventListener("keyup", function(){

const keyword = this.value.toLowerCase();

const filtered = allStudents.filter(student =>

student.name.toLowerCase().includes(keyword) ||

student.roll.toString().includes(keyword) ||

student.gr.toString().includes(keyword)

);

displayStudents(filtered);

});