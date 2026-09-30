// handles the start/end date filter and re-renders cards + table when it changes

const filterState = {
  allRecords: [],
  startDate: null,
  endDate: null,
  category: 'all',
  searchText: ''
};

function getRecordDate(record) {
  if (!record || typeof record.approachDate !== 'string') return null;

  const match = /^(\d{4})-([A-Za-z]{3})-(\d{2})$/.exec(record.approachDate);
  if (!match) return null;

  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(match[2]);
  if (month === -1) return null;

  const year = Number(match[1]);
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
  return date;
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

function applyCategoryFilter(records) {
  if (filterState.category === 'all') return records;
  return records.filter((record) => record.category === filterState.category);
}

function applySearchFilter(records) {
  const searchText = filterState.searchText.trim().toLocaleLowerCase();
  if (!searchText) return records;

  return records.filter((record) => [record.designation, record.fullname]
    .some((value) => typeof value === 'string' && value.toLocaleLowerCase().includes(searchText)));
}

function getFilteredRecords() {
  return applySearchFilter(applyCategoryFilter(applyDateFilter(filterState.allRecords)));
}

function updateDashboard() {
  const filtered = getFilteredRecords();
  renderSummaryCards(buildSummaryStats(filtered));
  renderClosestApproachesChart(filtered);
  renderFastestObjectsChart(filtered);
  renderAsteroidTable(filtered);
}

function handleCategoryChange(category) {
  filterState.category = category;
  updateCategoryButtons();
  updateDashboard();
}

function handleSearchInput(event) {
  filterState.searchText = event.target.value;
  updateDashboard();
}

// highlights whichever category button is active
function updateCategoryButtons() {
  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.category === filterState.category);
  });
}

function handleFilterChange() {
  const startValue = document.getElementById('start-date-input').value;
  const endValue = document.getElementById('end-date-input').value;

  filterState.startDate = startValue ? new Date(`${startValue}T00:00:00`) : null;
  filterState.endDate = endValue ? new Date(`${endValue}T00:00:00`) : null;

  updateDashboard();
}

function handleResetFilters() {
  document.getElementById('start-date-input').value = '';
  document.getElementById('end-date-input').value = '';
  document.getElementById('asteroid-search').value = '';
  filterState.startDate = null;
  filterState.endDate = null;
  filterState.searchText = '';
  filterState.category = 'all';
  resetTableSorting();
  updateCategoryButtons();
  updateDashboard();
}

function initFilters(allRecords) {
  filterState.allRecords = allRecords;

  document.getElementById('start-date-input').addEventListener('change', handleFilterChange);
  document.getElementById('end-date-input').addEventListener('change', handleFilterChange);
  document.getElementById('reset-filters-btn').addEventListener('click', handleResetFilters);
  document.getElementById('asteroid-search').addEventListener('input', handleSearchInput);

  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.addEventListener('click', () => handleCategoryChange(btn.dataset.category));
  });

  document.getElementById('start-date-input').value = '';
  document.getElementById('end-date-input').value = '';

  updateCategoryButtons();
  updateDashboard();
}
