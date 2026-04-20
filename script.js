/**
 * 第五人格排位降溫日記（MVP）
 * 純前端：HTML/CSS/JS + localStorage
 *
 * 擴充指南：
 * 1) 新增主題：在 THEMES 物件新增設定。
 * 2) 新增發洩按鈕：參考 bindVentButtons 寫法增加設定。
 * 3) 新增遊戲：以新的 initXXXGame() 函式掛進 init()。
 * 4) 換裝換素材：調整 DRESSUP_OPTIONS，將文字替換成圖片路徑。
 */

const STORAGE_KEY = "idv_cooldown_diary_v2";

const THEMES = {
  rage: {
    key: "rage",
    label: "😡 紅溫模式",
    title: "本日紅溫紀錄",
    subtitle: "先發洩，再冷靜，今天先別怪自己。",
    stickers: ["😡", "🔥"],
    placeholders: {
      mood: "例如：怒火、想摔手機",
      worst: "例如：開局秒倒、硬救雙倒",
      story: "把今天所有逆天操作都打出來。",
    },
    calmTip: {
      有: "你有降溫成功，給你一個擁抱 🫂",
      一點點: "有降一點點，休息一下再排。",
      沒有: "沒關係，今天先到這裡也可以。",
    },
  },
  dream: {
    key: "dream",
    label: "😭💔 夢女崩潰",
    title: "退坑失敗日記",
    subtitle: "想卸載，但我老公還在裡面。",
    stickers: ["😭", "💔"],
    placeholders: {
      mood: "例如：戀愛腦、心碎、暈船",
      worst: "例如：輸掉了但老公太帥無法退坑",
      story: "寫下你今天的愛恨情仇與失智戀愛腦。",
    },
    calmTip: {
      有: "你有冷靜一點，愛會過去，分也會回來。",
      一點點: "還在哭但有比較好，慢慢來。",
      沒有: "還在崩潰也沒事，先去喝水。",
    },
  },
  gloom: {
    key: "gloom",
    label: "🥹💦 社死模式",
    title: "今日社死懺悔錄",
    subtitle: "我今天拉了一坨，怕被匿名公審。",
    stickers: ["🥹", "💦"],
    placeholders: {
      mood: "例如：羞恥、想裝死、心虛",
      worst: "例如：最雷就是我自己",
      story: "誠實記錄社死過程，未來回看可以笑自己。",
    },
    calmTip: {
      有: "你已經面對社死了，超勇敢。",
      一點點: "還有點痛，但你正在恢復。",
      沒有: "先別苛責自己，輸贏都只是一天。",
    },
  },
};

/**
 * 換裝資料骨架：
 * 後續可把每個項目改成 { label, image } 形式，並在 renderDressup 讀 image 疊圖。
 */
const DRESSUP_OPTIONS = {
  hair: ["髮型 A", "髮型 B", "髮型 C"],
  cloth: ["衣服 A", "衣服 B", "衣服 C"],
  acc: ["配件 A", "配件 B", "配件 C"],
  face: ["表情 A", "表情 B", "表情 C"],
};

const state = {
  theme: "rage",
  diaryDate: "",
  mood: "",
  worst: "",
  story: "",
  calmLevel: "有",
  rageMeter: 55,
  poopCount: 0,
  eyeCount: 0,
  dressup: { hair: 0, cloth: 0, acc: 0, face: 0 },
};

