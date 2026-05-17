export default async function handler(req, res) {
   export default async function handler(req, res) {
    // CORS கொள்கைகளுக்கான பாதுகாப்பு அமைப்புகள்
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST method only' });

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        // CLUSTER 1: அதிவேக மல்டி-பிளாட்ஃபார்ம் நோ-பிளாக் வீடியோ பாரஸர் API
        const response = await fetch('https://api.download.savetube.me/v1/twitt/video-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            body: JSON.stringify({ url: url })
        }).catch(() => null);

        if (response && response.ok) {
            const data = await response.json();
            if (data && data.url) {
                return res.status(200).json({
                    url: data.url,
                    filename: data.title || "Nexora_Download"
                });
            }
        }

        // CLUSTER 2 (FALLBACK): 1வது வேலை செய்யாவிட்டால் உடனடியாக இயங்கும் மாற்று எஞ்சின் (AIO Core)
        console.log("Cluster 1 failed, routing traffic to Backup Cluster 2...");
        const response2 = await fetch('https://sub.shakedown.online/api/index', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        }).catch(() => null);

        if (response2 && response2.ok) {
            const data2 = await response2.json();
            if (data2 && data2.url) {
                return res.status(200).json({
                    url: data2.url,
                    filename: data2.title || "Nexora_Ready"
                });
            }
        }

        return res.status(429).json({ error: "All engine clusters are temporarily busy. Click download again!" });

    } catch (error) {
        console.error("Master Core Router Crash:", error);
        return res.status(500).json({ error: "Network sync timeout. Click download button again!" });
    }
}