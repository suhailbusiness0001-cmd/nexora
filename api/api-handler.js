export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST method only' });

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        // நேரடி மெயின் Cobalt எஞ்சின் API
        const response = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Origin': 'https://cobalt.tools',
                'Referer': 'https://cobalt.tools/'
            },
            body: JSON.stringify({
                url: url,
                vQuality: '720',
                filenameStyle: 'basic'
            })
        });

        const data = await response.json();

        if (response.ok && data && (data.url || data.stream)) {
            return res.status(200).json({
                url: data.url || data.stream,
                filename: data.filename || "Video Ready"
            });
        } else {
            return res.status(429).json({ error: data.text || "All backend clusters are temporarily busy. Try again!" });
        }

    } catch (error) {
        console.error("Master Backend Fail:", error);
        return res.status(500).json({ error: "Server connection timed out. Retry now!" });
    }
}