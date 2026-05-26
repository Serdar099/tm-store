export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-shadow, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const supabaseUrl = 'https://tewshpcmudtkbosuqxry.supabase.co'; 
  // Используем секретный мастер-ключ (service_role) для полного доступа к удалению
  const supabaseMasterKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRld3NocGNtdWR0a2Jvc3VxeHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODEzNDA4MiwiZXhwIjoyMDUzNzEwMDgyfQ.zFv4o-K9Z8f9D5Ew1Cms6w3X_N6U4_9Hj9M4D1TqZ9Y';

  const targetUrl = `${supabaseUrl}/rest/v1/products`;

  // 1. ПОЛУЧЕНИЕ ТОВАРОВ (GET)
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${targetUrl}?order=id.desc`, {
        method: 'GET',
        headers: {
          'apikey': supabaseMasterKey,
          'Authorization': `Bearer ${supabaseMasterKey}`,
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
          'apikey': supabaseMasterKey,
          'Authorization': `Bearer ${supabaseMasterKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ 
          title, 
          price, 
          image, 
          category: category || 'Очки',
          description: description || '' 
        })
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
      const id = req.query.id || req.body.id;
      if (!id) return res.status(400).send('Не указан ID товара');

      const response = await fetch(`${targetUrl}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseMasterKey,
          'Authorization': `Bearer ${supabaseMasterKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return res.status(response.status).send(await response.text());
      }

      return res.status(200).send('Успешно удалено');
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  return res.status(405).send('Метод запрещен');
}
