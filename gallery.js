// ==========================
// 9E Digital Hub — Gallery
// ==========================

let galleryData = null;
let currentEvent = null;
let currentYear = null;
let currentPhotos = [];
let currentPhotoIndex = 0;

const eventGrid = document.getElementById('eventGrid');
const yearGrid = document.getElementById('yearGrid');
const photoGrid = document.getElementById('photoGrid');
const galleryEmpty = document.getElementById('galleryEmpty');
const breadcrumb = document.getElementById('galleryBreadcrumb');
const crumbEventWrap = document.getElementById('crumbEventWrap');
const crumbYearWrap = document.getElementById('crumbYearWrap');
const crumbEvent = document.getElementById('crumbEvent');
const crumbYear = document.getElementById('crumbYear');

fetch('data/gallery.json')
    .then(res => {
        if (!res.ok) throw new Error('gallery.json not found');
        return res.json();
    })
    .then(data => {
        galleryData = data;
        renderEventGrid();
    })
    .catch(err => {
        eventGrid.innerHTML = `<div class="gallery-empty"><i class="fa-solid fa-triangle-exclamation"></i><p>Gallery data load thai shakyu nathi. (${err.message})</p></div>`;
        console.error(err);
    });

/* ---------- STEP 1: EVENT GRID ---------- */
function renderEventGrid() {
    eventGrid.innerHTML = '';
    galleryData.events.forEach(event => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="event-card" data-event="${event.id}">
                <i class="${event.icon}"></i>
                <span>${event.title}</span>
                <small>${event.subtitle}</small>
            </div>`;
        col.querySelector('.event-card').addEventListener('click', () => openEvent(event.id));
        eventGrid.appendChild(col);
    });
    showStep('event');
}

/* ---------- STEP 2: YEAR GRID ---------- */
function openEvent(eventId) {
    currentEvent = galleryData.events.find(e => e.id === eventId);
    if (!currentEvent) return;

    yearGrid.innerHTML = '';
    Object.keys(currentEvent.years).forEach(year => {
        const count = currentEvent.years[year].length;
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3';
        col.innerHTML = `
            <div class="year-card" data-year="${year}">
                <i class="fa-solid fa-calendar-days"></i>
                <span>${year}</span>
                <small>${count} Photos</small>
            </div>`;
        col.querySelector('.year-card').addEventListener('click', () => openYear(year));
        yearGrid.appendChild(col);
    });

    crumbEvent.textContent = currentEvent.title;
    crumbEventWrap.style.display = 'inline-flex';
    crumbYearWrap.style.display = 'none';

    showStep('year');
}

/* ---------- STEP 3: PHOTO GRID ---------- */
function openYear(year) {
    currentYear = year;
    currentPhotos = currentEvent.years[year] || [];

    photoGrid.innerHTML = '';

    if (currentPhotos.length === 0) {
        photoGrid.style.display = 'none';
        galleryEmpty.style.display = 'block';
    } else {
        galleryEmpty.style.display = 'none';
        currentPhotos.forEach((photo, idx) => {
            const path = `Images/gallery/${currentEvent.id}/${year}/${photo}`;
            const thumb = document.createElement('div');
            thumb.className = 'photo-thumb';
            thumb.innerHTML = `<img src="${path}" alt="${currentEvent.title} ${year}" loading="lazy" onerror="this.closest('.photo-thumb').style.display='none';">`;
            thumb.addEventListener('click', () => openLightbox(idx));
            photoGrid.appendChild(thumb);
        });
        photoGrid.style.display = 'grid';
    }

    crumbYear.textContent = year;
    crumbYearWrap.style.display = 'inline-flex';

    showStep('photo');
}

/* ---------- STEP NAVIGATION / BREADCRUMB ---------- */
function showStep(step) {
    eventGrid.style.display = step === 'event' ? 'flex' : 'none';
    yearGrid.style.display = step === 'year' ? 'flex' : 'none';
    photoGrid.style.display = step === 'photo' && currentPhotos.length ? 'grid' : 'none';
    if (step !== 'photo') galleryEmpty.style.display = 'none';

    breadcrumb.style.display = step === 'event' ? 'none' : 'flex';
    if (step === 'year') crumbYearWrap.style.display = 'none';
}

document.getElementById('crumbHome').addEventListener('click', () => {
    currentEvent = null;
    currentYear = null;
    showStep('event');
});

crumbEvent.addEventListener('click', () => {
    if (currentEvent) openEvent(currentEvent.id);
});

/* ---------- LIGHTBOX ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');

function openLightbox(index) {
    currentPhotoIndex = index;
    updateLightboxImage();
    lightbox.classList.add('open');
}

function updateLightboxImage() {
    const photo = currentPhotos[currentPhotoIndex];
    lightboxImg.src = `Images/gallery/${currentEvent.id}/${currentYear}/${photo}`;
    lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${currentPhotos.length}`;
}

document.getElementById('lightboxClose').addEventListener('click', () => {
    lightbox.classList.remove('open');
});

document.getElementById('lightboxPrev').addEventListener('click', () => {
    currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
    updateLightboxImage();
});

document.getElementById('lightboxNext').addEventListener('click', () => {
    currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
    updateLightboxImage();
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('open');
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('open');
    if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
});
