// renders the closest approaches chart from the current filtered records

let closestApproachesChart = null;
let fastestObjectsChart = null;

function showClosestChartMessage(message) {
  const canvas = document.getElementById('closest-approaches-chart');
  const emptyMessage = document.getElementById('closest-chart-empty');

  if (closestApproachesChart) {
    closestApproachesChart.destroy();
    closestApproachesChart = null;
  }

  canvas.hidden = true;
  emptyMessage.textContent = message;
  emptyMessage.hidden = false;
}

function renderClosestApproachesChart(records) {
  const canvas = document.getElementById('closest-approaches-chart');
  const emptyMessage = document.getElementById('closest-chart-empty');

  if (typeof Chart === 'undefined') {
    showClosestChartMessage('The chart could not be loaded.');
    return;
  }

  const closestRecords = records
    .filter((record) => typeof record.missDistanceAU === 'number' && Number.isFinite(record.missDistanceAU))
    .sort((first, second) => first.missDistanceAU - second.missDistanceAU)
    .slice(0, 10);

  if (closestRecords.length === 0) {
    showClosestChartMessage('No close approaches with distance data match the current filters.');
    return;
  }

  canvas.hidden = false;
  emptyMessage.hidden = true;

  const labels = closestRecords.map((record) => {
    if (typeof record.fullname === 'string' && record.fullname !== 'Not available') return record.fullname;
    return record.designation || 'Not available';
  });
  const distances = closestRecords.map((record) => record.missDistanceAU);

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.x.toLocaleString('en-US', { maximumFractionDigits: 6 })} AU`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Miss distance (AU)', color: '#c9d1f0' },
        ticks: {
          color: '#9aa4c0',
          callback: (value) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 6 })
        },
        grid: { color: 'rgba(154, 164, 192, 0.15)' }
      },
      y: {
        ticks: { color: '#c9d1f0' },
        grid: { display: false }
      }
    }
  };

  if (closestApproachesChart) {
    closestApproachesChart.data.labels = labels;
    closestApproachesChart.data.datasets[0].data = distances;
    closestApproachesChart.update();
    return;
  }

  closestApproachesChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Miss distance (AU)',
        data: distances,
        backgroundColor: '#54c7bb',
        borderColor: '#7be1d6',
        borderWidth: 1,
        borderRadius: 3
      }]
    },
    options: chartOptions
  });
}

function showFastestChartMessage(message) {
  const canvas = document.getElementById('fastest-objects-chart');
  const emptyMessage = document.getElementById('fastest-chart-empty');

  if (fastestObjectsChart) {
    fastestObjectsChart.destroy();
    fastestObjectsChart = null;
  }

  canvas.hidden = true;
  emptyMessage.textContent = message;
  emptyMessage.hidden = false;
}

function renderFastestObjectsChart(records) {
  const canvas = document.getElementById('fastest-objects-chart');
  const emptyMessage = document.getElementById('fastest-chart-empty');

  if (typeof Chart === 'undefined') {
    showFastestChartMessage('The chart could not be loaded.');
    return;
  }

  const fastestRecords = records
    .filter((record) => typeof record.relativeVelocityKmS === 'number' && Number.isFinite(record.relativeVelocityKmS))
    .sort((first, second) => second.relativeVelocityKmS - first.relativeVelocityKmS)
    .slice(0, 10);

  if (fastestRecords.length === 0) {
    showFastestChartMessage('No close approaches with velocity data match the current filters.');
    return;
  }

  canvas.hidden = false;
  emptyMessage.hidden = true;

  const labels = fastestRecords.map((record) => {
    if (typeof record.fullname === 'string' && record.fullname !== 'Not available') return record.fullname;
    return record.designation || 'Not available';
  });
  const velocities = fastestRecords.map((record) => record.relativeVelocityKmS);

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km/s`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Relative velocity (km/s)', color: '#c9d1f0' },
        ticks: {
          color: '#9aa4c0',
          callback: (value) => `${Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 })} km/s`
        },
        grid: { color: 'rgba(154, 164, 192, 0.15)' }
      },
      y: {
        ticks: { color: '#c9d1f0' },
        grid: { display: false }
      }
    }
  };

  if (fastestObjectsChart) {
    fastestObjectsChart.data.labels = labels;
    fastestObjectsChart.data.datasets[0].data = velocities;
    fastestObjectsChart.update();
    return;
  }

  fastestObjectsChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Relative velocity (km/s)',
        data: velocities,
        backgroundColor: '#e79b5a',
        borderColor: '#ffc58d',
        borderWidth: 1,
        borderRadius: 3
      }]
    },
    options: chartOptions
  });
}
