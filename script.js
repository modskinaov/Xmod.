// ===== script.js (FULL, AI vi Hugging Face API, nâng cp vi upload nh) =====

// ==== CU HÌNH HUGGING FACE ====
const COHERE_API_KEY = "nhP5h2XbDhOwMdy5fwlWqGsJdDdfRyjFz3O2apki"; // Ly ti https://dashboard.cohere.ai/api-keys

async function callChatAI(message) {
  try {
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-light',
        message: message,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    return data.text || "AI không th tr li";
  } catch (err) {
    return "Li kt ni AI";
  }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('show');
}

// ===== HIU NG CON TR =====
const cursor = document.querySelector('.cursor');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
function updateCursor() {
  cursorX += (mouseX - cursorX) * 0.1;
  cursorY += (mouseY - cursorY) * 0.1;
  if (cursor) { cursor.style.left = cursorX - 10 + 'px'; cursor.style.top = cursorY - 10 + 'px'; }
  requestAnimationFrame(updateCursor);
}
updateCursor();

function createTrailParticle(x, y) {
  const particle = document.createElement('div');
  particle.className = 'trail-particle';
  particle.style.left = x + 'px'; particle.style.top = y + 'px';
  document.body.appendChild(particle);
  let opacity = 1, size = 4;
  const animate = () => {
    opacity -= 0.05; size += 0.2;
    particle.style.opacity = opacity;
    particle.style.width = size + 'px'; particle.style.height = size + 'px';
    if (opacity > 0) requestAnimationFrame(animate); else particle.remove();
  };
  animate();
}
document.addEventListener('mousemove', (e) => { if (Math.random() < 0.28) createTrailParticle(e.clientX, e.clientY); });

function createRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.left = (x - 50) + 'px'; ripple.style.top = (y - 50) + 'px';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}
document.addEventListener('click', (e) => { createRipple(e.clientX, e.clientY); });

function createFloatingParticle() {
  const particle = document.createElement('div');
  particle.className = 'floating-particle';
  particle.style.left = Math.random() * 100 + 'vw';
  particle.style.animationDuration = (Math.random() * 5 + 6) + 's';
  particle.style.animationDelay = Math.random() * 2 + 's';
  particle.style.opacity = Math.random() * 0.8 + 0.2;
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 12000);
}
setInterval(createFloatingParticle, 300);

// ===== CHAT + UI =====
const dynamicContent = document.getElementById('dynamicContent');
const dynamicIsland = document.getElementById('dynamicIsland');
const dynamicIcon = document.getElementById('dynamicIcon');
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function updateTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  if (dynamicContent) dynamicContent.textContent = `${h}:${m}`;
}
updateTime(); setInterval(updateTime, 60000);

// ===== HISTORY =====
const STORAGE_KEY = 'xmod_chat_history';
function saveChatHistory() {
  try {
    const arr = Array.from(chatArea.children).map(n => ({ html:n.innerHTML, className: n.className }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) { }
}
function loadChatHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    arr.forEach(it => {
      const d = document.createElement('div');
      d.className = it.className;
      d.innerHTML = it.html;
      chatArea.appendChild(d);
    });
    chatArea.scrollTop = chatArea.scrollHeight;
  } catch (e) { }
}
function clearChatHistory() { localStorage.removeItem(STORAGE_KEY); chatArea.innerHTML = ''; }

// ===== MESSAGE HELPERS =====
function addMessage(text, cls='user', useTypewriter=false) {
  const div = document.createElement('div');
  div.className = `message ${cls}`;
div.innerHTML = `
  <div class="avatar ${cls}"></div>
  <div class="bubble">${escapeHtml(text)}</div>
`;
  if (useTypewriter && cls === 'bot') {
    div.innerHTML = `<span class="typewriter neon-text">${escapeHtml(text)}</span>`;
  } else {
    div.textContent = text;
  }
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
  setTimeout(saveChatHistory, 120);
}
function addHtmlMessage(html, cls='bot') {
  const div = document.createElement('div');
  div.className = `message ${cls}`;
  div.innerHTML = html;
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
  setTimeout(saveChatHistory, 120);
}
function showDynamic(text, icon='', duration=3000) {
  if (!dynamicContent || !dynamicIcon || !dynamicIsland) return;
  dynamicContent.textContent = text;
  dynamicIcon.textContent = icon;
  dynamicIsland.classList.add('expanded');
  setTimeout(()=> dynamicIsland.classList.remove('expanded'), duration);
}
function escapeHtml(s) { const d = document.createElement('div'); d.innerText = s; return d.innerHTML; }

