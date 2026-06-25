// App State
let recipes = [];
let activeRecipe = null;
let activeTimers = [];
let audioContext = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadRecipes();
  setupEventListeners();
  registerServiceWorker();
  
  // Initialize Lucide Icons for static elements
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && systemDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
    toggleThemeIcon(true);
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    toggleThemeIcon(false);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  toggleThemeIcon(newTheme === "dark");
}

function toggleThemeIcon(isDark) {
  const darkIcon = document.querySelector(".theme-icon-dark");
  const lightIcon = document.querySelector(".theme-icon-light");
  if (isDark) {
    darkIcon.style.display = "none";
    lightIcon.style.display = "block";
  } else {
    darkIcon.style.display = "block";
    lightIcon.style.display = "none";
  }
}

// Load Recipes
function loadRecipes() {
  const localRecipes = localStorage.getItem("custom_recipes");
  const custom = localRecipes ? JSON.parse(localRecipes) : [];
  recipes = [...initialRecipes, ...custom];
  renderRecipesList();
}

// Save Recipe
function saveCustomRecipe(newRecipe) {
  const localRecipes = localStorage.getItem("custom_recipes");
  const custom = localRecipes ? JSON.parse(localRecipes) : [];
  custom.push(newRecipe);
  localStorage.setItem("custom_recipes", JSON.stringify(custom));
  recipes.push(newRecipe);
  renderRecipesList();
  selectRecipe(newRecipe.id);
}

