// functions for loading the local NASA/JPL JSON files

async function loadJsonFile(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`could not load ${path} (status ${response.status})`);
  }
  return response.json();
}

async function loadHistoricalData() {
  return loadJsonFile('historicaldata.json');
}

async function loadFutureData() {
  return loadJsonFile('futuredata.json');
}