// ===== MUSIC =====
const playlist = [
  'https://www.dropbox.com/scl/fi/003fj25b92y8jio117ip9/Legends-Never-Die-ft.-Against-The-Current-2017.mp3?dl=1',
  'https://www.dropbox.com/scl/fi/735t19z143hw1d9r0w0mp/HUNTRIX-What-It-Sounds-Like-Lyrics-Color-Coded-Lyrics.mp3?dl=1',
  'https://www.dropbox.com/scl/fi/fbfi2t9cd7jf2qsh7kbim/Free-Official-Lyric-Video-Sony-Animation.mp3?dl=1'
];
let currentSong = 0;
const audioPlayer = new Audio();
audioPlayer.volume = 0.5;
function playMusic(){ audioPlayer.src = playlist[currentSong]; audioPlayer.play().catch(()=>{}); }
function pauseMusic(){ audioPlayer.pause(); }
function prevSong(){ currentSong = (currentSong-1+playlist.length)%playlist.length; playMusic(); }
function nextSong(){ currentSong = (currentSong+1)%playlist.length; playMusic(); }

// ===== BACKGROUND SELECTOR & UPLOAD =====
const backgrounds = [
  'https://i.postimg.cc/NMvXZVGx/Better-Image-1757996494029.jpg',
  'https://i.postimg.cc/50wZWcSV/bg2.png',
  'https://i.postimg.cc/SRN1gvJF/snapedit-1758346742290.jpg',
  'https://i.postimg.cc/wMvfvkw7/bg5.png',
  'https://i.postimg.cc/TYsNcQxF/snapedit-1758346703269.jpg',
  'https://i.postimg.cc/C1tn2ZKh/Better-Image-1758346552140.jpg',
  'https://i.postimg.cc/RhHJxM3c/Better-Image-1758346529282.jpg',
  'https://i.postimg.cc/nVgWJZSM/Better-Image-1758346503241.jpg',
  'https://i.postimg.cc/zXTxYhRP/cover-How-to-learn-a-new-skill-this-year.png',
  'https://i.postimg.cc/R0Zdtbpj/unnamed.webp',
  'https://i.postimg.cc/76CNsJk9/cover-best-way-to-learn-1.png',
  'https://i.postimg.cc/QtLBDF70/duolingonewcourses.png',
  ''
];
function openBackgroundSelector(){ 
  const el = document.getElementById('bgModal'); 
  if(el) el.classList.add('show'); 
  loadBackgroundGrid(); 
}

