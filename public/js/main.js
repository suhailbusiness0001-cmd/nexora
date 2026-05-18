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

        // UI லோடிங் நிலை - எக்ஸ்டெர்னல் அலர்ட்டுகள் வராது
        dlBtn.innerText = "Connecting...";
        dlBtn.disabled = true;
        if (previewContainer) previewContainer.style.display = "block";
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Accessing ultra-speed download nodes...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        // பிரவுசர் CORS பிளாக்கிங்கை உடைக்கும் ப்ராக்ஸி டன்னல்
        const proxyGateway = "https://corsproxy.io/?";

        // உலகளவில் தற்போது மிக வேகமாக இயங்கும் 4 பிரதான Cobalt API க்ளஸ்ட்டர்கள்
        const highSpeedClusters = [
            "https://api.cobalt.tools/api/json",
            "https://co.wuk.sh/api/json",
            "https://cobalt.api.unblockit.pro/api/json",
            "https://cobalt.moe/api/json"
        ];

        let downloadLinkFound = false;

        // பேக்ரவுண்டில் 4 சர்வர்களையும் ஒவ்வொன்றாக செக் செய்யும் அதிவேக லூப்
        for (let apiNode of highSpeedClusters) {
            try {
                const targetUrl = proxyGateway + encodeURIComponent(apiNode);
                console.log(`Nexora Node Switch: Requesting -> ${apiNode}`);

                const response = await fetch(targetUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        url: url,
                        vQuality: "720",
                        filenamePattern: "classic",
                        isAudioOnly: false
                    })
                });

                const textData = await response.text();
                
                // ரெஸ்பான்ஸ் சரியான JSON தானா என்பதை உறுதிப்படுத்துதல்
                if (!textData.trim().startsWith('{')) continue;

                const jsonData = JSON.parse(textData);

                if (response.ok && jsonData && jsonData.url) {
                    // 100% நம்ம வெப்சைட்டிற்குள்ளேயே லிங்க் உருவாக்கப்படுகிறது!
                    videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Nexora Secure Link Ready!</span><br>High-speed media stream successfully grabbed.";
                    
                    if (hdDownloadBtn) {
                        hdDownloadBtn.href = jsonData.url;
                        // டவுன்லோட் ஆகும் ஃபைல் பிரவுசரிலேயே சேவ் ஆக 'download' ஆட்ரிபியூட் சேர்த்தல்
                        hdDownloadBtn.setAttribute('download', 'Nexora_Download');
                        hdDownloadBtn.innerText = "Download File Now";
                        hdDownloadBtn.style.display = "inline-block";
                    }
                    
                    downloadLinkFound = true;
                    break; // ஒரு சர்வரில் லிங்க் கிடைத்துவிட்டால் லூப்பை நிறுத்து
                }
            } catch (err) {
                console.warn(`Node ${apiNode} busy. Auto-routing to next network cluster...`);
            }
        }

        // ஒருவேளை மிக அரிதாக 4 சர்வர்களுமே டிராஃபிக்கில் இருந்தால், யூசரை வெளியே அனுப்பாமல் மாற்று வழி
        if (!downloadLinkFound) {
            videoTitle.innerHTML = "❌ <span style='color: #ff4a4a;'>All processing streams are currently congested.</span><br>Please refresh and try again in a few moments.";
            if (hdDownloadBtn) hdDownloadBtn.style.display = "none";
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };
});