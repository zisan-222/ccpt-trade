// ============================================================
// CptMarkets — translator.js
// FINAL UNIVERSAL TRANSLATOR
// Works with: const languageData = {...} from lang.js
// Shared language across ALL HTML pages
// ============================================================

(function () {
    "use strict";

    const STORAGE_KEY = "cpt_lang";
    const DEFAULT_LANG = "en_UK";

    let isTranslating = false;
    let observerTimer = null;

    // ----------------------------------------------------------
    // GET LANGUAGE DATA
    // IMPORTANT:
    // lang.js uses:
    // const languageData = {...}
    //
    // NOT:
    // window.languageData
    // ----------------------------------------------------------

    function getLanguages() {

        try {
            if (
                typeof languageData !== "undefined" &&
                languageData &&
                typeof languageData === "object"
            ) {
                return languageData;
            }
        } catch (e) {}

        if (
            typeof window !== "undefined" &&
            window.languageData &&
            typeof window.languageData === "object"
        ) {
            return window.languageData;
        }

        return {};
    }


    // ----------------------------------------------------------
    // GET STATIC TRANSLATIONS
    // lang.js also uses:
    // const cptStaticTranslations = {...}
    // ----------------------------------------------------------

    function getStaticTranslations() {

        try {
            if (
                typeof cptStaticTranslations !== "undefined" &&
                cptStaticTranslations &&
                typeof cptStaticTranslations === "object"
            ) {
                return cptStaticTranslations;
            }
        } catch (e) {}

        if (
            typeof window !== "undefined" &&
            window.cptStaticTranslations &&
            typeof window.cptStaticTranslations === "object"
        ) {
            return window.cptStaticTranslations;
        }

        return {};
    }


    // ----------------------------------------------------------
    // NORMALIZE
    // ----------------------------------------------------------

    function normalize(text) {
        return String(text == null ? "" : text)
            .replace(/\s+/g, " ")
            .trim();
    }


    // ----------------------------------------------------------
    // GET CURRENT LANGUAGE
    // ----------------------------------------------------------

    function getCurrentLanguage() {

        const languages = getLanguages();

        let saved = null;

        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            saved = null;
        }

        if (
            saved &&
            languages &&
            Object.prototype.hasOwnProperty.call(
                languages,
                saved
            )
        ) {
            return saved;
        }

        if (
            languages &&
            Object.prototype.hasOwnProperty.call(
                languages,
                DEFAULT_LANG
            )
        ) {
            return DEFAULT_LANG;
        }

        const keys = Object.keys(languages);

        return keys.length > 0
            ? keys[0]
            : DEFAULT_LANG;
    }


    // ----------------------------------------------------------
    // SAVE LANGUAGE
    // ----------------------------------------------------------

    function saveLanguage(code) {

        try {
            localStorage.setItem(
                STORAGE_KEY,
                code
            );
        } catch (e) {
            console.warn(
                "CptMarkets: unable to save language."
            );
        }
    }


    // ----------------------------------------------------------
    // REMEMBER ORIGINAL TEXT
    // ----------------------------------------------------------

    function rememberNode(node) {

        if (
            !node ||
            node.nodeType !== Node.TEXT_NODE
        ) {
            return;
        }

        const parent = node.parentElement;

        if (!parent) {
            return;
        }

        if (
            parent.closest(
                "script,style,noscript,svg,template,[contenteditable='true']"
            )
        ) {
            return;
        }

        const value = node.nodeValue;

        if (
            !value ||
            !normalize(value)
        ) {
            return;
        }

        if (
            !Object.prototype.hasOwnProperty.call(
                node,
                "__cptOriginalText"
            )
        ) {

            Object.defineProperty(
                node,
                "__cptOriginalText",
                {
                    value: value,
                    writable: true,
                    configurable: true
                }
            );
        }
    }


    // ----------------------------------------------------------
    // REMEMBER WHOLE PAGE
    // ----------------------------------------------------------

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
            rememberNode(node);
        }
    }


    // ----------------------------------------------------------
    // FIND TRANSLATION BY DICTIONARY KEY
    // ----------------------------------------------------------

    function findDictionaryTranslation(
        source,
        targetCode
    ) {

        const languages = getLanguages();

        const target =
            languages[targetCode] || {};

        const cleanSource =
            normalize(source);

        if (!cleanSource) {
            return null;
        }


        // Direct key match
        if (
            Object.prototype.hasOwnProperty.call(
                target,
                cleanSource
            )
        ) {
            return target[cleanSource];
        }


        // Match source against dictionary values
        const languageCodes =
            Object.keys(languages);


        for (
            let i = 0;
            i < languageCodes.length;
            i++
        ) {

            const sourceCode =
                languageCodes[i];

            const sourceDictionary =
                languages[sourceCode] || {};

            const keys =
                Object.keys(sourceDictionary);


            for (
                let j = 0;
                j < keys.length;
                j++
            ) {

                const key = keys[j];

                const sourceValue =
                    sourceDictionary[key];


                if (
                    typeof sourceValue === "string" &&
                    normalize(sourceValue) === cleanSource
                ) {

                    if (
                        Object.prototype.hasOwnProperty.call(
                            target,
                            key
                        )
                    ) {

                        return target[key];
                    }
                }
            }
        }

        return null;
    }


    // ----------------------------------------------------------
    // TRANSLATE PHRASE
    // ----------------------------------------------------------

    function translatePhrase(
        source,
        targetCode
    ) {

        if (
            source == null ||
            source === ""
        ) {
            return source;
        }

        const original =
            String(source);

        const clean =
            normalize(original);

        if (!clean) {
            return original;
        }


        // ------------------------------------------------------
        // STATIC TRANSLATION MAP
        // ------------------------------------------------------

        const staticTranslations =
            getStaticTranslations();

        const staticMap =
            staticTranslations[targetCode] || {};


        if (
            Object.prototype.hasOwnProperty.call(
                staticMap,
                clean
            )
        ) {

            return staticMap[clean];
        }


        // ------------------------------------------------------
        // LANGUAGE DICTIONARY
        // ------------------------------------------------------

        const translated =
            findDictionaryTranslation(
                clean,
                targetCode
            );


        if (
            translated !== null &&
            translated !== undefined
        ) {
            return translated;
        }


        // ------------------------------------------------------
        // RETURN ORIGINAL IF NOT FOUND
        // ------------------------------------------------------

        return original;
    }


    // ----------------------------------------------------------
    // TRANSLATE TEXT NODE
    // ----------------------------------------------------------

    function translateTextNode(
        node,
        targetCode
    ) {

        if (
            !node ||
            node.nodeType !== Node.TEXT_NODE
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
                "script,style,noscript,svg,template,[contenteditable='true']"
            )
        ) {
            return;
        }


        rememberNode(node);


        const original =
            node.__cptOriginalText;


        if (
            !original ||
            !normalize(original)
        ) {
            return;
        }


        const translated =
            translatePhrase(
                original,
                targetCode
            );


        if (
            node.nodeValue !== translated
        ) {

            node.nodeValue =
                translated;
        }
    }


    // ----------------------------------------------------------
    // TRANSLATE ATTRIBUTE
    // ----------------------------------------------------------

    function translateAttribute(
        element,
        attribute,
        targetCode
    ) {

        if (!element) {
            return;
        }

        const value =
            element.getAttribute(attribute);

        if (!value) {
            return;
        }


        const originalKey =
            "__cptOriginal_" +
            attribute;


        if (
            !Object.prototype.hasOwnProperty.call(
                element,
                originalKey
            )
        ) {

            Object.defineProperty(
                element,
                originalKey,
                {
                    value: value,
                    writable: true,
                    configurable: true
                }
            );
        }


        const original =
            element[originalKey];


        const translated =
            translatePhrase(
                original,
                targetCode
            );


        if (
            translated !== null &&
            translated !== undefined
        ) {

            element.setAttribute(
                attribute,
                translated
            );
        }
    }


    // ----------------------------------------------------------
    // TRANSLATE ELEMENT
    // ----------------------------------------------------------

    function translateElement(
        element,
        targetCode
    ) {

        if (
            !element ||
            element.nodeType !== Node.ELEMENT_NODE
        ) {
            return;
        }


        if (
            element.matches(
                "script,style,noscript,svg,template"
            )
        ) {
            return;
        }


        // ------------------------------------------------------
        // DATA-KEY
        // ------------------------------------------------------

        const key =
            element.getAttribute(
                "data-key"
            );


        const languages =
            getLanguages();

        const dictionary =
            languages[targetCode] || {};


        if (
            key &&
            Object.prototype.hasOwnProperty.call(
                dictionary,
                key
            )
        ) {

            const value =
                dictionary[key];


            if (
                typeof value === "string"
            ) {

                if (
                    !element.__cptOriginalDataKey
                ) {

                    element.__cptOriginalDataKey =
                        key;
                }


                if (
                    element.children.length === 0
                ) {

                    element.textContent =
                        value;

                } else {

                    const walker =
                        document.createTreeWalker(
                            element,
                            NodeFilter.SHOW_TEXT
                        );

                    const nodes = [];

                    let n;

                    while (
                        (n = walker.nextNode())
                    ) {
                        nodes.push(n);
                    }


                    if (
                        nodes.length === 1
                    ) {

                        rememberNode(
                            nodes[0]
                        );

                        nodes[0].nodeValue =
                            value;
                    }
                }
            }
        }


        // ------------------------------------------------------
        // DATA-PH-KEY
        // ------------------------------------------------------

        const placeholderKey =
            element.getAttribute(
                "data-ph-key"
            );


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


        // ------------------------------------------------------
        // PLACEHOLDER
        // ------------------------------------------------------

        translateAttribute(
            element,
            "placeholder",
            targetCode
        );


        // ------------------------------------------------------
        // TITLE
        // ------------------------------------------------------

        translateAttribute(
            element,
            "title",
            targetCode
        );


        // ------------------------------------------------------
        // ARIA LABEL
        // ------------------------------------------------------

        translateAttribute(
            element,
            "aria-label",
            targetCode
        );
    }


    // ----------------------------------------------------------
    // APPLY RTL
    // ----------------------------------------------------------

    function applyDirection(
        targetCode
    ) {

        const rtlLanguages = {
            ar_SA: true,
            ar: true
        };


        const direction =
            rtlLanguages[targetCode]
                ? "rtl"
                : "ltr";


        document.documentElement.setAttribute(
            "dir",
            direction
        );


        document.documentElement.setAttribute(
            "lang",
            String(targetCode)
                .replace("_", "-")
        );


        if (document.body) {

            document.body.setAttribute(
                "dir",
                direction
            );
        }
    }


    // ----------------------------------------------------------
    // LANGUAGE BUTTON SELECTOR
    // ----------------------------------------------------------

    function getLanguageButtons() {

        const selectors = [
            "#languageBtn",
            ".language-btn",
            "#languageButton",
            "#languageSelector",
            ".language-selector",
            ".language-selector-btn",
            "[data-language-button]",
            "[data-language-selector]"
        ];


        const result = [];


        selectors.forEach(
            function (selector) {

                document
                    .querySelectorAll(selector)
                    .forEach(
                        function (element) {

                            if (
                                result.indexOf(
                                    element
                                ) === -1
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


    // ----------------------------------------------------------
    // UPDATE LANGUAGE BUTTON
    // ----------------------------------------------------------

    function updateLanguageButtons(
        targetCode
    ) {

        const languages =
            getLanguages();

        const data =
            languages[targetCode] || {};


        const flag =
            data.flag || "🌐";


        const name =
            data.langName ||
            data.name ||
            targetCode;


        getLanguageButtons()
            .forEach(
                function (button) {

                    /*
                     * Show selected language
                     * FLAG + LANGUAGE NAME
                     *
                     * Example:
                     * 🇧🇩 বাংলা
                     * 🇬🇧 English (UK)
                     */

                    button.textContent =
                        flag + " " + name;


                    button.setAttribute(
                        "title",
                        name
                    );


                    button.setAttribute(
                        "aria-label",
                        name
                    );


                    button.setAttribute(
                        "data-current-language",
                        targetCode
                    );
                }
            );


        const settingsText =
            document.getElementById(
                "settingsLangText"
            );


        if (settingsText) {

            settingsText.textContent =
                name;
        }


        const settingsFlag =
            document.getElementById(
                "settingsLangFlag"
            );


        if (settingsFlag) {

            settingsFlag.textContent =
                flag;
        }
    }


    // ----------------------------------------------------------
    // CLOSE DROPDOWN
    // ----------------------------------------------------------

    function closeDropdown() {

        const dropdown =
            document.getElementById(
                "cpt-lang-dropdown"
            );


        if (dropdown) {

            dropdown.remove();
        }
    }


    // ----------------------------------------------------------
    // CREATE LANGUAGE DROPDOWN
    // ----------------------------------------------------------

    function buildDropdown(
        anchor
    ) {

        closeDropdown();


        const languages =
            getLanguages();


        const codes =
            Object.keys(languages);


        if (!codes.length) {

            console.error(
                "CptMarkets Translator: languageData not found."
            );

            return;
        }


        const current =
            getCurrentLanguage();


        // ------------------------------------------------------
        // DROPDOWN
        // ------------------------------------------------------

        const dropdown =
            document.createElement("div");


        dropdown.id =
            "cpt-lang-dropdown";


        dropdown.setAttribute(
            "role",
            "menu"
        );


        // ------------------------------------------------------
        // HEADER
        // ------------------------------------------------------

        const header =
            document.createElement("div");


        header.textContent =
            "Select Language";


        header.style.cssText =
            [
                "padding:14px 16px",
                "font-size:16px",
                "font-weight:700",
                "color:#ffffff",
                "background:#081426",
                "border-bottom:1px solid rgba(255,255,255,.12)",
                "position:sticky",
                "top:0",
                "z-index:2"
            ].join(";");


        dropdown.appendChild(
            header
        );


        // ------------------------------------------------------
        // LANGUAGE ITEMS
        // ------------------------------------------------------

        codes.forEach(
            function (code) {

                const data =
                    languages[code] || {};


                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.dataset.langCode =
                    code;


                item.setAttribute(
                    "role",
                    "menuitem"
                );


                const selected =
                    code === current;


                item.style.cssText =
                    [
                        "width:100%",
                        "min-height:58px",
                        "box-sizing:border-box",
                        "display:flex",
                        "align-items:center",
                        "gap:12px",
                        "padding:10px 14px",
                        "margin:0",
                        "border:0",
                        "border-bottom:1px solid rgba(255,255,255,.06)",
                        "border-left:" +
                            (
                                selected
                                    ? "3px solid #00d9ff"
                                    : "3px solid transparent"
                            ),
                        "background:" +
                            (
                                selected
                                    ? "#12314a"
                                    : "#0a1729"
                            ),
                        "color:#ffffff",
                        "font-family:inherit",
                        "font-size:15px",
                        "text-align:left",
                        "cursor:pointer"
                    ].join(";");


                // Flag
                const flag =
                    document.createElement(
                        "span"
                    );


                flag.textContent =
                    data.flag || "🌐";


                flag.style.cssText =
                    [
                        "font-size:24px",
                        "width:32px",
                        "min-width:32px",
                        "text-align:center",
                        "line-height:1"
                    ].join(";");


                // Name
                const name =
                    document.createElement(
                        "span"
                    );


                name.textContent =
                    data.langName ||
                    data.name ||
                    code;


                name.style.cssText =
                    [
                        "flex:1",
                        "font-weight:500",
                        "white-space:nowrap",
                        "overflow:hidden",
                        "text-overflow:ellipsis"
                    ].join(";");


                // Check
                const check =
                    document.createElement(
                        "span"
                    );


                if (selected) {

                    check.textContent =
                        "✓";


                    check.style.cssText =
                        [
                            "font-size:21px",
                            "font-weight:800",
                            "color:#00d9ff"
                        ].join(";");
                }


                item.appendChild(
                    flag
                );


                item.appendChild(
                    name
                );


                item.appendChild(
                    check
                );


                // ------------------------------------------------
                // SELECT
                // ------------------------------------------------

                item.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        setLanguage(
                            code
                        );
                    }
                );


                dropdown.appendChild(
                    item
                );
            }
        );


        // ------------------------------------------------------
        // DROPDOWN STYLE
        // ------------------------------------------------------

        dropdown.style.cssText =
            [
                "position:fixed",
                "z-index:2147483647",
                "display:block",
                "width:260px",
                "max-width:calc(100vw - 20px)",
                "max-height:440px",
                "overflow-y:auto",
                "overflow-x:hidden",
                "box-sizing:border-box",
                "background:#081426",
                "border:1px solid #00cfff",
                "border-radius:16px",
                "box-shadow:0 18px 55px rgba(0,0,0,.9)",
                "padding:0",
                "margin:0"
            ].join(";");


        document.body.appendChild(
            dropdown
        );


        // ------------------------------------------------------
        // POSITION
        // ------------------------------------------------------

        const rect =
            anchor.getBoundingClientRect();


        const width =
            Math.min(
                260,
                window.innerWidth - 20
            );


        let left =
            rect.right - width;


        if (left < 10) {

            left = 10;
        }


        if (
            left + width >
            window.innerWidth - 10
        ) {

            left =
                window.innerWidth -
                width -
                10;
        }


        let top =
            rect.bottom + 8;


        const maxHeight =
            Math.min(
                440,
                window.innerHeight - 20
            );


        if (
            top + maxHeight >
            window.innerHeight - 10
        ) {

            top =
                rect.top -
                maxHeight -
                8;
        }


        if (top < 10) {

            top = 10;
        }


        dropdown.style.width =
            width + "px";


        dropdown.style.maxHeight =
            maxHeight + "px";


        dropdown.style.left =
            left + "px";


        dropdown.style.top =
            top + "px";
    }


    // ----------------------------------------------------------
    // CONNECT LANGUAGE BUTTONS
    // ----------------------------------------------------------

    function connectLanguageButtons() {

        getLanguageButtons()
            .forEach(
                function (button) {

                    if (
                        button.dataset
                            .cptLanguageWired === "1"
                    ) {
                        return;
                    }


                    button.dataset
                        .cptLanguageWired =
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

                                closeDropdown();

                            } else {

                                buildDropdown(
                                    button
                                );
                            }
                        }
                    );
                }
            );
    }


    // ----------------------------------------------------------
    // TRANSLATE PAGE
    // ----------------------------------------------------------

    function translatePage(
        targetCode
    ) {

        if (
            !document.body ||
            isTranslating
        ) {
            return;
        }


        const languages =
            getLanguages();


        if (
            !languages[targetCode]
        ) {

            targetCode =
                getCurrentLanguage();
        }


        isTranslating =
            true;


        try {

            // Remember source BEFORE changing anything
            rememberDocument();


            // --------------------------------------------------
            // TEXT NODES
            // --------------------------------------------------

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

                nodes.push(node);
            }


            nodes.forEach(
                function (textNode) {

                    translateTextNode(
                        textNode,
                        targetCode
                    );
                }
            );


            // --------------------------------------------------
            // ELEMENTS
            // --------------------------------------------------

            document
                .querySelectorAll(
                    "[data-key]," +
                    "[data-ph-key]," +
                    "input," +
                    "textarea," +
                    "button," +
                    "select," +
                    "option," +
                    "[title]," +
                    "[aria-label]"
                )
                .forEach(
                    function (element) {

                        translateElement(
                            element,
                            targetCode
                        );
                    }
                );


            // --------------------------------------------------
            // DIRECTION
            // --------------------------------------------------

            applyDirection(
                targetCode
            );


            // --------------------------------------------------
            // LANGUAGE BUTTON
            // --------------------------------------------------

            updateLanguageButtons(
                targetCode
            );


            // --------------------------------------------------
            // BUTTON CONNECTION
            // --------------------------------------------------

            connectLanguageButtons();

        } catch (error) {

            console.error(
                "CptMarkets Translator Error:",
                error
            );

        } finally {

            isTranslating =
                false;
        }
    }


    // ----------------------------------------------------------
    // SET LANGUAGE
    // ----------------------------------------------------------

    function setLanguage(
        code
    ) {

        const languages =
            getLanguages();


        if (
            !languages ||
            !languages[code]
        ) {

            console.error(
                "CptMarkets: Invalid language:",
                code
            );

            return;
        }


        // Save globally
        saveLanguage(
            code
        );


        // Translate immediately
        translatePage(
            code
        );


        // Close menu
        closeDropdown();


        // Notify page scripts
        try {

            window.dispatchEvent(
                new CustomEvent(
                    "cpt:languagechange",
                    {
                        detail: {
                            code: code
                        }
                    }
                )
            );

        } catch (e) {}


        // Update every visible language control
        updateLanguageButtons(
            code
        );
    }


    // ----------------------------------------------------------
    // DYNAMIC CONTENT
    // ----------------------------------------------------------

    function startObserver() {

        if (!document.body) {
            return;
        }


        const observer =
            new MutationObserver(
                function (mutations) {

                    if (isTranslating) {
                        return;
                    }


                    let added =
                        false;


                    for (
                        let i = 0;
                        i < mutations.length;
                        i++
                    ) {

                        if (
                            mutations[i]
                                .addedNodes &&
                            mutations[i]
                                .addedNodes.length
                        ) {

                            added =
                                true;

                            break;
                        }
                    }


                    if (!added) {
                        return;
                    }


                    clearTimeout(
                        observerTimer
                    );


                    observerTimer =
                        setTimeout(
                            function () {

                                const current =
                                    getCurrentLanguage();


                                translatePage(
                                    current
                                );

                            },
                            150
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


    // ----------------------------------------------------------
    // OUTSIDE CLICK
    // ----------------------------------------------------------

    function startOutsideClick() {

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


                if (
                    dropdown.contains(
                        event.target
                    )
                ) {
                    return;
                }


                const languageButton =
                    event.target.closest(
                        "#languageBtn," +
                        ".language-btn," +
                        "#languageButton," +
                        "#languageSelector," +
                        ".language-selector," +
                        ".language-selector-btn," +
                        "[data-language-button]," +
                        "[data-language-selector]"
                    );


                if (!languageButton) {

                    closeDropdown();
                }
            },
            false
        );
    }


    // ----------------------------------------------------------
    // SAME LANGUAGE IN OTHER TABS
    // ----------------------------------------------------------

    function startStorageSync() {

        window.addEventListener(
            "storage",
            function (event) {

                if (
                    event.key !==
                    STORAGE_KEY
                ) {
                    return;
                }


                if (!event.newValue) {
                    return;
                }


                const languages =
                    getLanguages();


                if (
                    !languages[event.newValue]
                ) {
                    return;
                }


                translatePage(
                    event.newValue
                );
            }
        );
    }


    // ----------------------------------------------------------
    // PUBLIC API
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // INITIALIZE
    // ----------------------------------------------------------

    function init() {

        const languages =
            getLanguages();


        if (
            !languages ||
            Object.keys(languages).length === 0
        ) {

            console.error(
                "CptMarkets Translator: languageData is unavailable. Make sure lang.js loads before translator.js."
            );

            return;
        }


        const current =
            getCurrentLanguage();


        // Initial translation
        translatePage(
            current
        );


        // Connect controls
        connectLanguageButtons();


        // Dynamic pages/content
        startObserver();


        // Outside click
        startOutsideClick();


        // Cross-tab sync
        startStorageSync();


        console.log(
            "CptMarkets Translator Ready:",
            Object.keys(languages).length,
            "languages",
            "| Current:",
            current
        );
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();
    }

})();
