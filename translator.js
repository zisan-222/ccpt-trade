// ============================================================
//  CptMarkets — translator.js  (Universal Language Switcher)
//  localStorage দিয়ে সব পেজে একসাথে ভাষা পরিবর্তন হবে
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("cpt_lang") || "en_UK";
  applyLanguage(saved);
  buildDropdown();
  attachAllLangButtons();
  attachSettingsLangItem();
});

// ─── ড্রপডাউন তৈরি ───────────────────────────────────────
function buildDropdown() {
  if (document.getElementById("cpt-lang-dropdown")) return;

  const drop = document.createElement("div");
  drop.id = "cpt-lang-dropdown";
  drop.style.cssText = `
    position: fixed;
    z-index: 999999;
    display: none;
    width: 210px;
    max-height: 340px;
    overflow-y: auto;
    background: #0a1628;
    border: 1.5px solid #ffc928;
    border-radius: 14px;
    box-shadow: 0 12px 48px rgba(0,0,0,0.95), 0 0 24px rgba(255,201,40,0.12);
    padding: 6px 0;
  `;

  const currentLang = localStorage.getItem("cpt_lang") || "en_UK";

  for (const code in languageData) {
    const isActive = code === currentLang;
    const item = document.createElement("div");
    item.setAttribute("data-lang-code", code);
    item.style.cssText = `
      padding: 11px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-family: inherit;
      border-bottom: 1px solid #1a2540;
      background: ${isActive ? "#16264a" : "transparent"};
      border-left: ${isActive ? "3px solid #ffc928" : "3px solid transparent"};
      transition: background 0.15s;
    `;
    item.innerHTML = `
      <span style="font-size:20px;line-height:1;">${languageData[code].flag}</span>
      <span style="color:#fff;font-weight:500;flex:1;">${languageData[code].langName}</span>
      ${isActive ? '<span style="color:#ffc928;font-size:16px;font-weight:bold;">✓</span>' : ""}
    `;

    item.addEventListener("mouseenter", () => {
      if (!isActive) item.style.background = "#1d2d50";
    });
    item.addEventListener("mouseleave", () => {
      if (!isActive) item.style.background = "transparent";
    });

    item.addEventListener("click", (e) => {
      e.stopPropagation();
      localStorage.setItem("cpt_lang", code);
      applyLanguage(code);
      closeDrop();
      // ড্রপডাউন পুনর্নির্মাণ (active চিহ্ন আপডেট)
      const old = document.getElementById("cpt-lang-dropdown");
      if (old) old.remove();
      buildDropdown();
    });

    drop.appendChild(item);
  }

  document.body.appendChild(drop);
  document.addEventListener("click", closeDrop);
}

// ─── ড্রপডাউন খোলা/বন্ধ ─────────────────────────────────
function openDrop(anchorEl) {
  const drop = document.getElementById("cpt-lang-dropdown");
  if (!drop) return;
  const r = anchorEl.getBoundingClientRect();
  // ডানদিক থেকে position করো
  drop.style.top  = (r.bottom + 8) + "px";
  drop.style.right = (window.innerWidth - r.right) + "px";
  drop.style.left = "auto";
  drop.style.display = "block";
}

function closeDrop() {
  const d = document.getElementById("cpt-lang-dropdown");
  if (d) d.style.display = "none";
}

function toggleDrop(anchorEl, e) {
  e.stopPropagation();
  const drop = document.getElementById("cpt-lang-dropdown");
  if (!drop) return;
  drop.style.display === "block" ? closeDrop() : openDrop(anchorEl);
}

// ─── সব ফ্ল্যাগ বাটনে ইভেন্ট যুক্ত করো ─────────────────
function attachAllLangButtons() {
  // id="languageBtn" অথবা class="language-btn" যেকোনো বাটন
  document.querySelectorAll("#languageBtn, .language-btn").forEach(btn => {
    // একাধিকবার listener যুক্ত না হওয়ার জন্য
    if (btn.dataset.cptListened) return;
    btn.dataset.cptListened = "1";
    btn.addEventListener("click", (e) => toggleDrop(btn, e));
  });
}

// ─── Settings পেজে Language item ────────────────────────
function attachSettingsLangItem() {
  const item = document.getElementById("settingsLangItem");
  if (!item) return;
  item.style.cursor = "pointer";
  item.addEventListener("click", (e) => toggleDrop(item, e));
}

// ─── ভাষা প্রয়োগ (সব পেজে) ────────────────────────────
function applyLanguage(langCode) {
  const lang = languageData[langCode];
  if (!lang) return;

  // ১. সব ফ্ল্যাগ বাটন আপডেট
  document.querySelectorAll("#languageBtn, .language-btn").forEach(btn => {
    btn.textContent = lang.flag;
    btn.title = lang.langName;
  });

  // ২. Settings পেজের ভাষার নাম আপডেট
  const stText = document.getElementById("settingsLangText");
  if (stText) stText.textContent = lang.langName;
  const stFlag = document.getElementById("settingsLangFlag");
  if (stFlag) stFlag.textContent = lang.flag;

  // ৩. data-key দিয়ে সব টেক্সট বদলাও
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (lang[key] !== undefined) el.textContent = lang[key];
  });

  // ৪. placeholder অনুবাদ
  document.querySelectorAll("[data-ph-key]").forEach(el => {
    const key = el.getAttribute("data-ph-key");
    if (lang[key] !== undefined) el.placeholder = lang[key];
  });
}
