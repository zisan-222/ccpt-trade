/* ============================================================
   CptMarkets — translator.js
   GLOBAL LANGUAGE TRANSLATOR
   ------------------------------------------------------------
   • Works with languageData from lang.js
   • Works with cptStaticTranslations from lang.js
   • Language selection persists across ALL pages
   • Uses .language-btn from existing HTML
   • Button displays the CURRENT LANGUAGE NAME
   • No globe icon inside the button
   • 11-language menu support
   ============================================================ */

(function () {
  "use strict";

  /* ==========================================================
     CONFIG
     ========================================================== */

  const STORAGE_KEY = "cptmarkets_language";

  const OLD_STORAGE_KEYS = [
    "selectedLanguage",
    "language",
    "cptLanguage",
    "currentLanguage",
    "preferredLanguage"
  ];

  /* ==========================================================
     11 LANGUAGES
     ========================================================== */

  const LANGUAGES = [
    {
      code: "bn_BD",
      flag: "🇧🇩",
      name: "বাংলা"
    },
    {
      code: "en_UK",
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


  /* ==========================================================
     HELPERS
     ========================================================== */

  function getLanguageData() {

    if (
      typeof window !== "undefined" &&
      window.languageData
    ) {
      return window.languageData;
    }

    if (
      typeof languageData !== "undefined"
    ) {
      return languageData;
    }

    return {};
  }


  function getStaticTranslations() {

    if (
      typeof window !== "undefined" &&
      window.cptStaticTranslations
    ) {
      return window.cptStaticTranslations;
    }

    if (
      typeof cptStaticTranslations !== "undefined"
    ) {
      return cptStaticTranslations;
    }

    return {};
  }


  function normalizeText(value) {

    return String(value ?? "")
      .replace(/\s+/g, " ")
      .trim();
  }


  function findLanguage(code) {

    return LANGUAGES.find(function (item) {
      return item.code === code;
    });
  }


  /* ==========================================================
     STORAGE
     ========================================================== */

  function getSavedLanguage() {

    let saved =
      localStorage.getItem(STORAGE_KEY);


    if (
      saved &&
      LANGUAGES.some(function (lang) {
        return lang.code === saved;
      })
    ) {
      return saved;
    }


    for (
      let i = 0;
      i < OLD_STORAGE_KEYS.length;
      i++
    ) {

      const oldValue =
        localStorage.getItem(
          OLD_STORAGE_KEYS[i]
        );


      if (
        oldValue &&
        LANGUAGES.some(function (lang) {
          return lang.code === oldValue;
        })
      ) {

        localStorage.setItem(
          STORAGE_KEY,
          oldValue
        );

        return oldValue;
      }
    }


    /*
      Default language
    */

    return "en_UK";
  }


  function saveLanguage(code) {

    localStorage.setItem(
      STORAGE_KEY,
      code
    );


    /*
      Keep compatibility with existing code
    */

    localStorage.setItem(
      "selectedLanguage",
      code
    );

    localStorage.setItem(
      "language",
      code
    );

    localStorage.setItem(
      "cptLanguage",
      code
    );

    localStorage.setItem(
      "currentLanguage",
      code
    );

    localStorage.setItem(
      "preferredLanguage",
      code
    );
  }


  /* ==========================================================
     TRANSLATION LOOKUP
     ========================================================== */

  function translateKey(key, code) {

    const data =
      getLanguageData();

    const staticData =
      getStaticTranslations();


    /*
      1. languageData key
    */

    if (
      data &&
      data[code] &&
      Object.prototype.hasOwnProperty.call(
        data[code],
        key
      )
    ) {

      return data[code][key];
    }


    /*
      2. static phrase translations
    */

    if (
      staticData &&
      staticData[code] &&
      Object.prototype.hasOwnProperty.call(
        staticData[code],
        key
      )
    ) {

      return staticData[code][key];
    }


    /*
      3. Existing helper
    */

    if (
      typeof window !== "undefined" &&
      typeof window.cptTranslatePhrase ===
        "function"
    ) {

      return window.cptTranslatePhrase(
        key,
        code
      );
    }


    return null;
  }


  /* ==========================================================
     TRANSLATE DATA ATTRIBUTES
     ========================================================== */

  function translateDataAttributes(code) {

    /*
      data-i18n
    */

    document
      .querySelectorAll(
        "[data-i18n]"
      )
      .forEach(function (element) {

        const key =
          element.getAttribute(
            "data-i18n"
          );

        const translated =
          translateKey(
            key,
            code
          );


        if (
          translated === null ||
          translated === undefined
        ) {
          return;
        }


        /*
          Input / textarea
        */

        if (
          element.tagName === "INPUT" ||
          element.tagName === "TEXTAREA"
        ) {

          element.placeholder =
            translated;

        } else {

          element.textContent =
            translated;
        }

      });


    /*
      data-translate
    */

    document
      .querySelectorAll(
        "[data-translate]"
      )
      .forEach(function (element) {

        const key =
          element.getAttribute(
            "data-translate"
          );

        const translated =
          translateKey(
            key,
            code
          );


        if (
          translated === null ||
          translated === undefined
        ) {
          return;
        }


        if (
          element.tagName === "INPUT" ||
          element.tagName === "TEXTAREA"
        ) {

          element.placeholder =
            translated;

        } else {

          element.textContent =
            translated;
        }

      });
  }


  /* ==========================================================
     PLACEHOLDERS
     ========================================================== */

  function translatePlaceholders(code) {

    document
      .querySelectorAll(
        "[data-i18n-placeholder]"
      )
      .forEach(function (element) {

        const key =
          element.getAttribute(
            "data-i18n-placeholder"
          );

        const translated =
          translateKey(
            key,
            code
          );


        if (
          translated !== null &&
          translated !== undefined
        ) {

          element.placeholder =
            translated;
        }

      });


    document
      .querySelectorAll(
        "[data-translate-placeholder]"
      )
      .forEach(function (element) {

        const key =
          element.getAttribute(
            "data-translate-placeholder"
          );

        const translated =
          translateKey(
            key,
            code
          );


        if (
          translated !== null &&
          translated !== undefined
        ) {

          element.placeholder =
            translated;
        }

      });
  }


  /* ==========================================================
     TITLE ATTRIBUTES
     ========================================================== */

  function translateTitles(code) {

    document
      .querySelectorAll(
        "[data-i18n-title]"
      )
      .forEach(function (element) {

        const key =
          element.getAttribute(
            "data-i18n-title"
          );

        const translated =
          translateKey(
            key,
            code
          );


        if (
          translated !== null &&
          translated !== undefined
        ) {

          element.title =
            translated;
        }

      });


    document
      .querySelectorAll(
        "[data-translate-title]"
      )
      .forEach(function (element) {

        const key =
          element.getAttribute(
            "data-translate-title"
          );

        const translated =
          translateKey(
            key,
            code
          );


        if (
          translated !== null &&
          translated !== undefined
        ) {

          element.title =
            translated;
        }

      });
  }


  /* ==========================================================
     STATIC TEXT TRANSLATION
     ----------------------------------------------------------
     This handles existing HTML text which uses the
     phrase-based translation map.
     ========================================================== */

  function translateStaticText(code) {

    const staticData =
      getStaticTranslations();


    if (
      !staticData ||
      !staticData[code]
    ) {
      return;
    }


    const translations =
      staticData[code];


    const walker =
      document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );


    const nodes = [];


    while (
      walker.nextNode()
    ) {

      nodes.push(
        walker.currentNode
      );
    }


    nodes.forEach(function (node) {

      if (
        !node.parentElement
      ) {
        return;
      }


      const parent =
        node.parentElement;


      /*
        Do not touch these elements
      */

      if (
        parent.closest(
          "#cpt-language-menu"
        )
      ) {
        return;
      }


      if (
        parent.closest(
          "script, style, noscript, textarea"
        )
      ) {
        return;
      }


      const raw =
        node.nodeValue;


      const normalized =
        normalizeText(raw);


      if (!normalized) {
        return;
      }


      if (
        Object.prototype.hasOwnProperty.call(
          translations,
          normalized
        )
      ) {

        /*
          Preserve leading/trailing spaces
        */

        const leading =
          raw.match(/^\s*/)?.[0] || "";

        const trailing =
          raw.match(/\s*$/)?.[0] || "";


        node.nodeValue =
          leading +
          translations[normalized] +
          trailing;
      }

    });
  }


  /* ==========================================================
     PAGE DIRECTION
     ========================================================== */

  function applyDirection(code) {

    if (
      code === "ar_SA"
    ) {

      document.documentElement
        .setAttribute(
          "dir",
          "rtl"
        );

      document.documentElement
        .setAttribute(
          "lang",
          "ar"
        );

      document.body
        .classList
        .add(
          "cpt-translator-rtl"
        );

    } else {

      document.documentElement
        .setAttribute(
          "dir",
          "ltr"
        );

      document.documentElement
        .setAttribute(
          "lang",
          code.replace(
            "_",
            "-"
          )
        );

      document.body
        .classList
        .remove(
          "cpt-translator-rtl"
        );
    }
  }


  /* ==========================================================
     LANGUAGE BUTTON
     ----------------------------------------------------------
     IMPORTANT:
     Existing HTML uses:
       <button class="language-btn">🇬🇧</button>

     We change it to:
       English (UK)

     when English UK is selected.
     ========================================================== */

  function getLanguageButtons() {

    const selectors = [
      ".language-btn",
      ".language-button",
      ".lang-btn",
      ".lang-button",
      "#languageBtn",
      "#languageButton",
      "#langBtn",
      "#langButton",
      "[data-language-toggle]",
      "[data-lang-toggle]"
    ];


    const result = [];


    selectors.forEach(
      function (selector) {

        document
          .querySelectorAll(
            selector
          )
          .forEach(
            function (element) {

              if (
                !result.includes(
                  element
                )
              ) {

                result.push(
                  element
                );
              }

            }
          );

      }
    );


    return result;
  }


  function updateLanguageButtons(code) {

    const lang =
      findLanguage(code);


    if (!lang) {
      return;
    }


    const buttons =
      getLanguageButtons();


    buttons.forEach(
      function (button) {

        /*
          Show ONLY language name.
          No globe.
          No flag.
        */

        button.textContent =
          lang.name;


        button.setAttribute(
          "aria-label",
          "Language: " +
          lang.name
        );


        button.setAttribute(
          "title",
          lang.name
        );


        button.setAttribute(
          "data-current-language",
          code
        );


        button.classList.add(
          "cpt-language-button-active"
        );

      }
    );
  }


  /* ==========================================================
     LANGUAGE MENU
     ========================================================== */

  let menu = null;


  function createMenu() {

    if (menu) {
      return menu;
    }


    menu =
      document.createElement(
        "div"
      );


    menu.id =
      "cpt-language-menu";


    menu.setAttribute(
      "role",
      "menu"
    );


    menu.innerHTML = `
      <div class="cpt-language-menu-header">
        <span class="cpt-language-menu-title">
          Select Language
        </span>
      </div>

      <div class="cpt-language-options"></div>
    `;


    document.body.appendChild(
      menu
    );


    const options =
      menu.querySelector(
        ".cpt-language-options"
      );


    LANGUAGES.forEach(
      function (lang) {

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.className =
          "cpt-language-option";


        button.setAttribute(
          "role",
          "menuitem"
        );


        button.setAttribute(
          "data-language",
          lang.code
        );


        button.innerHTML = `
          <span class="cpt-language-option-flag">
            ${lang.flag}
          </span>

          <span class="cpt-language-option-name">
            ${lang.name}
          </span>

          <span class="cpt-language-option-check">
            ✓
          </span>
        `;


        button.addEventListener(
          "click",
          function (event) {

            event.preventDefault();
            event.stopPropagation();


            const code =
              button.getAttribute(
                "data-language"
              );


            setLanguage(
              code
            );


            closeMenu();
          }
        );


        options.appendChild(
          button
        );
      }
    );


    return menu;
  }


  /* ==========================================================
     MENU POSITION
     ========================================================== */

  function positionMenu(button) {

    if (!menu || !button) {
      return;
    }


    const rect =
      button.getBoundingClientRect();


    const width =
      Math.min(
        270,
        window.innerWidth - 24
      );


    menu.style.width =
      width + "px";


    let left =
      rect.right - width;


    if (
      left < 12
    ) {
      left = 12;
    }


    if (
      left + width >
      window.innerWidth - 12
    ) {

      left =
        window.innerWidth -
        width -
        12;
    }


    let top =
      rect.bottom + 8;


    const estimatedHeight =
      11 * 48 + 60;


    if (
      top + estimatedHeight >
      window.innerHeight - 10
    ) {

      top =
        rect.top -
        estimatedHeight -
        8;
    }


    if (
      top < 10
    ) {
      top = 10;
    }


    menu.style.left =
      left + "px";


    menu.style.top =
      top + "px";
  }


  /* ==========================================================
     OPEN MENU
     ========================================================== */

  function openMenu() {

    const buttons =
      getLanguageButtons();


    if (
      !buttons.length
    ) {

      console.warn(
        "CptMarkets Translator: .language-btn not found."
      );

      return;
    }


    const button =
      buttons[0];


    createMenu();


    positionMenu(
      button
    );


    menu.classList.add(
      "cpt-language-menu-open"
    );


    updateMenuSelection(
      getSavedLanguage()
    );
  }


  /* ==========================================================
     CLOSE MENU
     ========================================================== */

  function closeMenu() {

    if (!menu) {
      return;
    }


    menu.classList.remove(
      "cpt-language-menu-open"
    );
  }


  /* ==========================================================
     TOGGLE MENU
     ========================================================== */

  function toggleMenu(event) {

    event.preventDefault();
    event.stopPropagation();


    if (!menu) {

      openMenu();

      return;
    }


    if (
      menu.classList.contains(
        "cpt-language-menu-open"
      )
    ) {

      closeMenu();

    } else {

      openMenu();
    }
  }


  /* ==========================================================
     CONNECT BUTTONS
     ========================================================== */

  function connectLanguageButtons() {

    const buttons =
      getLanguageButtons();


    buttons.forEach(
      function (button) {

        if (
          button.dataset
            .cptTranslatorConnected ===
          "true"
        ) {
          return;
        }


        button.dataset
          .cptTranslatorConnected =
          "true";


        button.addEventListener(
          "click",
          toggleMenu
        );


        button.addEventListener(
          "keydown",
          function (event) {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              toggleMenu(
                event
              );
            }

          }
        );

      }
    );
  }


  /* ==========================================================
     UPDATE MENU CHECK
     ========================================================== */

  function updateMenuSelection(code) {

    if (!menu) {
      return;
    }


    menu
      .querySelectorAll(
        ".cpt-language-option"
      )
      .forEach(
        function (button) {

          const optionCode =
            button.getAttribute(
              "data-language"
            );


          if (
            optionCode === code
          ) {

            button.classList.add(
              "cpt-language-option-selected"
            );

          } else {

            button.classList.remove(
              "cpt-language-option-selected"
            );
          }

        }
      );
  }


  /* ==========================================================
     SET LANGUAGE
     ========================================================== */

  function setLanguage(code) {

    /*
      Compatibility:
      en_GB -> en_UK
    */

    if (
      code === "en_GB"
    ) {
      code = "en_UK";
    }


    const lang =
      findLanguage(code);


    if (!lang) {

      console.warn(
        "CptMarkets Translator: Unsupported language:",
        code
      );

      return;
    }


    /*
      Save globally FIRST
    */

    saveLanguage(
      code
    );


    /*
      Translate current page
    */

    applyLanguage(
      code
    );


    /*
      Notify other scripts
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


  /* ==========================================================
     APPLY LANGUAGE
     ========================================================== */

  function applyLanguage(code) {

    const data =
      getLanguageData();


    const staticData =
      getStaticTranslations();


    /*
      At least one translation source
      must exist.
    */

    if (
      !data[code] &&
      !staticData[code]
    ) {

      /*
        Arabic / Portuguese may not yet exist
        in current lang.js.
      */

      console.warn(
        "CptMarkets Translator: Translation data missing for:",
        code
      );

    }


    /*
      Attribute translations
    */

    translateDataAttributes(
      code
    );


    /*
      Placeholder translations
    */

    translatePlaceholders(
      code
    );


    /*
      Title translations
    */

    translateTitles(
      code
    );


    /*
      Existing phrase-based text
    */

    translateStaticText(
      code
    );


    /*
      Direction
    */

    applyDirection(
      code
    );


    /*
      Button text
    */

    updateLanguageButtons(
      code
    );


    /*
      Menu check
    */

    updateMenuSelection(
      code
    );


    /*
      Global state
    */

    window.cptCurrentLanguage =
      code;
  }


  /* ==========================================================
     CLOSE OUTSIDE
     ========================================================== */

  function connectOutsideClick() {

    document.addEventListener(
      "click",
      function (event) {

        if (!menu) {
          return;
        }


        if (
          menu.contains(
            event.target
          )
        ) {
          return;
        }


        const buttons =
          getLanguageButtons();


        for (
          let i = 0;
          i < buttons.length;
          i++
        ) {

          if (
            buttons[i].contains(
              event.target
            )
          ) {
            return;
          }
        }


        closeMenu();

      }
    );
  }


  /* ==========================================================
     ESC
     ========================================================== */

  function connectEscape() {

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape"
        ) {

          closeMenu();
        }

      }
    );
  }


  /* ==========================================================
     STORAGE SYNC
     ----------------------------------------------------------
     If language changes in another tab,
     current page updates automatically.
     ========================================================== */

  window.addEventListener(
    "storage",
    function (event) {

      if (
        event.key === STORAGE_KEY ||
        event.key === "selectedLanguage" ||
        event.key === "language"
      ) {

        const code =
          getSavedLanguage();


        applyLanguage(
          code
        );
      }

    }
  );


  /* ==========================================================
     RESIZE
     ========================================================== */

  function connectResize() {

    window.addEventListener(
      "resize",
      function () {

        closeMenu();

      }
    );
  }


  /* ==========================================================
     ADD CSS
     ========================================================== */

  function injectStyles() {

    if (
      document.getElementById(
        "cpt-translator-style"
      )
    ) {
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "cpt-translator-style";


    style.textContent = `

      /* =====================================================
         CURRENT LANGUAGE BUTTON
         ===================================================== */

      .language-btn,
      .language-button,
      .lang-btn,
      .lang-button {

        white-space: nowrap;

        overflow: hidden;

        text-overflow: ellipsis;

      }


      /* =====================================================
         LANGUAGE MENU
         ===================================================== */

      #cpt-language-menu {

        position: fixed;

        display: none;

        z-index: 2147483647;

        box-sizing: border-box;

        padding: 9px;

        width: 270px;

        max-width:
          calc(100vw - 24px);

        max-height:
          calc(100vh - 20px);

        overflow: hidden;

        border-radius: 18px;

        border:
          1px solid
          rgba(0, 204, 255, 0.45);

        background:
          linear-gradient(
            145deg,
            rgba(4, 18, 39, 0.98),
            rgba(2, 9, 24, 0.99)
          );

        box-shadow:
          0 20px 55px
          rgba(0, 0, 0, 0.70),

          0 0 30px
          rgba(0, 200, 255, 0.12);

        backdrop-filter:
          blur(20px);

        -webkit-backdrop-filter:
          blur(20px);

        font-family:
          Arial,
          Helvetica,
          sans-serif;

      }


      #cpt-language-menu.cpt-language-menu-open {

        display: block;

        animation:
          cptTranslatorMenuIn
          0.16s
          ease-out;

      }


      @keyframes cptTranslatorMenuIn {

        from {

          opacity: 0;

          transform:
            translateY(-7px)
            scale(0.98);

        }

        to {

          opacity: 1;

          transform:
            translateY(0)
            scale(1);

        }

      }


      /* =====================================================
         HEADER
         ===================================================== */

      .cpt-language-menu-header {

        padding:
          8px
          9px
          10px;

        margin-bottom:
          5px;

        border-bottom:
          1px solid
          rgba(255,255,255,0.08);

      }


      .cpt-language-menu-title {

        color:
          #ffffff;

        font-size:
          14px;

        font-weight:
          700;

      }


      /* =====================================================
         OPTIONS CONTAINER
         ===================================================== */

      .cpt-language-options {

        display:
          flex;

        flex-direction:
          column;

        gap:
          4px;

        max-height:
          470px;

        overflow-y:
          auto;

        scrollbar-width:
          thin;

      }


      .cpt-language-options::-webkit-scrollbar {

        width:
          4px;

      }


      .cpt-language-options::-webkit-scrollbar-thumb {

        background:
          rgba(0, 204, 255, 0.40);

        border-radius:
          20px;

      }


      /* =====================================================
         OPTION
         ===================================================== */

      .cpt-language-option {

        width:
          100%;

        min-height:
          46px;

        display:
          flex;

        align-items:
          center;

        gap:
          10px;

        box-sizing:
          border-box;

        padding:
          7px
          10px;

        border:
          1px solid
          transparent;

        border-radius:
          11px;

        background:
          rgba(255,255,255,0.035);

        color:
          #ffffff;

        font-size:
          14px;

        font-weight:
          600;

        text-align:
          left;

        cursor:
          pointer;

        transition:
          all 0.14s ease;

      }


      .cpt-language-option:hover {

        background:
          rgba(0, 204, 255, 0.11);

        border-color:
          rgba(0, 204, 255, 0.20);

        transform:
          translateX(2px);

      }


      .cpt-language-option:active {

        transform:
          scale(0.98);

      }


      /* =====================================================
         FLAG
         ===================================================== */

      .cpt-language-option-flag {

        width:
          28px;

        min-width:
          28px;

        font-size:
          20px;

        line-height:
          1;

        text-align:
          center;

      }


      /* =====================================================
         NAME
         ===================================================== */

      .cpt-language-option-name {

        flex:
          1;

        color:
          #f7f9fc;

      }


      /* =====================================================
         CHECK
         ===================================================== */

      .cpt-language-option-check {

        display:
          none;

        color:
          #00d9ff;

        font-size:
          16px;

        font-weight:
          900;

      }


      .cpt-language-option-selected {

        background:
          rgba(0, 204, 255, 0.13);

        border-color:
          rgba(0, 204, 255, 0.30);

      }


      .cpt-language-option-selected
      .cpt-language-option-check {

        display:
          block;

      }


      /* =====================================================
         ARABIC
         ===================================================== */

      html[dir="rtl"]
      #cpt-language-menu {

        direction:
          rtl;

      }


      html[dir="rtl"]
      .cpt-language-option {

        text-align:
          right;

      }


      html[dir="rtl"]
      .cpt-language-option:hover {

        transform:
          translateX(-2px);

      }


      /* =====================================================
         MOBILE
         ===================================================== */

      @media (max-width: 600px) {

        #cpt-language-menu {

          width:
            260px;

          max-width:
            calc(100vw - 20px);

          border-radius:
            16px;

        }


        .cpt-language-option {

          min-height:
            47px;

        }


        .cpt-language-option-name {

          font-size:
            14px;

        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* ==========================================================
     PUBLIC API
     ========================================================== */

  window.CptTranslator = {

    setLanguage:
      function (code) {

        setLanguage(
          code
        );
      },

    getLanguage:
      function () {

        return getSavedLanguage();

      },

    getLanguages:
      function () {

        return LANGUAGES.slice();

      },

    refresh:
      function () {

        applyLanguage(
          getSavedLanguage()
        );

      },

    open:
      function () {

        openMenu();

      },

    close:
      function () {

        closeMenu();

      }

  };


  /* ==========================================================
     INITIALIZATION
     ========================================================== */

  function initialize() {

    /*
      lang.js must already be loaded.
    */

    const data =
      getLanguageData();


    const staticData =
      getStaticTranslations();


    if (
      !data &&
      !staticData
    ) {

      console.warn(
        "CptMarkets Translator: lang.js not loaded yet."
      );


      setTimeout(
        initialize,
        300
      );


      return;
    }


    /*
      CSS
    */

    injectStyles();


    /*
      Menu
    */

    createMenu();


    /*
      Buttons
    */

    connectLanguageButtons();


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

    const current =
      getSavedLanguage();


    applyLanguage(
      current
    );
  }


  /* ==========================================================
     START
     ========================================================== */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );

  } else {

    initialize();

  }

})();
