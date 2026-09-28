// turns raw NASA/JPL record arrays into simpler objects

function getFieldValue(record, fields, fieldName) {
  const index = fields.indexOf(fieldName);
  if (index === -1) return null;
  return record[index];
}

// converts a value to a number, falls back to "Not available" if missing or invalid
function toNumberOrFallback(value) {
  if (value === null || value === undefined || value === '') return 'Not available';
  const num = Number(value);
  return isNaN(num) ? 'Not available' : num;
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
  const [approachDate, approachTime] = cd ? cd.split(' ') : [null, null];

  return {
    designation: des || 'Not available',
    fullname: fullname ? fullname.trim() : 'Not available',
    approachDate: approachDate || 'Not available',
    approachTime: approachTime || 'Not available',
    missDistanceAU: toNumberOrFallback(dist),
    relativeVelocityKmS: toNumberOrFallback(vRel),
    orbitId: orbitId || 'Not available',
    diameterKm: toNumberOrFallback(diameter),
    category
  };
}

function normalizeDataset(rawDataset, category) {
  const fields = rawDataset.fields;
  return rawDataset.data.map((record) => normalizeRecord(record, fields, category));
}
