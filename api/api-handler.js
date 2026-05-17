export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST method only' });

    const { url } = req.body;

    // --- INSTANCE 1: AllVideoDownloader API ---
    try {
        console.log("Trying Instance 1...");
        const res1 = await fetch('https://api.allvideodownloader.cc/api/v1/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });
        
        if (res1.ok) {
            const data1 = await res1.json();
            if (data1 && data1.success && data1.data) {
                return res.status(200).json({
                    url: data1.data.video_url || data1.data.download_url,
                    filename: data1.data.title || "Video Ready"
                });
            }
        }
    } catch (e) {
        console.log("Instance 1 failed, moving to Instance 2...");
    }

    // --- INSTANCE 2: Cobalt Tools Premium Mirror ---
    try {
        console.log("Trying Instance 2 (Cobalt Premium Mirror)...");
        const res2 = await fetch('https://cobalt.betatv.ch/api/json', {
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

        if (res2.ok) {
            const data2 = await res2.json();
            if (data2 && (data2.url || data2.stream)) {
                return res.status(200).json({
                    url: data2.url || data2.stream,
                    filename: data2.filename || "Video Ready"
                });
            }
        }
    } catch (e) {
        console.log("Instance 2 failed as well.");
    }

    // ரெண்டுமே வேலை செய்யலைனா மட்டும் தான் இந்த எர்ரர் வரும்
    return res.status(500).json({ 
        error: "All backend clusters are temporarily rate-limited. Please retry in 10 seconds." 
    });
}