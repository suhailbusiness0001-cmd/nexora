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
            if (!url) return alert("Please paste a link!");

            dlBtn.innerText = "Connecting...";
            dlBtn.disabled = true;

            try {
                const response = await fetch('/api/api-handler', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                });

                const data = await response.json();

                if (data && (data.url || data.stream)) {
                    const finalUrl = data.url || data.stream;
                    
                    document.getElementById('videoTitle').innerText = data.filename || "Video Ready";
                    document.getElementById('videoPreview').src = finalUrl;
                    document.getElementById('hdDownloadBtn').href = finalUrl;

                    previewContainer.style.display = "block";
                    previewContainer.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Cobalt server enna error anupudhunu ippo real-ah alert aagum
                    alert("API Error: " + (data.error || data.text || "Extraction failed. Platform might be rate-limited."));
                }

            } catch (err) {
                console.error("Master Error:", err);
                alert("Server Error! Check if Vercel deployment has functions.");
            } finally {
                dlBtn.innerText = "Download";
                dlBtn.disabled = false;
            }
        };
    }
});