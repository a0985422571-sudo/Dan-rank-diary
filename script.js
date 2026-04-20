/**
 * 第五人格排位降溫日記 MVP
 * - 純前端 + localStorage
 * - 結構設計為可擴充：主題、發洩按鈕、小遊戲都用設定物件管理
 */

const STORAGE_KEY = "idvCooldownDiary.v1";

const THEMES = {
  rage: {
    id: "rage",
    name: "😡 被雷到紅溫了",
    title: "本日紅溫紀錄",
    tagline: "先把怒氣倒出來，等等再說誰送分。",
    stickers: ["😡", "🔥"],
    placeholders: {
      quick: "先打一行：我現在真的很想尖叫。",
      diary: "把今天所有逆天操作都寫出來，不要客氣。",
      mood: "例如：火大、想報警、想摔手機",
      worst: "例如：隊友硬救雙倒、我自己空刀",
    },
  },
  dream: {
    id: "dream",
    name: "😭💔 退坑失敗日記",
    title: "都是因為我老公還在",
    tagline: "一邊崩潰，一邊戀愛腦上頭。",
    stickers: ["😭", "💕"],
    placeholders: {
      quick: "先打一行：我想卸載，但我老公還在裡面。",
      diary: "寫下你今天的愛恨情仇，戀愛腦也沒關係。",
      mood: "例如：心碎、戀愛腦、失戀但還想排",
      worst: "例如：輸了但我老公語音太好聽",
    },
  },
  guilt: {
    id: "guilt",
    name: "🥹💦 社死懺悔錄",
    title: "我是不是會被公審",
    tagline: "今天打得像在濕答答地滑倒。",
    stickers: ["🥹", "🫠"],
    placeholders: {
      quick: "先打一行：今天我拉了大坨，先道歉。",
      diary: "把社死過程完整記錄，讓未來的你笑出來。",
      mood: "例如：羞恥、害怕、想裝死",
      worst: "例如：我自己、我的手、我的腦子",
    },
  },
};

/**
 * 換裝資料：未來可直接換成圖片 URL。
 * 你可以把 label 改成素材名稱，並在 renderDressup 中改成 <img> 疊圖顯示。
 */
const DRESSUP_DATA = {
  hair: ["髮型 A", "髮型 B", "髮型 C"],
  outfit: ["衣服 A", "衣服 B", "衣服 C"],
  accessory: ["配件 A", "配件 B", "配件 C"],
  face: ["表情 A", "表情 B", "表情 C"],
};

const state = {
  theme: "rage",
  poopCount: 0,
  eyeCount: 0,
  rage: 50,
  quickInput: "",
  diaryText: "",
  moodInput: "",
  worstInput: "",
  calmSelect: "有",
  dressup: { hair: 0, outfit: 0, accessory: 0, face: 0 },
};

