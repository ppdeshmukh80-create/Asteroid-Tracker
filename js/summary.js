// works out the summary stats shown in the dashboard cards

function findClosestApproach(records) {
  const withDistance = records.filter((r) => typeof r.missDistanceAU === 'number');
  if (withDistance.length === 0) return null;
  return withDistance.reduce(
    (closest, r) => (r.missDistanceAU < closest.missDistanceAU ? r : closest),
    withDistance[0]
  );
}

function findFastestObject(records) {
  const withSpeed = records.filter((r) => typeof r.relativeVelocityKmS === 'number');
  if (withSpeed.length === 0) return null;
  return withSpeed.reduce(
    (fastest, r) => (r.relativeVelocityKmS > fastest.relativeVelocityKmS ? r : fastest),
    withSpeed[0]
  );
}

function buildSummaryStats(records) {
  const historicalCount = records.filter((r) => r.category === 'historical').length;
  const futureCount = records.filter((r) => r.category === 'future').length;
  const closest = findClosestApproach(records);
  const fastest = findFastestObject(records);

  return {
    totalCount: records.length,
    historicalCount,
    futureCount,
    closestName: closest ? closest.fullname : 'Not available',
    closestDistance: closest ? `${closest.missDistanceAU.toFixed(6)} AU` : 'Not available',
    fastestName: fastest ? fastest.fullname : 'Not available',
    fastestSpeed: fastest ? `${fastest.relativeVelocityKmS.toFixed(2)} km/s` : 'Not available'
  };
}

function renderSummaryCards(stats) {
  const container = document.getElementById('summary-cards');

  const cards = [
    { title: 'Total Close Approaches', value: stats.totalCount },
    { title: 'Closest Approach', value: `${stats.closestName} — ${stats.closestDistance}` },
    { title: 'Fastest Object', value: `${stats.fastestName} — ${stats.fastestSpeed}` },
    { title: 'Historical Records', value: stats.historicalCount },
    { title: 'Upcoming Records', value: stats.futureCount }
  ];

  container.innerHTML = cards
    .map((card) => `
      <div class="summary-card">
        <h3>${card.title}</h3>
        <p>${card.value}</p>
      </div>
    `)
    .join('');
}