const el = {
  themeTitle: document.getElementById("themeTitle"),
  themeSubtitle: document.getElementById("themeSubtitle"),
  themeButtons: document.getElementById("themeButtons"),
  stickerLeft: document.getElementById("stickerLeft"),
  stickerRight: document.getElementById("stickerRight"),

  diaryDate: document.getElementById("diaryDate"),
  mood: document.getElementById("mood"),
  worst: document.getElementById("worst"),
  story: document.getElementById("story"),
  calmLevel: document.getElementById("calmLevel"),
  rageMeter: document.getElementById("rageMeter"),
  rageValue: document.getElementById("rageValue"),
  calmHint: document.getElementById("calmHint"),
  saveBtn: document.getElementById("saveBtn"),
  clearBtn: document.getElementById("clearBtn"),

  poopBtn: document.getElementById("poopBtn"),
  eyeBtn: document.getElementById("eyeBtn"),
  poopCount: document.getElementById("poopCount"),
  eyeCount: document.getElementById("eyeCount"),
  burstArea: document.getElementById("burstArea"),

  gameTime: document.getElementById("gameTime"),
  gameScore: document.getElementById("gameScore"),
  startGameBtn: document.getElementById("startGameBtn"),
  gameArea: document.getElementById("gameArea"),
  target: document.getElementById("target"),
  gameMsg: document.getElementById("gameMsg"),

  hairLayer: document.getElementById("hairLayer"),
  clothLayer: document.getElementById("clothLayer"),
  accLayer: document.getElementById("accLayer"),
  faceLayer: document.getElementById("faceLayer"),
  dressupControls: document.getElementById("dressupControls"),
};

function getTodayDateInputValue() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function applyTheme() {
  const theme = THEMES[state.theme] || THEMES.rage;
  document.body.dataset.theme = theme.key;
  el.themeTitle.textContent = theme.title;
  el.themeSubtitle.textContent = theme.subtitle;
  el.stickerLeft.textContent = theme.stickers[0];
  el.stickerRight.textContent = theme.stickers[1];
  el.mood.placeholder = theme.placeholders.mood;
  el.worst.placeholder = theme.placeholders.worst;
  el.story.placeholder = theme.placeholders.story;
  applyCalmHint();

  [...el.themeButtons.querySelectorAll("button")].forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === state.theme);
  });
}

function buildThemeButtons() {
  el.themeButtons.innerHTML = "";
  Object.values(THEMES).forEach((theme) => {
    const button = document.createElement("button");
    button.className = "theme-btn";
    button.dataset.theme = theme.key;
    button.textContent = theme.label;
    button.addEventListener("click", () => {
      state.theme = theme.key;
      applyTheme();
      saveState();
    });
    el.themeButtons.appendChild(button);
  });
}

function applyCalmHint() {
  const theme = THEMES[state.theme] || THEMES.rage;
  const hint = theme.calmTip[state.calmLevel] || "先寫下來，呼吸一下。";
  el.calmHint.textContent = hint;
}

function renderDiary() {
  el.diaryDate.value = state.diaryDate || getTodayDateInputValue();
  el.mood.value = state.mood;
  el.worst.value = state.worst;
  el.story.value = state.story;
  el.calmLevel.value = state.calmLevel;
  el.rageMeter.value = state.rageMeter;
  el.rageValue.textContent = String(state.rageMeter);
  applyCalmHint();
}

function renderCounters() {
  el.poopCount.textContent = String(state.poopCount);
  el.eyeCount.textContent = String(state.eyeCount);
}

function bindDiaryEvents() {
  const sync = () => {
    state.diaryDate = el.diaryDate.value;
    state.mood = el.mood.value;
    state.worst = el.worst.value;
    state.story = el.story.value;
    saveState();
  };

  [el.diaryDate, el.mood, el.worst, el.story].forEach((input) => {
    input.addEventListener("input", sync);
  });

  el.calmLevel.addEventListener("change", () => {
    state.calmLevel = el.calmLevel.value;
    applyCalmHint();
    saveState();
  });

  el.rageMeter.addEventListener("input", () => {
    state.rageMeter = Number(el.rageMeter.value);
    el.rageValue.textContent = String(state.rageMeter);
    saveState();
  });

  el.saveBtn.addEventListener("click", () => {
    sync();
    el.saveBtn.textContent = "✅ 已儲存";
    setTimeout(() => {
      el.saveBtn.textContent = "💾 儲存今天紀錄";
    }, 900);
  });

  el.clearBtn.addEventListener("click", () => {
    state.diaryDate = getTodayDateInputValue();
    state.mood = "";
    state.worst = "";
    state.story = "";
    state.calmLevel = "有";
    state.rageMeter = 55;
    state.poopCount = 0;
    state.eyeCount = 0;
    saveState();
    renderDiary();
    renderCounters();
  });
}

