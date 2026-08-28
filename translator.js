// ============================================================
//  CptMarkets — translator.js
//  Universal language switcher (works across ALL pages)
//  Must be included AFTER lang.js on every HTML page:
//
//      <script src="lang.js"></script>
//      <script src="translator.js"></script>
//
//  Matches the site's real markup convention:
//    <label data-key="username">Username</label>
//    <input data-ph-key="password" placeholder="Password">
//    <button id="languageBtn" class="language-btn">🇬🇧</button>
//
//  Settings page extras (optional, only used if present):
//    <div id="settingsLangItem">              -> also opens the language menu
//      <p id="settingsLangText">English (UK)</p>   -> shows current language name
//      <span id="settingsLangFlag">🇬🇧</span>       -> shows current language flag
//    </div>
// ============================================================

(function () {
  const STORAGE_KEY = "cpt_lang";
  const DEFAULT_LANG = "en_UK";

  // Elements that show the flag emoji as their own text/content and
  // should have that emoji swapped out when the language changes.
  const FLAG_DISPLAY_SELECTOR = "#languageBtn, .language-btn";

  // Elements that should open the language dropdown when clicked
  // (flag buttons + the settings page "Language" row, if present).
  const TRIGGER_SELECTOR = "#languageBtn, .language-btn, #settingsLangItem";

  // ------------------------------------------------------------
  // 1. Get / Set current language (persisted in localStorage so
  //    it is shared across every page of the site)
  // ------------------------------------------------------------
  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function setLanguage(langCode) {
    if (!window.languageData || !window.languageData[langCode]) {
      console.warn("cptTranslator: unknown language code:", langCode);
      return;
    }
    localStorage.setItem(STORAGE_KEY, langCode);
    applyTranslations();
    updateFlagButtons(langCode);
    updateSettingsLangDisplay(langCode);
    closeAllMenus();

    document.dispatchEvent(
      new CustomEvent("languageChanged", { detail: { lang: langCode } })
    );
  }

  // ------------------------------------------------------------
  // 2. Apply translations to the page
  //    - data-key             -> textContent
  //    - data-ph-key          -> placeholder
  //    - data-i18n-title      -> title attribute
  //    - (data-i18n / data-i18n-placeholder also supported, in
  //       case any page uses that convention instead)
  // ------------------------------------------------------------
  function applyTranslations() {
    const langCode = getCurrentLang();
    const lang = window.languageData[langCode] || window.languageData[DEFAULT_LANG];

    document.querySelectorAll("[data-key]").forEach((el) => {
      const key = el.getAttribute("data-key");
      if (key in lang) el.textContent = lang[key];
    });

    document.querySelectorAll("[data-ph-key]").forEach((el) => {
      const key = el.getAttribute("data-ph-key");
      if (key in lang) el.setAttribute("placeholder", lang[key]);
    });

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key in lang) el.textContent = lang[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key in lang) el.setAttribute("placeholder", lang[key]);
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (key in lang) el.setAttribute("title", lang[key]);
    });

    // Free-text elements (long sentences not covered by languageData keys)
    document.querySelectorAll("[data-i18n-auto]").forEach((el) => {
      if (!el.dataset.i18nOriginal) {
        el.dataset.i18nOriginal = el.textContent.trim();
      }
      if (typeof window.cptTranslatePhrase === "function") {
        el.textContent = window.cptTranslatePhrase(el.dataset.i18nOriginal, langCode);
      }
    });

    document.documentElement.setAttribute("lang", langCode.split("_")[0]);
  }

  // ------------------------------------------------------------
  // 3. Flag button(s) + dropdown menu
  //    Works for the header flag button on every page, AND for
  //    the "Language" row on the settings page (#settingsLangItem).
  // ------------------------------------------------------------
  function injectMenuStyles() {
    if (document.getElementById("cptLangMenuStyles")) return;
    const style = document.createElement("style");
    style.id = "cptLangMenuStyles";
    style.textContent = `
      .cpt-lang-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 8px;
        background: #12182b;
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 10px;
        padding: 6px;
        min-width: 170px;
        max-height: 280px;
        overflow-y: auto;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        z-index: 9999;
        display: none;
      }
      .cpt-lang-menu.open { display: block; }
      .cpt-lang-menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 8px;
        cursor: pointer;
        color: #fff;
        font-size: 14px;
        white-space: nowrap;
      }
      .cpt-lang-menu-item:hover { background: rgba(255,255,255,0.08); }
      .cpt-lang-menu-item.active { background: rgba(59,130,246,0.25); }
      .cpt-lang-menu-item .flag { font-size: 18px; }
    `;
    document.head.appendChild(style);
  }

  function buildMenuFor(anchorEl) {
    if (anchorEl._cptMenu) return anchorEl._cptMenu;

    const parent = anchorEl.parentElement;
    const computedPosition = getComputedStyle(parent).position;
    if (computedPosition === "static") {
      parent.style.position = "relative";
    }

    const menu = document.createElement("div");
    menu.className = "cpt-lang-menu";

    Object.keys(window.languageData).forEach((code) => {
      const info = window.languageData[code];
      const item = document.createElement("div");
      item.className = "cpt-lang-menu-item";
      item.setAttribute("data-lang-code", code);
      item.innerHTML = `<span class="flag">${info.flag}</span><span>${info.langName}</span>`;
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        setLanguage(code);
      });
      menu.appendChild(item);
    });

    parent.appendChild(menu);
    anchorEl._cptMenu = menu;
    return menu;
  }

  function closeAllMenus() {
    document.querySelectorAll(".cpt-lang-menu.open").forEach((m) => m.classList.remove("open"));
  }

  function wireLanguageTriggers() {
    injectMenuStyles();
    const triggers = document.querySelectorAll(TRIGGER_SELECTOR);
    triggers.forEach((el) => {
      const menu = buildMenuFor(el);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains("open");
        closeAllMenus();
        if (!isOpen) menu.classList.add("open");
      });
    });

    document.addEventListener("click", closeAllMenus);
  }

  function updateFlagButtons(langCode) {
    const info = window.languageData[langCode];
    if (!info) return;
    document.querySelectorAll(FLAG_DISPLAY_SELECTOR).forEach((btn) => {
      Array.from(btn.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) node.textContent = "";
      });
      btn.firstChild
        ? btn.insertBefore(document.createTextNode(info.flag), btn.firstChild)
        : btn.appendChild(document.createTextNode(info.flag));
    });

    // mark active item in every open/closed menu (header + settings row)
    document.querySelectorAll(TRIGGER_SELECTOR).forEach((el) => {
      if (el._cptMenu) {
        el._cptMenu.querySelectorAll(".cpt-lang-menu-item").forEach((item) => {
          item.classList.toggle("active", item.getAttribute("data-lang-code") === langCode);
        });
      }
    });
  }

  // ------------------------------------------------------------
  // 3b. Settings page: keep #settingsLangText / #settingsLangFlag
  //     in sync with the current language.
  // ------------------------------------------------------------
  function updateSettingsLangDisplay(langCode) {
    const info = window.languageData[langCode];
    if (!info) return;

    const textEl = document.getElementById("settingsLangText");
    if (textEl) textEl.textContent = info.langName;

    const flagEl = document.getElementById("settingsLangFlag");
    if (flagEl) flagEl.textContent = info.flag;
  }

  // ------------------------------------------------------------
  // 4. Keep multiple open tabs in sync instantly
  // ------------------------------------------------------------
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      applyTranslations();
      updateFlagButtons(e.newValue);
      updateSettingsLangDisplay(e.newValue);
    }
  });

  // ------------------------------------------------------------
  // 5. Init on every page load
  // ------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    wireLanguageTriggers();
    applyTranslations();
    updateFlagButtons(getCurrentLang());
    updateSettingsLangDisplay(getCurrentLang());
  });

  // Expose for manual use elsewhere
  window.cptSetLanguage = setLanguage;
  window.cptGetLanguage = getCurrentLang;
  window.cptApplyTranslations = applyTranslations;
})();
