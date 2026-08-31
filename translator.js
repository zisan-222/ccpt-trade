/* ============================================================
   CptMarkets — translator.js
   UNIVERSAL GLOBAL LANGUAGE SYSTEM
   ============================================================ */

(function () {
  "use strict";

  /* ==========================================================
     GLOBAL STORAGE
     ========================================================== */

  const STORAGE_KEY = "cptmarkets_language";
  const DEFAULT_LANGUAGE = "en_UK";


  /* ==========================================================
     11 LANGUAGE SETTINGS
     ========================================================== */

  const LANGUAGE_LIST = [
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
     GET LANGUAGE DATA FROM lang.js
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


  /* ==========================================================
     GET STATIC TRANSLATIONS
     ========================================================== */

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


  /* ==========================================================
     NORMALIZE TEXT
     ========================================================== */

  function normalizeText(value) {

    return String(
      value == null ? "" : value
    )
      .replace(/\s+/g, " ")
      .trim();
  }


  /* ==========================================================
     GET LANGUAGE INFORMATION
     ========================================================== */

  function getLanguageInfo(code) {

    return LANGUAGE_LIST.find(
      function (item) {
        return item.code === code;
      }
    ) || null;
  }


  /* ==========================================================
     FIND CURRENT LANGUAGE
     ========================================================== */

  function getCurrentLanguage() {

    const data =
      getLanguageData();

    let saved =
      localStorage.getItem(
        STORAGE_KEY
      );


    /*
      Compatibility with old keys
    */

    if (!saved) {

      const oldKeys = [
        "selectedLanguage",
        "language",
        "cptLanguage",
        "currentLanguage",
        "preferredLanguage",
        "cpt_lang"
      ];


      for (
        let i = 0;
        i < oldKeys.length;
        i++
      ) {

        const oldValue =
          localStorage.getItem(
            oldKeys[i]
          );


        if (oldValue) {

          saved =
            oldValue;

          break;
        }
      }
    }


    /*
      Old code compatibility
    */

    if (saved === "en_GB") {
      saved = "en_UK";
    }


    /*
      If language exists in lang.js,
      use it.
    */

    if (
      saved &&
      data &&
      data[saved]
    ) {

      return saved;
    }


    /*
      Allow our supported language list
      even when a language object has not
      yet been added to lang.js.
    */

    if (
      saved &&
      getLanguageInfo(saved)
    ) {

      return saved;
    }


    return DEFAULT_LANGUAGE;
  }


  /* ==========================================================
     SAVE LANGUAGE GLOBALLY
     ========================================================== */

  function saveLanguage(code) {

    localStorage.setItem(
      STORAGE_KEY,
      code
    );


    /*
      Compatibility keys.
      This makes the selection available
      to existing page scripts too.
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

    localStorage.setItem(
      "cpt_lang",
      code
    );
  }


  /* ==========================================================
     GET DICTIONARY
     ========================================================== */

  function getDictionary(code) {

    const data =
      getLanguageData();

    if (
      data &&
      data[code]
    ) {

      return data[code];
    }

    return {};
  }


  /* ==========================================================
     TRANSLATION LOOKUP
     ========================================================== */

  function translatePhrase(
    source,
    targetCode
  ) {

    const clean =
      normalizeText(source);


    if (!clean) {
      return source;
    }


    const staticMaps =
      getStaticTranslations();


    const staticMap =
      staticMaps[targetCode] || {};


    /*
      1. Exact static translation
    */

    if (
      Object.prototype.hasOwnProperty.call(
        staticMap,
        clean
      )
    ) {

      return staticMap[clean];
    }


    const targetDictionary =
      getDictionary(
        targetCode
      );


    /*
      2. Match source phrase
         against English UK dictionary
    */

    const sourceDictionaries =
      getLanguageData();


    /*
      First try en_UK because this
      is the main source language.
    */

    const english =
      sourceDictionaries.en_UK || {};


    for (
      const key of Object.keys(
        english
      )
    ) {

      const englishValue =
        normalizeText(
          english[key]
        );


      if (
        typeof english[key] === "string" &&
        englishValue === clean &&
        targetDictionary[key] != null
      ) {

        return targetDictionary[key];
      }
    }


    /*
      3. Search every language dictionary
    */

    for (
      const sourceCode of Object.keys(
        sourceDictionaries
      )
    ) {

      const sourceDictionary =
        sourceDictionaries[
          sourceCode
        ] || {};


      for (
        const key of Object.keys(
          sourceDictionary
        )
      ) {

        if (
          typeof sourceDictionary[key] !==
          "string"
        ) {
          continue;
        }


        if (
          normalizeText(
            sourceDictionary[key]
          ) === clean &&
          targetDictionary[key] != null
        ) {

          return targetDictionary[key];
        }
      }
    }


    /*
      4. Existing helper if available
    */

    if (
      typeof window.cptTranslatePhrase ===
      "function" &&
      window.cptTranslatePhrase !==
      translatePhrase
    ) {

      try {

        const result =
          window.cptTranslatePhrase(
            clean,
            targetCode
          );


        if (
          result &&
          result !== clean
        ) {

          return result;
        }

      } catch (error) {
        /* ignore */
      }
    }


    /*
      No translation found
    */

    return source;
  }


  /* ==========================================================
     REMEMBER ORIGINAL TEXT
     ========================================================== */

  function rememberTextNode(node) {

    if (
      !node ||
      node.nodeType !== 3
    ) {
      return;
    }


    const parent =
      node.parentElement;


    if (!parent) {
      return;
    }


    if (
      parent.closest(
        "script,style,noscript,svg,textarea,[contenteditable='true']"
      )
    ) {
      return;
    }


    if (
      node.nodeValue &&
      node.nodeValue.trim()
    ) {

      if (
        typeof node.__cptOriginalText ===
        "undefined"
      ) {

        node.__cptOriginalText =
          node.nodeValue;
      }
    }
  }


  /* ==========================================================
     REMEMBER WHOLE DOCUMENT
     ========================================================== */

  function rememberDocument() {

    if (!document.body) {
      return;
    }


    const walker =
      document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );


    let node;


    while (
      (node = walker.nextNode())
    ) {

      rememberTextNode(
        node
      );
    }
  }


  /* ==========================================================
     TRANSLATE TEXT NODE
     ========================================================== */

  function translateTextNode(
    node,
    code
  ) {

    if (
      !node ||
      node.nodeType !== 3
    ) {
      return;
    }


    const parent =
      node.parentElement;


    if (!parent) {
      return;
    }


    if (
      parent.closest(
        "script,style,noscript,svg,textarea,[contenteditable='true']"
      )
    ) {
      return;
    }


    rememberTextNode(
      node
    );


    const original =
      node.__cptOriginalText;


    if (
      typeof original ===
      "undefined"
    ) {
      return;
    }


    const clean =
      normalizeText(
        original
      );


    if (!clean) {
      return;
    }


    const translated =
      translatePhrase(
        original,
        code
      );


    if (
      translated &&
      translated !== original
    ) {

      node.nodeValue =
        translated;

    } else {

      /*
        If no translation exists,
        restore original source text.
      */

      node.nodeValue =
        original;
    }
  }


  /* ==========================================================
     TRANSLATE DATA-KEY ELEMENTS
     ========================================================== */

  function translateDataKeys(
    code
  ) {

    const dictionary =
      getDictionary(
        code
      );


    document
      .querySelectorAll(
        "[data-key]"
      )
      .forEach(
        function (element) {

          const key =
            element.getAttribute(
              "data-key"
            );


          if (
            !key ||
            dictionary[key] == null
          ) {
            return;
          }


          /*
            Input / textarea
          */

          if (
            element.tagName ===
              "INPUT" ||
            element.tagName ===
              "TEXTAREA"
          ) {

            if (
              element.type !==
              "button"
            ) {

              element.placeholder =
                dictionary[key];
            }


          } else {

            /*
              If element contains only text
            */

            if (
              !element.children.length
            ) {

              element.textContent =
                dictionary[key];

            } else {

              const walker =
                document.createTreeWalker(
                  element,
                  NodeFilter.SHOW_TEXT
                );


              let firstText =
                walker.nextNode();


              if (firstText) {

                rememberTextNode(
                  firstText
                );


                firstText.nodeValue =
                  dictionary[key];
              }
            }
          }

        }
      );
  }


  /* ==========================================================
     TRANSLATE PLACEHOLDERS
     ========================================================== */

  function translatePlaceholders(
    code
  ) {

    const dictionary =
      getDictionary(
        code
      );


    document
      .querySelectorAll(
        "[data-ph-key]"
      )
      .forEach(
        function (element) {

          const key =
            element.getAttribute(
              "data-ph-key"
            );


          if (
            dictionary[key] != null
          ) {

            element.placeholder =
              dictionary[key];
          }

        }
      );


    document
      .querySelectorAll(
        "input,textarea"
      )
      .forEach(
        function (element) {

          const placeholder =
            element.getAttribute(
              "placeholder"
            );


          if (!placeholder) {
            return;
          }


          const translated =
            translatePhrase(
              placeholder,
              code
            );


          if (
            translated !==
            placeholder
          ) {

            element.placeholder =
              translated;
          }

        }
      );
  }


  /* ==========================================================
     TRANSLATE TITLE / ARIA
     ========================================================== */

  function translateAttributes(
    code
  ) {

    document
      .querySelectorAll(
        "[title],[aria-label]"
      )
      .forEach(
        function (element) {

          ["title", "aria-label"]
            .forEach(
              function (attribute) {

                const value =
                  element.getAttribute(
                    attribute
                  );


                if (!value) {
                  return;
                }


                const translated =
                  translatePhrase(
                    value,
                    code
                  );


                if (
                  translated !==
                  value
                ) {

                  element.setAttribute(
                    attribute,
                    translated
                  );
                }

              }
            );

        }
      );
  }


  /* ==========================================================
     TRANSLATE ENTIRE PAGE
     ========================================================== */

  function translatePage(
    code
  ) {

    if (!document.body) {
      return;
    }


    /*
      Remember original English/source
      text before changing anything.
    */

    rememberDocument();


    /*
      Text nodes
    */

    const walker =
      document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );


    const nodes = [];


    let node;


    while (
      (node = walker.nextNode())
    ) {

      nodes.push(
        node
      );
    }


    nodes.forEach(
      function (textNode) {

        translateTextNode(
          textNode,
          code
        );

      }
    );


    /*
      data-key
    */

    translateDataKeys(
      code
    );


    /*
      placeholders
    */

    translatePlaceholders(
      code
    );


    /*
      title + aria-label
    */

    translateAttributes(
      code
    );


    /*
      RTL / LTR
    */

    applyDirection(
      code
    );


    /*
      Update language button
    */

    updateLanguageButtons(
      code
    );


    /*
      Update dropdown check
    */

    updateDropdownSelection(
      code
    );
  }


  /* ==========================================================
     DIRECTION
     ========================================================== */

  function applyDirection(
    code
  ) {

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

      if (document.body) {

        document.body
          .setAttribute(
            "dir",
            "rtl"
          );

        document.body
          .classList
          .add(
            "cpt-translator-rtl"
          );
      }

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

      if (document.body) {

        document.body
          .setAttribute(
            "dir",
            "ltr"
          );

        document.body
          .classList
          .remove(
            "cpt-translator-rtl"
          );
      }
    }
  }


  /* ==========================================================
     LANGUAGE BUTTONS
     ========================================================== */

  function getLanguageButtons() {

    const selectors = [
      "#languageBtn",
      ".language-btn",
      "#languageButton",
      ".language-button",
      "#langBtn",
      ".lang-btn",
      "[data-language-toggle]",
      "[data-lang-toggle]"
    ];


    const buttons = [];


    selectors.forEach(
      function (selector) {

        document
          .querySelectorAll(
            selector
          )
          .forEach(
            function (button) {

              if (
                !buttons.includes(
                  button
                )
              ) {

                buttons.push(
                  button
                );
              }

            }
          );

      }
    );


    return buttons;
  }


  /* ==========================================================
     UPDATE LANGUAGE BUTTON
     ========================================================== */

  function updateLanguageButtons(
    code
  ) {

    const info =
      getLanguageInfo(
        code
      );


    if (!info) {
      return;
    }


    const buttons =
      getLanguageButtons();


    buttons.forEach(
      function (button) {

        /*
          IMPORTANT:
          Show language NAME only.
          No globe.
          No flag.
        */

        button.textContent =
          info.name;


        button.title =
          info.name;


        button.setAttribute(
          "aria-label",
          info.name
        );


        button.setAttribute(
          "data-current-language",
          code
        );


        button.classList.add(
          "cpt-language-active"
        );


        /*
          Make text visible on dark
          existing button.
        */

        button.style.color =
          "#ffffff";

        button.style.fontWeight =
          "700";

        button.style.textShadow =
          "0 1px 3px rgba(0,0,0,.8)";

      }
    );


    /*
      Settings language text
    */

    const settingsText =
      document.getElementById(
        "settingsLangText"
      );


    if (settingsText) {

      settingsText.textContent =
        info.name;
    }


    /*
      Settings flag:
      keep selected flag here if this
      element exists.
    */

    const settingsFlag =
      document.getElementById(
        "settingsLangFlag"
      );


    if (settingsFlag) {

      settingsFlag.textContent =
        info.flag;
    }
  }


  /* ==========================================================
     DROPDOWN VARIABLE
     ========================================================== */

  let languageDropdown =
    null;


  /* ==========================================================
     CLOSE DROPDOWN
     ========================================================== */

  function closeDropdown() {

    if (
      languageDropdown
    ) {

      languageDropdown.remove();

      languageDropdown =
        null;
    }


    const old =
      document.getElementById(
        "cpt-language-dropdown"
      );


    if (old) {
      old.remove();
    }
  }


  /* ==========================================================
     CREATE DROPDOWN
     ========================================================== */

  function createDropdown(
    anchor
  ) {

    closeDropdown();


    languageDropdown =
      document.createElement(
        "div"
      );


    languageDropdown.id =
      "cpt-language-dropdown";


    languageDropdown.setAttribute(
      "role",
      "menu"
    );


    /*
      Header
    */

    const header =
      document.createElement(
        "div"
      );


    header.className =
      "cpt-language-header";


    header.textContent =
      "Select Language";


    languageDropdown.appendChild(
      header
    );


    /*
      Options
    */

    const options =
      document.createElement(
        "div"
      );


    options.className =
      "cpt-language-options";


    LANGUAGE_LIST.forEach(
      function (language) {

        const option =
          document.createElement(
            "button"
          );


        option.type =
          "button";


        option.className =
          "cpt-language-option";


        option.setAttribute(
          "role",
          "menuitem"
        );


        option.dataset.language =
          language.code;


        option.innerHTML = `
          <span class="cpt-language-flag">
            ${language.flag}
          </span>

          <span class="cpt-language-name">
            ${language.name}
          </span>

          <span class="cpt-language-check">
            ✓
          </span>
        `;


        /*
          IMPORTANT:
          Stop propagation here.
          This fixes the previous bug where
          document click closed the menu
          before setLanguage() ran.
        */

        option.addEventListener(
          "click",
          function (event) {

            event.preventDefault();
            event.stopPropagation();


            setLanguage(
              language.code
            );

          }
        );


        options.appendChild(
          option
        );

      }
    );


    languageDropdown.appendChild(
      options
    );


    document.body.appendChild(
      languageDropdown
    );


    /*
      Position
    */

    positionDropdown(
      anchor
    );


    /*
      Current selection
    */

    updateDropdownSelection(
      getCurrentLanguage()
    );


    return languageDropdown;
  }


  /* ==========================================================
     POSITION DROPDOWN
     ========================================================== */

  function positionDropdown(
    anchor
  ) {

    if (
      !languageDropdown ||
      !anchor
    ) {
      return;
    }


    const rect =
      anchor.getBoundingClientRect();


    const menuWidth =
      Math.min(
        285,
        window.innerWidth - 20
      );


    languageDropdown.style.width =
      menuWidth + "px";


    let left =
      rect.right -
      menuWidth;


    if (
      left < 10
    ) {

      left = 10;
    }


    if (
      left + menuWidth >
      window.innerWidth - 10
    ) {

      left =
        window.innerWidth -
        menuWidth -
        10;
    }


    let top =
      rect.bottom + 8;


    /*
      If there isn't enough room below,
      open above the button.
    */

    const menuHeight =
      Math.min(
        languageDropdown.scrollHeight,
        520
      );


    if (
      top + menuHeight >
      window.innerHeight - 10
    ) {

      top =
        rect.top -
        menuHeight -
        8;
    }


    if (
      top < 10
    ) {

      top = 10;
    }


    languageDropdown.style.left =
      left + "px";


    languageDropdown.style.top =
      top + "px";
  }


  /* ==========================================================
     UPDATE DROPDOWN SELECTION
     ========================================================== */

  function updateDropdownSelection(
    code
  ) {

    if (
      !languageDropdown
    ) {
      return;
    }


    languageDropdown
      .querySelectorAll(
        ".cpt-language-option"
      )
      .forEach(
        function (option) {

          const optionCode =
            option.dataset.language;


          if (
            optionCode === code
          ) {

            option.classList.add(
              "selected"
            );

          } else {

            option.classList.remove(
              "selected"
            );
          }

        }
      );
  }


  /* ==========================================================
     OPEN / CLOSE
     ========================================================== */

  function toggleDropdown(
    event,
    button
  ) {

    event.preventDefault();
    event.stopPropagation();


    if (
      languageDropdown
    ) {

      closeDropdown();

      return;
    }


    createDropdown(
      button
    );
  }


  /* ==========================================================
     CONNECT LANGUAGE BUTTONS
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
          function (event) {

            toggleDropdown(
              event,
              button
            );

          }
        );


        button.addEventListener(
          "keydown",
          function (event) {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              toggleDropdown(
                event,
                button
              );

            }

          }
        );

      }
    );
  }


  /* ==========================================================
     OUTSIDE CLICK
     ========================================================== */

  function connectOutsideClick() {

    /*
      DO NOT use capture phase.
      This was one of the reasons
      language selection was failing.
    */

    document.addEventListener(
      "click",
      function (event) {

        if (
          !languageDropdown
        ) {
          return;
        }


        /*
          Click inside dropdown:
          do nothing.
        */

        if (
          languageDropdown.contains(
            event.target
          )
        ) {

          return;
        }


        /*
          Click on language button:
          do nothing because button handler
          already controls open/close.
        */

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


        closeDropdown();

      },
      false
    );
  }


  /* ==========================================================
     ESCAPE
     ========================================================== */

  function connectEscape() {

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape"
        ) {

          closeDropdown();
        }

      }
    );
  }


  /* ==========================================================
     RESIZE
     ========================================================== */

  function connectResize() {

    window.addEventListener(
      "resize",
      function () {

        closeDropdown();

      }
    );
  }


  /* ==========================================================
     GLOBAL LANGUAGE CHANGE
     ========================================================== */

  function setLanguage(
    code
  ) {

    /*
      Compatibility
    */

    if (
      code === "en_GB"
    ) {

      code =
        "en_UK";
    }


    const info =
      getLanguageInfo(
        code
      );


    if (!info) {

      return;
    }


    /*
      SAVE FIRST
    */

    saveLanguage(
      code
    );


    /*
      APPLY CURRENT PAGE
    */

    translatePage(
      code
    );


    /*
      Close menu
    */

    closeDropdown();


    /*
      Notify page scripts
    */

    try {

      window.dispatchEvent(
        new CustomEvent(
          "cpt:languagechange",
          {
            detail: {
              code: code,
              language: code
            }
          }
        )
      );

    } catch (error) {
      /* ignore */
    }


    try {

      document.dispatchEvent(
        new CustomEvent(
          "cptLanguageChanged",
          {
            detail: {
              code: code,
              language: code
            }
          }
        )
      );

    } catch (error) {
      /* ignore */
    }
  }


  /* ==========================================================
     CSS
     ========================================================== */

  function injectCSS() {

    if (
      document.getElementById(
        "cpt-translator-css"
      )
    ) {
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "cpt-translator-css";


    style.textContent = `

      /* =====================================================
         LANGUAGE BUTTON
         ===================================================== */

      .cpt-language-active {

        color: #ffffff !important;

        font-weight: 700 !important;

        white-space: nowrap;

        overflow: hidden;

        text-overflow: ellipsis;

      }


      /* =====================================================
         LANGUAGE DROPDOWN
         ===================================================== */

      #cpt-language-dropdown {

        position: fixed;

        z-index: 2147483647;

        box-sizing: border-box;

        max-height:
          min(520px, calc(100vh - 20px));

        overflow: hidden;

        padding: 8px;

        border-radius: 18px;

        border:
          1px solid
          rgba(0, 210, 255, .42);

        background:
          linear-gradient(
            145deg,
            rgba(4, 20, 42, .99),
            rgba(2, 9, 24, .99)
          );

        box-shadow:
          0 18px 55px
          rgba(0,0,0,.75),

          0 0 28px
          rgba(0,210,255,.12);

        backdrop-filter:
          blur(18px);

        -webkit-backdrop-filter:
          blur(18px);

        animation:
          cptLanguageOpen
          .16s
          ease-out;

      }


      @keyframes cptLanguageOpen {

        from {

          opacity: 0;

          transform:
            translateY(-6px)
            scale(.98);

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

      .cpt-language-header {

        padding:
          9px
          10px
          11px;

        margin-bottom:
          5px;

        border-bottom:
          1px solid
          rgba(255,255,255,.08);

        color:
          #ffffff;

        font-size:
          14px;

        font-weight:
          700;

      }


      /* =====================================================
         OPTIONS
         ===================================================== */

      .cpt-language-options {

        max-height:
          455px;

        overflow-y:
          auto;

        display:
          flex;

        flex-direction:
          column;

        gap:
          4px;

        scrollbar-width:
          thin;

      }


      .cpt-language-options::-webkit-scrollbar {

        width:
          4px;

      }


      .cpt-language-options::-webkit-scrollbar-thumb {

        background:
          rgba(0,210,255,.35);

        border-radius:
          20px;

      }


      /* =====================================================
         LANGUAGE OPTION
         ===================================================== */

      .cpt-language-option {

        width:
          100%;

        min-height:
          46px;

        box-sizing:
          border-box;

        display:
          flex;

        align-items:
          center;

        gap:
          11px;

        padding:
          7px
          10px;

        border:
          1px solid
          transparent;

        border-radius:
          12px;

        background:
          rgba(255,255,255,.035);

        color:
          #ffffff;

        cursor:
          pointer;

        font-family:
          inherit;

        font-size:
          14px;

        font-weight:
          600;

        text-align:
          left;

        transition:
          background .15s ease,
          border-color .15s ease,
          transform .15s ease;

      }


      .cpt-language-option:hover {

        background:
          rgba(0,210,255,.10);

        border-color:
          rgba(0,210,255,.25);

        transform:
          translateX(2px);

      }


      .cpt-language-option:active {

        transform:
          scale(.98);

      }


      /* =====================================================
         FLAG
         ===================================================== */

      .cpt-language-flag {

        width:
          29px;

        min-width:
          29px;

        font-size:
          21px;

        line-height:
          1;

        text-align:
          center;

      }


      /* =====================================================
         NAME
         ===================================================== */

      .cpt-language-name {

        flex:
          1;

        color:
          #ffffff;

      }


      /* =====================================================
         CHECK
         ===================================================== */

      .cpt-language-check {

        display:
          none;

        color:
          #00dcff;

        font-size:
          18px;

        font-weight:
          900;

      }


      .cpt-language-option.selected {

        background:
          rgba(0,210,255,.13);

        border-color:
          rgba(0,210,255,.30);

      }


      .cpt-language-option.selected
      .cpt-language-check {

        display:
          block;

      }


      /* =====================================================
         RTL
         ===================================================== */

      html[dir="rtl"]
      #cpt-language-dropdown {

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

        #cpt-language-dropdown {

          max-width:
            calc(100vw - 20px);

          border-radius:
            16px;

        }


        .cpt-language-option {

          min-height:
            47px;

        }


        .cpt-language-name {

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
     MUTATION OBSERVER
     ----------------------------------------------------------
     Handles dashboard/trade content that is inserted later.
     ========================================================== */

  function connectMutationObserver() {

    if (!document.body) {
      return;
    }


    let timer =
      null;


    const observer =
      new MutationObserver(
        function (mutations) {

          let added =
            false;


          mutations.forEach(
            function (mutation) {

              if (
                mutation.addedNodes &&
                mutation.addedNodes.length
              ) {

                added = true;
              }

            }
          );


          if (!added) {
            return;
          }


          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              function () {

                translatePage(
                  getCurrentLanguage()
                );

              },
              80
            );

        }
      );


    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );
  }


  /* ==========================================================
     CROSS-TAB LANGUAGE SYNC
     ========================================================== */

  function connectStorageSync() {

    window.addEventListener(
      "storage",
      function (event) {

        if (
          event.key !==
          STORAGE_KEY
        ) {

          return;
        }


        if (
          !event.newValue
        ) {

          return;
        }


        if (
          event.newValue ===
          getCurrentLanguage()
        ) {

          return;
        }


        if (
          !getLanguageInfo(
            event.newValue
          )
        ) {

          return;
        }


        translatePage(
          event.newValue
        );

      }
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

        return getCurrentLanguage();

      },

    getLanguages:
      function () {

        return LANGUAGE_LIST.slice();

      },

    refresh:
      function () {

        translatePage(
          getCurrentLanguage()
        );

      },

    open:
      function () {

        const buttons =
          getLanguageButtons();


        if (
          buttons.length
        ) {

          createDropdown(
            buttons[0]
          );

        }

      },

    close:
      function () {

        closeDropdown();

      }

  };


  /*
    Compatibility with existing website code
  */

  window.getLanguage =
    getCurrentLanguage;


  window.setLanguage =
    setLanguage;


  window.applyLanguage =
    setLanguage;


  /*
    Do not overwrite an existing
    cptTranslatePhrase helper.
  */

  if (
    typeof window.cptTranslatePhrase !==
    "function"
  ) {

    window.cptTranslatePhrase =
      translatePhrase;
  }


  /* ==========================================================
     INITIALIZATION
     ========================================================== */

  function initialize() {

    injectCSS();


    connectLanguageButtons();


    connectOutsideClick();


    connectEscape();


    connectResize();


    connectStorageSync();


    connectMutationObserver();


    /*
      Apply saved language
    */

    translatePage(
      getCurrentLanguage()
    );


    /*
      Some pages create their language button
      slightly later, so reconnect once more.
    */

    setTimeout(
      function () {

        connectLanguageButtons();

        translatePage(
          getCurrentLanguage()
        );

      },
      300
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
      initialize,
      {
        once: true
      }
    );

  } else {

    initialize();

  }

})();
