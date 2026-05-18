/ api/download.js
export default async function handler(req, res) {
    // CORS ஹேண்ட்லிங் - பிரவுசர் பிளாக்கிங்கை தடுக்க
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // பேக் எண்டில் பாதுகாப்பாக ரன் ஆகும் 3 பிரதான டவுன்லோடு க்ளஸ்ட்டர்கள்
    const backendClusters = [
        "https://api.cobalt.tools/api/json",
        "https://co.wuk.sh/api/json",
        "https://cobalt.api.unblockit.pro/api/json"
    ];

    for (let node of backendClusters) {
        try {
            // சர்வர் டு சர்வர் (Server to Server) ரெக்வஸ்ட் என்பதால் எந்த CORS கட்டுப்பாடும் சர்வர்கள் விதிக்காது
            const response = await fetch(node, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    url: url,
                    vQuality: "720",
                    filenamePattern: "classic"
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.url) {
                    // லிங்க் கிடைத்துவிட்டால் நேரடியாக பிரவுசருக்கு அனுப்புதல்
                    return res.status(200).json({ url: data.url });
                }
            }
        } catch (error) {
            console.error(`Backend cluster ${node} failed, switching node...`);
        }
    }

    // ஆல்டர்நேட்டிவ் பேக் எண்ட் எமர்ஜென்சி ஏபிஐ லேயர்
    try {
        const altRes = await fetch(`https://api.sand0.dev/alldl?url=${encodeURIComponent(url)}`);
        if (altRes.ok) {
            const altData = await altRes.json();
            const finalUrl = altData.url || altData.result?.url;
            if (finalUrl) {
                return res.status(200).json({ url: finalUrl });
            }
        }
    } catch (e) {
        console.error("Alternative extraction failed too.");
    }

    return res.status(500).json({ error: 'All premium download servers are crowded' });
}