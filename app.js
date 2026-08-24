const KEY = "eja_smis_v1";

const SUPABASE_URL = "https://xxxvjlrjndtmoldkpeeby.supabase.co";
const SUPABASE_KEY = "sb_publishable_i2LJlBXWZpusyLBbYVhOKw_QH13Rv5w";

// Supabase client
const supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const seed = {
  students: [],
  fees: [],
  staff: [],
  books: [],
  clubs: [],
  notes: [],
  marks: []
};

let db = JSON.parse(localStorage.getItem(KEY) || "null") || seed;

function save() {
  localStorage.setItem(KEY, JSON.stringify(db));
}

function money(n) {
  return "KSh " + Number(n || 0).toLocaleString();
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

function show(id) {
  document.getElementById(id)?.classList.remove("hidden");
}

function hide(id) {
  document.getElementById(id)?.classList.add("hidden");
}

function setPage(page) {
  document.querySelectorAll("#nav button").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === page
    );
  });

  const title = document.getElementById("pageTitle");

  if (title) {
    title.textContent =
      page.charAt(0).toUpperCase() + page.slice(1);
  }

  render(page);
}

function render(page) {
  const content = document.getElementById("content");

  if (!content) return;

  const views = {
    dashboard,
    students,
    fees,
    academics,
    reports,
    library,
    timetable,
    staff,
    clubs,
    notes
  };

  content.innerHTML =
    (views[page] || dashboard)();
}

/* =========================
   DASHBOARD
========================= */

function dashboard() {
  const paid = db.fees.reduce(
    (total, fee) => total + Number(fee.amount || 0),
    0
  );

  return `
    <div class="cards">

      <div class="card">
        <span class="muted">Students</span>
        <div class="stat">${db.students.length}</div>
      </div>

      <div class="card">
        <span class="muted">Fee payments</span>
        <div class="stat">${money(paid)}</div>
      </div>

      <div class="card">
        <span class="muted">Staff</span>
        <div class="stat">${db.staff.length}</div>
      </div>

      <div class="card">
        <span class="muted">Library books</span>
        <div class="stat">${db.books.length}</div>
      </div>

    </div>

    <div class="section card">
      <h3>ELLY JUNIOR ACADEMY</h3>

      <p class="muted">
        Super Administrator dashboard.
        This version is functional in the browser and stores
        records locally.
      </p>

      <div class="toolbar">
        <button class="primary" onclick="openStudent()">
          + Register Student
        </button>

        <button onclick="setPage('fees')">
          Record Fee
        </button>

        <button onclick="setPage('academics')">
          Enter Marks
        </button>
      </div>
    </div>
  `;
}

/* =========================
   STUDENTS
========================= */

function students() {
  return `
    <div class="section-head">

      <div>
        <h3>Student Register</h3>
        <span class="muted">
          ${db.students.length} learners
        </span>
      </div>

      <div class="toolbar">

        <input
          id="studentSearch"
          placeholder="Search name/admission..."
          oninput="filterStudents()"
        >

        <button
          class="primary"
          onclick="openStudent()"
        >
          + Add Student
        </button>

      </div>

    </div>

    <div class="table-wrap">

      <table>

        <thead>
          <tr>
            <th>Admission No.</th>
            <th>Name</th>
            <th>Grade</th>
            <th>Gender</th>
            <th>Guardian</th>
            <th>Phone</th>
            <th></th>
          </tr>
        </thead>

        <tbody id="studentRows">
          ${studentRows(db.students)}
        </tbody>

      </table>

    </div>
  `;
}

function studentRows(arr) {
  if (!arr.length) {
    return `
      <tr>
        <td colspan="7" class="empty">
          No students registered yet.
        </td>
      </tr>
    `;
  }

  return arr.map((student, index) => `
    <tr>

      <td>${esc(student.adm || student.admission_no)}</td>

      <td>${esc(student.name || student.full_name)}</td>

      <td>${esc(student.grade)}</td>

      <td>${esc(student.gender || "")}</td>

      <td>${esc(student.guardian || student.guardian_name || "")}</td>

      <td>${esc(student.phone || student.guardian_phone || "")}</td>

      <td>
        <button
          class="danger"
          onclick="deleteStudent(${index})"
        >
          Delete
        </button>
      </td>

    </tr>
  `).join("");
}

function filterStudents() {
  const input = document.getElementById("studentSearch");

  if (!input) return;

  const q = input.value.toLowerCase();

  const filtered = db.students.filter(student => {

    const text = `
      ${student.name || ""}
      ${student.full_name || ""}
      ${student.adm || ""}
      ${student.admission_no || ""}
      ${student.grade || ""}
    `.toLowerCase();

    return text.includes(q);
  });

  const rows = document.getElementById("studentRows");

  if (rows) {
    rows.innerHTML = studentRows(filtered);
  }
}