// Render Sidebar Recipe Cards
function renderRecipesList(filterCategory = "hepsi", searchQuery = "") {
  const container = document.getElementById("recipes-list");
  container.innerHTML = "";
  
  const filtered = recipes.filter(r => {
    const matchesCategory = filterCategory === "hepsi" || r.category === filterCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-list-state">Tarif bulunamadı</div>`;
    return;
  }

  filtered.forEach(r => {
    const card = document.createElement("div");
    card.className = `recipe-card ${activeRecipe && activeRecipe.id === r.id ? 'active' : ''}`;
    card.addEventListener("click", () => selectRecipe(r.id));

    // Fallback image
    const imgUrl = r.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&auto=format&fit=crop&q=60";

    card.innerHTML = `
      <img src="${imgUrl}" alt="${r.title}" class="recipe-card-img" onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&auto=format&fit=crop&q=60'">
      <div class="recipe-card-info">
        <h3>${r.title}</h3>
        <div class="recipe-card-meta">
          <span><i data-lucide="clock" style="width:12px;height:12px;"></i> ${r.prepTime + r.cookTime} dk</span>
          <span><i data-lucide="award" style="width:12px;height:12px;"></i> ${r.difficulty}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons({ attrs: { class: 'lucide-icon' } });
  }
}

// Select and Display Recipe Details
function selectRecipe(id) {
  activeRecipe = recipes.find(r => r.id === id);
  
  // Update active card class
  document.querySelectorAll(".recipe-card").forEach(card => card.classList.remove("active"));
  renderRecipesList(
    document.querySelector(".tab-btn.active").dataset.category,
    document.getElementById("recipe-search").value
  );

  document.getElementById("welcome-view").style.display = "none";
  const detailView = document.getElementById("recipe-detail-view");
  detailView.style.display = "block";

  const imgUrl = activeRecipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop&q=80";

  // Build View
  detailView.innerHTML = `
    <div class="recipe-hero">
      <img src="${imgUrl}" alt="${activeRecipe.title}" class="recipe-hero-img" onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop&q=80'">
      <div class="recipe-hero-overlay">
        <h2>${activeRecipe.title}</h2>
        <div class="recipe-hero-badges">
          <span class="badge badge-category">${activeRecipe.category}</span>
          <span class="badge badge-difficulty">${activeRecipe.difficulty}</span>
        </div>
      </div>
    </div>

    <div class="recipe-stats">
      <div class="stat-card">
        <div class="stat-icon"><i data-lucide="clock"></i></div>
        <div class="stat-info">
          <span>Hazırlık</span>
          <strong>${activeRecipe.prepTime} dk</strong>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i data-lucide="flame"></i></div>
        <div class="stat-info">
          <span>Pişirme</span>
          <strong>${activeRecipe.cookTime} dk</strong>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i data-lucide="users"></i></div>
        <div class="stat-info">
          <span>Porsiyon</span>
          <strong>${activeRecipe.servings} Kişilik</strong>
        </div>
      </div>
    </div>

    <div class="recipe-body-grid">
      <div class="ingredients-card">
        <h3><i data-lucide="shopping-basket"></i> Malzemeler</h3>
        <ul class="ingredients-list">
          ${activeRecipe.ingredients.map((ing, idx) => `
            <li class="ingredient-item" onclick="toggleIngredient(this)">
              <div class="ingredient-checkbox">
                <i data-lucide="check" style="width: 12px; height: 12px; display: none;"></i>
              </div>
              <span class="ingredient-text">${ing}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="prep-card">
        <h3><i data-lucide="cooking-pot"></i> Hazırlanışı</h3>
        <div class="steps-list">
          ${activeRecipe.instructions.map((step, idx) => {
            const parsedStepText = parseTimersInText(step, activeRecipe.title, idx + 1);
            return `
              <div class="step-item" id="step-${idx + 1}">
                <div class="step-number" onclick="toggleStepCompleted(${idx + 1})">${idx + 1}</div>
                <div class="step-content">
                  <p class="step-text">${parsedStepText}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Initialize Lucide Icons for newly injected DOM elements
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Bind inline timer click events
  detailView.querySelectorAll(".timer-badge").forEach(badge => {
    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      const seconds = parseInt(badge.dataset.duration);
      const label = badge.dataset.label;
      const stepNum = badge.dataset.step;
      const recipeTitle = badge.dataset.recipe;
      
      startOrToggleTimer(recipeTitle, stepNum, label, seconds, badge);
    });
  });

  // Scroll details to top
  document.getElementById("active-recipe-section").scrollTop = 0;
}

// Check/Uncheck ingredient
window.toggleIngredient = function(element) {
  element.classList.toggle("checked");
  const checkIcon = element.querySelector(".ingredient-checkbox i");
  if (checkIcon) {
    checkIcon.style.display = element.classList.contains("checked") ? "block" : "none";
  }
};

// Check/Uncheck cooking step
window.toggleStepCompleted = function(stepNum) {
  const stepItem = document.getElementById(`step-${stepNum}`);
  if (stepItem) {
    stepItem.classList.toggle("completed");
  }
};

// Parse durations and convert to clickable elements
// Matches: "X dakika", "X dk", "X saniye", "X sn", "X saat", "X-Y dakika", "X-Y dk", etc.
function parseTimersInText(text, recipeTitle, stepNum) {
  // Regex mapping time expressions
  const pattern = /(\d+(?:\.\d+)?)(?:-(\d+))?\s*(dakika|dk|saniye|sn|saat|sa|min|mins|minute|minutes|second|seconds|sec|hour|hours)/gi;
  
  return text.replace(pattern, (match, val1, val2, unit) => {
    let numVal = parseFloat(val1);
    // If range is specified (e.g. 2-3 min), take the upper limit for accuracy
    if (val2) {
      numVal = parseFloat(val2);
    }
    
    let seconds = 0;
    const lowerUnit = unit.toLowerCase();
    
    if (lowerUnit.includes("saniye") || lowerUnit.includes("sn") || lowerUnit.includes("sec") || lowerUnit.includes("second")) {
      seconds = numVal;
    } else if (lowerUnit.includes("saat") || lowerUnit.includes("sa") || lowerUnit.includes("hour")) {
      seconds = numVal * 3600;
    } else {
      // Default to minutes
      seconds = numVal * 60;
    }
    
    // Label for the timer (e.g., "Sufle Adım 3")
    const label = `${match}`;
    
    return `<span class="timer-badge" data-duration="${seconds}" data-label="${label}" data-step="${stepNum}" data-recipe="${recipeTitle}" title="Sayacı Başlat">${match} <i data-lucide="play" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;"></i></span>`;
  });
}

// Timer Management Logic
function startOrToggleTimer(recipeTitle, stepNum, label, seconds, badgeElement) {
  const timerId = `${recipeTitle}-${stepNum}-${seconds}`;
  const existingIndex = activeTimers.findIndex(t => t.id === timerId);

  if (existingIndex > -1) {
    // Already running/paused, expand the bottom drawer
    document.getElementById("active-timers-panel").classList.add("expanded");
    return;
  }

  // Create new timer
  const timerObj = {
    id: timerId,
    recipe: recipeTitle,
    step: stepNum,
    label: label,
    totalSeconds: seconds,
    remainingSeconds: seconds,
    isRunning: true,
    badgeElement: badgeElement // might become obsolete if recipe changes but useful for now
  };

  if (badgeElement) {
    badgeElement.classList.add("running");
    badgeElement.innerHTML = `${label} <i data-lucide="pause" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;"></i>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Audio initialize on first user interaction
  initAudio();

  activeTimers.push(timerObj);
  updateFloatingPanel();
  document.getElementById("active-timers-panel").classList.add("expanded");
  
  // Start Interval if first timer
  if (activeTimers.length === 1) {
    startGlobalTimerLoop();
  }
}

let timerInterval = null;
function startGlobalTimerLoop() {
  if (timerInterval) return;
  
  timerInterval = setInterval(() => {
    if (activeTimers.length === 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      return;
    }

    activeTimers.forEach(t => {
      if (t.isRunning) {
        t.remainingSeconds--;
        if (t.remainingSeconds <= 0) {
          triggerAlarm(t);
        }
      }
    });

    // Remove expired timers from active list
    activeTimers = activeTimers.filter(t => t.remainingSeconds > 0);
    updateFloatingPanel();
    updateInlineBadges();
  }, 1000);
}

function updateInlineBadges() {
  document.querySelectorAll(".timer-badge").forEach(badge => {
    const timerId = `${badge.dataset.recipe}-${badge.dataset.step}-${badge.dataset.duration}`;
    const active = activeTimers.find(t => t.id === timerId);
    
    if (active) {
      if (active.isRunning) {
        badge.classList.add("running");
        badge.innerHTML = `${formatTime(active.remainingSeconds)} <i data-lucide="pause" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;"></i>`;
      } else {
        badge.classList.remove("running");
        badge.innerHTML = `${formatTime(active.remainingSeconds)} <i data-lucide="play" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;"></i>`;
      }
    } else {
      badge.classList.remove("running");
      badge.innerHTML = `${badge.dataset.label} <i data-lucide="play" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;"></i>`;
    }
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleTimerState(id) {
  const timer = activeTimers.find(t => t.id === id);
  if (timer) {
    timer.isRunning = !timer.isRunning;
    updateFloatingPanel();
    updateInlineBadges();
  }
}

function removeTimer(id) {
  activeTimers = activeTimers.filter(t => t.id !== id);
  updateFloatingPanel();
  updateInlineBadges();
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Audio System (Web Audio API Synthesizer - No External Assets Needed)
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playAlarmSound() {
  if (!audioContext) return;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = "sine";
  // Beautiful sweet alert tone
  osc.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
  osc.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.15); // C6 note
  
  gain.gain.setValueAtTime(0.5, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.6);
}

function triggerAlarm(timer) {
  playAlarmSound();
  
  // Show browser notification if permitted
  if (Notification.permission === "granted") {
    new Notification("Şefin Sayacı Bitti!", {
      body: `"${timer.recipe}" tarifindeki süreniz doldu: ${timer.label}`,
      icon: "/icon-192.png"
    });
  } else {
    alert(`🛎️ SÜRE BİTTİ!\n${timer.recipe}: ${timer.label}`);
  }
}

// Update Floating Dock UI
function updateFloatingPanel() {
  const panel = document.getElementById("active-timers-panel");
  const list = document.getElementById("timers-list");
  const count = document.getElementById("timer-badge-count");

  count.innerText = activeTimers.length;

  if (activeTimers.length === 0) {
    list.innerHTML = `<div class="empty-timers">Aktif çalışan sayaç yok</div>`;
    return;
  }

  list.innerHTML = activeTimers.map(t => `
    <div class="timer-item">
      <div class="timer-item-info">
        <div class="timer-item-title" title="${t.recipe}">${t.recipe}</div>
        <div class="timer-item-time">${formatTime(t.remainingSeconds)}</div>
      </div>
      <div class="timer-item-actions">
        <button class="timer-item-btn" onclick="toggleTimerState('${t.id}')" title="${t.isRunning ? 'Durdur' : 'Başlat'}">
          <i data-lucide="${t.isRunning ? 'pause' : 'play'}" style="width:14px;height:14px;"></i>
        </button>
        <button class="timer-item-btn remove-btn" onclick="removeTimer('${t.id}')" title="İptal Et">
          <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
        </button>
      </div>
    </div>
  `).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Event Listeners Setup
function setupEventListeners() {
  // Theme Toggle
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  
  // Floating timers expandable
  document.getElementById("timers-panel-trigger").addEventListener("click", () => {
    document.getElementById("active-timers-panel").classList.toggle("expanded");
  });

  // Search Filter
  document.getElementById("recipe-search").addEventListener("input", (e) => {
    const activeCatTab = document.querySelector(".tab-btn.active");
    renderRecipesList(activeCatTab.dataset.category, e.target.value);
  });

  // Category Tabs
  document.querySelectorAll(".tab-btn").forEach(tab => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const searchVal = document.getElementById("recipe-search").value;
      renderRecipesList(tab.dataset.category, searchVal);
    });
  });

  // Modal open/close
  const modal = document.getElementById("add-recipe-modal");
  document.getElementById("add-recipe-btn").addEventListener("click", () => {
    modal.style.display = "flex";
  });
  document.getElementById("close-modal-btn").addEventListener("click", closeModal);
  document.getElementById("cancel-modal-btn").addEventListener("click", closeModal);
  
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Request notifications permission on interaction
  document.body.addEventListener("click", () => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, { once: true });

  // Add Recipe Submission
  document.getElementById("add-recipe-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const title = document.getElementById("recipe-title").value;
    const category = document.getElementById("recipe-category").value;
    const difficulty = document.getElementById("recipe-difficulty").value;
    const prepTime = parseInt(document.getElementById("recipe-prep").value) || 0;
    const cookTime = parseInt(document.getElementById("recipe-cook").value) || 0;
    const servings = parseInt(document.getElementById("recipe-servings").value) || 1;
    const description = document.getElementById("recipe-desc").value;
    const image = document.getElementById("recipe-image").value;
    
    // Split ingredients and steps by lines
    const ingredients = document.getElementById("recipe-ingredients").value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== "");
      
    const instructions = document.getElementById("recipe-instructions").value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== "");

    const newRecipe = {
      id: "custom-" + Date.now(),
      title,
      description,
      category,
      image,
      prepTime,
      cookTime,
      servings,
      difficulty,
      ingredients,
      instructions
    };

    saveCustomRecipe(newRecipe);
    closeModal();
  });
}

function closeModal() {
  document.getElementById("add-recipe-modal").style.display = "none";
  document.getElementById("add-recipe-form").reset();
}

// Register PWA Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('ServiceWorker registered successfully.', reg.scope))
        .catch(err => console.log('ServiceWorker registration failed: ', err));
    });
  }
}
