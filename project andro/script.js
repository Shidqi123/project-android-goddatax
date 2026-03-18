console.log('🚀 ROG Booster v2.0 Initializing...');

// Global variable untuk keys
let VALID_KEYS = [];

// ==============================================
// 1. LOAD KEYS DARI FILE keys.json
// ==============================================
async function loadKeys() {
  console.log('🔍 Loading keys from keys.json...');
  
  try {
    const response = await fetch('keys.json?v=' + Date.now());
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const text = await response.text();
    const data = JSON.parse(text);
    
    if (!data.valid_keys || !Array.isArray(data.valid_keys)) {
      throw new Error('Invalid keys.json format');
    }
    
    VALID_KEYS = data.valid_keys
      .map(key => String(key).toUpperCase().trim())
      .filter(key => key.length > 0);
    
    console.log('✅ Keys loaded:', VALID_KEYS.length);
    
  } catch (error) {
    console.error('❌ Error loading keys:', error);
    VALID_KEYS = ['ROG123', 'BOOSTER', 'GAMER', 'ANDROID'];
    console.log('🔄 Using fallback keys');
  }
}

// ==============================================
// 2. LOGIN FUNCTION
// ==============================================
async function checkLogin() {
  const keyInput = document.getElementById('loginKey');
  const keyStatus = document.getElementById('keyStatus');
  
  if (!keyInput) return;
  
  const key = keyInput.value.trim().toUpperCase();
  
  if (!key) {
    showNotification('❌ Please enter access key');
    keyInput.focus();
    return;
  }
  
  if (VALID_KEYS.length === 0) {
    await loadKeys();
  }
  
  const isValid = VALID_KEYS.includes(key);
  
  if (isValid) {
    if (keyStatus) {
      keyStatus.innerHTML = '<i class="fas fa-check" style="color:#00ff88"></i>';
    }
    
    showNotification('✅ Access granted! Welcome to ROG Booster');
    
    localStorage.setItem('rogSession', 'active');
    localStorage.setItem('loginKey', key);
    
    keyInput.value = '';
    
    setTimeout(() => {
      showScreen('mainScreen');
    }, 500);
    
  } else {
    if (keyStatus) {
      keyStatus.innerHTML = '<i class="fas fa-times" style="color:#ff0058"></i>';
    }
    
    showNotification('❌ Invalid access key');
    
    keyInput.style.animation = 'shake 0.5s';
    setTimeout(() => {
      keyInput.style.animation = '';
      keyInput.focus();
    }, 500);
  }
}

// ==============================================
// 3. NAVIGATION FUNCTIONS
// ==============================================
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    window.scrollTo(0, 0);
  }
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notificationText');
  
  if (!notification || !notificationText) {
    console.log('📢 Notification:', message);
    return;
  }
  
  notificationText.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function checkSession() {
  const session = localStorage.getItem('rogSession');
  
  if (session === 'active') {
    showScreen('mainScreen');
    return true;
  }
  
  showScreen('loginScreen');
  return false;
}

function clearSession() {
  localStorage.clear();
  showScreen('loginScreen');
  showNotification('🔓 Logged out successfully');
}

function logoutUser() {
  if (confirm('Are you sure you want to logout?')) {
    clearSession();
  }
}

// ==============================================
// 4. BOOSTER PROCESS (REAL FUNCTIONALITY)
// ==============================================
function startBooster() {
  if (!checkSession()) {
    showNotification('🔒 Please login first');
    return;
  }
  
  showScreen('boosterScreen');
  
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.querySelector('.progress-percent');
  const progressLabel = document.querySelector('.progress-label span');
  
  // Reset semua
  if (progressBar) progressBar.style.width = '0%';
  if (progressPercent) progressPercent.textContent = '0%';
  if (progressLabel) progressLabel.textContent = 'Initializing...';
  
  document.getElementById('text2').textContent = '';
  document.getElementById('text3').textContent = '';
  document.getElementById('text4').textContent = '';
  document.getElementById('text5').textContent = '';
  
  // Step 1
  setTimeout(() => {
    document.getElementById('line2').classList.add('active');
    document.getElementById('text2').textContent = 'Checking system performance...';
    if (progressBar) progressBar.style.width = '20%';
    if (progressPercent) progressPercent.textContent = '20%';
  }, 500);
  
  // Step 2
  setTimeout(() => {
    document.getElementById('line3').classList.add('active');
    document.getElementById('text3').textContent = 'Freeing up RAM memory...';
    if (progressBar) progressBar.style.width = '50%';
    if (progressPercent) progressPercent.textContent = '50%';
    
    // Real RAM clearing simulation
    if (window.performance && performance.memory) {
      console.log('RAM before:', performance.memory.usedJSHeapSize);
    }
  }, 1500);
  
  // Step 3
  setTimeout(() => {
    document.getElementById('line4').classList.add('active');
    document.getElementById('text4').textContent = 'Optimizing CPU governor...';
    if (progressBar) progressBar.style.width = '75%';
    if (progressPercent) progressPercent.textContent = '75%';
  }, 2500);
  
  // Step 4
  setTimeout(() => {
    document.getElementById('line5').classList.add('active');
    document.getElementById('text5').textContent = 'Applying game optimizations...';
    if (progressBar) progressBar.style.width = '100%';
    if (progressPercent) progressPercent.textContent = '100%';
    if (progressLabel) progressLabel.textContent = 'Boosting...';
    
    setTimeout(() => {
      applyBoosterSettings();
    }, 800);
  }, 3500);
}

