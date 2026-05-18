document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Theme Logic ---
    const body = document.body;
    const icon = document.getElementById('theme-btn') ? (document.getElementById('theme-btn')).querySelector('i') : null;

    if (localStorage.getItem('nexora-theme') === 'light') {
        body.classList.add('light-theme');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    }

    if (document.getElementById('theme-btn')) {
        (document.getElementById('theme-btn')).addEventListener('click', () => {
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

        // UI Loading State (Nexora Theme)
        dlBtn.innerText = "Connecting...";
        dlBtn.disabled = true;
        if (previewContainer) previewContainer.style.display = "block";
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Tunneling secure stream via Nexora Core...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        let finalLink = null;

        try {
            // லோக்கலா அல்லது லைவ் சர்வரானு செக் பண்றோம்
            const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";

            if (isLocal) {
                console.log("Local Environment: Using secure public fallback cluster...");
                const res = await fetch(`https://api.sand0.dev/alldl?url=${encodeURIComponent(url)}`);
                if (res.ok) {
                    const data = await res.json();
                    finalLink = data.url || data.result?.url;
                }
            } else {
                console.log("Live Production: Route initiated via Vercel Serverless Node...");
                const res = await fetch('/api/download', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                });
                
                if (res.ok) {
                    const data = await res.json();
                    finalLink = data.url;
                }
            }
        } catch (err) {
            console.warn("Primary path congested. Checking backup gateway configurations...");
        }

        // எமர்ஜென்சி பேக்கப் ரூட் (AllOrigins Proxy Cluster)
        if (!finalLink) {
            try {
                console.log("Deploying emergency proxy wrapper...");
                const proxyWrapper = `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.sand0.dev/alldl?url=' + encodeURIComponent(url))}`;
                const res = await fetch(proxyWrapper);
                if (res.ok) {
                    const wrapperData = await res.json();
                    const actualData = JSON.parse(wrapperData.contents);
                    finalLink = actualData.url || actualData.result?.url;
                }
            } catch (proxyErr) {
                console.error("All extraction layers exhausted.");
            }
        }

        // டவுன்லோடு பட்டன் ரெண்டரிங் லாஜிக்
        if (finalLink) {
            videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Premium Connection Stable!</span><br>Your high-speed secure HD link is ready inside Nexora nodes.";
            if (hdDownloadBtn) {
                hdDownloadBtn.href = finalLink;
                hdDownloadBtn.setAttribute('download', 'Nexora_Download');
                hdDownloadBtn.innerText = "Download Video Now";
                hdDownloadBtn.style.display = "inline-block";
            }
        } else {
            videoTitle.innerHTML = "❌ <span style='color: #ff4a4a; font-weight: bold;'>All internal stream tunnels are crowded.</span><br>Please refresh or try again with a different link.";
            if (hdDownloadBtn) hdDownloadBtn.style.display = "none";
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };
});