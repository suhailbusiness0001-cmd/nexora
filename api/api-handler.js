export default async function handler(req, res) {
    // CORS பிழை வராமல் தடுக்க Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'POST method only allowed' });
    }

    const { url } = req.body;

    try {
        // Cobalt-க்கு பதிலாக மாற்று ஓபன் டவுன்லோடு சர்வர் API
        const response = await fetch('https://api.allvideodownloader.cc/api/v1/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        // புது API-யோட டேட்டா ஸ்ட்ரக்சர் படி சரிபார்க்கிறோம்
        if (data && data.success && data.data) {
            return res.status(200).json({
                url: data.data.video_url || data.data.download_url,
                filename: data.data.title || "Video Ready"
            });
        } else {
            return res.status(400).json({ 
                error: data.message || "This platform or link is not supported right now." 
            });
        }

    } catch (error) {
        console.error("Alternative API Error:", error);
        return res.status(500).json({ error: "Downloader server is currently busy. Try again!" });
    }
}