function loadBackgroundGrid() {
  const grid = document.getElementById("bgGrid");
  if (!grid) return;
  
  grid.innerHTML = "";

  // === NÚT UPLOAD NH CUSTOM ===
  const uploadSection = document.createElement("div");
  uploadSection.className = "upload-section";
  uploadSection.innerHTML = `
    <div class="neon-text" style="margin-bottom: 10px;"> Upload hình nh ca bn  làm background </div>
    <input type="file" id="customBgUpload" accept="image/*" style="display: none;">
    <button class="upload-btn neon-text" onclick="document.getElementById('customBgUpload').click()">
       Chn nh trên máy
    </button>
    <div class="upload-info neon-text" style="font-size: 12px; margin-top: 5px; opacity: 0.7;">
      H tr: JPG, PNG, GIF (ti a 10MB)
    </div>
  `;
  grid.appendChild(uploadSection);

  // === DANH SÁCH BACKGROUND CÓ SN ===
  const presetsTitle = document.createElement("div");
  presetsTitle.className = "neon-text";
  presetsTitle.style.marginTop = "20px";
  presetsTitle.style.marginBottom = "10px";
  presetsTitle.textContent = " Background có sn";
  grid.appendChild(presetsTitle);

  backgrounds.forEach((bg, index) => {
    const item = document.createElement("div");
    item.className = "bg-item";
    item.innerHTML = `
      <img src="${bg}" style="width:100%; height:100px; object-fit:cover; border-radius: 8px;">
      <div class="bg-label neon-text">Background ${index + 1}</div>
    `;
    item.onclick = () => {
      changeBackground(bg);
      addMessage(` ã i background thành Background ${index + 1}`, 'bot', true);
    };
    grid.appendChild(item);
  });

  // === NÚT RESET V MC NH ===
  const resetBtn = document.createElement("button");
  resetBtn.textContent = " Reset v mc nh";
  resetBtn.className = "reset-btn neon-text";
  resetBtn.onclick = () => {
    changeBackground("");
    addMessage(" ã reset background", 'bot', true);
  };
  grid.appendChild(resetBtn);

  // === X LÝ UPLOAD NH ===
  const customUpload = document.getElementById('customBgUpload');
  if (customUpload) {
    customUpload.onchange = handleImageUpload;
  }
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    addMessage(" Ch h tr JPG, PNG, GIF, WEBP", 'bot', true);
    return;
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    addMessage(" File quá ln! Vui lòng chn file nh hn 10MB", 'bot', true);
    return;
  }

  addMessage(" ang x lý nh...", 'bot', true);
  showDynamic('Uploading Image', '');

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageData = e.target.result;
    const img = new Image();
    img.onload = function() {
      changeBackground(imageData);
      saveCustomBackground(imageData);
      addMessage(` Upload thành công! ã set nh "${file.name}" làm background`, 'bot', true);
      showDynamic('Background Updated', '');
      closeModal('bgModal');
    };
    img.onerror = function() {
      addMessage(" Li khi ti nh", 'bot', true);
    };
    img.src = imageData;
  };
  reader.onerror = function() {
    addMessage(" Li khi c file", 'bot', true);
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function saveCustomBackground(imageData) {
  try {
    localStorage.setItem('customBackground', imageData);
    localStorage.setItem('selectedBackground', imageData);
  } catch (e) {
    console.warn('Không lu c background vào localStorage:', e);
    addMessage(" Không lu c nh (quá ln)", 'bot', true);
  }
}

function changeBackground(url) {
  if (url === "") {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = '#0a0a0a';
  } else {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  }
  
  try { 
    localStorage.setItem('selectedBackground', url); 
  } catch(e) {
    console.warn('Không th lu background setting:', e);
  }
  
  try { 
    new Audio('audio/notification.mp3').play().catch(()=>{}); 
  } catch(e){}
}

window.addEventListener('load', ()=> {
  try { 
    const savedBg = localStorage.getItem('selectedBackground'); 
    if (savedBg && savedBg !== "") {
      changeBackground(savedBg);
    }
  } catch(e) {
    console.warn('Không th load background ã lu:', e);
  }
});
// ===== COMMAND HANDLER =====
function handleCommand(txt) {
  const cmd = txt.trim().toLowerCase();
  if (cmd === '/dowmod' || cmd === 'dowmod') {
    addMessage(' Khi ng các mod hin có...', 'bot', true);
    let html = '<div class="neon-text" style="margin-top:10px;">';
    const mods = [
      {title:'NAKROTH GKTS', desc:'NAKROTH Skin Mod - High Quality Graphics', img:'https://i.postimg.cc/L5K9dVrK/53202.jpg', link:'https://www.mediafire.com/file/lahx0a7mbghy3wl/NAKROTH_GKTS-XMOD.zip/file'},
      {title:'NAKROTH TTVT', desc:'NAKROTH Thunder Skin - Premium Edition', img:'https://i.postimg.cc/7PJd5vbP/16712.jpg', link:'https://www.mediafire.com/file/l9n4gopwl4ygdbf/NAKROTH_TTVT-XMOD.zip/file'},
      {title:'Resources Pack', desc:'Complete Game Resources - Latest Update', img:'https://i.postimg.cc/YSCWv57R/lien-quan-x-conan-lich-ra-mat-tat-ca-cac-skin-collab-1.webp', link:'https://www.mediafire.com/file/oi7bhkm1fqbb1p8/Resources_28.8.zip/file'}
    ];
    mods.forEach(m => {
      html += `<div class="mod-card"><img src="${m.img}" alt="${m.title}" loading="lazy">
                <div class="mod-info"><h4 class="neon-text">${m.title}</h4><p>${m.desc}</p>
                <a href="${m.link}" target="_blank" class="neon-text"> DOWNLOAD</a></div></div>`;
    });
    html += '</div>';
    setTimeout(()=>{ addHtmlMessage(html,'bot'); showDynamic('Mod Database',''); }, 1100);
    return;
  }
  
  if (cmd === '/playmusic' || cmd === 'playmusic') {
    const musicHtml = `<div class="neon-text music-info"> NOW PLAYING: <strong>SONG ${currentSong+1}</strong>
      <div class="music-controls">
        <button class="music-btn neon-text" onclick="playMusic()"> PLAY</button>
        <button class="music-btn neon-text" onclick="pauseMusic()"> PAUSE</button>
        <button class="music-btn neon-text" onclick="prevSong()"> PREV</button>
        <button class="music-btn neon-text" onclick="nextSong()"> NEXT</button>
      </div></div>`;
    setTimeout(()=>{ addHtmlMessage(musicHtml,'bot'); playMusic(); showDynamic('Neural Music Active',''); }, 900);
    return;
  }
  if (cmd.startsWith('/search')) {
  const query = txt.replace('/search','').trim() || "AI chatbot";
  
  addMessage(` Bt u tìm kim cho: "${query}"`, "bot");

  // Fake progress messages
  setTimeout(() => addMessage(" ang truy vn Google...", "bot"), 1000);
  setTimeout(() => addMessage(" ang truy vn Wikipedia...", "bot"), 2000);
  setTimeout(() => addMessage(" ang truy vn Reddit...", "bot"), 3000);
  setTimeout(() => addMessage(" ang truy vn StackOverflow...", "bot"), 4000);

  // Fake search results (snippets + source)
  setTimeout(() => {
    const resultsHtml = `
      <div class="search-results" style="margin-top:10px; font-size:14px; line-height:1.5;">
        <p><strong> Google:</strong> "${query}" là mt trong nhng công c AI ph bin nht, c nhiu ngi dùng  h tr công vic, hc tp và sáng to ni dung.<br>
        <a href="https://www.google.com/search?q=${encodeURIComponent(query)}" target="_blank">Ngun: Google Search</a></p>
        
        <p><strong> Wikipedia:</strong> <em>${query}</em> là mt h thng trí tu nhân to dng mô hình ngôn ng, có kh nng i thoi, tr li câu hi và sinh vn bn theo ng cnh.<br>
        <a href="https://vi.wikipedia.org/wiki/${encodeURIComponent(query)}" target="_blank">Ngun: Wikipedia</a></p>
        
        <p><strong> Reddit:</strong> Ngi dùng tho lun rng "${query}" rt hu ích, nhng ôi khi tr li cha chính xác. Nhiu ngi chia s mo  khai thác ti a hiu qu.<br>
        <a href="https://www.reddit.com/search/?q=${encodeURIComponent(query)}" target="_blank">Ngun: Reddit</a></p>
        
        <p><strong> StackOverflow:</strong> Các lp trình viên hi v cách tích hp "${query}" vào ng dng web. Có nhiu on code mu và gii pháp ti u c chia s.<br>
        <a href="https://stackoverflow.com/search?q=${encodeURIComponent(query)}" target="_blank">Ngun: StackOverflow</a></p>
      </div>
    `;
    addHtmlMessage(resultsHtml, "bot");
  }, 6000);

  return;
}
  
  if (cmd === '/background' || cmd === 'background') {
    addMessage(' Mi bn chn background...', 'bot', true);
    setTimeout(()=>{ openBackgroundSelector(); showDynamic('Background Selector',''); }, 600);
    return;
  }
  
  if (cmd === '/clear' || cmd === 'clear') {
    clearChatHistory();
    addMessage(' ã xoá lch s!', 'bot', true);
    showDynamic('History Cleared','');
    return;
  }
  
  if (cmd === '/help') {
    const helpText = ` Danh sách lnh:
/dowmod - Ti mod game
/playmusic - Phát nhc
/background - i background (có th upload nh)
/clear - Xóa lch s chat
/about - Thông tin bot
/time - Xem thi gian hin ti 
/random - random s ngu nhiên
/donate - donate tác gi
/upload - upload nh`;
    addMessage(helpText, "bot");
    return;
  }

  if (cmd === '/upload') {
    addMessage(" Hng dn upload nh làm background:\n1. Gõ /background\n2. Click 'Chn nh trên Máy'\n3. Chn file nh (JPG, PNG, GIF)\n4. i upload xong!", "bot");
    return;
  }

  if (cmd === '/about') {
    addMessage(" Chatbot XMOD v1.3", "bot");
    return;
  }

  if (cmd === '/donate') {
    addMessage(" Donate qua Vietinbank!", "bot");
    return;
  }

  if (cmd === '/time') {
    addMessage(` Bây gi là: ${new Date().toLocaleTimeString("vi-VN")}`, "bot");
    return;
  }

  if (cmd === '/random') {
    addMessage(` Random ngu nhiên: ${Math.floor(Math.random() * 100) + 1}`, "bot");
    return;
  }
  
  if (cmd.startsWith('/')) {
    addMessage(' COMMAND NOT FOUND! Try /help', 'bot', true);
    showDynamic('System Error','');
    return;
  }
  
  addMessage(' AI ang suy ngh...', 'bot', true);
  callChatAI(txt).then(answer => {
    addMessage(answer, 'bot', true);
    showDynamic('AI Response','');
  });
}

// ===== EVENTS =====
function handleSend() {
  const txt = userInput.value.trim();
  if (!txt) return;
  addMessage(txt, 'user');
  userInput.value = '';
  document.body.style.animation = 'shake 0.45s ease-in-out';
  setTimeout(()=> document.body.style.animation = 'none', 480);
  setTimeout(()=> handleCommand(txt), 400);
}

if (sendBtn) sendBtn.addEventListener('click', handleSend);
if (userInput) userInput.addEventListener('keydown', (e)=> { if (e.key === 'Enter') handleSend(); });
userInput.addEventListener('input', ()=> { if (Math.random() < 0.08) createFloatingParticle(); });

setTimeout(()=> {
  loadChatHistory();
  if (!chatArea.children.length) {
    addMessage(' Welcome to NEON XMOD Chatbot!', 'bot', true);
    setTimeout(()=> addMessage(' Th: /dowmod, /playmusic, /background, /help', 'bot', true), 1200);
  }
  showDynamic('System Online','');
}, 600);

document.addEventListener('contextmenu', e => e.preventDefault());

// ===== KEYBOARD SHORTCUTS & EXTRA FEATURES =====
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'b') {
    e.preventDefault();
    openBackgroundSelector();
    addMessage(' ã m background selector bng Ctrl+B', 'bot', true);
  }
  
  if (e.ctrlKey && e.key === 'm') {
    e.preventDefault();
    if (audioPlayer.paused) {
      playMusic();
      addMessage(' Nhc phát (Ctrl+M)', 'bot', true);
    } else {
      pauseMusic();
      addMessage(' Nhc dng (Ctrl+M)', 'bot', true);
    }
  }
  
  if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    clearChatHistory();
    addMessage(' ã xoá lch s (Ctrl+L)', 'bot', true);
  }
  
  if (e.key === 'F1') {
    e.preventDefault();
    handleCommand('/help');
  }
});

