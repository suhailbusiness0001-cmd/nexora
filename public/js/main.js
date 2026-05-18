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

        // UI லோடிங் ஸ்டேட்
        dlBtn.innerText = "Connecting...";
        dlBtn.disabled = true;
        if (previewContainer) previewContainer.style.display = "block";
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Fetching premium streaming link...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        // கன்சோல் எர்ரர் வராமல் தடுக்க 'corsproxy.io' மற்றும் ஸ்டேபிள் Cobalt API இணைப்பு
        const targetApi = "https://corsproxy.io/?" + encodeURIComponent("https://api.cobalt.tools/api/json");

        try {
            const response = await fetch(targetApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    url: url,
                    vQuality: "720",
                    filenamePattern: "classic"
                })
            });

            const data = await response.json();

            if (data && data.url) {
                videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Link Generated!</span><br>Your high-speed Nexora link is ready.";
                hdDownloadBtn.href = data.url;
                hdDownloadBtn.innerText = "Download Video";
                hdDownloadBtn.style.display = "inline-block";
            } else {
                throw new Error("Invalid API response");
            }
        } catch (err) {
            console.warn("Primary bypass crowded, launching mirror channel.");
            videoTitle.innerHTML = "⚠️ API nodes are temporarily busy.<br>Redirecting to high-speed backup gateway:";
            hdDownloadBtn.href = "https://ssstik.io/en";
            hdDownloadBtn.innerText = "Go to Mirror Download";
            hdDownloadBtn.style.display = "inline-block";
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };
});