/* =========================
   REGISTER STUDENT
========================= */

function openStudent() {

  modal(`
    <h3>Register Student</h3>

    <form id="studentForm">

      <div class="form-grid">

        <label>
          Admission No.
          <input name="adm" required>
        </label>

        <label>
          Full Name
          <input name="name" required>
        </label>

        <label>
          Grade

          <select name="grade" required>
            <option value="">Select grade</option>
            ${Array.from(
              { length: 9 },
              (_, i) => `<option>Grade ${i + 1}</option>`
            ).join("")}
          </select>

        </label>

        <label>
          Gender

          <select name="gender">
            <option>Male</option>
            <option>Female</option>
          </select>

        </label>

        <label>
          Guardian
          <input name="guardian">
        </label>

        <label>
          Phone
          <input name="phone">
        </label>

      </div>

      <div class="form-actions">

        <button
          type="button"
          onclick="closeModal()"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="primary"
        >
          Save Student
        </button>

      </div>

    </form>
  `);

  const form = document.getElementById("studentForm");

  form.onsubmit = async function (e) {

    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(form)
    );

    /*
      Save locally first.
      This keeps the app working even if Supabase
      is not connected yet.
    */

    db.students.push(data);
    save();

    /*
      Try Supabase if available.
    */

    if (supabaseClient) {

      try {

        const { error } = await supabaseClient
          .from("students")
          .insert([{
            admission_no: data.adm,
            full_name: data.name,
            grade: data.grade,
            gender: data.gender,
            guardian_name: data.guardian,
            guardian_phone: data.phone
          }]);

        if (error) {
          console.error(
            "Supabase error:",
            error
          );

          alert(
            "Student saved on this device, but Supabase could not save it:\n\n" +
            error.message
          );

          closeModal();
          render("students");
          return;
        }

      } catch (error) {

        console.error(
          "Supabase connection error:",
          error
        );

        alert(
          "Student saved locally. Supabase connection is not working yet."
        );
      }
    }

    alert("Student registered successfully!");

    closeModal();

    render("students");
  };
}

function deleteStudent(index) {

  if (!confirm("Delete this student?")) {
    return;
  }

  db.students.splice(index, 1);

  save();

  render("students");
}

/* =========================
   FEES
========================= */

function fees() {

  return `
    <div class="section-head">

      <div>
        <h3>Fee Management</h3>
        <span class="muted">
          Authorised finance records
        </span>
      </div>

      <button
        class="primary"
        onclick="openFee()"
      >
        + Record Payment
      </button>

    </div>

    <div class="table-wrap">

      <table>

        <thead>
          <tr>
            <th>Date</th>
            <th>Admission</th>
            <th>Student</th>
            <th>Amount</th>
            <th>Reference</th>
          </tr>
        </thead>

        <tbody>

          ${
            db.fees.length

              ? db.fees.map(fee => `
                <tr>
                  <td>${esc(fee.date)}</td>
                  <td>${esc(fee.adm)}</td>
                  <td>${esc(fee.student)}</td>
                  <td>${money(fee.amount)}</td>
                  <td>${esc(fee.ref)}</td>
                </tr>
              `).join("")

              : `
                <tr>
                  <td colspan="5" class="empty">
                    No fee payments recorded.
                  </td>
                </tr>
              `
          }

        </tbody>

      </table>

    </div>
  `;
}

function openFee() {

  modal(`
    <h3>Record Fee Payment</h3>

    <form id="feeForm">

      <div class="form-grid">

        <label>
          Date
          <input
            name="date"
            type="date"
            value="${new Date().toISOString().slice(0, 10)}"
            required
          >
        </label>

        <label>
          Admission No.
          <input name="adm" required>
        </label>

        <label>
          Student Name
          <input name="student" required>
        </label>

        <label>
          Amount (KSh)
          <input
            name="amount"
            type="number"
            min="0"
            required
          >
        </label>

        <label>
          Receipt/Reference
          <input name="ref">
        </label>

      </div>

      <div class="form-actions">

        <button
          type="button"
          onclick="closeModal()"
        >
          Cancel
        </button>

        <button
          class="primary"
          type="submit"
        >
          Save Payment
        </button>

      </div>

    </form>
  `);

  document.getElementById("feeForm").onsubmit = e => {

    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(e.target)
    );

    db.fees.push(data);

    save();

    closeModal();

    render("fees");
  };
}

/* =========================
   ACADEMICS
========================= */

