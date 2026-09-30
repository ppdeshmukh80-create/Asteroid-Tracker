// turns raw NASA/JPL record arrays into simpler objects

function getFieldValue(record, fields, fieldName) {
  if (!Array.isArray(record) || !Array.isArray(fields)) return null;
  const index = fields.indexOf(fieldName);
  if (index === -1) return null;
  return record[index];
}

// converts a value to a number, falls back to "Not available" if missing or invalid
function toNumberOrFallback(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return 'Not available';
  if (typeof value === 'string' && value.trim() === '') return 'Not available';
  const num = typeof value === 'string' ? Number(value.trim()) : value;
  return Number.isFinite(num) ? num : 'Not available';
}

function textOrFallback(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : 'Not available';
}

function normalizeApproachDate(value) {
  if (typeof value !== 'string') return { date: 'Not available', time: 'Not available' };

  const match = /^(\d{4})-([A-Za-z]{3})-(\d{2})(?:\s+(\d{2}):(\d{2}))?$/.exec(value.trim());
  if (!match) return { date: 'Not available', time: 'Not available' };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months.indexOf(match[2]);
  if (month === -1) return { date: 'Not available', time: 'Not available' };

  const year = Number(match[1]);
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return { date: 'Not available', time: 'Not available' };
  }

  if (match[4] === undefined) return { date: `${match[1]}-${match[2]}-${match[3]}`, time: 'Not available' };

  const hour = Number(match[4]);
  const minute = Number(match[5]);
  if (hour > 23 || minute > 59) return { date: 'Not available', time: 'Not available' };

  return {
    date: `${match[1]}-${match[2]}-${match[3]}`,
    time: `${match[4]}:${match[5]}`
  };
}

function normalizeRecord(record, fields, category) {
  const des = getFieldValue(record, fields, 'des');
  const fullname = getFieldValue(record, fields, 'fullname');
  const cd = getFieldValue(record, fields, 'cd');
  const orbitId = getFieldValue(record, fields, 'orbit_id');
  const dist = getFieldValue(record, fields, 'dist');
  const vRel = getFieldValue(record, fields, 'v_rel');
  const diameter = getFieldValue(record, fields, 'diameter');

  // the cd field looks like "2016-Aug-23 20:23", split into date and time
  const approach = normalizeApproachDate(cd);
  const designation = textOrFallback(des);

  return {
    designation: designation === 'Not available' ? textOrFallback(fullname) : designation,
    fullname: textOrFallback(fullname) === 'Not available' ? designation : textOrFallback(fullname),
    approachDate: approach.date,
    approachTime: approach.time,
    missDistanceAU: toNumberOrFallback(dist),
    relativeVelocityKmS: toNumberOrFallback(vRel),
    orbitId: textOrFallback(orbitId),
    diameterKm: toNumberOrFallback(diameter),
    category: category === 'historical' || category === 'future' ? category : 'Not available'
  };
}

function normalizeDataset(rawDataset, category) {
  if (!rawDataset || !Array.isArray(rawDataset.fields) || !Array.isArray(rawDataset.data)) return [];
  return rawDataset.data
    .filter((record) => Array.isArray(record))
    .map((record) => normalizeRecord(record, rawDataset.fields, category));
}
