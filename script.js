const videoData = [
    {
        url: "https://github.com/vschirhan/reelmedia/raw/refs/heads/main/WhatsApp%20Video%202026-01-01%20at%2010.14.15%20PM.mp4",
        user: "@nature_guy",
        desc: "Infinite loops of nature 🌿"
    },
    {
        url: "https://cdn.discordapp.com/attachments/1347890703820128267/1456338193745051759/VID_20260101_082451_252.mp4?ex=69580022&is=6956aea2&hm=db74748097ae137764a11b18e7e3973fc2d8d3a42660615e582118f235f3454f&",
        user: "@life_moments",
        desc: "Sweet moments forever ☁️"
    }
];

const container = document.getElementById('reelsContainer');
const muteBtn = document.getElementById('muteToggle');
let isGlobalMuted = true;

// 2. INITIALIZE REELS
videoData.forEach((data, index) => {
    const reel = document.createElement('div');
    reel.className = 'reel';
    reel.innerHTML = `
        <video class="video-player" loop playsinline muted src="${data.url}"></video>
        <div class="progress-container">
            <div class="progress-bar" id="bar-${index}"></div>
        </div>
        <div class="video-overlay">
            <h3>${data.user}</h3>
            <p>${data.desc}</p>
        </div>
    `;
    container.appendChild(reel);
});

const allVideos = document.querySelectorAll('.video-player');

// 3. GLOBAL MUTE LOGIC (Top Button)
muteBtn.addEventListener('click', () => {
    isGlobalMuted = !isGlobalMuted;
    allVideos.forEach(v => v.muted = isGlobalMuted);
    muteBtn.innerText = isGlobalMuted ? "🔇 Muted" : "🔊 Sound On";
});

// 4. SMOOTH PROGRESS & PLAY/PAUSE LOGIC
allVideos.forEach((video, index) => {
    const bar = document.getElementById(`bar-${index}`);

    // Function to update the bar 60 times per second
    function updateProgress() {
        if (!video.paused && !video.ended) {
            const percentage = (video.currentTime / video.duration) * 100;
            bar.style.width = percentage + "%";
            // Request the next animation frame for maximum smoothness
            requestAnimationFrame(updateProgress);
        }
    }

    // Single click to Pause/Play
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    // Start the smooth update loop whenever the video starts playing
    video.addEventListener('play', () => {
        updateProgress();
    });
});

// 5. INTERSECTION OBSERVER (Autoplay & Resets)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (entry.isIntersecting) {
            // Apply global mute state to the video entering view
            video.muted = isGlobalMuted;
            video.play().catch(err => {
                console.log("Autoplay waiting for user interaction");
            });
        } else {
            // Pause and reset when scrolled away
            video.pause();
            video.currentTime = 0;
            const bar = entry.target.querySelector('.progress-bar');
            if (bar) bar.style.width = "0%";
        }
    });
}, { threshold: 0.8 });

// Apply observer to every reel container
document.querySelectorAll('.reel').forEach(reel => observer.observe(reel));