const { getSupabase, jsonResponse } = require('./_supabase');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return jsonResponse(200, {});

  try {
    const supabase = getSupabase();

    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase.from('services').select('*').order('position', { ascending: true });
      if (error) throw error;
      return jsonResponse(200, data.map(s => ({ id: s.id, name: s.name, price: Number(s.price) })));
    }

    if (event.httpMethod === 'POST') {
      const services = JSON.parse(event.body);

      const { data: existing, error: fetchErr } = await supabase.from('services').select('id');
      if (fetchErr) throw fetchErr;
      const newIds = services.map(s => s.id);
      const toDelete = existing.filter(e => !newIds.includes(e.id)).map(e => e.id);
      if (toDelete.length > 0) {
        const { error: delErr } = await supabase.from('services').delete().in('id', toDelete);
        if (delErr) throw delErr;
      }

      const rows = services.map((s, idx) => ({ id: s.id, name: s.name, price: s.price, position: idx }));
      const { error } = await supabase.from('services').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
      return jsonResponse(200, { ok: true });
    }

    return jsonResponse(405, { error: 'method_not_allowed' });
  } catch (err) {
    return jsonResponse(500, { error: err.message });
  }
};
