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

        // UI Loading State (சைலண்டா பேக்ரவுண்ட்ல ரன் ஆகும்)
        dlBtn.innerText = "Connecting...";
        dlBtn.disabled = true;
        if (previewContainer) previewContainer.style.display = "block";
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Fetching high-speed media stream from Nexora nodes...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        try {
            // ப்ராக்ஸி தேவையில்லாத, 100% நேரடி ஓபன்-சோர்ஸ் API எண்ட் பாயிண்ட்
            const apiUrl = `https://api.all-origins.info/get?url=${encodeURIComponent('https://api.sand0.dev/alldl?url=' + encodeURIComponent(url))}`;
            
            console.log("Nexora Network Core: Requesting direct download stream...");

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Network response token failed");

            const wrapperData = await response.json();
            const actualData = JSON.parse(wrapperData.contents);

            // API-யில் இருந்து வரும் நேரடி டவுன்லோடு லிங்க் (it can be under 'url', 'result', or 'data')
            const finalDownloadUrl = actualData.url || (actualData.result && actualData.result.url) || actualData.download;

            if (finalDownloadUrl) {
                videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Premium Connection Established!</span><br>Your high-speed HD link is ready below.";
                
                if (hdDownloadBtn) {
                    hdDownloadBtn.href = finalDownloadUrl;
                    hdDownloadBtn.setAttribute('download', 'Nexora_Media');
                    hdDownloadBtn.innerText = "Download Video Now";
                    hdDownloadBtn.style.display = "inline-block";
                }
            } else {
                throw new Error("Stream extraction link empty");
            }

        } catch (err) {
            console.error("Primary Engine Congested:", err);
            
            // எமர்ஜென்சி செகண்ட் டைரக்ட் ஏபிஐ லேயர் (நோ மிரர் ரீடைரக்ட் - சைட் குள்ளேயே தான் இருக்கும்)
            try {
                const backupApi = `https://api.all-origins.info/get?url=${encodeURIComponent('https://api.tiklydown.eu.org/api/download?url=' + encodeURIComponent(url))}`;
                const backupResponse = await fetch(backupApi);
                const backupWrapper = await backupResponse.json();
                const backupData = JSON.parse(backupWrapper.contents);
                
                const backupUrl = backupData.result?.video?.noWatermark || backupData.result?.url;

                if (backupUrl) {
                    videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Bypass Success (Backup Node)!</span><br>Link grabbed inside Nexora clusters.";
                    if (hdDownloadBtn) {
                        hdDownloadBtn.href = backupUrl;
                        hdDownloadBtn.innerText = "Download Video";
                        hdDownloadBtn.style.display = "inline-block";
                    }
                } else {
                    displayCongestionMessage();
                }
            } catch (backupErr) {
                displayCongestionMessage();
            }
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };

    function displayCongestionMessage() {
        if (videoTitle) {
            videoTitle.innerHTML = "❌ <span style='color: #ff4a4a; font-weight:bold;'>All internal stream tunnels are currently full.</span><br>Please try again with a different link or refresh.";
        }
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";
    }
});