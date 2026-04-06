const VERCEL_API = 'https://perfume-ten-snowy.vercel.app/api/admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, ...body } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Admin password is required' });
  }

  try {
    const response = await fetch(VERCEL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ password, ...body }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Admin proxy error:', err);
    return res.status(502).json({
      error: 'Failed to reach the admin API. Check your network connection.',
      details: err.message,
    });
  }
}
