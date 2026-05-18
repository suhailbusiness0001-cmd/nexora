document.addEventListener('DOMContentLoaded', () => {
    const dlBtn = document.getElementById('startDl');
    const input = document.getElementById('videoUrl');
    const previewContainer = document.getElementById('preview-container');
    const videoTitle = document.getElementById('videoTitle');
    const hdDownloadBtn = document.getElementById('hdDownloadBtn');

    if (!dlBtn) return;

    dlBtn.onclick = async () => {
        const url = input.value.trim();
        if (!url) {
            alert("Please paste a valid video link!");
            return;
        }

        // UI-ஐ லோடிங் நிலைக்கு மாற்றுதல் (பழைய அலர்ட்டுகள் வராது)
        dlBtn.innerText = "Connecting...";
        dlBtn.disabled = true;
        
        if (previewContainer) previewContainer.style.display = "block";
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Fetching premium stream links...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        // தற்போது லைவ்வில் இருக்கும் பவர்புல் Cobalt ஏபிஐ க்ளஸ்ட்டர்கள்
        const clusterNodes = [
            'https://cobalt.api.unblockit.pro/api/json',
            'https://co.wuk.sh/api/json',
            'https://api.cobalt.tools/api/json'
        ];

        let success = false;

        // ஒவ்வொரு ஏபிஐ எண்ட்பாயிண்ட்டாக பேக்ரவுண்டில் டெஸ்ட் செய்யும் அலர்ட்-ஃப்ரீ லூப்
        for (let node of clusterNodes) {
            try {
                console.log(`Nexora Shift: Trying cluster -> ${node}`);
                
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

                // பாசிங் எர்ரர்களை (Unexpected token 'A') தடுக்க ரெஸ்பான்ஸை டெக்ஸ்ட்டாக மாற்றுதல்
                const textData = await response.text();
                let jsonData;
                try {
                    jsonData = JSON.parse(textData);
                } catch (e) {
                    continue; // JSON இல்லை என்றால் அடுத்த ஏபிஐ-க்கு மாறு
                }

                if (response.ok && jsonData && jsonData.url) {
                    videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Connection Stable!</span><br>Your high-speed Nexora HD link is ready.";
                    hdDownloadBtn.href = jsonData.url;
                    hdDownloadBtn.innerText = "Download Video Now";
                    hdDownloadBtn.style.display = "inline-block";
                    success = true;
                    break; // லிங்க் கிடைத்துவிட்டால் லூப்பை நிறுத்து
                }
            } catch (err) {
                console.warn(`Node ${node} timed out. Auto-switching stream source...`);
            }
        }

        // ஒருவேளை எல்லா ஏபிஐ-களும் டிராஃபிக்கால் முடங்கினால், இறுதி சேஃப் பைபாஸ் மிரர்
        if (!success) {
            videoTitle.innerHTML = "⚠️ Primary nodes busy.<br>Redirecting to high-speed mirror network:";
            
            // 100% வொர்க்கிங் சேஃப் மிரர் லிங்க்
            const safeFallback = `https://ssstik.io/en`; 
            hdDownloadBtn.href = safeFallback;
            hdDownloadBtn.innerText = "Go to Mirror Download";
            hdDownloadBtn.style.display = "inline-block";
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };
});