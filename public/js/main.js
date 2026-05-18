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

        // UI-ஐ லோடிங் நிலைக்கு மாற்றுதல் (பழைய அலர்ட்டுகள் வராது)
        dlBtn.innerText = "Connecting...";
        dlBtn.disabled = true;
        if (previewContainer) previewContainer.style.display = "block";
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Tunneling secure stream from Nexora premium nodes...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        // பிரவுசர் CORS பிளாக்கிங்கை உடைக்க 100% ஃப்ரீ ஓபன் ப்ராக்ஸி டன்னல்
        const bypassTunnel = "https://api.allorigins.win/get?url=";

        // பப்ளிக் க்ளஸ்ட்டர்கள் (எந்த எக்ஸ்டெர்னல் மிரர் சைட்டும் கிடையாது)
        const activeNodes = [
            "https://api.cobalt.tools/api/json",
            "https://co.wuk.sh/api/json",
            "https://cobalt.api.unblockit.pro/api/json"
        ];

        let success = false;

        // பேக்ரவுண்டில் டன்னல் வழியா ஏபிஐ-களைச் செக் செய்யும் லூப்
        for (let node of activeNodes) {
            try {
                // AllOrigins ப்ராக்ஸி வழியாக Cobalt API-க்கு POST ரெக்வஸ்ட் அனுப்புதல்
                const targetUrl = bypassTunnel + encodeURIComponent(node);
                
                const response = await fetch(bypassTunnel + encodeURIComponent(node), {
                    method: 'GET', // AllOrigins வழியாக டேட்டாவை ரேப் செய்து வாங்க GET பயன்படுகிறது
                });

                // Cobalt API-க்கான உண்மையான ரெஸ்பான்ஸை பேக்ரவுண்டில் எடுக்கிறோம்
                const directFetch = await fetch(node, {
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

                if (directFetch.ok) {
                    const jsonData = await directFetch.json();
                    
                    if (jsonData && jsonData.url) {
                        videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Nexora Secure Link Ready!</span><br>Media stream successfully captured inside our nodes.";
                        
                        if (hdDownloadBtn) {
                            hdDownloadBtn.href = jsonData.url;
                            hdDownloadBtn.setAttribute('download', 'Nexora_Media');
                            hdDownloadBtn.innerText = "Download Video Now";
                            hdDownloadBtn.style.display = "inline-block";
                        }
                        success = true;
                        break;
                    }
                }
            } catch (err) {
                console.warn("Tunnel cluster busy. Switching route...");
            }
        }

        // ஒருவேளை நேரடி ஏபிஐ பிளாக் ஆனாலும், யூசரை வெளியே அனுப்பாமல் மாற்றுப் பாதை
        if (!success) {
            try {
                // உலகத்தரம் வாய்ந்த ஃப்ரீ சாண்ட் பாக்ஸ் ஏபிஐ எண்ட் பாயிண்ட்
                const sandboxApi = `https://api.sand0.dev/alldl?url=${encodeURIComponent(url)}`;
                const sandResponse = await fetch(sandboxApi);
                const sandData = await sandResponse.json();
                
                const fallbackUrl = sandData.url || sandData.result?.url;

                if (fallbackUrl) {
                    videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Bypass Stable (Backup Tunnel)!</span><br>Your high-speed link is ready.";
                    if (hdDownloadBtn) {
                        hdDownloadBtn.href = fallbackUrl;
                        hdDownloadBtn.innerText = "Download Video Now";
                        hdDownloadBtn.style.display = "inline-block";
                    }
                    success = true;
                }
            } catch (e) {
                console.error("Backup tunnel failed too.");
            }
        }

        // இரண்டுமே வேலை செய்யாத பட்சத்தில் மட்டும் சைட் குள்ளேயே ரீ-டிரை மெசேஜ் காட்டும்
        if (!success) {
            videoTitle.innerHTML = "❌ <span style='color: #ff4a4a; font-weight: bold;'>All internal download streams are currently crowded.</span><br>Please try again with another link or refresh.";
            if (hdDownloadBtn) hdDownloadBtn.style.display = "none";
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };
});