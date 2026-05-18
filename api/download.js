// api/download.js
export default async function handler(req, res) {
    // பிரவுசர் CORS பிளாக்கிங்கை உடைக்க
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

    // வீடியோவில் சொன்னது போல பேக் எண்ட் டு சர்வர் ரன் ஆகும் 3 பிரீமியம் கேட்வேகள்
    const ytDlpNodes = [
        "https://api.cobalt.tools/api/json",
        "https://co.wuk.sh/api/json",
        "https://api.sand0.dev/alldl?url=" + encodeURIComponent(url)
    ];

    // முதலாவது செக்யூர் நோட் (Cobalt Core)
    try {
        const response = await fetch(ytDlpNodes[0], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ url: url, vQuality: "720", filenamePattern: "classic" })
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.url) return res.status(200).json({ url: data.url });
        }
    } catch (e) {
        console.log("Primary cluster busy, auto-switching...");
    }

    // பேக்கப் நோட் (Sand0 Core)
    try {
        const response = await fetch(`https://api.sand0.dev/alldl?url=${encodeURIComponent(url)}`);
        if (response.ok) {
            const data = await response.json();
            const finalUrl = data.url || data.result?.url;
            if (finalUrl) return res.status(200).json({ url: finalUrl });
        }
    } catch (e) {
        console.error("All backend routing failed.");
    }

    return res.status(500).json({ error: 'Nexora servers are currently busy.' });
}