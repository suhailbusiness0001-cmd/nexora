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

    if (dlBtn) {
        dlBtn.onclick = async () => {
            const url = input.value.trim();
            if (!url) {
                alert("Please paste a link!");
                return;
            }

            dlBtn.innerText = "Connecting...";
            dlBtn.disabled = true;

            try {
                const response = await fetch('/api/api-handler', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                });

                const data = await response.json();

                if (response.ok && data && data.url) {
                    // வெற்றிகரமாக டேட்டா கிடைத்துவிட்டால்
                    document.getElementById('videoTitle').innerText = data.filename || "Video Ready";
                    document.getElementById('videoPreview').src = data.url;
                    document.getElementById('hdDownloadBtn').href = data.url;

                    if (previewContainer) {
                        previewContainer.style.display = "block";
                        previewContainer.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    // ஏபிஐ அனுப்பும் உண்மையான எர்ரர் மெசேஜ் இப்போ அலர்ட் ஆகும்
                    alert("API Error: " + (data.error || "Extraction failed. Server rate-limited."));
                }

            } catch (err) {
                console.error("Frontend Master Error:", err);
                alert("Server Connection Error! Please try again.");
            } finally {
                dlBtn.innerText = "Download";
                dlBtn.disabled = false;
            }
        };
    }
});