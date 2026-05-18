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

        // UI-ஐ லோடிங் நிலைக்கு மாற்றுதல்
        dlBtn.innerText = "Connecting...";
        dlBtn.disabled = true;
        
        if (previewContainer) previewContainer.style.display = "block";
        if (videoTitle) videoTitle.innerHTML = "<i class='fas fa-spinner fa-spin' style='color:#149777;'></i> Bypassing restrictions & fetching media...";
        if (hdDownloadBtn) hdDownloadBtn.style.display = "none";

        // CORS பிளாக்கிங்கை உடைக்க ஃப்ரீ ப்ராக்ஸிகள்
        const proxyList = [
            'https://corsproxy.io/?',
            'https://api.allorigins.win/raw?url='
        ];

        // டாப் ஆக்டிவ் Cobalt சர்வர்கள்
        const cobaltNodes = [
            'https://cobalt.api.unblockit.pro/api/json',
            'https://co.wuk.sh/api/json',
            'https://api.cobalt.tools/api/json'
        ];

        let success = false;

        // ப்ராக்ஸி மற்றும் ஏபிஐ-களை மாற்றி மாற்றி டெஸ்ட் செய்யும் லூப்
        for (let proxy of proxyList) {
            if (success) break;

            for (let node of cobaltNodes) {
                try {
                    // ப்ராக்ஸி வழியா கோபால்ட் சர்வர் லிங்க் உருவாக்கப்படுகிறது
                    const targetUrl = proxy + encodeURIComponent(node);
                    
                    console.log(`Nexora Core: Routing via -> ${targetUrl}`);

                    const response = await fetch(targetUrl, {
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

                    const textData = await response.text();
                    
                    // HTML எர்ரர் பேஜ் வந்திருக்கா அல்லது JSON-ஆ என செக் செய்தல்
                    if (!textData.trim().startsWith('{')) {
                        continue; // JSON இல்லை என்றால் அடுத்த நோடுக்கு மாறு
                    }

                    const jsonData = JSON.parse(textData);

                    if (jsonData && jsonData.url) {
                        if (videoTitle) videoTitle.innerHTML = "🎉 <span style='color: #149777; font-weight: bold;'>Bypass Success!</span><br>Your high-speed HD link is ready.";
                        if (hdDownloadBtn) {
                            hdDownloadBtn.href = jsonData.url;
                            hdDownloadBtn.innerText = "Download Video Now";
                            hdDownloadBtn.style.display = "inline-block";
                        }
                        success = true;
                        break; // வெற்றி கிடைத்துவிட்டால் லூப்பை நிறுத்து
                    }
                } catch (err) {
                    console.warn(`Node request failed through current tunnel. Switching...`);
                }
            }
        }

        // ஒருவேளை எல்லா ப்ராக்ஸியும் ஃபெயில் ஆனால், யூசருக்கு எர்ரர் காட்டாமல் மாற்று தளம் காட்டுதல்
        if (!success) {
            if (videoTitle) videoTitle.innerHTML = "⚠️ Primary nodes busy.<br>Redirecting to backup premium gateway:";
            if (hdDownloadBtn) {
                hdDownloadBtn.href = `https://ssstik.io/en`; 
                hdDownloadBtn.innerText = "Go to Mirror Download";
                hdDownloadBtn.style.display = "inline-block";
            }
        }

        dlBtn.innerText = "Download";
        dlBtn.disabled = false;
    };
});