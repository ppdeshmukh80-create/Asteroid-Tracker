// builds the main close approach data table, with paging and column sorting

const ROWS_PER_PAGE = 50;

// columns that can be sorted, mapped to the record field they use
const SORTABLE_COLUMNS = {
  date: 'approachDate',
  distance: 'missDistanceAU',
  velocity: 'relativeVelocityKmS'
};

// table state lives here so paging/sorting can re-render without reloading data
const tableState = {
  allRecords: [],
  currentPage: 1,
  sortColumn: null,
  sortDirection: 'asc'
};

function formatStatus(category) {
  if (category === 'historical') return 'Historical';
  if (category === 'future') return 'Upcoming';
  return 'Not available';
}

function buildTableRow(record, recordIndex) {
  return `
    <tr>
      <td>${escapeHtml(record.fullname)}</td>
      <td>${escapeHtml(record.approachDate)}</td>
      <td>${formatDistanceFromAU(record.missDistanceAU)}</td>
      <td>${formatVelocityFromKmPerSecond(record.relativeVelocityKmS)}</td>
      <td>${formatStatus(record.category)}</td>
      <td><button class="view-details-btn" type="button" data-record-index="${recordIndex}" aria-label="View details for ${escapeHtml(record.fullname)}">View details</button></td>
    </tr>
  `;
}

function getSortableValue(record, column) {
  if (column !== 'date') {
    const value = record[SORTABLE_COLUMNS[column]];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  const match = /^(\d{4})-([A-Za-z]{3})-(\d{2})$/.exec(record.approachDate || '');
  if (!match) return null;

  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(match[2]);
  if (month === -1) return null;

  const year = Number(match[1]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month, day);
  const date = new Date(timestamp);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) return null;
  return timestamp;
}

// returns a sorted copy, records with missing values end up at the bottom
function getSortedRecords() {
  const { sortColumn, sortDirection } = tableState;
  if (!sortColumn) return tableState.allRecords;

  return [...tableState.allRecords].sort((a, b) => {
    const valueA = getSortableValue(a, sortColumn);
    const valueB = getSortableValue(b, sortColumn);
    const aMissing = valueA === null;
    const bMissing = valueB === null;

    if (aMissing && bMissing) return 0;
    if (aMissing) return 1;
    if (bMissing) return -1;

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}

function getSortArrow(column) {
  if (tableState.sortColumn !== column) return '';
  return tableState.sortDirection === 'asc' ? ' ▲' : ' ▼';
}

function getSortHeaderClass(column) {
  return tableState.sortColumn === column ? ' sorted' : '';
}

function getSortAriaValue(column) {
  if (tableState.sortColumn !== column) return 'none';
  return tableState.sortDirection === 'asc' ? 'ascending' : 'descending';
}

function handleHeaderClick(column) {
  if (tableState.sortColumn === column) {
    tableState.sortDirection = tableState.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    tableState.sortColumn = column;
    tableState.sortDirection = 'asc';
  }
  tableState.currentPage = 1;
  renderTable();
}

function handlePageChange(newPage) {
  tableState.currentPage = newPage;
  renderTable();
}

function getTotalPages() {
  return Math.max(1, Math.ceil(tableState.allRecords.length / ROWS_PER_PAGE));
}

function buildPaginationControls() {
  const totalPages = getTotalPages();
  const page = tableState.currentPage;

  return `
    <div class="pagination">
      <button id="prev-page-btn" ${page <= 1 ? 'disabled' : ''}>Previous</button>
      <span>Page ${page} of ${totalPages}</span>
      <button id="next-page-btn" ${page >= totalPages ? 'disabled' : ''}>Next</button>
    </div>
  `;
}

function renderTable() {
  const container = document.getElementById('data-table-section');
  const sortedRecords = getSortedRecords();

  if (sortedRecords.length === 0) {
    container.innerHTML = '<p class="table-empty" role="status">No matching close approaches found.</p>';
    return;
  }

  const startIndex = (tableState.currentPage - 1) * ROWS_PER_PAGE;
  const rowsToShow = sortedRecords.slice(startIndex, startIndex + ROWS_PER_PAGE);
  const rowsHtml = rowsToShow.map((record, index) => buildTableRow(record, startIndex + index)).join('');

  container.innerHTML = `
    <p class="table-note">Showing ${startIndex + 1}-${startIndex + rowsToShow.length} of ${sortedRecords.length} close approaches.</p>
    ${buildPaginationControls()}
    <div class="table-wrapper">
      <table class="asteroid-table">
        <caption class="visually-hidden">Close approach records matching the current filters</caption>
        <thead>
          <tr>
            <th scope="col">Asteroid / Object</th>
            <th scope="col" aria-sort="${getSortAriaValue('date')}"><button class="sort-button${getSortHeaderClass('date')}" type="button" data-column="date">Close Approach Date<span aria-hidden="true">${getSortArrow('date')}</span></button></th>
            <th scope="col" aria-sort="${getSortAriaValue('distance')}"><button class="sort-button${getSortHeaderClass('distance')}" type="button" data-column="distance">Miss Distance from Earth<span aria-hidden="true">${getSortArrow('distance')}</span></button></th>
            <th scope="col" aria-sort="${getSortAriaValue('velocity')}"><button class="sort-button${getSortHeaderClass('velocity')}" type="button" data-column="velocity">Speed Relative to Earth<span aria-hidden="true">${getSortArrow('velocity')}</span></button></th>
            <th scope="col">Historical / Upcoming</th>
            <th scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;

  container.querySelectorAll('.sort-button').forEach((button) => {
    button.addEventListener('click', () => handleHeaderClick(button.dataset.column));
  });

  container.querySelectorAll('.view-details-btn').forEach((button) => {
    button.addEventListener('click', () => openAsteroidDetails(sortedRecords[Number(button.dataset.recordIndex)], button));
  });

  const prevBtn = document.getElementById('prev-page-btn');
  const nextBtn = document.getElementById('next-page-btn');
  if (prevBtn) prevBtn.addEventListener('click', () => handlePageChange(tableState.currentPage - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => handlePageChange(tableState.currentPage + 1));
}

function renderAsteroidTable(records) {
  tableState.allRecords = records;
  tableState.currentPage = 1;
  renderTable();
}

function resetTableSorting() {
  tableState.sortColumn = null;
  tableState.sortDirection = 'asc';
  tableState.currentPage = 1;
}
