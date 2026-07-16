/* 9E Digital Hub — premium A4 desk-card printer. */

const printContainer = document.getElementById('printContainer');
const printAllBtn = document.getElementById('printAllBtn');
const CARDS_PER_PAGE = 6;
const LIVE_SITE = 'https://yashtandel293-cyber.github.io/9E-Digital-Hub1/';

function profileUrl(gr) {
  // Always use the public GitHub Pages URL, even while desk cards are made on Live Server.
  return `${LIVE_SITE}profile.html?gr=${encodeURIComponent(gr)}`;
}

function createCard(student) {
  const card = document.createElement('article');
  card.className = 'desk-card';
  card.innerHTML = `
    <div class="card-top">9E DIGITAL HUB</div>
    <img class="student-photo" src="Photos/${student.photo}" alt="${student.name}">
    <div class="student-name">${student.name}</div>
    <div class="roll-tag">ROLL NO. ${String(student.roll).padStart(2, '0')} • CLASS 9-E</div>
    <div class="qr-box" id="qr-${student.gr}"></div>
    <div class="scan-text">SCAN TO VIEW STUDENT PROFILE</div>
    <div class="school-name">Shree N. D. Desai Sarvajanik High School, Vankal</div>
  `;
  return card;
}

function addSquareQr(student) {
  const target = document.getElementById(`qr-${student.gr}`);
  new QRCode(target, {
    text: profileUrl(student.gr),
    width: 106,
    height: 106,
    correctLevel: QRCode.CorrectLevel.M
  });
}

function renderDeskCards(students) {
  printContainer.innerHTML = '';
  const sortedStudents = [...students].sort((a, b) => Number(a.roll) - Number(b.roll));

  sortedStudents.forEach((student, index) => {
    const pageNumber = Math.floor(index / CARDS_PER_PAGE);
    let page = printContainer.querySelector(`[data-page="${pageNumber}"]`);
    if (!page) {
      page = document.createElement('section');
      page.className = 'a4-page';
      page.dataset.page = pageNumber;
      printContainer.appendChild(page);
    }
    page.appendChild(createCard(student));
  });

  /* QRCodeJS makes a square 140 × 140 QR. CSS above prevents it from becoming round. */
  sortedStudents.forEach(addSquareQr);
}

fetch('data/students.json')
  .then((response) => {
    if (!response.ok) throw new Error(`Student data could not be loaded (${response.status}).`);
    return response.json();
  })
  .then(renderDeskCards)
  .catch((error) => {
    printContainer.innerHTML = `<div class="message"><strong>Desk cards could not be loaded.</strong><br>${error.message}</div>`;
    console.error(error);
  });

printAllBtn.addEventListener('click', () => window.print());
