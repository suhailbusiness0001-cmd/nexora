export default async function handler(req, res) {
    // CORS அமைப்புகள்
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST method only' });

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        // CLUSTER 1: அதிவேக மல்டி-பிளாட்ஃபார்ம் மீடியா எக்ஸ்ட்ராக்டர் API
        const response = await fetch('https://api.allvideodownloader.cc/api/v1/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        if (response.ok && data && data.success && data.data) {
            return res.status(200).json({
                url: data.data.video_url || data.data.download_url,
                filename: data.data.title || "Nexora_Download"
            });
        }

        // CLUSTER 2 (FALLBACK): ஒருவேளை முதலாவது தவறினால் உடனடியாக இயங்கும் மாற்று எஞ்சின்
        console.log("Cluster 1 bypassed, trying Cluster 2...");
        const response2 = await fetch('https://cobalt.betatv.ch/api/json', {
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

        if (response2.ok) {
            const data2 = await response2.json();
            if (data2 && (data2.url || data2.stream)) {
                return res.status(200).json({
                    url: data2.url || data2.stream,
                    filename: data2.filename || "Nexora_Download"
                });
            }
        }

        return res.status(429).json({ error: "Video platform is currently rate-limiting traffic. Please re-click in 5 seconds." });

    } catch (error) {
        console.error("Master Router Error:", error);
        return res.status(500).json({ error: "Extraction nodes are overloaded. Click download again!" });
    }
}