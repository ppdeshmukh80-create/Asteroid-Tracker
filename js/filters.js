// handles the start/end date filter and re-renders cards + table when it changes

const filterState = {
  allRecords: [],
  startDate: null,
  endDate: null
};

function getRecordDate(record) {
  const date = new Date(record.approachDate);
  return isNaN(date.getTime()) ? null : date;
}

// shows the earliest and latest close approach dates in the loaded data
function renderDataCoverageNote(records) {
  const dates = records.map(getRecordDate).filter((date) => date !== null);
  const container = document.getElementById('data-coverage-note');
  if (dates.length === 0) {
    container.textContent = 'Data coverage: Not available';
    return;
  }

  const earliest = new Date(Math.min(...dates));
  const latest = new Date(Math.max(...dates));
  const options = { year: 'numeric', month: 'short', day: 'numeric' };

  container.textContent = `Data covers close approaches from ${earliest.toLocaleDateString('en-US', options)} to ${latest.toLocaleDateString('en-US', options)}.`;
}

function applyDateFilter(records) {
  if (!filterState.startDate && !filterState.endDate) return records;

  return records.filter((record) => {
    const date = getRecordDate(record);
    if (!date) return false;
    if (filterState.startDate && date < filterState.startDate) return false;
    if (filterState.endDate && date > filterState.endDate) return false;
    return true;
  });
}

function updateDashboard() {
  const filtered = applyDateFilter(filterState.allRecords);
  renderSummaryCards(buildSummaryStats(filtered));
  renderAsteroidTable(filtered);
}

function handleFilterChange() {
  const startValue = document.getElementById('start-date-input').value;
  const endValue = document.getElementById('end-date-input').value;

  filterState.startDate = startValue ? new Date(startValue) : null;
  filterState.endDate = endValue ? new Date(endValue) : null;

  updateDashboard();
}

function handleResetFilters() {
  const defaults = getDefaultDateRange();
  setDateInputs(defaults.start, defaults.end);
  filterState.startDate = defaults.start;
  filterState.endDate = defaults.end;
  updateDashboard();
}

// formats a Date as yyyy-MM-dd for use in a date input
function formatDateForInput(date) {
  return date.toISOString().split('T')[0];
}

function setDateInputs(startDate, endDate) {
  document.getElementById('start-date-input').value = formatDateForInput(startDate);
  document.getElementById('end-date-input').value = formatDateForInput(endDate);
}

// default range: start of the current year through one year from today
function getDefaultDateRange() {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  const end = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
  return { start, end };
}

function initFilters(allRecords) {
  filterState.allRecords = allRecords;

  document.getElementById('start-date-input').addEventListener('change', handleFilterChange);
  document.getElementById('end-date-input').addEventListener('change', handleFilterChange);
  document.getElementById('reset-filters-btn').addEventListener('click', handleResetFilters);

  const defaults = getDefaultDateRange();
  setDateInputs(defaults.start, defaults.end);
  filterState.startDate = defaults.start;
  filterState.endDate = defaults.end;

  updateDashboard();
}
