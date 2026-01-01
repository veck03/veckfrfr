// 1. DATA - Update with your GitHub Raw Links or Discord Links
const videoData = [
    {
        url: "https://github.com/vschirhan/reelmedia/raw/refs/heads/main/WhatsApp%20Video%202026-01-01%20at%2010.14.15%20PM.mp4",
        user: "toxi",
        desc: ""
    },
    {
        url: "https://cdn.discordapp.com/attachments/1347890703820128267/1456338193745051759/VID_20260101_082451_252.mp4?ex=69580022&is=6956aea2&hm=db74748097ae137764a11b18e7e3973fc2d8d3a42660615e582118f235f3454f&",
        user: "izomu",
        desc: ""
    }
];

const container = document.getElementById('reelsContainer');
const muteBtn = document.getElementById('muteToggle');
let isGlobalMuted = true;

// 2. INJECT VIDEOS (Using Backticks for proper template rendering)
videoData.forEach((data, index) => {
    const reel = document.createElement('div');
    reel.className = 'reel';
    reel.innerHTML = `
        <video class="video-player" loop playsinline muted src="${data.url}"></video>
        <div class="progress-container">
            <div class="progress-bar" id="bar-${index}"></div>
        </div>
        <div class="video-overlay">
            <div class="info-content">
                <h3>${data.user}</h3>
                <p>${data.desc}</p>
            </div>
            <div class="action-content">
                <button class="share-btn" onclick="shareVideo('${data.url}', '${data.user}')">
                    📤
                </button>
            </div>
        </div>
    `;
    container.appendChild(reel);
});

const allVideos = document.querySelectorAll('.video-player');

// 3. GLOBAL MUTE LOGIC
muteBtn.addEventListener('click', () => {
    isGlobalMuted = !isGlobalMuted;
    allVideos.forEach(v => v.muted = isGlobalMuted);
    muteBtn.innerText = isGlobalMuted ? "🔇 Muted" : "🔊 Sound On";
});

// 4. SMOOTH PROGRESS & PLAY/PAUSE
allVideos.forEach((video, index) => {
    const bar = document.getElementById(`bar-${index}`);

    function updateProgress() {
        if (!video.paused && !video.ended) {
            const percentage = (video.currentTime / video.duration) * 100;
            bar.style.width = percentage + "%";
            requestAnimationFrame(updateProgress);
        }
    }

    video.addEventListener('click', () => {
        if (video.paused) video.play();
        else video.pause();
    });

    video.addEventListener('play', updateProgress);
});

// 5. INTERSECTION OBSERVER
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (entry.isIntersecting) {
            video.muted = isGlobalMuted;
            video.play().catch(() => {});
        } else {
            video.pause();
            video.currentTime = 0;
        }
    });
}, { threshold: 0.8 });

document.querySelectorAll('.reel').forEach(reel => observer.observe(reel));

// 6. SHARE FUNCTION
async function shareVideo(url, user) {
    const shareData = {
        title: `Reel by ${user}`,
        text: `Check out this reel!`,
        url: window.location.href // Shares your website link
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    } catch (err) {
        console.log("Error sharing:", err);
    }
}