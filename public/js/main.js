document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Theme Logic ---
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;
    const icon = themeBtn ? themeBtn.querySelector('i') : null;

    if (localStorage.getItem('nexora-theme') === 'light') {
        body.classList.add('light-theme');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            const isLight = body.classList.contains('light-theme');
            if (icon) icon.classList.replace(isLight ? 'fa-moon' : 'fa-sun', isLight ? 'fa-sun' : 'fa-moon');
            localStorage.setItem('nexora-theme', isLight ? 'light' : 'dark');
        });
    }

    // --- 2. Download Logic ---
   document.addEventListener('DOMContentLoaded', () => {
    const dlBtn = document.getElementById('startDl');
    const input = document.getElementById('videoUrl');
    const previewContainer = document.getElementById('preview-container');
    const videoTitle = document.getElementById('videoTitle');
    const hdDownloadBtn = document.getElementById('hdDownloadBtn');

    if (!dlBtn || !input) return;

    dlBtn.onclick = async () => {
        const url = input.value.trim();
        if (!url) {
            alert("Please paste a valid video link!");
            return;
        }

        // UI-ஐ லோடிங் நிலைக்கு மாற்றுதல் (பழைய பாப்-அப் அலர்ட்டுகள் வராது)
        dlBtn.innerText = "Connecting...";
        dlBtn.disabled = true;
        if (previewContainer) previewContainer.style.display = "block";
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Extracting high-speed media stream from Nexora nodes...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        // மார்க்கெட்டில் 100% உடைந்த ஐகான் இல்லாமல் இயங்கும் டாப் 3 API-கள்
        const directApis = [
            `https://api.sand0.dev/alldl?url=${encodeURIComponent(url)}`,
            `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
            `https://scrappy-download-api.vercel.app/api/download?url=${encodeURIComponent(url)}`
        ];

        let downloadLinkFound = false;

        // ஒவ்வொரு ஏபிஐ எண்ட்பாயிண்ட்டாக பேக்ரவுண்டில் டெஸ்ட் செய்யும் அலர்ட்-ஃப்ரீ லூப்
        for (let apiEndpoint of directApis) {
            try {
                console.log(`Nexora Node Switch: Requesting -> ${apiEndpoint}`);
                
                const response = await fetch(apiEndpoint, { method: 'GET' });
                if (!response.ok) continue;

                const data = await response.json();
                
                // வெவ்வேறு ஏபிஐ-களில் இருந்து வரும் டவுன்লোடு கீகளை (Keys) மேப் செய்தல்
                const rawUrl = data.url || data.result?.url || data.result?.video?.noWatermark || data.download || data.link;

                if (rawUrl) {
                    videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Premium Connection Stable!</span><br>Your high-speed Nexora link is generated successfully.";
                    
                    if (hdDownloadBtn) {
                        hdDownloadBtn.href = rawUrl;
                        hdDownloadBtn.setAttribute('download', 'Nexora_Media');
                        hdDownloadBtn.innerText = "Download Video Now";
                        hdDownloadBtn.style.display = "inline-block";
                    }
                    downloadLinkFound = true;
                    break; // லிங்க் கிடைத்துவிட்டால் லூப்பை நிறுத்து
                }
            } catch (err) {
                console.warn("Current Nexora route congested. Auto-switching channel...");
            }
        }

        // ஒருவேளை எல்லா ஏபிஐ-களும் முடங்கினால், யூசரை வெளியே அனுப்பாமல் அங்கேயே ரீ-டிரை மெசேஜ் காட்டுதல்
        if (!downloadLinkFound) {
            videoTitle.innerHTML = "❌ <span style='color: #ff4a4a; font-weight: bold;'>All internal stream tunnels are currently full.</span><br>Please refresh or try again with a different link.";
            if (hdDownloadBtn) hdDownloadBtn.style.display = "none";
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };
});
});