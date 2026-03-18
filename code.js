const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const toggleBtn = document.getElementById("toggle-theme");
const installBtn = document.getElementById("install-btn");

function addTask() {
    if (inputBox.value.trim() === "") {
        alert("Enter your task!");
        return;
    }
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
    inputBox.value = "";
    saveData();
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();

toggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");
    const darkMode = document.documentElement.classList.contains("dark-mode");
    toggleBtn.textContent = darkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    // start or stop animations
    if (darkMode) {
        startDarkAnimations();
    } else {
        stopDarkAnimations();
    }
});

// ✨ Dark mode animations
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars = [], animFrame;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initStars() {
    stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.3,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.abs(Math.sin(s.alpha))})`;
        ctx.fill();
    });
    animFrame = requestAnimationFrame(drawStars);
}

function spawnFirefly() {
    const f = document.createElement('div');
    f.className = 'firefly';
    f.style.left = (5 + Math.random() * 90) + '%';
    f.style.bottom = (5 + Math.random() * 50) + '%';
    f.style.animationDelay = Math.random() * 2 + 's';
    f.style.animationDuration = (3 + Math.random() * 3) + 's';
    f.style.width = f.style.height = (3 + Math.random() * 3) + 'px';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 6000);
}

function spawnShootingStar() {
    const s = document.createElement('div');
    s.className = 'shooting-star';
    s.style.top = (5 + Math.random() * 35) + '%';
    s.style.left = (50 + Math.random() * 40) + '%';
    s.style.animation = `shoot ${1 + Math.random()}s ease-out forwards`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 2000);
}

function startDarkAnimations() {
    resizeCanvas();
    initStars();
    cancelAnimationFrame(animFrame);
    drawStars();
    clearInterval(window._fireflyTimer);
    window._fireflyTimer = setInterval(spawnFirefly, 900);
    clearInterval(window._shootTimer);
    window._shootTimer = setInterval(spawnShootingStar, 4000);
    setTimeout(spawnShootingStar, 1000);
}

function stopDarkAnimations() {
    cancelAnimationFrame(animFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearInterval(window._fireflyTimer);
    clearInterval(window._shootTimer);
    document.querySelectorAll('.firefly, .shooting-star').forEach(e => e.remove());
}

window.addEventListener('resize', () => {
    if (document.documentElement.classList.contains('dark-mode')) {
        resizeCanvas();
        initStars();
    }
});

// start if already in dark mode on load
if (document.documentElement.classList.contains('dark-mode')) {
    startDarkAnimations();
}