function academics() {

  return `
    <div class="card">

      <h3>Assessment & Marks</h3>

      <p class="muted">
        Enter learner marks and calculate a simple rubric automatically.
      </p>

      <button
        class="primary"
        onclick="openMark()"
      >
        + Enter Assessment
      </button>

    </div>

    <div class="section table-wrap">

      <table>

        <thead>
          <tr>
            <th>Student</th>
            <th>Subject</th>
            <th>Score</th>
            <th>Rubric</th>
          </tr>
        </thead>

        <tbody>

          ${
            db.marks.length

              ? db.marks.map(mark => `
                <tr>

                  <td>${esc(mark.student)}</td>

                  <td>${esc(mark.subject)}</td>

                  <td>${esc(mark.score)}%</td>

                  <td>
                    ${esc(rubric(mark.score))}
                  </td>

                </tr>
              `).join("")

              : `
                <tr>
                  <td colspan="4" class="empty">
                    No assessments entered.
                  </td>
                </tr>
              `
          }

        </tbody>

      </table>

    </div>
  `;
}

function rubric(score) {

  const x = Number(score);

  if (x >= 80) {
    return "Exceeding Expectation";
  }

  if (x >= 60) {
    return "Meeting Expectation";
  }

  if (x >= 40) {
    return "Approaching Expectation";
  }

  return "Below Expectation";
}

function openMark() {

  modal(`
    <h3>Enter Assessment</h3>

    <form id="markForm">

      <div class="form-grid">

        <label>
          Student
          <input name="student" required>
        </label>

        <label>
          Subject
          <input name="subject" required>
        </label>

        <label>
          Score (%)
          <input
            name="score"
            type="number"
            min="0"
            max="100"
            required
          >
        </label>

      </div>

      <div class="form-actions">

        <button
          type="button"
          onclick="closeModal()"
        >
          Cancel
        </button>

        <button
          class="primary"
          type="submit"
        >
          Save
        </button>

      </div>

    </form>
  `);

  document.getElementById("markForm").onsubmit = e => {

    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(e.target)
    );

    db.marks.push(data);

    save();

    closeModal();

    render("academics");
  };
}

/* =========================
   REPORTS
========================= */

function reports() {

  return `
    <div class="card">

      <h3>Student Reports</h3>

      <p class="muted">
        Reports will use registered students and assessment records.
        PDF report-card generation is the next module.
      </p>

      <button
        class="primary"
        onclick="alert('Report-card engine is ready to be connected to the assessment records.')"
      >
        Generate Report
      </button>

    </div>
  `;
}

/* =========================
   LIBRARY
========================= */

function library() {

  return `
    <div class="section-head">

      <div>
        <h3>Library</h3>
      </div>

      <button
        class="primary"
        onclick="openBook()"
      >
        + Add Book
      </button>

    </div>

    <div class="table-wrap">

      <table>

        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Copies</th>
          </tr>
        </thead>

        <tbody>

          ${
            db.books.length

              ? db.books.map(book => `
                <tr>
                  <td>${esc(book.title)}</td>
                  <td>${esc(book.author)}</td>
                  <td>${esc(book.copies)}</td>
                </tr>
              `).join("")

              : `
                <tr>
                  <td colspan="3" class="empty">
                    No books added.
                  </td>
                </tr>
              `
          }

        </tbody>

      </table>

    </div>
  `;
}

function openBook() {

  modal(`
    <h3>Add Library Book</h3>

    <form id="bookForm">

      <div class="form-grid">

        <label>
          Title
          <input name="title" required>
        </label>

        <label>
          Author
          <input name="author">
        </label>

        <label>
          Copies
          <input
            name="copies"
            type="number"
            min="1"
            value="1"
          >
        </label>

      </div>

      <div class="form-actions">

        <button
          type="button"
          onclick="closeModal()"
        >
          Cancel
        </button>

        <button
          class="primary"
          type="submit"
        >
          Save
        </button>

      </div>

    </form>
  `);

  document.getElementById("bookForm").onsubmit = e => {

    e.preventDefault();

    db.books.push(
      Object.fromEntries(
        new FormData(e.target)
      )
    );

    save();

    closeModal();

    render("library");
  };
}

/* =========================
   TIMETABLE
========================= */

function timetable() {

  return `
    <div class="card">

      <h3>Timetable</h3>

      <p class="muted">
        Flexible timetable workspace for Grade 1–9.
        Automatic conflict-free generation can be added
        after subjects, teachers and periods are configured.
      </p>

      <button
        class="primary"
        onclick="alert('Timetable setup module: define teachers, subjects, rooms and periods first.')"
      >
        Configure Timetable
      </button>

    </div>
  `;
}

/* =========================
   STAFF
========================= */

