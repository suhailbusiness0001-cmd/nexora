// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Logic ---
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

    // --- Download Logic ---
    const dlBtn = document.getElementById('startDl');
    const input = document.getElementById('videoUrl');
    const previewContainer = document.getElementById('preview-container');

    if (dlBtn) {
        dlBtn.onclick = async () => {
            const url = input.value.trim();
            if (!url) return alert("Please paste a link!");

            dlBtn.innerText = "Connecting...";
            dlBtn.disabled = true;

            try {
                // image_1f0b54.png connection issue-va solve panna fetch timeout handle pannuvom
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds wait pannum

                const response = await fetch('https://api.cobalt.tools/api/json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        url: url,
                        videoQuality: '720'
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                const data = await response.json();

                if (data && data.url) {
                    document.getElementById('videoPreview').src = data.url;
                    document.getElementById('hdDownloadBtn').href = data.url;
                    document.getElementById('hdDownloadBtn').style.display = "inline-block";
                    previewContainer.style.display = "block";
                    previewContainer.scrollIntoView({ behavior: 'smooth' });
                } else {
                    alert("AI could not extract this video. Try a YouTube link!");
                }

            } catch (err) {
                console.error("Master Error:", err);
                // image_1f0b54.png fallback message
                if (err.name === 'AbortError') {
                    alert("Connection Timeout! Server is too slow, please try again.");
                } else {
                    alert("STILL BLOCKED: Chrome is stopping the request. \n\nFIX: Open your project in Firefox or install 'CORS Unblock' extension on Chrome!");
                }
            } finally {
                dlBtn.innerText = "Download";
                dlBtn.disabled = false;
            }
        };
    }
});

// main.js-la fetch function kulla
const response = await fetch('/api/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: input.value })
});

const data = await response.json();

if (data.status === 'ok' || data.url) {
    // 1. Title set pannuvom
    document.getElementById('videoTitle').innerText = data.filename || "Your AI Video is Ready";
    
    // 2. Playable Preview set pannuvom
    document.getElementById('videoPreview').src = data.url;
    
    // 3. Download link update pannuvom
    document.getElementById('hdDownloadBtn').href = data.url;

    // 4. Everything show pannuvom
    document.getElementById('preview-container').style.display = 'block';
}