// ============================================================
//  CptMarkets — translator.js
//  Universal language switcher (works across ALL pages)
//  Must be included AFTER lang.js on every HTML page:
//
//      <script src="lang.js"></script>
//      <script src="translator.js"></script>
//
// ============================================================

(function () {
  const STORAGE_KEY = "cpt_lang";
  const DEFAULT_LANG = "en_UK";

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
    updateActiveFlagUI(langCode);

    // Let other scripts on the same page know the language changed
    document.dispatchEvent(
      new CustomEvent("languageChanged", { detail: { lang: langCode } })
    );
  }

  // ------------------------------------------------------------
  // 2. Translate one piece of text
  //    - First try languageData[lang][key]   (structured keys)
  //    - Fallback to cptTranslatePhrase()     (raw English phrase)
  // ------------------------------------------------------------
  function translateByKey(key, langCode) {
    const lang = window.languageData[langCode] || window.languageData[DEFAULT_LANG];
    if (key in lang) return lang[key];
    return null;
  }

  function translateByText(text, langCode) {
    if (typeof window.cptTranslatePhrase === "function") {
      return window.cptTranslatePhrase(text, langCode);
    }
    return text;
  }

  // ------------------------------------------------------------
  // 3. Walk the DOM and apply translations
  //    Supported attributes on any element:
  //      data-i18n="key"              -> textContent from languageData
  //      data-i18n-placeholder="key"  -> placeholder attribute
  //      data-i18n-title="key"        -> title attribute
  //      data-i18n-auto               -> translate existing text via
  //                                       cptStaticTranslations (no key needed)
  // ------------------------------------------------------------
  function applyTranslations() {
    const langCode = getCurrentLang();

    // a) Key-based translation (structured UI strings)
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = translateByKey(key, langCode);
      if (val !== null) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = translateByKey(key, langCode);
      if (val !== null) el.setAttribute("placeholder", val);
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      const val = translateByKey(key, langCode);
      if (val !== null) el.setAttribute("title", val);
    });

    // b) Auto phrase-based translation (no key required, uses the
    //    element's own English text against cptStaticTranslations)
    document.querySelectorAll("[data-i18n-auto]").forEach((el) => {
      // Store the original English text once so re-translating
      // (e.g. switching en -> bn -> en) always works correctly.
      if (!el.dataset.i18nOriginal) {
        el.dataset.i18nOriginal = el.textContent.trim();
      }
      el.textContent = translateByText(el.dataset.i18nOriginal, langCode);
    });

    document.documentElement.setAttribute("lang", langCode);
  }

  // ------------------------------------------------------------
  // 4. Flag icon click handling
  //    Any element with data-lang-switch="en_UK" / "bn_BD" / etc.
  //    becomes clickable and switches the language.
  // ------------------------------------------------------------
  function wireFlagClicks() {
    document.querySelectorAll("[data-lang-switch]").forEach((el) => {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        const code = el.getAttribute("data-lang-switch");
        setLanguage(code);
      });
    });
  }

  function updateActiveFlagUI(langCode) {
    document.querySelectorAll("[data-lang-switch]").forEach((el) => {
      el.classList.toggle(
        "lang-active",
        el.getAttribute("data-lang-switch") === langCode
      );
    });
  }

  // ------------------------------------------------------------
  // 5. Auto-build a flag switcher into any container:
  //      <div id="langSwitcher"></div>
  //    Generates one flag per language defined in languageData.
  //    (Use this OR hand-place data-lang-switch icons — not both.)
  // ------------------------------------------------------------
  function buildLangSwitcher() {
    const containers = document.querySelectorAll("#langSwitcher");
    if (!containers.length || !window.languageData) return;

    containers.forEach((container) => {
      container.innerHTML = "";
      Object.keys(window.languageData).forEach((code) => {
        const info = window.languageData[code];
        const btn = document.createElement("span");
        btn.className = "lang-flag-btn";
        btn.setAttribute("data-lang-switch", code);
        btn.title = info.langName;
        btn.textContent = info.flag;
        btn.style.cursor = "pointer";
        btn.style.fontSize = "20px";
        btn.style.margin = "0 4px";
        container.appendChild(btn);
      });
    });

    wireFlagClicks();
    updateActiveFlagUI(getCurrentLang());
  }

  // ------------------------------------------------------------
  // 6. Keep multiple open tabs in sync instantly
  // ------------------------------------------------------------
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      applyTranslations();
      updateActiveFlagUI(e.newValue);
    }
  });

  // ------------------------------------------------------------
  // 7. Init on every page load
  // ------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    buildLangSwitcher();   // auto flags, if #langSwitcher exists
    wireFlagClicks();      // hand-placed flags, if any
    applyTranslations();   // translate the page immediately
    updateActiveFlagUI(getCurrentLang());
  });

  // Expose for manual use elsewhere (e.g. settings page dropdown)
  window.cptSetLanguage = setLanguage;
  window.cptGetLanguage = getCurrentLang;
  window.cptApplyTranslations = applyTranslations;
})();
  
