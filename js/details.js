function detailText(value) {
  if (value === null || value === undefined || value === '' || value === 'Not available') return 'Not available';
  if (typeof value === 'number' && !Number.isFinite(value)) return 'Not available';
  return String(value);
}

function setDetailValue(id, value) {
  document.getElementById(id).textContent = detailText(value);
}

const detailDialog = document.getElementById('asteroid-detail-dialog');
let detailReturnFocus = null;

function openAsteroidDetails(record, trigger) {
  if (!record) return;
  detailReturnFocus = trigger || document.activeElement;

  const name = record.fullname !== 'Not available' ? record.fullname : record.designation;
  document.getElementById('detail-name').textContent = detailText(name);
  setDetailValue('detail-designation', record.designation);
  setDetailValue('detail-category', record.category === 'historical' ? 'Historical' : record.category === 'future' ? 'Upcoming' : 'Not available');
  setDetailValue('detail-date', record.approachDate);
  setDetailValue('detail-time', record.approachTime);
  setDetailValue('detail-distance', formatDistanceFromAU(record.missDistanceAU));
  setDetailValue('detail-velocity', formatVelocityFromKmPerSecond(record.relativeVelocityKmS));
  setDetailValue('detail-orbit', record.orbitId);
  setDetailValue('detail-diameter', typeof record.diameterKm === 'number' && Number.isFinite(record.diameterKm)
    ? `${record.diameterKm.toLocaleString('en-US', { maximumFractionDigits: 3 })} km`
    : 'Not available');

  detailDialog.showModal();
}

document.getElementById('close-detail-dialog').addEventListener('click', () => detailDialog.close());
detailDialog.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && detailDialog.open) {
    event.preventDefault();
    detailDialog.close();
  }
});
detailDialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  detailDialog.close();
});
detailDialog.addEventListener('close', () => {
  if (detailReturnFocus && detailReturnFocus.isConnected) detailReturnFocus.focus();
  detailReturnFocus = null;
});
detailDialog.addEventListener('click', (event) => {
  if (event.target === detailDialog) detailDialog.close();
});
