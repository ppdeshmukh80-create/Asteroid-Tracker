function detailText(value) {
  if (value === null || value === undefined || value === '' || value === 'Not available') return 'Not available';
  if (typeof value === 'number' && !Number.isFinite(value)) return 'Not available';
  return String(value);
}

function setDetailValue(id, value) {
  document.getElementById(id).textContent = detailText(value);
}

function openAsteroidDetails(record) {
  if (!record) return;

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

  document.getElementById('asteroid-detail-dialog').showModal();
}

const detailDialog = document.getElementById('asteroid-detail-dialog');
document.getElementById('close-detail-dialog').addEventListener('click', () => detailDialog.close());
detailDialog.addEventListener('click', (event) => {
  if (event.target === detailDialog) detailDialog.close();
});
