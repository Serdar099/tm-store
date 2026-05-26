import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Настройка заголовков, чтобы избежать проблем со старым кэшем в браузерах
  res.setHeader('Cache-Control', 'no-shadow, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Получение списка товаров (GET-запрос)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        return res.status(400).json([]);
      }
      
      // Если данных нет, принудительно возвращаем пустой массив [], чтобы код на сайте не ломался
      return res.status(200).json(data || []);
    } catch (err) {
      return res.status(500).json([]);
    }
  }

  // Добавление нового товара (POST-запрос)
  if (req.method === 'POST') {
    try {
      const { title, price, image } = req.body;

      if (!title || !price) {
        return res.status(400).send('Название и цена обязательны');
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ title, price, image }]);

      if (error) {
        return res.status(400).send(error.message);
      }

      return res.status(200).send('Успешно добавлено');
    } catch (err) {
      return res.status(500).send('Внутренняя ошибка сервера');
    }
  }

  return res.status(405).send('Метод не поддерживается');
}
