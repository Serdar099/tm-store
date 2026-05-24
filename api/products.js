export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const SUPABASE_URL = "https://tewshpcmudtkbosuqxry.supabase.co"; //
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRld3NocGNtdWR0a2Jvc3VxeHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNjY3MzAsImV4cCI6MjA2Mzc0MjczMH0.Sb_publishable_gGTgFBsHSMpPkTqGlBXk8w_bjokjvqq"; //

    try {
        if (req.method === 'GET') {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`, {
                headers: {
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            const data = await response.json();
            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
                method: 'POST',
                headers: {
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                },
                body: JSON.stringify(req.body)
            });
            const data = await response.json();
            return res.status(200).json(data);
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