function staff() {

  return `
    <div class="section-head">

      <div>
        <h3>Staff & Permissions</h3>

        <span class="muted">
          Administrator can add authorised users.
        </span>
      </div>

      <button
        class="primary"
        onclick="openStaff()"
      >
        + Add Staff
      </button>

    </div>

    <div class="table-wrap">

      <table>

        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
          </tr>
        </thead>

        <tbody>

          ${
            db.staff.length

              ? db.staff.map(member => `
                <tr>
                  <td>${esc(member.name)}</td>
                  <td>${esc(member.role)}</td>
                  <td>${esc(member.phone)}</td>
                </tr>
              `).join("")

              : `
                <tr>
                  <td colspan="3" class="empty">
                    No staff accounts configured.
                  </td>
                </tr>
              `
          }

        </tbody>

      </table>

    </div>
  `;
}

function openStaff() {

  modal(`
    <h3>Add Staff</h3>

    <form id="staffForm">

      <div class="form-grid">

        <label>
          Name
          <input name="name" required>
        </label>

        <label>
          Role

          <select name="role">

            <option>Teacher</option>
            <option>Finance</option>
            <option>Librarian</option>
            <option>Administrator</option>

          </select>

        </label>

        <label>
          Phone
          <input name="phone">
        </label>

      </div>

      <div class="form-actions">

        <button
          type="button"
          onclick="closeModal()"
        >
          Cancel
        </button>

        <button
          class="primary"
          type="submit"
        >
          Save
        </button>

      </div>

    </form>
  `);

  document.getElementById("staffForm").onsubmit = e => {

    e.preventDefault();

    db.staff.push(
      Object.fromEntries(
        new FormData(e.target)
      )
    );

    save();

    closeModal();

    render("staff");
  };
}

/* =========================
   CLUBS
========================= */

function clubs() {

  return `
    <div class="card">

      <h3>Clubs & Activities</h3>

      <p class="muted">
        Create clubs and maintain learner membership records.
      </p>

      <button
        class="primary"
        onclick="openClub()"
      >
        + Add Club
      </button>

    </div>

    <div class="section table-wrap">

      <table>

        <thead>
          <tr>
            <th>Club</th>
            <th>Patron</th>
          </tr>
        </thead>

        <tbody>

          ${
            db.clubs.length

              ? db.clubs.map(club => `
                <tr>
                  <td>${esc(club.name)}</td>
                  <td>${esc(club.patron)}</td>
                </tr>
              `).join("")

              : `
                <tr>
                  <td colspan="2" class="empty">
                    No clubs created.
                  </td>
                </tr>
              `
          }

        </tbody>

      </table>

    </div>
  `;
}

function openClub() {

  modal(`
    <h3>Add Club</h3>

    <form id="clubForm">

      <div class="form-grid">

        <label>
          Club Name
          <input name="name" required>
        </label>

        <label>
          Patron
          <input name="patron">
        </label>

      </div>

      <div class="form-actions">

        <button
          type="button"
          onclick="closeModal()"
        >
          Cancel
        </button>

        <button
          class="primary"
          type="submit"
        >
          Save
        </button>

      </div>

    </form>
  `);

  document.getElementById("clubForm").onsubmit = e => {

    e.preventDefault();

    db.clubs.push(
      Object.fromEntries(
        new FormData(e.target)
      )
    );

    save();

    closeModal();

    render("clubs");
  };
}

/* =========================
   NOTES
========================= */

function notes() {

  return `
    <div class="card">

      <h3>Private Administrator Notes</h3>

      <textarea
        id="noteText"
        rows="9"
        placeholder="Write private school-management notes here..."
      >${esc(db.notes[0]?.text || "")}</textarea>

      <div class="form-actions">

        <button
          class="primary"
          onclick="saveNote()"
        >
          Save Note
        </button>

      </div>

    </div>
  `;
}

function saveNote() {

  const textarea = document.getElementById("noteText");

  if (!textarea) return;

  db.notes = [
    {
      text: textarea.value
    }
  ];

  save();

  alert("Saved locally.");
}

/* =========================
   MODAL
========================= */

function modal(html) {

  closeModal();

  const d = document.createElement("div");

  d.id = "modal";
  d.className = "modal";

  d.innerHTML = `
    <div class="modal-box">
      ${html}
    </div>
  `;

  document.body.appendChild(d);
}

function closeModal() {

  document.getElementById("modal")?.remove();
}

/* =========================
   NAVIGATION
========================= */

document.querySelectorAll("#nav button").forEach(button => {

  button.onclick = () => {
    setPage(button.dataset.page);
  };

});

/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.onsubmit = e => {

    e.preventDefault();

    hide("loginView");
    show("dashboardView");

    setPage("dashboard");
  };
}

/* =========================
   LOGOUT
========================= */

const logoutButton = document.getElementById("logout");

if (logoutButton) {

  logoutButton.onclick = () => {

    hide("dashboardView");
    show("loginView");

  };
}

/* =========================
   START APPLICATION
========================= */

setPage("dashboard");
