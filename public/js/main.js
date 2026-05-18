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
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Tunneling high-speed media stream from Nexora core...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        let downloadUrl = null;

        // லேயர் 1: நேரடி No-CORS ஓபன் சோர்ஸ் எக்ஸ்ட்ராக்டர் டன்னல்
        try {
            console.log("Nexora Route 1: Initiating direct sandbox download fetch...");
            const res = await fetch(`https://api.sand0.dev/alldl?url=${encodeURIComponent(url)}`);
            if (res.ok) {
                const data = await res.json();
                downloadUrl = data.url || data.result?.url || data.download;
            }
        } catch (e) {
            console.warn("Route 1 congested. Switching network cluster...");
        }

        // லேயர் 2: லேயர் 1 ஃபெயில் ஆனால் இயங்கும் ஆல்டர்நேட்டிவ் பப்ளிக் கேட்வே
        if (!downloadUrl) {
            try {
                console.log("Nexora Route 2: Initiating backup token fetch...");
                const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`);
                if (res.ok) {
                    const data = await res.json();
                    downloadUrl = data.result?.video?.noWatermark || data.result?.url || data.url;
                }
            } catch (e) {
                console.warn("Route 2 bypassed.");
            }
        }

        // லேயர் 3: அல்டிமேட் செக்யூர் டன்னல் (CORS Bypass Engine)
        if (!downloadUrl) {
            try {
                console.log("Nexora Route 3: Deploying premium bypass gateway...");
                const bypassRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.sand0.dev/alldl?url=' + encodeURIComponent(url))}`);
                if (bypassRes.ok) {
                    const wrapper = await bypassRes.json();
                    const innerData = JSON.parse(wrapper.contents);
                    downloadUrl = innerData.url || innerData.result?.url;
                }
            } catch (e) {
                console.error("All Client-side Routes Congested.");
            }
        }

        // ஃப்ரன்ட் எண்ட் லிங்க் பிரெண்டரிங் லாஜிக் (மிரர் சைட் கிடையாது)
        if (downloadUrl) {
            videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Nexora Secure Tunnel Active!</span><br>Media stream captured successfully inside our nodes.";
            if (hdDownloadBtn) {
                hdDownloadBtn.href = downloadUrl;
                // டவுன்லோடு ஃபைல் பிரவுசரிலேயே சேவ் ஆக 'download' ஆட்ரிபியூட்
                hdDownloadBtn.setAttribute('download', 'Nexora_Media_File');
                hdDownloadBtn.innerText = "Download Video Now";
                hdDownloadBtn.style.display = "inline-block";
            }
        } else {
            // எர்ரர் மெசேஜையும் நம்ம சைட் குள்ளேயே அழகாகக் காட்டுதல்
            videoTitle.innerHTML = "❌ <span style='color: #ff4a4a; font-weight: bold;'>All streaming lines are currently full.</span><br>Please try again with a different link or refresh the page.";
            if (hdDownloadBtn) hdDownloadBtn.style.display = "none";
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };
});