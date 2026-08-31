/* =========================================================
   CPTMARKETS — GLOBAL TRANSLATOR
   11 LANGUAGES
   Language persists across ALL HTML pages
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     CONFIGURATION
     ======================================================= */

  const STORAGE_KEY = "cptmarkets_language";

  const LANGUAGES = [
    {
      code: "bn_BD",
      flag: "🇧🇩",
      name: "বাংলা"
    },
    {
      code: "en_GB",
      flag: "🇬🇧",
      name: "English (UK)"
    },
    {
      code: "en_US",
      flag: "🇺🇸",
      name: "English (US)"
    },
    {
      code: "de_DE",
      flag: "🇩🇪",
      name: "Deutsch"
    },
    {
      code: "hi_IN",
      flag: "🇮🇳",
      name: "हिन्दी"
    },
    {
      code: "ja_JP",
      flag: "🇯🇵",
      name: "日本語"
    },
    {
      code: "zh_CN",
      flag: "🇨🇳",
      name: "简体中文"
    },
    {
      code: "it_IT",
      flag: "🇮🇹",
      name: "Italiano"
    },
    {
      code: "ar_SA",
      flag: "🇸🇦",
      name: "العربية"
    },
    {
      code: "es_ES",
      flag: "🇪🇸",
      name: "Español"
    },
    {
      code: "pt_PT",
      flag: "🇵🇹",
      name: "Português"
    }
  ];


  /* =======================================================
     GET TRANSLATION DATA FROM lang.js
     ======================================================= */

  function getLanguageData() {

    if (typeof window.languageData !== "undefined") {
      return window.languageData;
    }

    if (typeof languageData !== "undefined") {
      return languageData;
    }

    return {};
  }


  /* =======================================================
     CURRENT LANGUAGE
     ======================================================= */

  function getCurrentLanguage() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (
      saved &&
      LANGUAGES.some(function (lang) {
        return lang.code === saved;
      })
    ) {
      return saved;
    }

    return "en_GB";
  }


  /* =======================================================
     SAVE LANGUAGE
     ======================================================= */

  function saveLanguage(code) {
    localStorage.setItem(STORAGE_KEY, code);

    /*
      Also keep a second common key so other existing
      website code can access the selected language.
    */
    localStorage.setItem("selectedLanguage", code);
    localStorage.setItem("language", code);
  }


  /* =======================================================
     FIND TRANSLATION
     ======================================================= */

  function getTranslation(code, key) {

    const data = getLanguageData();

    if (!data || !data[code]) {
      return null;
    }

    return data[code][key] ?? null;
  }


  /* =======================================================
     TRANSLATE ELEMENT
     ======================================================= */

  function translateElement(element, code) {

    if (!element) return;

    const key =
      element.getAttribute("data-i18n") ||
      element.getAttribute("data-translate");

    if (!key) return;

    const translated = getTranslation(code, key);

    if (translated === null || translated === undefined) {
      return;
    }

    /*
      If element is an input / textarea,
      translate placeholder instead of its value.
    */

    if (
      element.tagName === "INPUT" ||
      element.tagName === "TEXTAREA"
    ) {

      element.placeholder = translated;

    } else {

      element.textContent = translated;
    }
  }


  /* =======================================================
     TRANSLATE PLACEHOLDERS
     ======================================================= */

  function translatePlaceholders(code) {

    const elements = document.querySelectorAll(
      "[data-i18n-placeholder], [data-translate-placeholder]"
    );

    elements.forEach(function (element) {

      const key =
        element.getAttribute("data-i18n-placeholder") ||
        element.getAttribute("data-translate-placeholder");

      const translated = getTranslation(code, key);

      if (translated !== null) {
        element.placeholder = translated;
      }

    });
  }


  /* =======================================================
     TRANSLATE TITLES
     ======================================================= */

  function translateTitles(code) {

    const elements = document.querySelectorAll(
      "[data-i18n-title], [data-translate-title]"
    );

    elements.forEach(function (element) {

      const key =
        element.getAttribute("data-i18n-title") ||
        element.getAttribute("data-translate-title");

      const translated = getTranslation(code, key);

      if (translated !== null) {
        element.title = translated;
      }

    });
  }


  /* =======================================================
     APPLY TRANSLATION TO PAGE
     ======================================================= */

  function applyLanguage(code) {

    const data = getLanguageData();

    if (!data[code]) {
      console.warn(
        "CptMarkets Translator: language not found:",
        code
      );
      return;
    }

    /*
      Translate all elements
    */

    const elements = document.querySelectorAll(
      "[data-i18n], [data-translate]"
    );

    elements.forEach(function (element) {
      translateElement(element, code);
    });


    /*
      Placeholders
    */

    translatePlaceholders(code);


    /*
      Titles
    */

    translateTitles(code);


    /*
      HTML language
    */

    document.documentElement.setAttribute(
      "lang",
      code
    );


    /*
      Arabic RTL
    */

    if (code === "ar_SA") {

      document.documentElement.setAttribute(
        "dir",
        "rtl"
      );

      document.body.classList.add(
        "cpt-rtl"
      );

    } else {

      document.documentElement.setAttribute(
        "dir",
        "ltr"
      );

      document.body.classList.remove(
        "cpt-rtl"
      );
    }


    /*
      Save everywhere
    */

    saveLanguage(code);


    /*
      Update language button
    */

    updateLanguageButton(code);


    /*
      Update menu selection
    */

    updateLanguageMenu(code);


    /*
      Custom event
    */

    document.dispatchEvent(
      new CustomEvent(
        "cptLanguageChanged",
        {
          detail: {
            language: code
          }
        }
      )
    );
  }


  /* =======================================================
     LANGUAGE BUTTON
     ======================================================= */

  function findLanguageButton() {

    const selectors = [

      "#languageBtn",
      "#languageButton",
      "#langBtn",
      "#langButton",

      ".language-btn",
      ".language-button",
      ".lang-btn",
      ".lang-button",

      "[data-language-toggle]",
      "[data-lang-toggle]",

      "[aria-label='Language']",
      "[aria-label='language']",
      "[title='Language']",
      "[title='language']"
    ];


    for (let i = 0; i < selectors.length; i++) {

      const element =
        document.querySelector(selectors[i]);

      if (element) {
        return element;
      }
    }


    /*
      If no named language button exists,
      try to find a button containing globe.
    */

    const buttons =
      document.querySelectorAll(
        "button, a, div"
      );

    for (let i = 0; i < buttons.length; i++) {

      const text =
        (buttons[i].textContent || "").trim();

      if (
        text === "🌐" ||
        text === "🌍" ||
        text === "🌎" ||
        text === "🌏"
      ) {
        return buttons[i];
      }
    }

    return null;
  }


  /* =======================================================
     LANGUAGE MENU
     ======================================================= */

  let languageMenu = null;


  function createLanguageMenu() {

    if (languageMenu) {
      return languageMenu;
    }


    languageMenu =
      document.createElement("div");

    languageMenu.id =
      "cptmarkets-language-menu";


    languageMenu.innerHTML = `

      <div class="cpt-language-header">
        <span>🌐</span>
        <span>Select Language</span>
      </div>

      <div class="cpt-language-list"></div>

    `;


    document.body.appendChild(
      languageMenu
    );


    const list =
      languageMenu.querySelector(
        ".cpt-language-list"
      );


    LANGUAGES.forEach(function (lang) {

      const item =
        document.createElement("button");

      item.type = "button";

      item.className =
        "cpt-language-option";

      item.setAttribute(
        "data-language-code",
        lang.code
      );


      item.innerHTML = `

        <span class="cpt-language-flag">
          ${lang.flag}
        </span>

        <span class="cpt-language-name">
          ${lang.name}
        </span>

        <span class="cpt-language-check">
          ✓
        </span>

      `;


      item.addEventListener(
        "click",
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          const selected =
            item.getAttribute(
              "data-language-code"
            );

          selectLanguage(
            selected
          );

          closeLanguageMenu();
        }
      );


      list.appendChild(item);
    });


    return languageMenu;
  }


  /* =======================================================
     OPEN MENU
     ======================================================= */

  function openLanguageMenu() {

    const menu =
      createLanguageMenu();

    const button =
      findLanguageButton();


    if (!button) {
      return;
    }


    /*
      Position menu below language button
    */

    const rect =
      button.getBoundingClientRect();


    const menuWidth =
      Math.min(
        260,
        window.innerWidth - 24
      );


    menu.style.width =
      menuWidth + "px";


    let left =
      rect.right - menuWidth;


    if (left < 12) {
      left = 12;
    }


    if (
      left + menuWidth >
      window.innerWidth - 12
    ) {
      left =
        window.innerWidth -
        menuWidth -
        12;
    }


    let top =
      rect.bottom + 10;


    /*
      If there is not enough room below,
      show above the button.
    */

    const menuHeight =
      Math.min(
        500,
        LANGUAGES.length * 52 + 70
      );


    if (
      top + menuHeight >
      window.innerHeight - 10
    ) {

      top =
        rect.top -
        menuHeight -
        10;
    }


    if (top < 10) {
      top = 10;
    }


    menu.style.left =
      left + "px";

    menu.style.top =
      top + "px";


    menu.classList.add(
      "cpt-language-menu-open"
    );


    updateLanguageMenu(
      getCurrentLanguage()
    );
  }


  /* =======================================================
     CLOSE MENU
     ======================================================= */

  function closeLanguageMenu() {

    if (!languageMenu) {
      return;
    }

    languageMenu.classList.remove(
      "cpt-language-menu-open"
    );
  }


  /* =======================================================
     TOGGLE MENU
     ======================================================= */

  function toggleLanguageMenu(
    event
  ) {

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }


    if (!languageMenu) {

      openLanguageMenu();

      return;
    }


    if (
      languageMenu.classList.contains(
        "cpt-language-menu-open"
      )
    ) {

      closeLanguageMenu();

    } else {

      openLanguageMenu();
    }
  }


  /* =======================================================
     SELECT LANGUAGE
     ======================================================= */

  function selectLanguage(code) {

    const data =
      getLanguageData();


    if (!data[code]) {

      console.warn(
        "CptMarkets Translator: Missing language:",
        code
      );

      return;
    }


    /*
      Save FIRST
      so every page receives the same language.
    */

    saveLanguage(code);


    /*
      Apply current page
    */

    applyLanguage(code);


    /*
      Keep menu/button synchronized
    */

    updateLanguageButton(code);

    updateLanguageMenu(code);
  }


  /* =======================================================
     UPDATE LANGUAGE BUTTON
     ======================================================= */

  function updateLanguageButton(code) {

    const button =
      findLanguageButton();


    if (!button) {
      return;
    }


    const lang =
      LANGUAGES.find(function (item) {
        return item.code === code;
      });


    if (!lang) {
      return;
    }


    /*
      Do NOT destroy the existing icon/design.
      Only update accessibility attributes.
    */

    button.setAttribute(
      "data-current-language",
      code
    );

    button.setAttribute(
      "title",
      lang.name
    );

    button.setAttribute(
      "aria-label",
      "Language: " + lang.name
    );
  }


  /* =======================================================
     UPDATE MENU
     ======================================================= */

  function updateLanguageMenu(code) {

    if (!languageMenu) {
      return;
    }


    const options =
      languageMenu.querySelectorAll(
        ".cpt-language-option"
      );


    options.forEach(function (option) {

      const optionCode =
        option.getAttribute(
          "data-language-code"
        );


      if (optionCode === code) {

        option.classList.add(
          "cpt-language-selected"
        );

      } else {

        option.classList.remove(
          "cpt-language-selected"
        );
      }

    });
  }


  /* =======================================================
     INJECT LANGUAGE MENU CSS
     ======================================================= */

  function injectLanguageStyles() {

    if (
      document.getElementById(
        "cptmarkets-translator-style"
      )
    ) {
      return;
    }


    const style =
      document.createElement("style");


    style.id =
      "cptmarkets-translator-style";


    style.textContent = `

      /* ==========================================
         LANGUAGE MENU
         ========================================== */

      #cptmarkets-language-menu {

        position: fixed;

        display: none;

        z-index: 999999;

        box-sizing: border-box;

        padding: 10px;

        border-radius: 18px;

        background:
          linear-gradient(
            145deg,
            rgba(5, 18, 38, 0.98),
            rgba(2, 10, 25, 0.98)
          );

        border:
          1px solid
          rgba(0, 204, 255, 0.45);

        box-shadow:
          0 18px 50px
          rgba(0, 0, 0, 0.65),

          0 0 25px
          rgba(0, 200, 255, 0.12);

        backdrop-filter:
          blur(18px);

        -webkit-backdrop-filter:
          blur(18px);

        overflow: hidden;

        font-family:
          Arial,
          Helvetica,
          sans-serif;

      }


      #cptmarkets-language-menu.cpt-language-menu-open {

        display: block;

        animation:
          cptLanguageOpen
          0.18s
          ease-out;

      }


      @keyframes cptLanguageOpen {

        from {

          opacity: 0;

          transform:
            translateY(-8px)
            scale(0.97);

        }

        to {

          opacity: 1;

          transform:
            translateY(0)
            scale(1);

        }

      }


      /* ==========================================
         HEADER
         ========================================== */

      .cpt-language-header {

        display: flex;

        align-items: center;

        gap: 9px;

        padding:
          10px
          10px
          12px;

        margin-bottom: 3px;

        color: #ffffff;

        font-size: 14px;

        font-weight: 700;

        border-bottom:
          1px solid
          rgba(255,255,255,0.08);

      }


      /* ==========================================
         LANGUAGE LIST
         ========================================== */

      .cpt-language-list {

        display: flex;

        flex-direction: column;

        gap: 4px;

        max-height: 430px;

        overflow-y: auto;

        scrollbar-width: thin;

      }


      .cpt-language-list::-webkit-scrollbar {

        width: 4px;

      }


      .cpt-language-list::-webkit-scrollbar-thumb {

        background:
          rgba(0, 204, 255, 0.45);

        border-radius: 10px;

      }


      /* ==========================================
         LANGUAGE OPTION
         ========================================== */

      .cpt-language-option {

        width: 100%;

        min-height: 46px;

        display: flex;

        align-items: center;

        gap: 11px;

        box-sizing: border-box;

        padding:
          8px
          10px;

        border: 0;

        border-radius: 11px;

        background:
          rgba(255,255,255,0.035);

        color: #ffffff;

        cursor: pointer;

        text-align: left;

        transition:
          background 0.15s ease,
          transform 0.15s ease;

        font-size: 14px;

      }


      .cpt-language-option:hover {

        background:
          rgba(0, 204, 255, 0.12);

        transform:
          translateX(2px);

      }


      .cpt-language-option:active {

        transform:
          scale(0.98);

      }


      /* ==========================================
         FLAG
         ========================================== */

      .cpt-language-flag {

        width: 27px;

        min-width: 27px;

        font-size: 20px;

        line-height: 1;

        text-align: center;

      }


      /* ==========================================
         LANGUAGE NAME
         ========================================== */

      .cpt-language-name {

        flex: 1;

        color: #f5f7fa;

        font-size: 14px;

        font-weight: 600;

      }


      /* ==========================================
         CHECK MARK
         ========================================== */

      .cpt-language-check {

        display: none;

        color: #00d9ff;

        font-size: 15px;

        font-weight: 900;

      }


      .cpt-language-selected {

        background:
          linear-gradient(
            90deg,
            rgba(0, 190, 255, 0.16),
            rgba(0, 120, 255, 0.08)
          ) !important;

        border:
          1px solid
          rgba(0, 210, 255, 0.25);

      }


      .cpt-language-selected
      .cpt-language-check {

        display: block;

      }


      /* ==========================================
         MOBILE
         ========================================== */

      @media (max-width: 600px) {

        #cptmarkets-language-menu {

          width:
            min(260px, calc(100vw - 24px));

          border-radius: 16px;

        }


        .cpt-language-option {

          min-height: 48px;

          padding:
            8px
            11px;

        }


        .cpt-language-name {

          font-size: 14px;

        }

      }


      /* ==========================================
         RTL / ARABIC
         ========================================== */

      html[dir="rtl"]
      #cptmarkets-language-menu {

        direction: rtl;

      }


      html[dir="rtl"]
      .cpt-language-option {

        text-align: right;

      }


      /* ==========================================
         TRANSLATOR SAFETY
         ========================================== */

      [data-i18n],
      [data-translate] {

        transition:
          opacity 0.12s ease;

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =======================================================
     CONNECT LANGUAGE BUTTON
     ======================================================= */

  function connectLanguageButton() {

    const button =
      findLanguageButton();


    if (!button) {

      console.warn(
        "CptMarkets Translator: Language button not found."
      );

      return;
    }


    /*
      Prevent duplicate event listener
    */

    if (
      button.dataset.cptTranslatorConnected ===
      "true"
    ) {
      return;
    }


    button.dataset.cptTranslatorConnected =
      "true";


    button.addEventListener(
      "click",
      toggleLanguageMenu
    );


    /*
      Keyboard support
    */

    button.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          toggleLanguageMenu(
            event
          );
        }

      }
    );
  }


  /* =======================================================
     CLOSE WHEN CLICKING OUTSIDE
     ======================================================= */

  function connectOutsideClick() {

    document.addEventListener(
      "click",
      function (event) {

        if (!languageMenu) {
          return;
        }


        const button =
          findLanguageButton();


        if (
          languageMenu.contains(
            event.target
          )
        ) {
          return;
        }


        if (
          button &&
          button.contains(
            event.target
          )
        ) {
          return;
        }


        closeLanguageMenu();

      }
    );
  }


  /* =======================================================
     CLOSE WITH ESC
     ======================================================= */

  function connectEscape() {

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape"
        ) {
          closeLanguageMenu();
        }

      }
    );
  }


  /* =======================================================
     WINDOW RESIZE
     ======================================================= */

  function connectResize() {

    window.addEventListener(
      "resize",
      function () {

        closeLanguageMenu();

      }
    );
  }


  /* =======================================================
     STORAGE EVENT
     ======================================================= */

  /*
    If the user has multiple tabs open,
    changing language in one tab will update
    the other tab automatically.
  */

  window.addEventListener(
    "storage",
    function (event) {

      if (
        event.key === STORAGE_KEY ||
        event.key === "selectedLanguage" ||
        event.key === "language"
      ) {

        const code =
          getCurrentLanguage();

        applyLanguage(code);

      }

    }
  );


  /* =======================================================
     PUBLIC API
     ======================================================= */

  window.CptTranslator = {

    setLanguage: function (code) {
      selectLanguage(code);
    },

    getLanguage: function () {
      return getCurrentLanguage();
    },

    open: function () {
      openLanguageMenu();
    },

    close: function () {
      closeLanguageMenu();
    },

    refresh: function () {
      applyLanguage(
        getCurrentLanguage()
      );
    },

    languages: LANGUAGES

  };


  /* =======================================================
     INITIALIZATION
     ======================================================= */

  function initializeTranslator() {

    /*
      Make sure lang.js has loaded
    */

    const data =
      getLanguageData();


    if (
      !data ||
      Object.keys(data).length === 0
    ) {

      console.warn(
        "CptMarkets Translator: lang.js data not found."
      );

      /*
        Try again shortly because script
        loading order may differ.
      */

      setTimeout(
        initializeTranslator,
        300
      );

      return;
    }


    /*
      Inject menu design
    */

    injectLanguageStyles();


    /*
      Create menu
    */

    createLanguageMenu();


    /*
      Connect globe / language button
    */

    connectLanguageButton();


    /*
      Outside click
    */

    connectOutsideClick();


    /*
      Escape
    */

    connectEscape();


    /*
      Resize
    */

    connectResize();


    /*
      Apply saved language
    */

    const savedLanguage =
      getCurrentLanguage();


    applyLanguage(
      savedLanguage
    );

  }


  /* =======================================================
     START
     ======================================================= */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initializeTranslator
    );

  } else {

    initializeTranslator();

  }

})();
