const profileContainer = document.getElementById('studentProfile');
const params = new URLSearchParams(window.location.search);
const selectedGr = params.get('gr');

function safeText(value, fallback = 'Not added yet') {
  const text = String(value ?? '').trim();
  return text && text.toLowerCase() !== 'nan' ? text : fallback;
}

function escapeHtml(value) {
  return safeText(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  }[char]));
}

function parseDob(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  // Supports DD/MM/YYYY, D/M/YYYY, and Excel-style YYYY-MM-DD 00:00:00 values.
  const dmy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));

  const ymd = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymd) return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function displayDob(value) {
  const date = parseDob(value);
  return date
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
    : safeText(value);
}

function isBirthdayToday(value) {
  const dob = parseDob(value);
  if (!dob) return false;
  const today = new Date();
  return dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth();
}

function birthdayLabel(value) {
  const dob = parseDob(value);
  if (!dob) return 'Birthday details coming soon';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' }).format(dob);
}

function genderIcon(gender) {
  return String(gender).toLowerCase() === 'female' ? 'fa-person-dress' : 'fa-person';
}

function infoCard(icon, label, value, accent = '') {
  return `
    <article class="profile-info-card ${accent}">
      <span class="profile-info-icon"><i class="fa-solid ${icon}"></i></span>
      <div>
        <p>${label}</p>
        <h3>${escapeHtml(value)}</h3>
      </div>
    </article>`;
}

function showError(message) {
  profileContainer.innerHTML = `
    <section class="profile-error-card">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <h1>Profile unavailable</h1>
      <p>${message}</p>
      <a href="students.html" class="profile-primary-btn">Back to Students</a>
    </section>`;
}

function renderProfile(student) {
  const name = safeText(student.name);
  const birthdayToday = isBirthdayToday(student.dob);
  const gender = safeText(student.gender);
  const achievement = safeText(student.achievement, 'No achievement added yet');

  document.title = `${name} | 9E Digital Hub`;

  profileContainer.innerHTML = `
    <section class="profile-v2-card">
      ${birthdayToday ? `
        <div class="birthday-celebration-banner">
          <i class="fa-solid fa-cake-candles"></i>
          Happy Birthday! Wishing you a wonderful year ahead.
          <i class="fa-solid fa-party-horn"></i>
        </div>` : ''}

      <div class="profile-v2-grid">
        <aside class="profile-identity-panel">
          <div class="profile-photo-wrap">
            <img class="profile-v2-photo" src="Photos/${encodeURIComponent(safeText(student.photo, ''))}" alt="Photo of ${escapeHtml(name)}" onerror="this.src='https://placehold.co/360x360/e8f0ff/0b3d91?text=9E';">
            <span class="profile-online-dot" title="Student profile"></span>
          </div>

          <span class="profile-roll-pill"><i class="fa-solid fa-id-badge"></i> Roll No. ${escapeHtml(student.roll)}</span>
          <h1>${escapeHtml(name)}</h1>

          <div class="profile-chips">
            <span class="profile-chip profile-gender-chip"><i class="fa-solid ${genderIcon(gender)}"></i>${escapeHtml(gender)}</span>
            <span class="profile-chip profile-birthday-chip"><i class="fa-solid fa-cake-candles"></i>${birthdayLabel(student.dob)}</span>
          </div>

          <a href="students.html" class="profile-back-button">
            <i class="fa-solid fa-arrow-left"></i> Back to Students
          </a>
        </aside>

        <div class="profile-content-panel">
          <div class="profile-section-heading">
            <div>
              <p class="profile-eyebrow">9E DIGITAL HUB</p>
              <h2>Student Snapshot</h2>
            </div>
            <span class="profile-gr-label">GR No. ${escapeHtml(student.gr)}</span>
          </div>

          <div class="profile-info-grid">
            ${infoCard('fa-id-card', 'Roll Number', student.roll, 'blue')}
            ${infoCard('fa-fingerprint', 'GR Number', student.gr, 'purple')}
            ${infoCard('fa-cake-candles', 'Date of Birth', displayDob(student.dob), 'orange')}
            ${infoCard('fa-book-open', 'Favourite Subject', student.subject, 'green')}
            ${infoCard('fa-medal', 'Favourite Sport', student.sport, 'blue')}
            ${infoCard('fa-rocket', 'Dream Career', student.dream, 'purple')}
          </div>

          <div class="profile-story-grid">
            <article class="profile-story-card about-card">
              <span class="profile-story-icon"><i class="fa-solid fa-comment-dots"></i></span>
              <div>
                <p class="profile-card-label">ABOUT ME</p>
                <h3>${escapeHtml(student.about)}</h3>
              </div>
            </article>

            <article class="profile-story-card achievement-card">
              <span class="profile-story-icon"><i class="fa-solid fa-trophy"></i></span>
              <div>
                <p class="profile-card-label">ACHIEVEMENT</p>
                <h3>${escapeHtml(achievement)}</h3>
              </div>
            </article>
          </div>

          <div class="profile-passion-row">
            <span><i class="fa-solid fa-heart"></i> Hobby: <strong>${escapeHtml(student.hobby)}</strong></span>
            <span><i class="fa-solid fa-star"></i> Every student has a story.</span>
          </div>
        </div>
      </div>
    </section>`;
}

if (!selectedGr) {
  showError('Please select a student from the Students page.');
} else {
  fetch('data/students.json')
    .then(response => {
      if (!response.ok) throw new Error('Student data could not be loaded.');
      return response.json();
    })
    .then(students => {
      const student = students.find(item => String(item.gr) === String(selectedGr));
      if (!student) {
        showError('The selected student could not be found.');
        return;
      }
      renderProfile(student);
    })
    .catch(() => showError('Please check that data/students.json is available and try again.'));
}
