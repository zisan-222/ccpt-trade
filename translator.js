// ============================================================
// CptMarkets — translator.js
// Universal 11-language translator
// Shared language state across ALL pages
// ============================================================
(function () {
  'use strict';

  const STORAGE_KEY = 'cpt_lang';
  const DEFAULT_LANG = 'en_UK';

  // Arabic uses right-to-left direction.
  const RTL_LANGS = new Set(['ar_SA']);

  // Elements that must never be translated.
  const SKIP_SELECTOR =
    'script,style,noscript,svg,[contenteditable="true"]';

  // ------------------------------------------------------------
  // LANGUAGE DATA
  // ------------------------------------------------------------

  function getLanguageData() {
    return window.languageData || {};
  }

  function getDictionary(code) {
    return getLanguageData()[code] || {};
  }

  function normalize(value) {
    return String(value == null ? '' : value)
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ------------------------------------------------------------
  // CURRENT LANGUAGE
  // ------------------------------------------------------------

  function getLanguage() {
    const data = getLanguageData();
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved && data[saved] && data[saved].langName) {
      return saved;
    }

    return DEFAULT_LANG;
  }

  // ------------------------------------------------------------
  // REMEMBER ORIGINAL TEXT
  // ------------------------------------------------------------
  // This is important because the user can switch:
  //
  // English → Bengali → Spanish → Portuguese → German
  //
  // without translating an already-translated string.

  function rememberTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) {
      return;
    }

    const parent = node.parentElement;

    if (!parent) {
      return;
    }

    if (parent.closest(SKIP_SELECTOR)) {
      return;
    }

    if (!normalize(node.nodeValue)) {
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(node, '__cptSource')) {
      Object.defineProperty(node, '__cptSource', {
        value: node.nodeValue,
        writable: true,
        configurable: true
      });
    }
  }

  function rememberAttribute(element, attribute) {
    if (!element || !element.hasAttribute(attribute)) {
      return;
    }

    const propertyName = '__cptOriginal_' + attribute;

    if (
      !Object.prototype.hasOwnProperty.call(
        element,
        propertyName
      )
    ) {
      Object.defineProperty(element, propertyName, {
        value: element.getAttribute(attribute),
        writable: true,
        configurable: true
      });
    }
  }

  // ------------------------------------------------------------
  // FIND TRANSLATION
  // ------------------------------------------------------------

  function translatePhrase(source, languageCode) {
    const raw = String(source == null ? '' : source);
    const clean = normalize(raw);

    if (!clean) {
      return raw;
    }

    const dictionaries = getLanguageData();
    const target = dictionaries[languageCode] || {};

    // Static phrase map.
    const staticMaps = window.cptStaticTranslations || {};
    const staticMap = staticMaps[languageCode] || {};

    if (
      Object.prototype.hasOwnProperty.call(
        staticMap,
        clean
      )
    ) {
      return staticMap[clean];
    }

    // First try the default English dictionary.
    const base = dictionaries[DEFAULT_LANG] || {};

    for (const key of Object.keys(base)) {
      if (normalize(base[key]) === clean) {
        if (target[key] != null) {
          return target[key];
        }
      }
    }

    // Try the language file's own phrase translator.
    if (
      typeof window.cptTranslatePhrase === 'function' &&
      window.cptTranslatePhrase !== translatePhrase
    ) {
      const result = window.cptTranslatePhrase(
        clean,
        languageCode
      );

      if (result && normalize(result) !== clean) {
        return result;
      }
    }

    return raw;
  }

  // ------------------------------------------------------------
  // TRANSLATE TEXT NODES
  // ------------------------------------------------------------

  function translateTextNodes(root, languageCode) {
    if (!root) {
      return;
    }

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT
    );

    const nodes = [];

    let node;

    while ((node = walker.nextNode())) {
      if (
        node.parentElement &&
        !node.parentElement.closest(SKIP_SELECTOR)
      ) {
        nodes.push(node);
      }
    }

    nodes.forEach(function (textNode) {
      rememberTextNode(textNode);

      const source = textNode.__cptSource;

      if (source) {
        textNode.nodeValue = translatePhrase(
          source,
          languageCode
        );
      }
    });
  }

  // ------------------------------------------------------------
  // DATA-KEY TRANSLATION
  // ------------------------------------------------------------

  function translateDataKey(element, languageCode) {
    const key = element.getAttribute('data-key');

    if (!key) {
      return;
    }

    const dictionary = getDictionary(languageCode);

    if (dictionary[key] == null) {
      return;
    }

    // Simple element containing only text.
    if (!element.children.length) {
      if (
        !Object.prototype.hasOwnProperty.call(
          element,
          '__cptOriginalHTML'
        )
      ) {
        Object.defineProperty(element, '__cptOriginalHTML', {
          value: element.innerHTML,
          writable: true,
          configurable: true
        });
      }

      element.textContent = dictionary[key];
      return;
    }

    // Element containing one text node and possibly formatting.
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT
    );

    const textNodes = [];

    let node;

    while ((node = walker.nextNode())) {
      if (
        node.parentElement &&
        !node.parentElement.closest(SKIP_SELECTOR)
      ) {
        textNodes.push(node);
      }
    }

    if (textNodes.length === 1) {
      rememberTextNode(textNodes[0]);
      textNodes[0].nodeValue = dictionary[key];
    }
  }

  // ------------------------------------------------------------
  // PLACEHOLDER / TITLE / ARIA
  // ------------------------------------------------------------

  function translateAttributes(element, languageCode) {
    const dictionary = getDictionary(languageCode);

    // data-ph-key
    const placeholderKey =
      element.getAttribute('data-ph-key');

    if (
      placeholderKey &&
      dictionary[placeholderKey] != null
    ) {
      element.setAttribute(
        'placeholder',
        dictionary[placeholderKey]
      );
    }

    // Placeholder
    if (element.hasAttribute('placeholder')) {
      rememberAttribute(element, 'placeholder');

      const original =
        element.__cptOriginal_placeholder;

      if (original) {
        element.setAttribute(
          'placeholder',
          translatePhrase(
            original,
            languageCode
          )
        );
      }
    }

    // Title
    if (element.hasAttribute('title')) {
      rememberAttribute(element, 'title');

      const original =
        element.__cptOriginal_title;

      if (original) {
        element.setAttribute(
          'title',
          translatePhrase(
            original,
            languageCode
          )
        );
      }
    }

    // aria-label
    if (element.hasAttribute('aria-label')) {
      rememberAttribute(element, 'aria-label');

      const original =
        element.__cptOriginal_aria_label;

      if (original) {
        element.setAttribute(
          'aria-label',
          translatePhrase(
            original,
            languageCode
          )
        );
      }
    }
  }

  // ------------------------------------------------------------
  // TRANSLATE ELEMENT
  // ------------------------------------------------------------

  function translateElement(element, languageCode) {
    if (!element) {
      return;
    }

    if (element.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    if (element.matches(SKIP_SELECTOR)) {
      return;
    }

    translateDataKey(
      element,
      languageCode
    );

    translateAttributes(
      element,
      languageCode
    );
  }

  // ------------------------------------------------------------
  // RTL / LTR
  // ------------------------------------------------------------

  function applyDirection(languageCode) {
    const rtl = RTL_LANGS.has(languageCode);

    document.documentElement.dir =
      rtl ? 'rtl' : 'ltr';

    document.documentElement.lang =
      languageCode.replace('_', '-');

    if (document.body) {
      document.body.dir =
        rtl ? 'rtl' : 'ltr';
    }

    document.documentElement.setAttribute(
      'data-language',
      languageCode
    );
  }

  // ------------------------------------------------------------
  // UPDATE LANGUAGE BUTTON
  // ------------------------------------------------------------

  function updateLanguageButton(languageCode) {
    const dictionary =
      getDictionary(languageCode);

    const flag =
      dictionary.flag || '🌐';

    const languageName =
      dictionary.langName || 'Language';

    document
      .querySelectorAll(
        '#languageBtn,.language-btn'
      )
      .forEach(function (button) {

        // Keep existing compact flag-button design.
        button.textContent = flag;

        button.title = languageName;

        button.setAttribute(
          'aria-label',
          languageName
        );
      });

    const settingsText =
      document.getElementById(
        'settingsLangText'
      );

    const settingsFlag =
      document.getElementById(
        'settingsLangFlag'
      );

    if (settingsText) {
      settingsText.textContent =
        languageName;
    }

    if (settingsFlag) {
      settingsFlag.textContent =
        flag;
    }
  }

  // ------------------------------------------------------------
  // CLOSE LANGUAGE MENU
  // ------------------------------------------------------------

  function closeLanguageMenu() {
    const menu =
      document.getElementById(
        'cptLanguageMenu'
      );

    if (menu) {
      menu.remove();
    }
  }

  // ------------------------------------------------------------
  // CREATE LANGUAGE MENU
  // ------------------------------------------------------------

  function openLanguageMenu(anchor) {
    closeLanguageMenu();

    const data =
      getLanguageData();

    const current =
      getLanguage();

    const menu =
      document.createElement('div');

    menu.id =
      'cptLanguageMenu';

    menu.style.cssText =
      'position:fixed;' +
      'z-index:2147483647;' +
      'width:235px;' +
      'max-height:390px;' +
      'overflow:auto;' +
      'background:#0b1526;' +
      'border:1px solid rgba(255,201,40,.8);' +
      'border-radius:14px;' +
      'padding:6px;' +
      'box-shadow:0 14px 50px rgba(0,0,0,.65);' +
      'box-sizing:border-box;';

    Object.keys(data).forEach(
      function (languageCode) {

        const language =
          data[languageCode];

        if (
          !language ||
          !language.langName
        ) {
          return;
        }

        const item =
          document.createElement('button');

        item.type =
          'button';

        const selected =
          languageCode === current;

        item.style.cssText =
          'display:flex;' +
          'align-items:center;' +
          'width:100%;' +
          'gap:10px;' +
          'padding:11px 12px;' +
          'border:0;' +
          'border-radius:9px;' +
          'background:' +
          (
            selected
              ? 'rgba(255,201,40,.14)'
              : 'transparent'
          ) +
          ';color:#fff;' +
          'cursor:pointer;' +
          'font:500 14px/1.2 inherit;' +
          'text-align:left;' +
          'box-sizing:border-box;';

        const flag =
          language.flag || '🌐';

        const name =
          language.langName;

        item.innerHTML =
          '<span style="' +
          'font-size:21px;' +
          'line-height:1">' +
          flag +
          '</span>' +

          '<span style="' +
          'flex:1">' +
          name +
          '</span>' +

          (
            selected
              ? '<span style="' +
                'color:#ffc928;' +
                'font-weight:700">' +
                '✓' +
                '</span>'
              : ''
          );

        item.addEventListener(
          'click',
          function (event) {

            event.stopPropagation();

            setLanguage(
              languageCode
            );
          }
        );

        menu.appendChild(item);
      }
    );

    document.body.appendChild(menu);

    const rect =
      anchor.getBoundingClientRect();

    const menuHeight =
      Math.min(
        menu.offsetHeight,
        390
      );

    let top =
      rect.bottom + 7;

    if (
      top + menuHeight >
      window.innerHeight
    ) {
      top =
        Math.max(
          7,
          rect.top -
          menuHeight -
          7
        );
    }

    let left =
      Math.min(
        rect.left,
        window.innerWidth -
        menu.offsetWidth -
        7
      );

    left =
      Math.max(
        7,
        left
      );

    menu.style.top =
      top + 'px';

    menu.style.left =
      left + 'px';
  }

  // ------------------------------------------------------------
  // CONNECT EXISTING LANGUAGE BUTTONS
  // ------------------------------------------------------------

  function wireLanguageButtons() {
    document
      .querySelectorAll(
        '#languageBtn,.language-btn'
      )
      .forEach(function (button) {

        if (
          button.dataset
            .cptLanguageReady === '1'
        ) {
          return;
        }

        button.dataset
          .cptLanguageReady = '1';

        button.addEventListener(
          'click',
          function (event) {

            event.preventDefault();
            event.stopPropagation();

            const menu =
              document.getElementById(
                'cptLanguageMenu'
              );

            if (menu) {
              closeLanguageMenu();
            } else {
              openLanguageMenu(
                button
              );
            }
          }
        );
      });
  }

  // ------------------------------------------------------------
  // TRANSLATE COMPLETE PAGE
  // ------------------------------------------------------------

  function translatePage(languageCode) {

    const dictionary =
      getDictionary(languageCode);

    if (
      !dictionary ||
      !dictionary.langName
    ) {
      languageCode =
        DEFAULT_LANG;
    }

    // 1. Translate normal text nodes.
    translateTextNodes(
      document.body,
      languageCode
    );

    // 2. Translate data-key elements,
    //    inputs, textareas, buttons and ARIA attributes.
    document
      .querySelectorAll(
        '[data-key],' +
        'input,' +
        'textarea,' +
        'button,' +
        '[title],' +
        '[aria-label]'
      )
      .forEach(function (element) {

        translateElement(
          element,
          languageCode
        );
      });

    // 3. Direction.
    applyDirection(
      languageCode
    );

    // 4. Update flag.
    updateLanguageButton(
      languageCode
    );

    // 5. Make sure newly-created buttons
    //    also have the language selector.
    wireLanguageButtons();
  }

  // ------------------------------------------------------------
  // SET LANGUAGE
  // ------------------------------------------------------------

  function setLanguage(languageCode) {

    const dictionary =
      getDictionary(languageCode);

    if (
      !dictionary ||
      !dictionary.langName
    ) {
      languageCode =
        DEFAULT_LANG;
    }

    // ONE shared key for every page.
    //
    // Therefore:
    // Dashboard → Spanish
    // Trade → Spanish
    // Assets → Spanish
    // Mine → Spanish
    // Settings → Spanish
    //
    localStorage.setItem(
      STORAGE_KEY,
      languageCode
    );

    translatePage(
      languageCode
    );

    closeLanguageMenu();

    // Notify other scripts.
    window.dispatchEvent(
      new CustomEvent(
        'cpt:languagechange',
        {
          detail: {
            code: languageCode
          }
        }
      )
    );
  }

  // ------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------

  function initTranslator() {

    // Apply saved language immediately.
    translatePage(
      getLanguage()
    );

    // Close menu when clicking outside.
    document.addEventListener(
      'click',
      function (event) {

        const menu =
          document.getElementById(
            'cptLanguageMenu'
          );

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

        if (
          event.target.closest(
            '#languageBtn,.language-btn'
          )
        ) {
          return;
        }

        closeLanguageMenu();
      }
    );

    // ----------------------------------------------------------
    // STORAGE EVENT
    // ----------------------------------------------------------
    // If another browser tab changes the language,
    // this page changes too.

    window.addEventListener(
      'storage',
      function (event) {

        if (
          event.key !==
          STORAGE_KEY
        ) {
          return;
        }

        const newLanguage =
          event.newValue;

        if (
          !newLanguage
        ) {
          return;
        }

        const dictionary =
          getDictionary(
            newLanguage
          );

        if (
          dictionary &&
          dictionary.langName
        ) {
          translatePage(
            newLanguage
          );
        }
      }
    );

    // ----------------------------------------------------------
    // DYNAMIC CONTENT
    // ----------------------------------------------------------
    // Dashboard/trading pages may create content with JavaScript.
    // This observer translates newly-added content automatically.

    let observerTimer =
      null;

    const observer =
      new MutationObserver(
        function (mutations) {

          const hasAddedNodes =
            mutations.some(
              function (mutation) {
                return (
                  mutation.addedNodes &&
                  mutation.addedNodes.length
                );
              }
            );

          if (!hasAddedNodes) {
            return;
          }

          clearTimeout(
            observerTimer
          );

          observerTimer =
            setTimeout(
              function () {

                translatePage(
                  getLanguage()
                );

              },
              50
            );
        }
      );

    if (document.body) {
      observer.observe(
        document.body,
        {
          childList: true,
          subtree: true
        }
      );
    }
  }

  // ------------------------------------------------------------
  // PUBLIC API
  // ------------------------------------------------------------

  window.getLanguage =
    getLanguage;

  window.setLanguage =
    setLanguage;

  window.applyLanguage =
    setLanguage;

  // Public phrase translator.
  window.cptUniversalTranslatePhrase =
    translatePhrase;

  // ------------------------------------------------------------
  // START
  // ------------------------------------------------------------

  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initTranslator,
      {
        once: true
      }
    );

  } else {

    initTranslator();

  }

})();