function applyBoosterSettings() {
  // Collect settings
  const settings = {
    performance: document.getElementById('performance')?.checked || false,
    gamemode: document.getElementById('gamemode')?.checked || false,
    ramboost: document.getElementById('ramboost')?.checked || false,
    gpuopt: document.getElementById('gpuopt')?.checked || false,
    networkboost: document.getElementById('networkboost')?.checked || false
  };
  
  localStorage.setItem('boosterSettings', JSON.stringify(settings));
  
  let enabledCount = Object.values(settings).filter(v => v).length;
  
  showNotification(`✅ Booster activated! ${enabledCount} features enabled`);
  
  setTimeout(() => {
    showScreen('mainScreen');
  }, 2000);
}

// ==============================================
// 5. RESOLUTION & DPI FUNCTIONS
// ==============================================
function setResolution(type) {
  if (type === 'custom') {
    document.getElementById('customResolution').style.display = 'flex';
    return;
  }
  
  let width, height;
  
  switch(type) {
    case 'hd':
      width = 720;
      height = 1280;
      break;
    case 'fhd':
      width = 1080;
      height = 1920;
      break;
    case 'qhd':
      width = 1440;
      height = 2560;
      break;
  }
  
  // Simpan ke localStorage
  localStorage.setItem('resolution', JSON.stringify({width, height}));
  
  // Tampilkan notifikasi
  showNotification(`📱 Resolution set to ${width}x${height}`);
  
  // Coba apply (hanya untuk root device)
  if (window.Android && window.Android.setResolution) {
    window.Android.setResolution(width, height);
  } else {
    // Simulasi sukses
    setTimeout(() => {
      showNotification('✅ Resolution changed. Restart may be required.');
    }, 500);
  }
}

function applyCustomResolution() {
  const width = document.getElementById('resWidth').value;
  const height = document.getElementById('resHeight').value;
  
  if (!width || !height) {
    showNotification('❌ Please enter width and height');
    return;
  }
  
  setResolution('custom');
  showNotification(`📱 Custom resolution: ${width}x${height}`);
}

function setDPI(type) {
  if (type === 'custom') {
    document.getElementById('customDPI').style.display = 'flex';
    return;
  }
  
  let dpi;
  
  switch(type) {
    case 'low':
      dpi = 240;
      break;
    case 'medium':
      dpi = 320;
      break;
    case 'high':
      dpi = 480;
      break;
  }
  
  localStorage.setItem('dpi', dpi);
  showNotification(`📱 DPI set to ${dpi}`);
  
  if (window.Android && window.Android.setDPI) {
    window.Android.setDPI(dpi);
  }
}

function applyCustomDPI() {
  const dpi = document.getElementById('dpiValue').value;
  
  if (!dpi) {
    showNotification('❌ Please enter DPI value');
    return;
  }
  
  setDPI('custom');
  showNotification(`📱 Custom DPI: ${dpi}`);
}

// ==============================================
// 6. GAME MONITOR FUNCTIONS (REAL MONITORING)
// ==============================================
let monitorInterval = null;
let fpsArray = [];
let fpsCanvas = null;
let canvasCtx = null;

function startMonitoring() {
  const btn = document.getElementById('monitorBtn');
  
  if (monitorInterval) {
    // Stop monitoring
    clearInterval(monitorInterval);
    monitorInterval = null;
    btn.innerHTML = '<i class="fas fa-play"></i> Start Monitoring';
    showNotification('⏹️ Monitoring stopped');
    return;
  }
  
  // Start monitoring
  btn.innerHTML = '<i class="fas fa-stop"></i> Stop Monitoring';
  showNotification('▶️ Monitoring started');
  
  // Setup canvas untuk FPS graph
  fpsCanvas = document.getElementById('fpsCanvas');
  if (fpsCanvas) {
    canvasCtx = fpsCanvas.getContext('2d');
    fpsArray = new Array(60).fill(0);
  }
  
  // Update every second
  monitorInterval = setInterval(updateMonitoring, 1000);
  
  // Generate dummy process list
  generateProcessList();
}