// ===== DRAG & DROP IMAGE UPLOAD =====
document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  document.body.style.border = '3px dashed #00ffff';
  document.body.style.backgroundColor = 'rgba(0, 255, 255, 0.1)';
});

document.addEventListener('dragleave', (e) => {
  if (!e.relatedTarget || e.relatedTarget.nodeName === 'HTML') {
    document.body.style.border = '';
    document.body.style.backgroundColor = '';
  }
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
  document.body.style.border = '';
  document.body.style.backgroundColor = '';
  
  const files = Array.from(e.dataTransfer.files);
  const imageFile = files.find(file => file.type.startsWith('image/'));
  
  if (imageFile) {
    addMessage(' Drag & Drop nh thành công!', 'bot', true);
    showDynamic('Processing Image', '');
    const fakeEvent = { target: { files: [imageFile], value: '' } };
    handleImageUpload(fakeEvent);
  } else {
    addMessage(' Vui lòng kéo th file nh (JPG, PNG, GIF)', 'bot', true);
  }
});

// ===== AUTO SAVE SETTINGS =====
function saveUserSettings() {
  const settings = {
    musicVolume: audioPlayer.volume,
    currentSong: currentSong,
    lastActiveTime: Date.now()
  };
  try {
    localStorage.setItem('xmod_user_settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Không th lu settings:', e);
  }
}

function loadUserSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem('xmod_user_settings') || '{}');
    if (settings.musicVolume) audioPlayer.volume = settings.musicVolume;
    if (settings.currentSong) currentSong = settings.currentSong;
  } catch (e) {
    console.warn('Không th load settings:', e);
  }
}

// ===== WELCOME MESSAGE WITH STATS =====
function showWelcomeStats() {
  const visitCount = parseInt(localStorage.getItem('xmod_visit_count') || '0') + 1;
  localStorage.setItem('xmod_visit_count', visitCount.toString());
  
  const welcomeHtml = `
    <div class="welcome-stats neon-text">
      <div> Chào mng ln th ${visitCount}!</div>
      <div style="font-size: 12px; opacity: 0.7; margin-top: 5px;">
         Mo: Kéo th nh vào trang  i background
      </div>
      <div style="font-size: 12px; opacity: 0.7;">
         Phím tt: Ctrl+B (Background), Ctrl+M (Music), Ctrl+L (Clear)
      </div>
    </div>
  `;
  
  setTimeout(() => { addHtmlMessage(welcomeHtml, 'bot'); }, 2000);
}

// ===== PERFORMANCE MONITORING =====
function monitorPerformance() {
  const particles = document.querySelectorAll('.trail-particle, .floating-particle');
  if (particles.length > 50) {
    particles.forEach((p, index) => { if (index < particles.length - 30) p.remove(); });
  }
}
setInterval(monitorPerformance, 5000);

