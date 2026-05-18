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

        // UI Loading State (நெக்ஸோரா தீம் ஸ்பின்னர் ரன் ஆகும்)
        dlBtn.innerText = "Connecting...";
        dlBtn.disabled = true;
        if (previewContainer) previewContainer.style.display = "block";
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Tunneling high-speed media stream via Nexora Core Nodes...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        let finalMediaUrl = null;

        // லேயர் 1: புதிய அல்டிமேட் No-CORS Aioasf கேட்வே
        try {
            console.log("Nexora Core Route 1: Connecting to premium aioasf cluster...");
            const res = await fetch(`https://api.aioasf.com/api/download?url=${encodeURIComponent(url)}`);
            if (res.ok) {
                const data = await res.json();
                // வெவ்வேறு பிளாட்ஃபார்ம்களுக்கான மீடியா கீகளை செக் செய்தல்
                finalMediaUrl = data.url || data.medias?.[0]?.url || data.download;
            }
        } catch (e) {
            console.warn("Route 1 bypassed. Deploying emergency tunnel 2...");
        }

        // லேயர் 2: லேயர் 1 பிஸியாக இருந்தால் இயங்கும் லூவாநெட் எக்ஸ்ட்ராக்டர்
        if (!finalMediaUrl) {
            try {
                console.log("Nexora Core Route 2: Deploying luanet backup cluster...");
                const res = await fetch(`https://api.luanet.xyz/download?url=${encodeURIComponent(url)}`);
                if (res.ok) {
                    const data = await res.json();
                    finalMediaUrl = data.result?.url || data.video || data.url;
                }
            } catch (e) {
                console.warn("Route 2 congested.");
            }
        }

        // லேயர் 3: ஆல்-ஒரிஜின்ஸ் ஹைப்ரிட் டன்னல் லேயர் (CORS Bypass)
        if (!finalMediaUrl) {
            try {
                console.log("Nexora Core Route 3: Deploying AllOrigins Proxy Bypass...");
                const proxyWrapper = `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.sand0.dev/alldl?url=' + encodeURIComponent(url))}`;
                const res = await fetch(proxyWrapper);
                if (res.ok) {
                    const wrapperData = await res.json();
                    const actualData = JSON.parse(wrapperData.contents);
                    finalMediaUrl = actualData.url || actualData.result?.url;
                }
            } catch (e) {
                console.error("All internal extraction layers exhausted.");
            }
        }

        // சைட் குள்ளேயே டவுன்லோடு பட்டனை ஆக்டிவேட் செய்யும் லாஜிக்
        if (finalMediaUrl) {
            videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Premium Connection Established!</span><br>Your high-speed secure HD link is ready below.";
            if (hdDownloadBtn) {
                hdDownloadBtn.href = finalMediaUrl;
                hdDownloadBtn.setAttribute('download', 'Nexora_Media_Stream');
                hdDownloadBtn.innerText = "Download Video Now";
                hdDownloadBtn.style.display = "inline-block";
            }
        } else {
            // எர்ரர் மெசேஜையும் சைட் குள்ளேயே அழகாக காட்டுதல்
            videoTitle.innerHTML = "❌ <span style='color: #ff4a4a; font-weight: bold;'>All stream tunnels are currently crowded.</span><br>Please refresh or try again with a different link.";
            if (hdDownloadBtn) hdDownloadBtn.style.display = "none";
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };
});