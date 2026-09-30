const KILOMETERS_PER_AU = 149597870.7;
const KILOMETERS_PER_MILE = 1.609344;
const KILOMETERS_PER_LUNAR_DISTANCE = 384400;
const MILES_PER_KILOMETER_PER_SECOND = 2236.936;

function formatDistanceFromAU(distanceAU) {
  if (typeof distanceAU !== 'number' || !Number.isFinite(distanceAU)) return 'Not available';

  const kilometers = distanceAU * KILOMETERS_PER_AU;
  const miles = kilometers / KILOMETERS_PER_MILE;
  const lunarDistances = kilometers / KILOMETERS_PER_LUNAR_DISTANCE;
  const distanceOptions = { maximumFractionDigits: kilometers < 1000 ? 2 : 0 };

  return `${kilometers.toLocaleString('en-US', distanceOptions)} km / ${miles.toLocaleString('en-US', { maximumFractionDigits: miles < 1000 ? 2 : 0 })} miles / ${lunarDistances.toLocaleString('en-US', { maximumFractionDigits: 2 })} lunar distances`;
}

function formatVelocityFromKmPerSecond(velocityKmPerSecond) {
  if (typeof velocityKmPerSecond !== 'number' || !Number.isFinite(velocityKmPerSecond)) return 'Not available';

  const milesPerHour = velocityKmPerSecond * MILES_PER_KILOMETER_PER_SECOND;
  return `${velocityKmPerSecond.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km/s / ${milesPerHour.toLocaleString('en-US', { maximumFractionDigits: 0 })} mph`;
}