function spawnBurst(emojiPool) {
  for (let i = 0; i < 9; i += 1) {
    const item = document.createElement("span");
    item.className = "burst";
    item.textContent = emojiPool[i % emojiPool.length];
    item.style.left = `${20 + Math.random() * 70}%`;
    item.style.top = `${26 + Math.random() * 34}px`;
    item.style.setProperty("--x", `${(Math.random() - 0.5) * 260}px`);
    item.style.setProperty("--y", `${-75 - Math.random() * 95}px`);
    el.burstArea.appendChild(item);
    setTimeout(() => item.remove(), 860);
  }

  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 420);

  // TODO: 如要補音效，可在此用 new Audio('your-sfx.mp3').play();
}

function bindVentButtons() {
  el.poopBtn.addEventListener("click", () => {
    state.poopCount += 1;
    renderCounters();
    saveState();
    spawnBurst(["💩", "🔥", "💥"]);
  });

  el.eyeBtn.addEventListener("click", () => {
    state.eyeCount += 1;
    renderCounters();
    saveState();
    spawnBurst(["🙄", "💅", "😮‍💨"]);
  });
}

function initTinyGame() {
  let timer = null;
  let mover = null;
  let leftSec = 12;
  let score = 0;

  const moveTarget = () => {
    const maxX = Math.max(0, el.gameArea.clientWidth - 90);
    const maxY = Math.max(0, el.gameArea.clientHeight - 45);
    el.target.style.left = `${Math.random() * maxX}px`;
    el.target.style.top = `${Math.random() * maxY}px`;
  };

  const stop = () => {
    clearInterval(timer);
    clearInterval(mover);
    el.target.hidden = true;
    el.startGameBtn.disabled = false;
    el.gameMsg.textContent = `你今天成功發洩了 ${score} 次，值得鼓掌。`;
  };

  el.startGameBtn.addEventListener("click", () => {
    leftSec = 12;
    score = 0;
    el.gameTime.textContent = String(leftSec);
    el.gameScore.textContent = String(score);
    el.target.hidden = false;
    el.startGameBtn.disabled = true;
    el.gameMsg.textContent = "快點雷包！把火氣點掉！";
    moveTarget();

    mover = setInterval(moveTarget, 650);
    timer = setInterval(() => {
      leftSec -= 1;
      el.gameTime.textContent = String(leftSec);
      if (leftSec <= 0) stop();
    }, 1000);
  });

  el.target.addEventListener("click", () => {
    score += 1;
    el.gameScore.textContent = String(score);
    moveTarget();
  });
}

function renderDressup() {
  el.hairLayer.textContent = DRESSUP_OPTIONS.hair[state.dressup.hair];
  el.clothLayer.textContent = DRESSUP_OPTIONS.cloth[state.dressup.cloth];
  el.accLayer.textContent = DRESSUP_OPTIONS.acc[state.dressup.acc];
  el.faceLayer.textContent = DRESSUP_OPTIONS.face[state.dressup.face];
}

function initDressupControls() {
  const controls = [
    ["hair", "髮型"],
    ["cloth", "衣服"],
    ["acc", "配件"],
    ["face", "表情"],
  ];

  el.dressupControls.innerHTML = "";

  controls.forEach(([key, label]) => {
    const row = document.createElement("div");
    row.className = "option-row";

    const title = document.createElement("strong");
    title.textContent = `${label}：`;

    const prev = document.createElement("button");
    prev.textContent = "⬅ 上一個";

    const next = document.createElement("button");
    next.textContent = "下一個 ➡";

    const change = (step) => {
      const list = DRESSUP_OPTIONS[key];
      const len = list.length;
      state.dressup[key] = (state.dressup[key] + step + len) % len;
      renderDressup();
      saveState();
    };

    prev.addEventListener("click", () => change(-1));
    next.addEventListener("click", () => change(1));

    row.append(title, prev, next);
    el.dressupControls.appendChild(row);
  });
}

function init() {
  loadState();

  if (!state.diaryDate) {
    state.diaryDate = getTodayDateInputValue();
  }

  buildThemeButtons();
  applyTheme();
  renderDiary();
  renderCounters();
  renderDressup();
  initDressupControls();

  bindDiaryEvents();
  bindVentButtons();
  initTinyGame();
}

init();