const el = {
  todayDate: document.getElementById("todayDate"),
  mainTitle: document.getElementById("mainTitle"),
  themeTagline: document.getElementById("themeTagline"),
  themeSwitcher: document.getElementById("themeSwitcher"),
  stickerLeft: document.getElementById("themeStickerLeft"),
  stickerRight: document.getElementById("themeStickerRight"),
  quickInput: document.getElementById("quickInput"),
  moodInput: document.getElementById("moodInput"),
  worstInput: document.getElementById("worstInput"),
  diaryText: document.getElementById("diaryText"),
  calmSelect: document.getElementById("calmSelect"),
  rageMeter: document.getElementById("rageMeter"),
  rageLabel: document.getElementById("rageLabel"),
  calmStatus: document.getElementById("calmStatus"),
  saveDiaryBtn: document.getElementById("saveDiaryBtn"),
  clearBtn: document.getElementById("clearBtn"),
  poopBtn: document.getElementById("poopBtn"),
  eyeBtn: document.getElementById("eyeBtn"),
  poopCount: document.getElementById("poopCount"),
  eyeCount: document.getElementById("eyeCount"),
  burstLayer: document.getElementById("burstLayer"),
  gameTime: document.getElementById("gameTime"),
  gameScore: document.getElementById("gameScore"),
  startGameBtn: document.getElementById("startGameBtn"),
  shootingArea: document.getElementById("shootingArea"),
  movingTarget: document.getElementById("movingTarget"),
  gameTip: document.getElementById("gameTip"),
  dressupControls: document.getElementById("dressupControls"),
  hairLayer: document.getElementById("hairLayer"),
  outfitLayer: document.getElementById("outfitLayer"),
  accLayer: document.getElementById("accLayer"),
  faceLayer: document.getElementById("faceLayer"),
};

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    Object.assign(state, data);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function getTodayLabel() {
  const now = new Date();
  return now.toLocaleDateString("zh-Hant-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
}

function renderThemeButtons() {
  el.themeSwitcher.innerHTML = "";
  Object.values(THEMES).forEach((theme) => {
    const btn = document.createElement("button");
    btn.className = "theme-btn";
    btn.textContent = theme.name;
    if (theme.id === state.theme) btn.classList.add("active");
    btn.addEventListener("click", () => {
      state.theme = theme.id;
      renderTheme();
      saveState();
    });
    el.themeSwitcher.appendChild(btn);
  });
}

function renderTheme() {
  const theme = THEMES[state.theme] || THEMES.rage;
  document.body.dataset.theme = theme.id;
  el.mainTitle.textContent = theme.title;
  el.themeTagline.textContent = theme.tagline;
  el.stickerLeft.textContent = theme.stickers[0];
  el.stickerRight.textContent = theme.stickers[1];
  el.quickInput.placeholder = theme.placeholders.quick;
  el.diaryText.placeholder = theme.placeholders.diary;
  el.moodInput.placeholder = theme.placeholders.mood;
  el.worstInput.placeholder = theme.placeholders.worst;
  renderThemeButtons();
}

function renderCounters() {
  el.poopCount.textContent = String(state.poopCount);
  el.eyeCount.textContent = String(state.eyeCount);
}

function renderInputs() {
  el.quickInput.value = state.quickInput;
  el.diaryText.value = state.diaryText;
  el.moodInput.value = state.moodInput;
  el.worstInput.value = state.worstInput;
  el.calmSelect.value = state.calmSelect;
  el.rageMeter.value = state.rage;
  el.rageLabel.textContent = String(state.rage);
  updateCalmStatus();
}

function updateCalmStatus() {
  const textMap = {
    有: "你今天有成功降溫，值得一個抱抱 🫂",
    一點點: "有降一點點，再深呼吸兩次。",
    沒有: "還在紅溫沒關係，先別開下一把。",
  };
  el.calmStatus.textContent = textMap[state.calmSelect] || "先寫點東西讓自己冷靜。";
}

function bindDiaryInputs() {
  const sync = () => {
    state.quickInput = el.quickInput.value;
    state.diaryText = el.diaryText.value;
    state.moodInput = el.moodInput.value;
    state.worstInput = el.worstInput.value;
    saveState();
  };

  [el.quickInput, el.diaryText, el.moodInput, el.worstInput].forEach((input) => {
    input.addEventListener("input", sync);
  });

  el.calmSelect.addEventListener("change", () => {
    state.calmSelect = el.calmSelect.value;
    updateCalmStatus();
    saveState();
  });

  el.rageMeter.addEventListener("input", () => {
    state.rage = Number(el.rageMeter.value);
    el.rageLabel.textContent = String(state.rage);
    saveState();
  });

  el.saveDiaryBtn.addEventListener("click", () => {
    sync();
    el.saveDiaryBtn.textContent = "✅ 已儲存";
    setTimeout(() => {
      el.saveDiaryBtn.textContent = "💾 儲存今天紀錄";
    }, 900);
  });

  el.clearBtn.addEventListener("click", () => {
    state.quickInput = "";
    state.diaryText = "";
    state.moodInput = "";
    state.worstInput = "";
    state.calmSelect = "有";
    state.rage = 50;
    state.poopCount = 0;
    state.eyeCount = 0;
    saveState();
    renderInputs();
    renderCounters();
  });
}

function spawnBurst(emojiList) {
  for (let i = 0; i < 8; i += 1) {
    const particle = document.createElement("span");
    particle.className = "burst";
    particle.textContent = emojiList[i % emojiList.length];
    particle.style.left = `${20 + Math.random() * 80}%`;
    particle.style.top = `${30 + Math.random() * 40}px`;
    particle.style.setProperty("--x", `${(Math.random() - 0.5) * 240}px`);
    particle.style.setProperty("--y", `${-80 - Math.random() * 80}px`);
    el.burstLayer.appendChild(particle);
    setTimeout(() => particle.remove(), 900);
  }

  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 450);

  // TODO: 若要補音效可在此播放 Audio（目前依需求先省略）
}

