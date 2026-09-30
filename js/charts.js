// renders the closest approaches chart from the current filtered records

let closestApproachesChart = null;
let fastestObjectsChart = null;
let approachesOverTimeChart = null;

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
  const distances = closestRecords.map((record) => record.missDistanceAU * KILOMETERS_PER_AU);

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.x.toLocaleString('en-US', { maximumFractionDigits: 0 })} km`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Distance from Earth (km)', color: '#c9d1f0' },
        ticks: {
          color: '#9aa4c0',
          callback: (value) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 })
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
        label: 'Distance from Earth (km)',
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
        title: { display: true, text: 'Speed relative to Earth (km/s)', color: '#c9d1f0' },
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
        label: 'Speed relative to Earth (km/s)',
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

function showTimelineChartMessage(message) {
  const canvas = document.getElementById('approaches-over-time-chart');
  const emptyMessage = document.getElementById('timeline-chart-empty');

  if (approachesOverTimeChart) {
    approachesOverTimeChart.destroy();
    approachesOverTimeChart = null;
  }

  canvas.hidden = true;
  emptyMessage.textContent = message;
  emptyMessage.hidden = false;
}

function renderApproachesOverTimeChart(records) {
  const canvas = document.getElementById('approaches-over-time-chart');
  const emptyMessage = document.getElementById('timeline-chart-empty');

  if (typeof Chart === 'undefined') {
    showTimelineChartMessage('The chart could not be loaded.');
    return;
  }

  const dates = records.map(getRecordDate).filter((date) => date !== null);
  if (dates.length === 0) {
    showTimelineChartMessage('No close approaches with valid dates match the current filters.');
    return;
  }

  const earliest = new Date(Math.min(...dates));
  const latest = new Date(Math.max(...dates));
  const monthSpan = (latest.getFullYear() - earliest.getFullYear()) * 12
    + latest.getMonth() - earliest.getMonth() + 1;
  const groupByMonth = monthSpan <= 24;
  const countsByPeriod = new Map();

  dates.forEach((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const key = groupByMonth ? `${year}-${month}` : String(year);
    countsByPeriod.set(key, (countsByPeriod.get(key) || 0) + 1);
  });

  const labels = [];
  const counts = [];

  if (groupByMonth) {
    const period = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    const lastPeriod = new Date(latest.getFullYear(), latest.getMonth(), 1);
    while (period <= lastPeriod) {
      const year = period.getFullYear();
      const month = String(period.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`;
      labels.push(period.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      counts.push(countsByPeriod.get(key) || 0);
      period.setMonth(period.getMonth() + 1);
    }
  } else {
    for (let year = earliest.getFullYear(); year <= latest.getFullYear(); year += 1) {
      const key = String(year);
      labels.push(key);
      counts.push(countsByPeriod.get(key) || 0);
    }
  }

  canvas.hidden = false;
  emptyMessage.hidden = true;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y.toLocaleString('en-US')} close approaches`
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: groupByMonth ? 'Month' : 'Year', color: '#c9d1f0' },
        ticks: { color: '#9aa4c0', maxRotation: 0, autoSkip: true },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Close approaches', color: '#c9d1f0' },
        ticks: { color: '#9aa4c0', precision: 0 },
        grid: { color: 'rgba(154, 164, 192, 0.15)' }
      }
    }
  };

  if (approachesOverTimeChart) {
    approachesOverTimeChart.data.labels = labels;
    approachesOverTimeChart.data.datasets[0].data = counts;
    approachesOverTimeChart.options = chartOptions;
    approachesOverTimeChart.update();
    return;
  }

  approachesOverTimeChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Close approaches',
        data: counts,
        backgroundColor: '#8a9bed',
        borderColor: '#b4c0ff',
        borderWidth: 1,
        borderRadius: 3
      }]
    },
    options: chartOptions
  });
}
