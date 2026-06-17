const { getSupabase, jsonResponse } = require('./_supabase');

function rowsToHours(rows) {
  const h = {};
  rows.forEach(r => {
    h[r.dow] = {
      open: r.open,
      morning: [r.morning_start || '', r.morning_end || ''],
      afternoon: [r.afternoon_start || '', r.afternoon_end || '']
    };
  });
  return h;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return jsonResponse(200, {});

  try {
    const supabase = getSupabase();

    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase.from('hours').select('*').order('dow', { ascending: true });
      if (error) throw error;
      return jsonResponse(200, rowsToHours(data));
    }

    if (event.httpMethod === 'POST') {
      const hours = JSON.parse(event.body);
      const rows = Object.keys(hours).map(dow => ({
        dow: Number(dow),
        open: hours[dow].open,
        morning_start: hours[dow].morning[0] || null,
        morning_end: hours[dow].morning[1] || null,
        afternoon_start: hours[dow].afternoon[0] || null,
        afternoon_end: hours[dow].afternoon[1] || null
      }));
      const { error } = await supabase.from('hours').upsert(rows, { onConflict: 'dow' });
      if (error) throw error;
      return jsonResponse(200, { ok: true });
    }

    return jsonResponse(405, { error: 'method_not_allowed' });
  } catch (err) {
    return jsonResponse(500, { error: err.message });
  }
};
