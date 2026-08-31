// ============================================================
// CptMarkets — translator.js
// Universal 11-Language Translator
// Shared language selection across ALL pages
// ============================================================

(function () {
    "use strict";

    /* =========================================================
       SETTINGS
    ========================================================= */

    const STORAGE_KEY = "cpt_lang";
    const DEFAULT_LANG = "en_UK";

    const RTL_LANGUAGES = {
        ar_SA: true
    };


    /* =========================================================
       LANGUAGE DATA
    ========================================================= */

    function getLanguageData() {
        if (
            typeof window !== "undefined" &&
            window.languageData &&
            typeof window.languageData === "object"
        ) {
            return window.languageData;
        }

        return {};
    }


    /* =========================================================
       NORMALIZE TEXT
    ========================================================= */

    function normalizeText(text) {
        return String(text == null ? "" : text)
            .replace(/\s+/g, " ")
            .trim();
    }


    /* =========================================================
       GET CURRENT LANGUAGE
    ========================================================= */

    function getCurrentLanguage() {
        const languages = getLanguageData();

        let savedLanguage = null;

        try {
            savedLanguage = localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            savedLanguage = null;
        }

        if (
            savedLanguage &&
            Object.prototype.hasOwnProperty.call(languages, savedLanguage)
        ) {
            return savedLanguage;
        }

        if (
            Object.prototype.hasOwnProperty.call(languages, DEFAULT_LANG)
        ) {
            return DEFAULT_LANG;
        }

        const available = Object.keys(languages);

        return available.length ? available[0] : DEFAULT_LANG;
    }


    /* =========================================================
       SAVE LANGUAGE
    ========================================================= */

    function saveLanguage(code) {
        try {
            localStorage.setItem(STORAGE_KEY, code);
        } catch (error) {
            console.warn("CptMarkets: localStorage unavailable.");
        }
    }


    /* =========================================================
       REMEMBER ORIGINAL TEXT
    ========================================================= */

    function rememberOriginalText(node) {

        if (!node || node.nodeType !== Node.TEXT_NODE) {
            return;
        }

        const parent = node.parentElement;

        if (!parent) {
            return;
        }

        if (
            parent.closest(
                "script,style,noscript,svg,[contenteditable='true']"
            )
        ) {
            return;
        }

        const value = node.nodeValue;

        if (!value || !normalizeText(value)) {
            return;
        }

        if (!Object.prototype.hasOwnProperty.call(node, "__cptOriginal")) {
            Object.defineProperty(node, "__cptOriginal", {
                value: value,
                writable: true,
                configurable: true
            });
        }
    }


    /* =========================================================
       REMEMBER WHOLE DOCUMENT
    ========================================================= */

    function rememberDocument() {

        if (!document.body) {
            return;
        }

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );

        let node;

        while ((node = walker.nextNode())) {
            rememberOriginalText(node);
        }
    }


    /* =========================================================
       FIND TRANSLATION
    ========================================================= */

    function translatePhrase(source, languageCode) {

        const original = normalizeText(source);

        if (!original) {
            return source;
        }

        const languages = getLanguageData();

        const targetDictionary =
            languages[languageCode] || {};

        /* ---------------------------------------------
           1. Static translation map
        --------------------------------------------- */

        const staticTranslations =
            window.cptStaticTranslations || {};

        const staticMap =
            staticTranslations[languageCode] || {};

        if (
            Object.prototype.hasOwnProperty.call(
                staticMap,
                original
            )
        ) {
            return staticMap[original];
        }


        /* ---------------------------------------------
           2. Direct dictionary key
        --------------------------------------------- */

        if (
            Object.prototype.hasOwnProperty.call(
                targetDictionary,
                original
            )
        ) {
            return targetDictionary[original];
        }


        /* ---------------------------------------------
           3. Find source text inside dictionary values
        --------------------------------------------- */

        const languageCodes = Object.keys(languages);

        for (let i = 0; i < languageCodes.length; i++) {

            const sourceCode = languageCodes[i];
            const sourceDictionary =
                languages[sourceCode] || {};

            const keys = Object.keys(sourceDictionary);

            for (let j = 0; j < keys.length; j++) {

                const key = keys[j];
                const value = sourceDictionary[key];

                if (
                    typeof value === "string" &&
                    normalizeText(value) === original
                ) {

                    if (
                        Object.prototype.hasOwnProperty.call(
                            targetDictionary,
                            key
                        )
                    ) {
                        return targetDictionary[key];
                    }
                }
            }
        }


        /* ---------------------------------------------
           4. No translation found
        --------------------------------------------- */

        return source;
    }


    /* =========================================================
       TRANSLATE TEXT NODE
    ========================================================= */

    function translateTextNode(node, languageCode) {

        if (!node || node.nodeType !== Node.TEXT_NODE) {
            return;
        }

        const parent = node.parentElement;

        if (!parent) {
            return;
        }

        if (
            parent.closest(
                "script,style,noscript,svg,[contenteditable='true']"
            )
        ) {
            return;
        }

        rememberOriginalText(node);

        const original =
            node.__cptOriginal;

        if (!original || !normalizeText(original)) {
            return;
        }

        const translated =
            translatePhrase(
                original,
                languageCode
            );

        if (node.nodeValue !== translated) {
            node.nodeValue = translated;
        }
    }


    /* =========================================================
       TRANSLATE ELEMENT
    ========================================================= */

    function translateElement(element, languageCode) {

        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        if (
            element.matches(
                "script,style,noscript,svg,[contenteditable='true']"
            )
        ) {
            return;
        }

        const languages = getLanguageData();

        const dictionary =
            languages[languageCode] || {};


        /* ---------------------------------------------
           DATA-KEY
        --------------------------------------------- */

        const key =
            element.getAttribute("data-key");

        if (
            key &&
            Object.prototype.hasOwnProperty.call(
                dictionary,
                key
            )
        ) {

            if (!element.__cptOriginalKey) {

                Object.defineProperty(
                    element,
                    "__cptOriginalKey",
                    {
                        value: key,
                        writable: true,
                        configurable: true
                    }
                );
            }

            const translated =
                dictionary[key];

            if (!element.children.length) {

                if (
                    element.textContent !== translated
                ) {
                    element.textContent = translated;
                }

            } else {

                const walker =
                    document.createTreeWalker(
                        element,
                        NodeFilter.SHOW_TEXT
                    );

                let childNode;

                while (
                    (childNode = walker.nextNode())
                ) {
                    rememberOriginalText(childNode);
                }
            }
        }


        /* ---------------------------------------------
           PLACEHOLDER KEY
        --------------------------------------------- */

        const placeholderKey =
            element.getAttribute("data-ph-key");

        if (
            placeholderKey &&
            Object.prototype.hasOwnProperty.call(
                dictionary,
                placeholderKey
            )
        ) {

            element.setAttribute(
                "placeholder",
                dictionary[placeholderKey]
            );
        }


        /* ---------------------------------------------
           PLACEHOLDER
        --------------------------------------------- */

        translateAttribute(
            element,
            "placeholder",
            languageCode
        );


        /* ---------------------------------------------
           TITLE
        --------------------------------------------- */

        translateAttribute(
            element,
            "title",
            languageCode
        );


        /* ---------------------------------------------
           ARIA LABEL
        --------------------------------------------- */

        translateAttribute(
            element,
            "aria-label",
            languageCode
        );
    }


    /* =========================================================
       TRANSLATE ATTRIBUTE
    ========================================================= */

    function translateAttribute(
        element,
        attribute,
        languageCode
    ) {

        const value =
            element.getAttribute(attribute);

        if (!value) {
            return;
        }

        const translated =
            translatePhrase(
                value,
                languageCode
            );

        if (
            translated &&
            translated !== value
        ) {

            element.setAttribute(
                attribute,
                translated
            );
        }
    }


    /* =========================================================
       PAGE DIRECTION
    ========================================================= */

    function applyDirection(languageCode) {

        const direction =
            RTL_LANGUAGES[languageCode]
                ? "rtl"
                : "ltr";

        document.documentElement.setAttribute(
            "dir",
            direction
        );

        document.documentElement.setAttribute(
            "lang",
            languageCode.replace("_", "-")
        );

        if (document.body) {

            document.body.setAttribute(
                "dir",
                direction
            );
        }
    }


    /* =========================================================
       UPDATE LANGUAGE BUTTON
    ========================================================= */

    function updateLanguageButtons(languageCode) {

        const languages =
            getLanguageData();

        const language =
            languages[languageCode] || {};

        const flag =
            language.flag || "🌐";

        const languageName =
            language.langName ||
            language.name ||
            languageCode;


        /* ---------------------------------------------
           Main language buttons
        --------------------------------------------- */

        const buttons =
            document.querySelectorAll(
                "#languageBtn, .language-btn"
            );

        buttons.forEach(function (button) {

            /*
             * IMPORTANT:
             * Show selected language flag + name.
             * Do NOT show global globe icon.
             */

            button.textContent =
                flag + " " + languageName;

            button.setAttribute(
                "title",
                languageName
            );

            button.setAttribute(
                "aria-label",
                languageName
            );
        });


        /* ---------------------------------------------
           Settings language text
        --------------------------------------------- */

        const settingsText =
            document.getElementById(
                "settingsLangText"
            );

        if (settingsText) {
            settingsText.textContent =
                languageName;
        }


        /* ---------------------------------------------
           Settings language flag
        --------------------------------------------- */

        const settingsFlag =
            document.getElementById(
                "settingsLangFlag"
            );

        if (settingsFlag) {
            settingsFlag.textContent =
                flag;
        }
    }


    /* =========================================================
       CLOSE DROPDOWN
    ========================================================= */

    function closeLanguageDropdown() {

        const dropdown =
            document.getElementById(
                "cpt-lang-dropdown"
            );

        if (dropdown) {
            dropdown.remove();
        }
    }


    /* =========================================================
       CREATE LANGUAGE DROPDOWN
    ========================================================= */

    function createLanguageDropdown(anchor) {

        closeLanguageDropdown();

        const languages =
            getLanguageData();

        const currentLanguage =
            getCurrentLanguage();


        /* ---------------------------------------------
           Container
        --------------------------------------------- */

        const dropdown =
            document.createElement("div");

        dropdown.id =
            "cpt-lang-dropdown";


        /* ---------------------------------------------
           Header
        --------------------------------------------- */

        const header =
            document.createElement("div");

        header.textContent =
            "Select Language";

        header.style.cssText =
            [
                "padding:14px 15px",
                "font-size:16px",
                "font-weight:700",
                "color:#ffffff",
                "border-bottom:1px solid rgba(255,255,255,.12)",
                "background:#081426"
            ].join(";");

        dropdown.appendChild(header);


        /* ---------------------------------------------
           Language list
        --------------------------------------------- */

        Object.keys(languages).forEach(
            function (code) {

                const language =
                    languages[code] || {};

                const item =
                    document.createElement("button");

                item.type =
                    "button";

                item.dataset.langCode =
                    code;

                const isSelected =
                    code === currentLanguage;


                item.style.cssText =
                    [
                        "width:100%",
                        "box-sizing:border-box",
                        "display:flex",
                        "align-items:center",
                        "gap:12px",
                        "padding:13px 14px",
                        "border:0",
                        "border-bottom:1px solid rgba(255,255,255,.06)",
                        "cursor:pointer",
                        "font-family:inherit",
                        "font-size:15px",
                        "text-align:left",
                        "color:#ffffff",
                        "background:" +
                            (
                                isSelected
                                    ? "#12324b"
                                    : "transparent"
                            ),
                        "border-left:" +
                            (
                                isSelected
                                    ? "3px solid #00d9ff"
                                    : "3px solid transparent"
                            )
                    ].join(";");


                /* Flag */

                const flagSpan =
                    document.createElement("span");

                flagSpan.textContent =
                    language.flag || "🌐";

                flagSpan.style.cssText =
                    [
                        "font-size:22px",
                        "width:30px",
                        "text-align:center",
                        "flex-shrink:0"
                    ].join(";");


                /* Language name */

                const nameSpan =
                    document.createElement("span");

                nameSpan.textContent =
                    language.langName ||
                    language.name ||
                    code;

                nameSpan.style.cssText =
                    [
                        "flex:1",
                        "font-weight:500",
                        "white-space:nowrap"
                    ].join(";");


                /* Check mark */

                const checkSpan =
                    document.createElement("span");

                if (isSelected) {

                    checkSpan.textContent =
                        "✓";

                    checkSpan.style.cssText =
                        [
                            "font-size:20px",
                            "font-weight:800",
                            "color:#00d9ff"
                        ].join(";");
                }


                item.appendChild(flagSpan);
                item.appendChild(nameSpan);
                item.appendChild(checkSpan);


                /* -----------------------------------------
                   Select language
                ----------------------------------------- */

                item.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        const selectedCode =
                            item.dataset.langCode;

                        setLanguage(
                            selectedCode
                        );
                    }
                );


                dropdown.appendChild(item);
            }
        );


        /* ---------------------------------------------
           Dropdown styling
        --------------------------------------------- */

        dropdown.style.cssText =
            [
                "position:fixed",
                "z-index:2147483647",
                "width:245px",
                "max-width:calc(100vw - 20px)",
                "max-height:430px",
                "overflow-y:auto",
                "box-sizing:border-box",
                "background:#081426",
                "border:1px solid #00cfff",
                "border-radius:16px",
                "box-shadow:0 15px 50px rgba(0,0,0,.85)",
                "padding:5px 0",
                "font-family:inherit"
            ].join(";");


        document.body.appendChild(
            dropdown
        );


        /* ---------------------------------------------
           Position dropdown
        --------------------------------------------- */

        const rect =
            anchor.getBoundingClientRect();

        const dropdownWidth =
            Math.min(
                245,
                window.innerWidth - 20
            );

        let left =
            rect.right - dropdownWidth;

        if (left < 10) {
            left = 10;
        }

        if (
            left + dropdownWidth >
            window.innerWidth - 10
        ) {
            left =
                window.innerWidth -
                dropdownWidth -
                10;
        }

        let top =
            rect.bottom + 8;

        const dropdownHeight =
            Math.min(
                dropdown.scrollHeight,
                430
            );


        if (
            top + dropdownHeight >
            window.innerHeight - 10
        ) {

            top =
                rect.top -
                dropdownHeight -
                8;
        }


        if (top < 10) {
            top = 10;
        }


        dropdown.style.left =
            left + "px";

        dropdown.style.top =
            top + "px";
    }


    /* =========================================================
       CONNECT LANGUAGE BUTTONS
    ========================================================= */

    function connectLanguageButtons() {

        const buttons =
            document.querySelectorAll(
                "#languageBtn, .language-btn, #settingsLangItem"
            );


        buttons.forEach(function (button) {

            if (
                button.dataset.cptLanguageConnected ===
                "1"
            ) {
                return;
            }


            button.dataset.cptLanguageConnected =
                "1";


            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    const existing =
                        document.getElementById(
                            "cpt-lang-dropdown"
                        );


                    if (existing) {

                        closeLanguageDropdown();

                    } else {

                        createLanguageDropdown(
                            button
                        );
                    }
                }
            );
        });
    }


    /* =========================================================
       TRANSLATE PAGE
    ========================================================= */

    function translatePage(languageCode) {

        if (!document.body) {
            return;
        }


        const languages =
            getLanguageData();


        if (
            !languages[languageCode]
        ) {
            return;
        }


        /*
         * First remember original English/source text.
         * This prevents A → B → C from translating
         * already translated text.
         */

        rememberDocument();


        /* ---------------------------------------------
           Translate text nodes
        --------------------------------------------- */

        const walker =
            document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT
            );

        const textNodes = [];

        let node;

        while (
            (node = walker.nextNode())
        ) {
            textNodes.push(node);
        }


        textNodes.forEach(
            function (textNode) {

                translateTextNode(
                    textNode,
                    languageCode
                );
            }
        );


        /* ---------------------------------------------
           Translate elements
        --------------------------------------------- */

        const elements =
            document.querySelectorAll(
                "[data-key]," +
                "[data-ph-key]," +
                "input," +
                "textarea," +
                "button," +
                "[title]," +
                "[aria-label]"
            );


        elements.forEach(
            function (element) {

                translateElement(
                    element,
                    languageCode
                );
            }
        );


        /* ---------------------------------------------
           Direction
        --------------------------------------------- */

        applyDirection(
            languageCode
        );


        /* ---------------------------------------------
           Update language button
        --------------------------------------------- */

        updateLanguageButtons(
            languageCode
        );


        /* ---------------------------------------------
           Connect buttons
        --------------------------------------------- */

        connectLanguageButtons();
    }


    /* =========================================================
       SET LANGUAGE
    ========================================================= */

    function setLanguage(languageCode) {

        const languages =
            getLanguageData();


        if (
            !languages[languageCode]
        ) {
            console.warn(
                "CptMarkets: Unknown language:",
                languageCode
            );

            return;
        }


        /* Save globally */

        saveLanguage(
            languageCode
        );


        /* Apply immediately */

        translatePage(
            languageCode
        );


        /* Close dropdown */

        closeLanguageDropdown();


        /* Notify other website scripts */

        try {

            window.dispatchEvent(
                new CustomEvent(
                    "cpt:languagechange",
                    {
                        detail: {
                            code: languageCode
                        }
                    }
                )
            );

        } catch (error) {
            /* Ignore unsupported CustomEvent */
        }
    }


    /* =========================================================
       STORAGE EVENT
       Keeps language synchronized between tabs/windows.
    ========================================================= */

    function connectStorageSync() {

        window.addEventListener(
            "storage",
            function (event) {

                if (
                    event.key !== STORAGE_KEY
                ) {
                    return;
                }


                const newLanguage =
                    event.newValue;


                if (!newLanguage) {
                    return;
                }


                const languages =
                    getLanguageData();


                if (
                    !languages[newLanguage]
                ) {
                    return;
                }


                translatePage(
                    newLanguage
                );
            }
        );
    }


    /* =========================================================
       OUTSIDE CLICK
    ========================================================= */

    function connectOutsideClick() {

        document.addEventListener(
            "click",
            function (event) {

                const dropdown =
                    document.getElementById(
                        "cpt-lang-dropdown"
                    );


                if (!dropdown) {
                    return;
                }


                const clickedInsideDropdown =
                    dropdown.contains(
                        event.target
                    );


                const clickedLanguageButton =
                    event.target.closest(
                        "#languageBtn, .language-btn, #settingsLangItem"
                    );


                if (
                    !clickedInsideDropdown &&
                    !clickedLanguageButton
                ) {

                    closeLanguageDropdown();
                }
            }
        );
    }


    /* =========================================================
       OBSERVE DYNAMIC CONTENT
    ========================================================= */

    function connectMutationObserver() {

        if (!document.body) {
            return;
        }


        let translationTimer = null;


        const observer =
            new MutationObserver(
                function (mutations) {

                    let hasNewNodes = false;


                    for (
                        let i = 0;
                        i < mutations.length;
                        i++
                    ) {

                        const mutation =
                            mutations[i];


                        if (
                            mutation.type ===
                            "childList" &&
                            mutation.addedNodes &&
                            mutation.addedNodes.length
                        ) {

                            hasNewNodes = true;
                            break;
                        }
                    }


                    if (!hasNewNodes) {
                        return;
                    }


                    /*
                     * Debounce translation.
                     * This prevents an infinite loop when
                     * translator itself changes DOM text.
                     */

                    clearTimeout(
                        translationTimer
                    );


                    translationTimer =
                        setTimeout(
                            function () {

                                const currentLanguage =
                                    getCurrentLanguage();


                                translatePage(
                                    currentLanguage
                                );

                            },
                            100
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


    /* =========================================================
       PUBLIC API
    ========================================================= */

    window.getLanguage =
        getCurrentLanguage;

    window.setLanguage =
        setLanguage;

    window.applyLanguage =
        setLanguage;

    window.cptTranslatePhrase =
        translatePhrase;

    window.cptTranslatePage =
        translatePage;


    /* =========================================================
       INITIALIZATION
    ========================================================= */

    function initializeTranslator() {

        const languages =
            getLanguageData();


        /*
         * If lang.js has not loaded yet,
         * wait briefly instead of breaking the page.
         */

        if (
            !languages ||
            !Object.keys(languages).length
        ) {

            let attempts = 0;


            const waitForLanguageData =
                setInterval(
                    function () {

                        attempts++;


                        const currentData =
                            getLanguageData();


                        if (
                            Object.keys(
                                currentData
                            ).length
                        ) {

                            clearInterval(
                                waitForLanguageData
                            );

                            startTranslator();

                            return;
                        }


                        /*
                         * Stop after approximately
                         * 10 seconds.
                         */

                        if (attempts >= 100) {

                            clearInterval(
                                waitForLanguageData
                            );

                            console.warn(
                                "CptMarkets: lang.js / languageData not found."
                            );
                        }

                    },
                    100
                );


            return;
        }


        startTranslator();
    }


    /* =========================================================
       START TRANSLATOR
    ========================================================= */

    function startTranslator() {

        if (!document.body) {
            return;
        }


        const language =
            getCurrentLanguage();


        /* Apply current language */

        translatePage(
            language
        );


        /* Global synchronization */

        connectStorageSync();


        /* Outside click */

        connectOutsideClick();


        /* Dynamic page content */

        connectMutationObserver();
    }


    /* =========================================================
       RUN
    ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeTranslator,
            {
                once: true
            }
        );

    } else {

        initializeTranslator();
    }

})();
