/* 9E Digital Hub shared behaviour — compatible with index.html and students.html */
let allStudents = [];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('currentYear')?.append(new Date().getFullYear());
  animateCounters();
  loadStudents();
});

async function loadStudents() {
  try {
    const response = await fetch('data/students.json');
    if (!response.ok) throw new Error('Unable to read students.json');
    allStudents = await response.json();
    populateHomeBirthday();
    populateStudentCounters();
    if (document.getElementById('studentContainer')) displayStudents(allStudents);
    setupSearch();
  } catch (error) {
    console.error(error);
    const widget = document.getElementById('todayBirthdayWidget');
    if (widget) widget.innerHTML = '<div class="birthday-empty"><i class="fa-solid fa-triangle-exclamation"></i><span>Birthday information is temporarily unavailable.</span></div>';
  }
}

function parseDob(value) {
  if (!value) return null;
  const text = String(value).trim();
  let match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) return { day:Number(match[1]), month:Number(match[2]), year:Number(match[3]) };
  match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) return { day:Number(match[3]), month:Number(match[2]), year:Number(match[1]) };
  return null;
}

function getTodayBirthdays() {
  const today = new Date();
  return allStudents.filter(student => {
    const dob = parseDob(student.dob);
    return dob && dob.day === today.getDate() && dob.month === today.getMonth() + 1;
  });
}

function populateHomeBirthday() {
  const widget = document.getElementById('todayBirthdayWidget');
  if (!widget) return;
  const birthdays = getTodayBirthdays();
  if (!birthdays.length) {
    widget.innerHTML = '<div class="birthday-empty"><i class="fa-solid fa-cake-candles"></i><strong>No birthday today</strong><span>We will celebrate again soon.</span></div>';
    return;
  }
  widget.innerHTML = `<div class="birthday-list">${birthdays.map(student => `
    <a class="birthday-person" href="profile.html?gr=${encodeURIComponent(student.gr)}">
      <img src="Photos/${student.photo}" alt="${escapeHtml(student.name)}" onerror="this.style.visibility='hidden'">
      <div><h3>${escapeHtml(student.name)}</h3><p><i class="fa-solid fa-cake-candles"></i> Happy Birthday!</p></div>
    </a>`).join('')}</div>`;
}

function displayStudents(students) {
  const container = document.getElementById('studentContainer');
  if (!container) return;
  container.innerHTML = students.length ? students.map(student => `
    <div class="col-md-6 col-lg-3">
      <article class="card student-card h-100 text-center p-4">
        <div class="student-top"><img src="Photos/${student.photo}" class="student-photo" alt="${escapeHtml(student.name)}" onerror="this.style.visibility='hidden'"><span class="roll-badge">#${student.roll}</span></div>
        <h4 class="student-name">${escapeHtml(student.name)}</h4>
        <p class="text-muted mb-1">Roll No: ${student.roll}</p>
        <p class="text-muted">GR No: ${student.gr}</p>
        <a href="profile.html?gr=${encodeURIComponent(student.gr)}" class="btn btn-primary w-100 mt-3"><i class="fa-solid fa-arrow-up-right-from-square me-2"></i>Open Profile</a>
      </article>
    </div>`).join('') : '<div class="col-12 text-center text-muted py-5">No student found.</div>';
  const count = document.getElementById('studentCount');
  if (count) count.textContent = students.length;
}

function setupSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', () => {
    const keyword = input.value.trim().toLowerCase();
    displayStudents(allStudents.filter(s => String(s.name).toLowerCase().includes(keyword) || String(s.roll).includes(keyword) || String(s.gr).includes(keyword)));
  });
}

function filterStudents(gender, button) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  button?.classList.add('active');
  displayStudents(gender === 'all' ? allStudents : allStudents.filter(student => student.gender === gender));
}
window.filterStudents = filterStudents;

function populateStudentCounters() {
  const set = (id, value) => { const el=document.getElementById(id); if(el) el.textContent=value; };
  set('allCount', allStudents.length);
  set('boyCount', allStudents.filter(s => s.gender === 'Male').length);
  set('girlCount', allStudents.filter(s => s.gender === 'Female').length);
}

function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count); let current = 0; const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => { current += step; if (current >= target) { current = target; clearInterval(timer); } el.textContent = current; }, 28);
  });
}

function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
