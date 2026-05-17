export default async function handler(req, res) {
    // CORS கொள்கைகளுக்கான பாதுகாப்பு அமைப்புகள்
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST method only' });

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        // நேரடி மெயின் Cobalt எஞ்சின் API
        const response = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Origin': 'https://cobalt.tools',
                'Referer': 'https://cobalt.tools/',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            body: JSON.stringify({
                url: url,
                vQuality: 'max',          // அதிகபட்ச குவாலிட்டி
                vCodec: 'h264',           // உலகளாவிய வீடியோ வடிவம்
                filenameStyle: 'classic',
                isAudioOnly: false
            })
        });

        // ஒருவேளை Cobalt சர்வர் தடுத்தால் மாற்று வழிக்கு மாற (Fallback)
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Primary Engine Rate-Limited:", errorText);
            
            // FALLBACK: மாற்று கிரிஸ்டல் கிளியர் ஓபன் API
            const fallbackResponse = await fetch(`https://api.vxtwitter.com/api/combine`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url })
            }).catch(() => null);

            if (fallbackResponse && fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                if (fallbackData && fallbackData.video_url) {
                    return res.status(200).json({
                        url: fallbackData.video_url,
                        filename: "Nexora_Download"
                    });
                }
            }
            
            return res.status(429).json({ error: "API engine is currently overloaded. Please re-click in a few seconds!" });
        }

        const data = await response.json();

        // Cobalt தரும் வெவ்வேறு ரெஸ்பான்ஸ் வடிவங்களை கையாளுதல் (picker, stream, url)
        if (data && (data.url || data.stream)) {
            return res.status(200).json({
                url: data.url || data.stream,
                filename: data.filename || "Nexora_Video"
            });
        } else if (data && data.picker) {
            // சில சமயம் பல லிங்க்குகள் வந்தால் முதல் லிங்க்கை எடுக்க
            return res.status(200).json({
                url: data.picker[0].url,
                filename: "Nexora_Video"
            });
        } else {
            return res.status(400).json({ error: "Video processing failed. Try another link!" });
        }

    } catch (error) {
        console.error("Master Backend Fail:", error);
        return res.status(500).json({ error: "Server connection timed out. Retry now!" });
    }
}