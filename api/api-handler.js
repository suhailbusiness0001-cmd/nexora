export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST method only' });

    const { url } = req.body;

    try {
        // மிகவும் ஸ்ட்ராங்கான ஒரு Cobalt Premium Mirror API
        const response = await fetch('https://cobalt.betatv.ch/api/json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
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
            return res.status(400).json({ 
                error: data.text || data.error || "This specific video cannot be extracted right now." 
            });
        }
    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: "Downloader engine is busy. Retry in 5 seconds!" });
    }
}