// ===== EASTER EGGS =====
let konamiCode = [];
const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
document.addEventListener('keydown', (e) => {
  konamiCode.push(e.code);
  if (konamiCode.length > konamiSequence.length) konamiCode.shift();
  if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
    addMessage(' KONAMI CODE ACTIVATED! ', 'bot', true);
    document.body.style.filter = 'hue-rotate(180deg) saturate(2)';
    setTimeout(() => {
      document.body.style.filter = '';
      addMessage(' Bn ã m khóa Matrix! Chúc mng!', 'bot', true);
    }, 3000);
    konamiCode = [];
  }
});

// ===== INIT EVERYTHING =====
loadUserSettings();
setInterval(saveUserSettings, 30000);
window.addEventListener('beforeunload', saveUserSettings);

console.log(' XMOD Chatbot v1.3 - Fully Loaded!');
console.log(' Commands: /dowmod, /playmusic, /background, /clear, /help');
console.log(' Shortcuts: Ctrl+B, Ctrl+M, Ctrl+L, F1');
console.log(' Drag & Drop: Supported for images');
// ===== XML TOOLS - CLEAN VERSION =====
(function() {
  'use strict';

  // Kim tra JSZip
  if (typeof JSZip === 'undefined') {
    console.error('JSZip not loaded! Add <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>');
  }

  // Utility
  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  // Create modal once
  function createXmlModal() {
    if (document.getElementById('xmlModal')) return;
    
    const modalHtml = `
<div id="xmlModal" class="modal">
  <div class="modal-content" style="max-width:700px;">
    <button class="modal-close" onclick="closeXmlModal()">×</button>
    <h3 class="modal-title"> XML TOOLS</h3>
    
    <div style="background:rgba(239,68,68,0.1);border:1px solid #ef4444;border-radius:10px;padding:12px;margin-bottom:15px;">
      <div style="color:#ef4444;font-weight:bold;margin-bottom:5px;"> LU Ý</div>
      <div style="color:#fff;font-size:13px;">Luôn backup file gc trc khi x lý!</div>
    </div>

    <div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap;">
      <label style="color:#fff;cursor:pointer;">
        <input type="radio" name="xmlTool" value="reformat" checked> Reformat (ti u game)
      </label>
      <label style="color:#fff;cursor:pointer;">
        <input type="radio" name="xmlTool" value="obf_safe"> Obfuscate Safe
      </label>
      <label style="color:#fff;cursor:pointer;">
        <input type="radio" name="xmlTool" value="obf_aggr"> Obfuscate Aggressive
      </label>
    </div>

    <input type="file" id="xmlFileInput" accept=".xml,.zip" style="width:100%;padding:10px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.3);border-radius:8px;color:#fff;margin-bottom:15px;">

    <div id="xmlProgress" style="display:none;margin-bottom:15px;">
      <div id="xmlStatus" style="color:#22c55e;margin-bottom:8px;font-size:14px;"></div>
      <div style="background:rgba(255,255,255,0.1);height:8px;border-radius:4px;overflow:hidden;">
        <div id="xmlBar" style="height:100%;width:0%;background:#22c55e;transition:width 0.3s;"></div>
      </div>
    </div>

    <div id="xmlResult"></div>
  </div>
</div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  // Open modal
  window.openXmlModal = function() {
    createXmlModal();
    const modal = document.getElementById('xmlModal');
    if (modal) {
      modal.classList.add('show');
      addMessage(' Chn file XML hoc ZIP  x lý', 'bot');
    }
  };

  // Close modal
  window.closeXmlModal = function() {
    const modal = document.getElementById('xmlModal');
    if (modal) modal.classList.remove('show');
  };

  // Progress helpers
  function setStatus(text) {
    const el = document.getElementById('xmlStatus');
    if (el) el.textContent = text;
  }

  function setProgress(percent) {
    const el = document.getElementById('xmlBar');
    if (el) el.style.width = Math.min(100, Math.max(0, percent)) + '%';
  }

  function showProgress() {
    const el = document.getElementById('xmlProgress');
    if (el) el.style.display = 'block';
  }

  function hideProgress() {
    const el = document.getElementById('xmlProgress');
    if (el) el.style.display = 'none';
  }

  // XML Processing Functions
  function reformatXml(xmlText) {
    let decl = '';
    const declMatch = xmlText.match(/^\s*(<\?xml[^>]*\?>)/i);
    if (declMatch) {
      decl = declMatch[1];
      xmlText = xmlText.slice(declMatch.index + declMatch[1].length);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    
    if (doc.querySelector('parsererror')) {
      return xmlText;
    }

    function serialize(node, indent = 0) {
      const pad = ' '.repeat(indent);
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue.trim();
        return text ? pad + text + '\n' : '';
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return '';

      let out = pad + '<' + node.tagName;
      const attrs = Array.from(node.attributes || []);
      
      if (attrs.length === 0 && node.childNodes.length === 0) {
        return out + ' />\n';
      }

      if (attrs.length > 0) {
        out += '\n';
        for (let a of attrs) {
          out += pad + '    ' + a.name + '="' + a.value + '"\n';
        }
        if (node.childNodes.length === 0) {
          return out.trimEnd() + ' />\n';
        }
        out += pad + '>';
      } else {
        out += '>';
      }

      if (node.childNodes.length > 0) {
        out += '\n';
        for (let i = 0; i < node.childNodes.length; i++) {
          out += serialize(node.childNodes[i], indent + 4);
        }
        out += pad + '</' + node.tagName + '>\n';
      }

      return out;
    }

    let body = serialize(doc.documentElement, 4);
    const final = (decl || '<?xml version="1.0" encoding="utf-8"?>') + '\n' + body;
    
    // Remove first 4 spaces from lines after declaration
    const lines = final.split('\n');
    const output = [lines[0]];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      output.push(line.startsWith('    ') ? line.slice(4) : line);
    }
    
    return output.join('\n');
  }

  function obfuscateXml(xmlText, aggressive = false) {
    let decl = '';
    const declMatch = xmlText.match(/^\s*(<\?xml[^>]*\?>)/i);
    if (declMatch) {
      decl = declMatch[1];
      xmlText = xmlText.slice(declMatch.index + declMatch[1].length);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    
    if (doc.querySelector('parsererror')) {
      return xmlText;
    }

    // Remove comments
    function removeComments(node) {
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        const ch = node.childNodes[i];
        if (ch.nodeType === Node.COMMENT_NODE) {
          node.removeChild(ch);
        } else if (ch.nodeType === Node.ELEMENT_NODE) {
          removeComments(ch);
        }
      }
    }
    removeComments(doc);

    // Shuffle attributes
    function shuffleAttrs(elem) {
      if (elem.attributes && elem.attributes.length > 1) {
        const arr = Array.from(elem.attributes).map(a => [a.name, a.value]);
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        const names = Array.from(elem.attributes).map(a => a.name);
        names.forEach(n => elem.removeAttribute(n));
        arr.forEach(([k, v]) => elem.setAttribute(k, v));
      }
      Array.from(elem.children).forEach(child => shuffleAttrs(child));
    }
    shuffleAttrs(doc.documentElement);

    // Aggressive: base64 encode text
    if (aggressive) {
      function encodeText(node) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
          node.nodeValue = btoa(unescape(encodeURIComponent(node.nodeValue)));
        }
        Array.from(node.childNodes).forEach(child => encodeText(child));
      }
      encodeText(doc.documentElement);
    }

    let body = new XMLSerializer().serializeToString(doc.documentElement);
    body = body.replace(/>\s+</g, '><').trim();

    return (decl || '<?xml version="1.0" encoding="utf-8"?>') + '\n' + body;
  }

  // Main file handler
  async function processFile(file) {
    showProgress();
    setProgress(5);
    setStatus(' ang c file...');

    const toolType = document.querySelector('input[name="xmlTool"]:checked')?.value || 'reformat';
    const isZip = file.name.toLowerCase().endsWith('.zip');

    await delay(300);

    if (isZip && typeof JSZip !== 'undefined') {
      // Process ZIP
      setStatus(' ang gii nén ZIP...');
      setProgress(15);

      const jszip = new JSZip();
      const zip = await jszip.loadAsync(file);
      const xmlFiles = Object.keys(zip.files).filter(p => p.toLowerCase().endsWith('.xml'));

      if (xmlFiles.length === 0) {
        setStatus(' Không tìm thy file XML trong ZIP');
        hideProgress();
        addMessage(' ZIP không cha file XML nào', 'bot');
        return;
      }

      setStatus(` Tìm thy ${xmlFiles.length} file XML`);
      setProgress(25);
      addMessage(` Tìm thy ${xmlFiles.length} file XML, ang x lý...`, 'bot');
      await delay(500);

      const outZip = new JSZip();
      let processed = 0;

      for (const path of xmlFiles) {
        processed++;
        setStatus(` X lý ${processed}/${xmlFiles.length}: ${path.split('/').pop()}`);
        setProgress(25 + Math.round((processed / xmlFiles.length) * 60));

        addMessage(` Using tool on ${path.split('/').pop()}`, 'bot');
        await delay(200);

        const content = await zip.file(path).async('string');
        let result;

        if (toolType === 'reformat') {
          result = reformatXml(content);
        } else {
          result = obfuscateXml(content, toolType === 'obf_aggr');
        }

        outZip.file(path, result);
      }

      setStatus(' ang óng gói kt qu...');
      setProgress(90);
      addMessage(' ang to file ZIP...', 'bot');
      await delay(500);

      const blob = await outZip.generateAsync({ 
  type: 'blob',
  compression: 'DEFLATE',
  compressionOptions: { level: 6 }
});
      const outName = file.name.replace(/\.zip$/i, '') + '-processed.zip';
      const url = URL.createObjectURL(blob);

      setStatus(' Hoàn thành!');
      setProgress(100);

      const resultDiv = document.getElementById('xmlResult');
      if (resultDiv) {
        resultDiv.innerHTML = `
          <div style="background:rgba(34,197,94,0.1);border:1px solid #22c55e;border-radius:10px;padding:15px;text-align:center;">
            <div style="color:#22c55e;font-weight:bold;margin-bottom:10px;"> X lý thành công ${xmlFiles.length} file!</div>
            <a href="${url}" download="${outName}" class="modal-btn" onclick="handleDownload(event, '${url}', '${outName}')" style="display:inline-block;background:#22c55e;color:#000;">
               Ti v ${outName}
            </a>
          </div>
        `;
      }

      addMessage(` Hoàn thành! ã x lý ${xmlFiles.length} file`, 'bot');
      setTimeout(() => URL.revokeObjectURL(url), 5 * 60 * 1000);

    } else if (file.name.toLowerCase().endsWith('.xml')) {
      // Process single XML
      setStatus(' ang c XML...');
      setProgress(30);
      addMessage(' ang phân tích cu trúc XML...', 'bot');
      await delay(500);

      const reader = new FileReader();
      reader.onload = async function(e) {
        const content = e.target.result;
        
        setStatus(' ang x lý...');
        setProgress(50);
        addMessage(' Using tools...', 'bot');
        await delay(700);

        let result;
        if (toolType === 'reformat') {
          result = reformatXml(content);
        } else {
          result = obfuscateXml(content, toolType === 'obf_aggr');
        }

        setStatus(' ang to file kt qu...');
        setProgress(80);
        await delay(300);

        const blob = new Blob([result], { type: 'application/xml' });
        const outName = file.name.replace(/\.xml$/i, '') + '-processed.xml';
        const url = URL.createObjectURL(blob);

        setStatus(' Hoàn thành!');
        setProgress(100);

        const resultDiv = document.getElementById('xmlResult');
        if (resultDiv) {
          resultDiv.innerHTML = `
            <div style="background:rgba(34,197,94,0.1);border:1px solid #22c55e;border-radius:10px;padding:15px;text-align:center;">
              <div style="color:#22c55e;font-weight:bold;margin-bottom:10px;"> X lý thành công!</div>
              <a href="${url}" download="${outName}" class="modal-btn" onclick="handleDownload(event, '${url}', '${outName}')" style="display:inline-block;background:#22c55e;color:#000;">
                 Ti v ${outName}
              </a>
            </div>
          `;
        }

        addMessage(' Hoàn thành! Click nút ti v bên di', 'bot');
        setTimeout(() => URL.revokeObjectURL(url), 5 * 60 * 1000);
      };

      reader.onerror = function() {
        setStatus(' Li c file');
        hideProgress();
        addMessage(' Không th c file', 'bot');
      };

      reader.readAsText(file);
    } else {
      setStatus(' Vui lòng chn file .xml hoc .zip');
      hideProgress();
      addMessage(' File không hp l. Ch chp nhn .xml hoc .zip', 'bot');
    }
  }

  // Wire up file input - ONLY ONCE
  document.addEventListener('DOMContentLoaded', function() {
    createXmlModal();
    
    const fileInput = document.getElementById('xmlFileInput');
    if (fileInput) {
      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          processFile(file);
          e.target.value = ''; // Reset input
        }
      });
    }

    // Button to open modal
    const xmlBtn = document.getElementById('openXmlToolBtn');
    if (xmlBtn) {
      xmlBtn.addEventListener('click', openXmlModal);
    }
  });
// Download handler
  window.handleDownload = function(event, url, filename) {
    event.preventDefault();
    
    // To link tm
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    
    // Click và xóa
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      addMessage(' File ã ti v th mc Downloads', 'bot');
    }, 100);
  };
  console.log(' XML Tools loaded');
})();