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
    const dlBtn = document.getElementById('startDl');
    const input = document.getElementById('videoUrl');
    const previewContainer = document.getElementById('preview-container');

    if (dlBtn) {
        dlBtn.onclick = async () => {
            const url = input.value.trim();
            if (!url) return alert("Please paste a valid video link!");

            dlBtn.innerText = "Extracting Media...";
            dlBtn.disabled = true;

            try {
                // ENGINE 1: பிரண்ட்எண்ட்ல இருந்தே நேரடியாக இயங்கும் அதிவேக ஓபன்-சோர்ஸ் API
                const response = await fetch('https://api.allvideodownloader.cc/api/v1/download', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                });

                const data = await response.json();

                if (response.ok && data && data.success && data.data) {
                    const videoLink = data.data.video_url || data.data.download_url;
                    
                    document.getElementById('videoTitle').innerText = data.data.title || "Nexora Ready File";
                    document.getElementById('videoPreview').src = videoLink;
                    document.getElementById('hdDownloadBtn').href = videoLink;

                    if (previewContainer) {
                        previewContainer.style.display = "block";
                        previewContainer.scrollIntoView({ behavior: 'smooth' });
                    }
                    return;
                }

                // BACKUP ENGINE 2: முதலாவது பிஸியாக இருந்தால் இயங்கும் மாற்று எக்ஸ்ட்ராக்டர்
                console.log("Switching to backup parser cluster...");
                const response2 = await fetch('https://api.download.savetube.me/v1/twitt/video-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                });

                const data2 = await response2.json();
                if (response2.ok && data2 && data2.url) {
                    document.getElementById('videoTitle').innerText = data2.title || "Nexora Premium Download";
                    document.getElementById('videoPreview').src = data2.url;
                    document.getElementById('hdDownloadBtn').href = data2.url;

                    if (previewContainer) {
                        previewContainer.style.display = "block";
                        previewContainer.scrollIntoView({ behavior: 'smooth' });
                    }
                    return;
                }

                // EMERGENCY FALLBACK விட்ஜெட் லிங்க்
                const backupWidgetUrl = `https://9download.me/query?url=${encodeURIComponent(url)}`;
                document.getElementById('videoTitle').innerText = "Click Download to Get Premium Media";
                document.getElementById('hdDownloadBtn').href = backupWidgetUrl;
                document.getElementById('hdDownloadBtn').target = "_blank";
                
                if (previewContainer) {
                    previewContainer.style.display = "block";
                    previewContainer.scrollIntoView({ behavior: 'smooth' });
                }

            } catch (err) {
                console.error("Nexora Core Error:", err);
                
                // நெட்வொர்க் எர்ரர் வந்தால் நேரடியாக டவுன்லோடு செய்ய வைக்கும் விட்ஜெட்
                const fallbackUrl = `https://9download.me/query?url=${encodeURIComponent(url)}`;
                document.getElementById('videoTitle').innerText = "Click Download to Get Premium Media";
                document.getElementById('hdDownloadBtn').href = fallbackUrl;
                document.getElementById('hdDownloadBtn').target = "_blank";
                
                if (previewContainer) {
                    previewContainer.style.display = "block";
                    previewContainer.scrollIntoView({ behavior: 'smooth' });
                }
            } finally {
                dlBtn.innerText = "Download";
                dlBtn.disabled = false;
            }
        };
    }
});