// ==========================
// 9E Digital Hub — Timetable Module
// ==========================

let timetableData = null;
let teachersById = {};

const statusEl = document.getElementById('timetableStatus');
const tableEl = document.getElementById('timetableTable');
const headRow = document.getElementById('timetableHeadRow');
const bodyEl = document.getElementById('timetableBody');
const popover = document.getElementById('teacherPopover');

const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

Promise.all([
    fetch('data/timetable.json').then(r => {
        if (!r.ok) throw new Error('timetable.json not found');
        return r.json();
    }),
    fetch('data/teachers.json').then(r => {
        if (!r.ok) throw new Error('teachers.json not found');
        return r.json();
    })
])
.then(([timetable, teachers]) => {
    timetableData = timetable;
    teachers.forEach(t => { teachersById[t.id] = t; });
    renderTimetable();
    statusEl.style.display = 'none';
    tableEl.style.display = 'table';
})
.catch(err => {
    statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Timetable load thai shakyu nathi. (${err.message})`;
    console.error(err);
});

function renderTimetable() {
    // Head row: Period label column + one column per day
    let headHtml = '<th class="period-col-head">Period</th>';
    timetableData.days.forEach(dayObj => {
        headHtml += `<th>${dayObj.day}</th>`;
    });
    headRow.innerHTML = headHtml;

    // Body rows: one row per period/break, one cell per day
    let bodyHtml = '';
    timetableData.periods.forEach((periodMeta, idx) => {
        if (periodMeta.break) {
            bodyHtml += `<tr class="break-row"><td colspan="${timetableData.days.length + 1}"><div class="break-cell">${periodMeta.label || 'BREAK'}</div></td></tr>`;
            return;
        }

        const timeHtml = periodMeta.time ? `<span class="period-time">${periodMeta.time}</span>` : '';
        bodyHtml += `<tr><td class="period-col">P${periodMeta.period}${timeHtml}</td>`;

        timetableData.days.forEach(dayObj => {
            const subject = dayObj.slots[idx];
            if (!subject) {
                bodyHtml += `<td><div class="empty-cell">—</div></td>`;
                return;
            }
            const teacherId = timetableData.subjectTeacher[subject];
            bodyHtml += `<td><div class="subject-cell" data-subject="${escapeAttr(subject)}" data-teacher="${teacherId || ''}">${subject}</div></td>`;
        });

        bodyHtml += '</tr>';
    });
    bodyEl.innerHTML = bodyHtml;

    attachHandlers();
}
function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;');
}

function attachHandlers() {
    const cells = document.querySelectorAll('.subject-cell');

    cells.forEach(cell => {
        const teacherId = cell.dataset.teacher;
        const teacher = teachersById[teacherId];

        // Desktop hover -> quick popover
        if (supportsHover) {
            cell.addEventListener('mouseenter', (e) => showPopover(e, teacher, cell.dataset.subject));
            cell.addEventListener('mousemove', (e) => positionPopover(e));
            cell.addEventListener('mouseleave', hidePopover);
        }

        // Click / tap (desktop + mobile) -> full profile modal
        cell.addEventListener('click', () => openTeacherModal(teacher, cell.dataset.subject));
    });
}

function showPopover(e, teacher, subject) {
    if (!teacher) return;
    document.getElementById('popoverPhoto').src = `Images/${teacher.photo}`;
    document.getElementById('popoverPhoto').onerror = function () {
        this.src = 'https://placehold.co/100x100/e8f0ff/0b3d91?text=9E';
    };
    document.getElementById('popoverName').textContent = teacher.name;
    document.getElementById('popoverSubject').textContent = subject;
    popover.style.display = 'flex';
    positionPopover(e);
}

function positionPopover(e) {
    const offset = 16;
    let left = e.clientX + offset;
    let top = e.clientY + offset;

    const popRect = popover.getBoundingClientRect();
    if (left + popRect.width > window.innerWidth - 10) {
        left = e.clientX - popRect.width - offset;
    }
    if (top + popRect.height > window.innerHeight - 10) {
        top = e.clientY - popRect.height - offset;
    }
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
}

function hidePopover() {
    popover.style.display = 'none';
}

function openTeacherModal(teacher, subject) {
    hidePopover();

    if (!teacher) {
        document.getElementById('modalPhoto').src = 'https://placehold.co/240x240/e8f0ff/0b3d91?text=9E';
        document.getElementById('modalName').textContent = subject;
        document.getElementById('modalSubjectTag').textContent = '👤 Teacher not assigned yet';
        document.getElementById('modalQualification').textContent = '—';
        document.getElementById('modalExperience').textContent = '—';
        document.getElementById('modalMessage').textContent = 'આ subject માટે teacher ડેટા હજુ ઉમેરાયો નથી.';
    } else {
        document.getElementById('modalPhoto').src = `Images/${teacher.photo}`;
        document.getElementById('modalPhoto').onerror = function () {
            this.src = 'https://placehold.co/240x240/e8f0ff/0b3d91?text=9E';
        };
        document.getElementById('modalName').textContent = teacher.name;
        document.getElementById('modalSubjectTag').textContent = `👨‍🏫 ${subject} Teacher`;
        document.getElementById('modalQualification').textContent = teacher.qualification || 'Not added yet';
        document.getElementById('modalExperience').textContent = teacher.experience || 'Not added yet';
        document.getElementById('modalMessage').textContent = teacher.message || 'No message added yet.';
    }

    const modal = new bootstrap.Modal(document.getElementById('teacherModal'));
    modal.show();
}
