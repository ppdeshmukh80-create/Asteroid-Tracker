// entry point, loads both datasets and logs record counts

async function init() {
  try {
    const historical = await loadHistoricalData();
    const future = await loadFutureData();

    const historicalCount = historical.data.length;
    const futureCount = future.data.length;
    const totalCount = historicalCount + futureCount;

    console.log(`historical records loaded: ${historicalCount}`);
    console.log(`future records loaded: ${futureCount}`);
    console.log(`total records loaded: ${totalCount}`);

    const normalizedHistorical = normalizeDataset(historical, 'historical');
    const normalizedFuture = normalizeDataset(future, 'future');

    console.log(`normalized historical records: ${normalizedHistorical.length}`);
    console.log(`normalized future records: ${normalizedFuture.length}`);
    console.log(`total normalized records: ${normalizedHistorical.length + normalizedFuture.length}`);
    console.log('sample normalized historical record:', normalizedHistorical[0]);
    console.log('sample normalized future record:', normalizedFuture[0]);

    const allRecords = normalizedHistorical.concat(normalizedFuture);
    renderDataCoverageNote(allRecords);
    initFilters(allRecords);
  } catch (error) {
    console.error('problem loading NASA data:', error.message);

  }
}

init();
