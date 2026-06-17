const { getSupabase, jsonResponse } = require('./_supabase');

function rowToBooking(r) {
  return {
    id: r.id,
    date: r.date,
    time: r.time,
    name: r.name,
    phone: r.phone,
    serviceId: r.service_id,
    serviceName: r.service_name,
    payMethod: r.pay_method,
    paid: r.paid,
    price: Number(r.price),
    status: r.status,
    createdAt: Number(r.created_at),
    createdLabel: r.created_label,
    paidAt: r.paid_at ? Number(r.paid_at) : null,
    paidLabel: r.paid_label || null
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return jsonResponse(200, {});

  try {
    const supabase = getSupabase();

    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase.from('bookings').select('*').order('date', { ascending: true }).order('time', { ascending: true });
      if (error) throw error;
      return jsonResponse(200, data.map(rowToBooking));
    }

    if (event.httpMethod === 'POST') {
      const b = JSON.parse(event.body);
      const row = {
        id: b.id,
        date: b.date,
        time: b.time,
        name: b.name,
        phone: b.phone,
        service_id: b.serviceId,
        service_name: b.serviceName,
        pay_method: b.payMethod,
        paid: b.paid || false,
        price: b.price,
        status: b.status || 'confirmed',
        created_at: b.createdAt,
        created_label: b.createdLabel
      };

      // Comprovació anti-col·lisió: que ningú més hagi agafat ja aquesta hora
      const { data: existing, error: checkErr } = await supabase
        .from('bookings')
        .select('id')
        .eq('date', row.date)
        .eq('time', row.time)
        .neq('status', 'cancelled');
      if (checkErr) throw checkErr;
      if (existing && existing.length > 0) {
        return jsonResponse(409, { error: 'slot_taken' });
      }

      const { data, error } = await supabase.from('bookings').insert(row).select().single();
      if (error) throw error;
      return jsonResponse(201, rowToBooking(data));
    }

    if (event.httpMethod === 'PATCH') {
      const b = JSON.parse(event.body);
      const updates = {};
      if (typeof b.paid === 'boolean') {
        updates.paid = b.paid;
        if (b.paid) {
          updates.paid_at = Date.now();
          updates.paid_label = b.paidLabel || null;
        }
      }
      if (b.status) updates.status = b.status;

      const { data, error } = await supabase.from('bookings').update(updates).eq('id', b.id).select().single();
      if (error) throw error;
      return jsonResponse(200, rowToBooking(data));
    }

    return jsonResponse(405, { error: 'method_not_allowed' });
  } catch (err) {
    return jsonResponse(500, { error: err.message });
  }
};
