export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-shadow, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const supabaseUrl = 'https://tewshpcmudtkbosuqxry.supabase.co'; 
  const supabaseKey = 'sb_publishable_gGTgFBsHSMpPkTqGlBXk8w_bjokjvqq'; 

  const targetUrl = `${supabaseUrl}/rest/v1/products`;

  // 1. ПОЛУЧЕНИЕ ТОВАРОВ (GET)
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${targetUrl}?order=id.desc`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) return res.status(response.status).send(await response.text());
      const data = await response.json();
      return res.status(200).json(data || []);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  // 2. ДОБАВЛЕНИЕ ТОВАРА (POST)
  if (req.method === 'POST') {
    try {
      const { title, price, image, category, description } = req.body;
      if (!title || !price) return res.status(400).send('Название и цена обязательны');

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ 
          title, 
          price, 
          image, 
          category: category || 'Очки',
          description: description || '' 
        } || []);
      });
      if (!response.ok) return res.status(response.status).send(await response.text());
      return res.status(200).send('Успешно добавлено');
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  // 3. УДАЛЕНИЕ ТОВАРА (DELETE)
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).send('Не указан ID товара');

      const response = await fetch(`${targetUrl}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) return res.status(response.status).send(await response.text());
      return res.status(200).send('Успешно удалено');
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  return res.status(405).send('Метод запрещен');
}
