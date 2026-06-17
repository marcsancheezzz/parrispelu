const { jsonResponse } = require('./_supabase');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return jsonResponse(200, {});
  if (event.httpMethod !== 'POST') return jsonResponse(405, { error: 'method_not_allowed' });

  try {
    const { password } = JSON.parse(event.body);
    const correct = process.env.ADMIN_PASSWORD;
    if (!correct) {
      return jsonResponse(500, { error: 'ADMIN_PASSWORD no configurada a Netlify' });
    }
    if (password === correct) {
      return jsonResponse(200, { ok: true, token: process.env.ADMIN_TOKEN || 'roger-admin-ok' });
    }
    return jsonResponse(401, { ok: false });
  } catch (err) {
    return jsonResponse(500, { error: err.message });
  }
};
