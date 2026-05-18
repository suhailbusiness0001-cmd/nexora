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

        // UI Loading State 
        dlBtn.innerText = "Connecting...";
        dlBtn.disabled = true;
        if (previewContainer) previewContainer.style.display = "block";
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Tunneling secure stream via Nexora Backend Node...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        try {
            // லோக்கலாக இருந்தால் நேரடியாக பப்ளிக் கேட்வேக்கும், லைவாக இருந்தால் நம்ம சொந்த ஏபிஐ-க்கும் மாறும் லாஜிக்
            const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
            const endpoint = isLocal ? `https://api.sand0.dev/alldl?url=${encodeURIComponent(url)}` : '/api/download';

            let finalLink = null;

            if (isLocal) {
                const res = await fetch(endpoint);
                const data = await res.json();
                finalLink = data.url || data.result?.url;
            } else {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                });
                const data = await res.json();
                finalLink = data.url;
            }

            if (finalLink) {
                videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Premium Connection Stable!</span><br>Your high-speed secure HD link is ready below.";
                if (hdDownloadBtn) {
                    hdDownloadBtn.href = finalLink;
                    hdDownloadBtn.setAttribute('download', 'Nexora_Media_Stream');
                    hdDownloadBtn.innerText = "Download Video Now";
                    hdDownloadBtn.style.display = "inline-block";
                }
            } else {
                throw new Error("Empty token");
            }

        } catch (err) {
            console.error(err);
            videoTitle.innerHTML = "❌ <span style='color: #ff4a4a; font-weight: bold;'>All internal stream tunnels are crowded.</span><br>Please refresh or try again with a different link.";
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };
})