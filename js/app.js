async function loadDataset(loader, fileName, category) {
  try {
    const dataset = await loader();
    if (!dataset || !Array.isArray(dataset.fields) || !Array.isArray(dataset.data)) {
      throw new Error('unexpected JSON structure');
    }

    const hasDate = dataset.fields.includes('cd');
    const hasDistance = dataset.fields.includes('dist');
    const hasVelocity = dataset.fields.includes('v_rel');
    const hasName = dataset.fields.includes('des') || dataset.fields.includes('fullname');
    if (!hasDate || !hasDistance || !hasVelocity || !hasName) {
      throw new Error('expected close approach fields are missing');
    }

    const records = normalizeDataset(dataset, category);
    if (dataset.data.length > 0 && records.length === 0) {
      throw new Error('no valid record arrays found');
    }

    const skippedRows = dataset.data.length - records.length;
    const warning = skippedRows > 0 ? `${skippedRows} invalid record rows were skipped from ${fileName}.` : null;
    if (warning) console.warn(warning);
    return { records, error: null, warning };
  } catch (error) {
    console.error(`Could not load ${fileName}: ${error.message}`);
    return { records: [], error: fileName, warning: null };
  }
}

function showDataLoadNotice(failedFiles, warnings) {
  const message = document.getElementById('data-load-error');
  const messages = [];
  if (failedFiles.length === 2) {
    messages.push('Neither local dataset could be loaded. Check the JSON files and reload the page.');
  } else if (failedFiles.length === 1) {
    messages.push(`Could not load ${failedFiles[0]}. Showing the available dataset only.`);
  }
  messages.push(...warnings);
  message.textContent = messages.join(' ');
  message.hidden = messages.length === 0;
}

async function init() {
  const [historicalResult, futureResult] = await Promise.all([
    loadDataset(loadHistoricalData, 'historicaldata.json', 'historical'),
    loadDataset(loadFutureData, 'futuredata.json', 'future')
  ]);
  const normalizedHistorical = historicalResult.records;
  const normalizedFuture = futureResult.records;
  const failedFiles = [historicalResult.error, futureResult.error].filter(Boolean);

  const warnings = [historicalResult.warning, futureResult.warning].filter(Boolean);
  showDataLoadNotice(failedFiles, warnings);
  console.log(`historical records loaded: ${normalizedHistorical.length}`);
  console.log(`future records loaded: ${normalizedFuture.length}`);
  console.log(`total records loaded: ${normalizedHistorical.length + normalizedFuture.length}`);

  const allRecords = normalizedHistorical.concat(normalizedFuture);
  renderDataCoverageNote(allRecords);
  renderDatasetCoverage(normalizedHistorical, normalizedFuture);
  initFilters(allRecords);
}

init();
