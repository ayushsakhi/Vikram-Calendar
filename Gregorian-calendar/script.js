 // ======== CONFIGURE INITIAL MONTH/YEAR HERE ========
  // Set initialMonth to 0-11 (0=Jan). To load current month by default use:
  // const now = new Date(); let initialMonth = now.getMonth(); let initialYear = now.getFullYear();
  let initialMonth = new Date().getMonth(); // change if you want a particular month
  let initialYear  = new Date().getFullYear(); // change if needed
  // ==================================================

  const monthYearLabel = document.getElementById('monthYear');
  const daysGrid = document.getElementById('daysGrid');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let shownMonth = initialMonth;
  let shownYear = initialYear;


// for clickable month event 
// const popover = document.getElementById("monthPopover");
// const popoverMonth = document.getElementById("popoverMonth");
// const popoverYear = document.getElementById("popoverYear");
// const applyChange = document.getElementById("applyChange");

// monthYearLabel.addEventListener("click", () => {
//   popover.classList.toggle("show");
//   popoverMonth.value = shownMonth;
//   popoverYear.value = shownYear;
// });

// applyChange.addEventListener("click", () => {
//   shownMonth = parseInt(popoverMonth.value);
//   shownYear = parseInt(popoverYear.value);
//   renderCalendar(shownYear, shownMonth);
//   popover.classList.remove("show");
// });


 // fill popover inputs with initial values
if (typeof popoverMonth !== 'undefined' && popoverMonth) popoverMonth.value = shownMonth;
if (typeof popoverYear !== 'undefined' && popoverYear) popoverYear.value = shownYear;


  function renderCalendar(year, month) {
    // Clear grid
    daysGrid.innerHTML = '';

    // Title
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    monthYearLabel.textContent = `${monthNames[month]} ${year}`;

    // First day of month (0=Sun ... 6=Sat)
    const firstDay = new Date(year, month, 1).getDay();
    // Number of days in this month:
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Optional: previous month's days count (if you want to show previous-month numbers)
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Today's date for highlighting
    const today = new Date();
    const isCurrentMonth = (today.getFullYear() === year && today.getMonth() === month);
    const todayDate = today.getDate();

    // We'll render 6 rows of 7 = 42 cells to keep layout consistent
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('role','gridcell');

      // Calculate day number corresponding to this cell:
      // cells before firstDay are previous month's trailing days
      const dayIndex = i - firstDay + 1;

      if (i < firstDay) {
        // previous month trailing cells (optional show as empty)
        cell.classList.add('empty'); // invisible number but keeps box
        cell.textContent = prevMonthDays - (firstDay - 1) + i; // if you want numbers, remove .empty class
      } else if (dayIndex <= daysInMonth) {
        cell.textContent = dayIndex;

        // highlight today
        if (isCurrentMonth && dayIndex === todayDate) {
          cell.classList.add('today');
          cell.setAttribute('aria-current','date');
        }

      } else {
        // next month's leading cells
        cell.classList.add('empty');
        cell.textContent = dayIndex - daysInMonth; // shows number if you remove .empty
      }

      daysGrid.appendChild(cell);
    }
    activateDateClick();
  }

  function prevMonth() {
    shownMonth--;
    if (shownMonth < 0) { shownMonth = 11; shownYear--; }
    renderCalendar(shownYear, shownMonth); // REMOVE updateControls()
  }
  
  function nextMonth() {
    shownMonth++;
    if (shownMonth > 11) { shownMonth = 0; shownYear++; }
    renderCalendar(shownYear, shownMonth); // REMOVE updateControls()
  }
  

  function updateControls(){
    monthSelect.value = shownMonth;
    yearInput.value = shownYear;
  }

  // event listeners
  prevBtn.addEventListener('click', prevMonth);
  nextBtn.addEventListener('click', nextMonth);

//   for clickable dates 
let selectedCell = null;

function activateDateClick() {
  const cells = document.querySelectorAll(".grid .cell");

  cells.forEach(cell => {
    cell.addEventListener("click", function () {
      // Ignore empty cells
      if (cell.classList.contains("empty")) return;

      // Remove border from previous selected
      if (selectedCell) {
        selectedCell.classList.remove("selected");
      }

      // Set new selected
      cell.classList.add("selected");
      selectedCell = cell;
    });
  });
}


  // Allow arrow keys to navigate months
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevMonth();
    if (e.key === 'ArrowRight') nextMonth();
  });

  // initial render
  renderCalendar(shownYear, shownMonth);
  activateDateClick();