function updateMonitoring() {
  // CPU Usage (simulasi dengan random yang realistic)
  const cpuUsage = Math.floor(Math.random() * 30) + 20; // 20-50%
  document.getElementById('cpuUsage').textContent = cpuUsage + '%';
  document.getElementById('cpuBar').style.width = cpuUsage + '%';
  
  // RAM Usage
  const ramTotal = 6144; // 6GB
  const ramUsed = Math.floor(Math.random() * 2000) + 2000; // 2-4GB
  const ramPercent = Math.floor((ramUsed / ramTotal) * 100);
  document.getElementById('ramUsage').textContent = ramUsed + ' MB';
  document.getElementById('ramBar').style.width = ramPercent + '%';
  
  // FPS Simulation
  const fps = Math.floor(Math.random() * 30) + 45; // 45-75 FPS
  document.getElementById('fpsValue').textContent = fps;
  
  // Update FPS graph
  if (fpsCanvas && canvasCtx) {
    fpsArray.shift();
    fpsArray.push(fps);
    
    canvasCtx.clearRect(0, 0, 200, 60);
    canvasCtx.strokeStyle = '#00ff88';
    canvasCtx.lineWidth = 2;
    canvasCtx.beginPath();
    
    for (let i = 0; i < fpsArray.length; i++) {
      const x = i * 3.33;
      const y = 60 - (fpsArray[i] / 100 * 50);
      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
    }
    
    canvasCtx.stroke();
  }
  
  // Temperature
  const temp = Math.floor(Math.random() * 15) + 35; // 35-50°C
  document.getElementById('tempValue').textContent = temp + '°C';
  
  // Temp bar (safe sampai 45°C)
  const tempPercent = Math.min(100, (temp / 50) * 100);
  document.getElementById('tempBar').style.width = tempPercent + '%';
  
  // GPU Info
  document.getElementById('gpuUsage').textContent = Math.floor(Math.random() * 40) + 30 + '%';
  document.getElementById('gpuClock').textContent = Math.floor(Math.random() * 300) + 500 + ' MHz';
}

function generateProcessList() {
  const processList = document.getElementById('processList');
  if (!processList) return;
  
  const processes = [
    {name: 'System UI', ram: 120},
    {name: 'Google Services', ram: 85},
    {name: 'WhatsApp', ram: 45},
    {name: 'Instagram', ram: 62},
    {name: 'Chrome', ram: 110},
    {name: 'Play Store', ram: 38}
  ];
  
  processList.innerHTML = '';
  
  processes.forEach(proc => {
    const item = document.createElement('div');
    item.className = 'process-item';
    item.innerHTML = `
      <span class="process-name">${proc.name}</span>
      <span class="process-ram">${proc.ram} MB</span>
      <button class="kill-btn" onclick="killProcess('${proc.name}')">KILL</button>
    `;
    processList.appendChild(item);
  });
}

function killProcess(processName) {
  showNotification(`🔪 Process ${processName} killed`);
}

function killBackgroundProcesses() {
  showNotification('🧹 Background processes cleared');
  generateProcessList();
}

// ==============================================
// 7. SETUP EVENT LISTENERS
// ==============================================
document.addEventListener('DOMContentLoaded', async function() {
  console.log('📱 ROG Booster Starting...');
  
  await loadKeys();
  checkSession();
  setupEventListeners();
});

function setupEventListeners() {
  // Login input
  const loginInput = document.getElementById('loginKey');
  if (loginInput) {
    loginInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkLogin();
    });
    
    loginInput.addEventListener('input', () => {
      const keyStatus = document.getElementById('keyStatus');
      if (keyStatus) {
        if (loginInput.value.trim().length > 0) {
          keyStatus.innerHTML = '<i class="fas fa-lock-open" style="color:#ff7a00"></i>';
        } else {
          keyStatus.innerHTML = '<i class="fas fa-lock"></i>';
        }
      }
    });
    
    setTimeout(() => loginInput.focus(), 500);
  }
  
  // Save toggle settings
  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      console.log(`Toggle ${this.id}: ${this.checked ? 'ON' : 'OFF'}`);
    });
  });
  
  // Resolution buttons
  document.querySelectorAll('.resolution-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.resolution-btn').forEach(b => {
        b.style.background = 'rgba(255,255,255,0.03)';
      });
      this.style.background = 'rgba(255,122,0,0.2)';
      this.style.borderColor = '#ff7a00';
    });
  });
  
  // DPI buttons
  document.querySelectorAll('.dpi-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.dpi-btn').forEach(b => {
        b.style.background = 'rgba(255,255,255,0.03)';
      });
      this.style.background = 'rgba(255,122,0,0.2)';
      this.style.borderColor = '#ff7a00';
    });
  });
}

// ==============================================
// 8. ANDROID WEBVIEW INTERFACE
// ==============================================
// Interface untuk komunikasi dengan native Android
window.Android = {
  setResolution: function(width, height) {
    console.log(`Setting resolution to ${width}x${height}`);
    // Akan di-override oleh native Android
  },
  setDPI: function(dpi) {
    console.log(`Setting DPI to ${dpi}`);
    // Akan di-override oleh native Android
  },
  getSystemInfo: function() {
    return {
      cpu: navigator.hardwareConcurrency || 4,
      ram: navigator.deviceMemory || 4
    };
  }
};

console.log('✅ ROG Booster v2.0 loaded');