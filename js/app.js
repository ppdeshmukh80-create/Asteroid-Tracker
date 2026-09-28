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
  } catch (error) {
    console.error('problem loading NASA data:', error.message);
  }
}

init();