function bindVentButtons() {
  el.poopBtn.addEventListener("click", () => {
    state.poopCount += 1;
    renderCounters();
    saveState();
    spawnBurst(["💩", "💥", "🤬"]);
  });

  el.eyeBtn.addEventListener("click", () => {
    state.eyeCount += 1;
    renderCounters();
    saveState();
    spawnBurst(["🙄", "💅", "😮‍💨"]);
  });
}

function bindShootingGame() {
  let timer = null;
  let mover = null;
  let timeLeft = 15;
  let score = 0;

  const moveTarget = () => {
    const maxX = Math.max(0, el.shootingArea.clientWidth - 90);
    const maxY = Math.max(0, el.shootingArea.clientHeight - 46);
    el.movingTarget.style.left = `${Math.random() * maxX}px`;
    el.movingTarget.style.top = `${Math.random() * maxY}px`;
  };

  const stopGame = () => {
    clearInterval(timer);
    clearInterval(mover);
    el.movingTarget.hidden = true;
    el.startGameBtn.disabled = false;
    el.gameTip.textContent = `你今天成功發洩了 ${score} 次，辛苦了。`;
  };

  el.startGameBtn.addEventListener("click", () => {
    timeLeft = 15;
    score = 0;
    el.gameTime.textContent = String(timeLeft);
    el.gameScore.textContent = String(score);
    el.startGameBtn.disabled = true;
    el.movingTarget.hidden = false;
    el.gameTip.textContent = "快點它！把雷包點到消失！";
    moveTarget();

    mover = setInterval(moveTarget, 650);
    timer = setInterval(() => {
      timeLeft -= 1;
      el.gameTime.textContent = String(timeLeft);
      if (timeLeft <= 0) stopGame();
    }, 1000);
  });

  el.movingTarget.addEventListener("click", () => {
    score += 1;
    el.gameScore.textContent = String(score);
    moveTarget();
  });
}

function renderDressup() {
  el.hairLayer.textContent = DRESSUP_DATA.hair[state.dressup.hair];
  el.outfitLayer.textContent = DRESSUP_DATA.outfit[state.dressup.outfit];
  el.accLayer.textContent = DRESSUP_DATA.accessory[state.dressup.accessory];
  el.faceLayer.textContent = DRESSUP_DATA.face[state.dressup.face];
}

function buildDressupControls() {
  const rows = [
    ["hair", "髮型"],
    ["outfit", "衣服"],
    ["accessory", "配件"],
    ["face", "表情"],
  ];

  el.dressupControls.innerHTML = "";
  rows.forEach(([key, label]) => {
    const row = document.createElement("div");
    row.className = "option-row";

    const title = document.createElement("strong");
    title.textContent = `${label}：`;

    const prev = document.createElement("button");
    prev.textContent = "⬅ 上一個";

    const next = document.createElement("button");
    next.textContent = "下一個 ➡";

    const onChange = (delta) => {
      const list = DRESSUP_DATA[key];
      const len = list.length;
      state.dressup[key] = (state.dressup[key] + delta + len) % len;
      renderDressup();
      saveState();
    };

    prev.addEventListener("click", () => onChange(-1));
    next.addEventListener("click", () => onChange(1));

    row.append(title, prev, next);
    el.dressupControls.appendChild(row);
  });
}

function init() {
  loadState();
  el.todayDate.textContent = getTodayLabel();
  renderTheme();
  renderCounters();
  renderInputs();
  renderDressup();
  buildDressupControls();
  bindDiaryInputs();
  bindVentButtons();
  bindShootingGame();
}

init();
