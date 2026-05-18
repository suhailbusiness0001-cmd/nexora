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

        // UI லோடிங் ஸ்டேட் (நெக்ஸோரா பிராண்ட் கலரில் ஸ்பின்னர் ரன் ஆகும்)
        dlBtn.innerText = "Connecting...";
        dlBtn.disabled = true;
        if (previewContainer) previewContainer.style.display = "block";
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Tunneling high-speed stream into Nexora nodes...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        let finalDownloadLink = null;

        // லேயர் 1: நேரடி சாண்ட்பாக்ஸ் ஏபிஐ டன்னல் (CORS Bypass)
        try {
            console.log("Nexora Tunnel 1: Accessing sandbox media grid...");
            const response = await fetch(`https://api.sand0.dev/alldl?url=${encodeURIComponent(url)}`);
            if (response.ok) {
                const data = await response.json();
                finalDownloadLink = data.url || data.result?.url || data.download;
            }
        } catch (e) {
            console.warn("Tunnel 1 congested. Auto-routing to network cluster 2...");
        }

        // லேயர் 2: லேயர் 1 பிஸியாக இருந்தால் இயங்கும் ஆல்-ஒரிஜின்ஸ் செக்யூர் மேப்பர்
        if (!finalDownloadLink) {
            try {
                console.log("Nexora Tunnel 2: Deploying backup open gate proxy...");
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.sand0.dev/alldl?url=' + encodeURIComponent(url))}`;
                const response = await fetch(proxyUrl);
                if (response.ok) {
                    const wrapper = await response.json();
                    const innerData = JSON.parse(wrapper.contents);
                    finalDownloadLink = innerData.url || innerData.result?.url || innerData.download;
                }
            } catch (e) {
                console.warn("Tunnel 2 bypassed.");
            }
        }

        // லேயர் 3: டிக்டாக் மற்றும் யூடியூப் பிரீமியம் எக்ஸ்ட்ராக்டர் லேயர்
        if (!finalDownloadLink) {
            try {
                console.log("Nexora Tunnel 3: Initiating tiklydown core engine...");
                const response = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`);
                if (response.ok) {
                    const data = await response.json();
                    finalDownloadLink = data.result?.video?.noWatermark || data.result?.url || data.url;
                }
            } catch (e) {
                console.error("All Client-side Extraction Routes Full.");
            }
        }

        // 100% நம்ம சைட் குள்ளேயே பட்டனை ரெண்டர் செய்யும் லாஜிக் (மிரர் வெப்சைட்ஸ் கிடையாது!)
        if (finalDownloadLink) {
            videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Nexora Secure Tunnel Active!</span><br>Media link successfully grabbed inside our core nodes.";
            if (hdDownloadBtn) {
                hdDownloadBtn.href = finalDownloadLink;
                hdDownloadBtn.setAttribute('download', 'Nexora_Download');
                hdDownloadBtn.innerText = "Download Video Now";
                hdDownloadBtn.style.display = "inline-block";
            }
        } else {
            // எர்ரர் மெசேஜையும் வெளியே அனுப்பாமல் நெக்ஸோராவுக்குள்ளேயே காட்டுதல்
            videoTitle.innerHTML = "❌ <span style='color: #ff4a4a; font-weight: bold;'>All internal download streams are currently crowded.</span><br>Please try again with a different link or refresh the page.";
            if (hdDownloadBtn) hdDownloadBtn.style.display = "none";
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };
});