export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-shadow, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // ТВОИ АБСОЛЮТНО ПРАВИЛЬНЫЕ ДАННЫЕ SUPABASE
  const supabaseUrl = 'https://tewshpcmudtkbosuqxry.supabase.co'; 
  const supabaseKey = 'sb_publishable_gGTgFBsHSMpPkTqGlBXk8w_bjokjvqq'; 

  const targetUrl = `${supabaseUrl}/rest/v1/products`;

  // 1. Получение товаров (GET)
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

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).send(`Ошибка Supabase: ${errText}`);
      }

      const data = await response.json();
      return res.status(200).json(data || []);
    } catch (err) {
      return res.status(500).send(`Ошибка сервера: ${err.message}`);
    }
  }

  // 2. Добавление товара (POST)
  if (req.method === 'POST') {
    try {
      const { title, price, image } = req.body;

      if (!title || !price) {
        return res.status(400).send('Название и цена обязательны');
      }

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ title, price, image })
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).send(`Ошибка Supabase при записи: ${errText}`);
      }

      return res.status(200).send('Успешно добавлено');
    } catch (err) {
      return res.status(500).send(`Ошибка сервера при записи: ${err.message}`);
    }
  }

  return res.status(405).send('Метод запрещен');
}
