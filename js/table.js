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

// adds commas to large numbers, e.g. 12345 -> 12,345
function formatNumber(value, decimals) {
  if (typeof value !== 'number') return 'Not available';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function formatDistance(value) {
  if (typeof value !== 'number') return 'Not available';
  return `${formatNumber(value, 6)} AU`;
}

function formatVelocity(value) {
  if (typeof value !== 'number') return 'Not available';
  return `${formatNumber(value, 2)} km/s`;
}

function formatStatus(category) {
  return category === 'historical' ? 'Historical' : 'Upcoming';
}

function buildTableRow(record) {
  return `
    <tr>
      <td>${record.fullname}</td>
      <td>${record.approachDate}</td>
      <td>${formatDistance(record.missDistanceAU)}</td>
      <td>${formatVelocity(record.relativeVelocityKmS)}</td>
      <td>${formatStatus(record.category)}</td>
    </tr>
  `;
}

// returns a sorted copy, records with missing values end up at the bottom
function getSortedRecords() {
  const { sortColumn, sortDirection } = tableState;
  if (!sortColumn) return tableState.allRecords;

  const field = SORTABLE_COLUMNS[sortColumn];
  return [...tableState.allRecords].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];
    const aMissing = typeof valueA !== 'number' && typeof valueA !== 'string';
    const bMissing = typeof valueB !== 'number' && typeof valueB !== 'string';

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

  const startIndex = (tableState.currentPage - 1) * ROWS_PER_PAGE;
  const rowsToShow = sortedRecords.slice(startIndex, startIndex + ROWS_PER_PAGE);
  const rowsHtml = rowsToShow.map(buildTableRow).join('');

  container.innerHTML = `
    <p class="table-note">Showing ${startIndex + 1}-${startIndex + rowsToShow.length} of ${sortedRecords.length} close approaches.</p>
    ${buildPaginationControls()}
    <div class="table-wrapper">
      <table class="asteroid-table">
        <thead>
          <tr>
            <th>Asteroid / Object</th>
            <th class="sortable" data-column="date">Close Approach Date${getSortArrow('date')}</th>
            <th class="sortable" data-column="distance">Miss Distance${getSortArrow('distance')}</th>
            <th class="sortable" data-column="velocity">Relative Velocity${getSortArrow('velocity')}</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;

  container.querySelectorAll('.sortable').forEach((header) => {
    header.addEventListener('click', () => handleHeaderClick(header.dataset.column));
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
