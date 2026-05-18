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

        // UI லோடிங் நிலைக்கு மாற்றுதல்
        dlBtn.innerText = "Processing...";
        dlBtn.disabled = true;
        if (previewContainer) previewContainer.style.display = "block";
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Tunneling secure stream via Nexora Backend API...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        try {
            // நம்ம சொந்த வெப்சைட்டின் பேக் எண்ட் எண்ட் பாயிண்டிற்கு ரெக்வஸ்ட் அனுப்புகிறோம்
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
            });

            const data = await response.json();

            if (response.ok && data && data.url) {
                videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Stream Grabbing Successful!</span><br>Your secure high-speed HD link is ready inside Nexora nodes.";
                if (hdDownloadBtn) {
                    hdDownloadBtn.href = data.url;
                    hdDownloadBtn.setAttribute('download', 'Nexora_Download');
                    hdDownloadBtn.innerText = "Download Video Now";
                    hdDownloadBtn.style.display = "inline-block";
                }
            } else {
                throw new Error(data.error || "Extraction failed");
            }

        } catch (err) {
            console.error("Client Error:", err);
            if (videoTitle) {
                videoTitle.innerHTML = "❌ <span style='color: #ff4a4a; font-weight: bold;'>All internal backend tunnels are congested.</span><br>Please refresh and try again with a different link.";
            }
            if (hdDownloadBtn) hdDownloadBtn.style.display = "none";
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };
});