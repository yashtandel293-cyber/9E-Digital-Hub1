fetch("data/students.json")
.then(response => response.json())
.then(students => {

    const container = document.getElementById("printContainer");

    students.forEach(student => {

        container.innerHTML += `

        <div class="print-card">

            <img src="Photos/${student.photo}" alt="">

            <h4>${student.name}</h4>

            <p><b>Roll :</b> ${student.roll}</p>

            <div id="qr-${student.gr}" class="my-3 d-flex justify-content-center"></div>

            <small>Scan to View Profile</small>

        </div>

        `;

        setTimeout(() => {

            new QRCode(document.getElementById(`qr-${student.gr}`), {

                text:`https://yashtandel293-cyber.github.io/9E-Digital-Hub1/profile.html?gr=${student.gr}`,

                width:120,
                height:120

            });

        },0);

    });

});