/* =========================================================
   CptMarkets
   translator.js
   GLOBAL LANGUAGE TRANSLATOR
   =========================================================

   FEATURES
   ---------------------------------------------------------
   • Global language selection
   • Same language on every HTML page
   • localStorage persistence
   • Selected language flag everywhere
   • Existing #languageBtn support
   • Automatic language menu
   • Arabic RTL support
   • Mobile friendly
   • Safe fallback to English
   • Does not reload the page
   ========================================================= */

(function (window, document) {

    "use strict";


    /* =====================================================
       BASIC CONFIGURATION
       ===================================================== */

    const LANGUAGE_DATA =
        window.CPT_LANGS || {};

    const TRANSLATIONS =
        window.CPT_TRANSLATIONS || {};

    const LANGUAGE_ORDER =
        window.CPT_LANGUAGE_ORDER || [
            "en",
            "bn",
            "ar",
            "hi",
            "es",
            "zh",
            "ja",
            "fr",
            "de",
            "ru"
        ];


    /* =====================================================
       STORAGE
       ===================================================== */

    const STORAGE_KEY =
        window.CPT_LANGUAGE_STORAGE_KEY ||
        "cptmarkets_language";


    const DEFAULT_LANGUAGE =
        window.CPT_DEFAULT_LANGUAGE ||
        "en";


    /* =====================================================
       CURRENT LANGUAGE
       ===================================================== */

    let currentLanguage =
        getSavedLanguage();


    /* =====================================================
       GET SAVED LANGUAGE
       ===================================================== */

    function getSavedLanguage() {

        let savedLanguage = null;

        try {

            savedLanguage =
                localStorage.getItem(
                    STORAGE_KEY
                );

        } catch (error) {

            savedLanguage = null;

        }


        if (
            savedLanguage &&
            isValidLanguage(savedLanguage)
        ) {

            return savedLanguage;

        }


        return DEFAULT_LANGUAGE;

    }


    /* =====================================================
       VALIDATE LANGUAGE
       ===================================================== */

    function isValidLanguage(language) {

        return Object.prototype.hasOwnProperty.call(
            LANGUAGE_DATA,
            language
        );

    }


    /* =====================================================
       SAVE LANGUAGE
       ===================================================== */

    function saveLanguage(language) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                language
            );

        } catch (error) {

            console.warn(
                "CptMarkets: Could not save language.",
                error
            );

        }

    }


    /* =====================================================
       GET LANGUAGE INFORMATION
       ===================================================== */

    function getLanguageInfo(language) {

        if (
            LANGUAGE_DATA &&
            LANGUAGE_DATA[language]
        ) {

            return LANGUAGE_DATA[language];

        }


        return LANGUAGE_DATA[DEFAULT_LANGUAGE] || {

            code: "en",

            name: "English",

            nativeName: "English",

            flag: "🇬🇧",

            direction: "ltr"

        };

    }


    /* =====================================================
       GET TRANSLATION
       ===================================================== */

    function translateText(
        text,
        language
    ) {

        if (!text) {

            return text;

        }


        language =
            language || currentLanguage;


        const languagePack =
            TRANSLATIONS[language];


        if (
            languagePack &&
            Object.prototype.hasOwnProperty.call(
                languagePack,
                text
            )
        ) {

            return languagePack[text];

        }


        /*
         * If translation is unavailable,
         * use English.
         */

        const englishPack =
            TRANSLATIONS[DEFAULT_LANGUAGE];


        if (
            englishPack &&
            Object.prototype.hasOwnProperty.call(
                englishPack,
                text
            )
        ) {

            return englishPack[text];

        }


        /*
         * Final fallback:
         * keep original text.
         */

        return text;

    }


    /* =====================================================
       CLEAN TEXT
       ===================================================== */

    function cleanText(text) {

        return String(
            text || ""
        )
        .replace(/\s+/g, " ")
        .trim();

    }


    /* =====================================================
       IGNORE ELEMENTS
       ===================================================== */

    function shouldIgnoreElement(element) {

        if (!element) {

            return true;

        }


        const tag =
            element.tagName
                ? element.tagName.toUpperCase()
                : "";


        const ignoredTags = [

            "SCRIPT",
            "STYLE",
            "NOSCRIPT",
            "CODE",
            "PRE",
            "SVG",
            "PATH",
            "TEXTAREA"

        ];


        if (
            ignoredTags.includes(tag)
        ) {

            return true;

        }


        /*
         * Never translate the language
         * selector itself.
         */

        if (
            element.closest(
                "#cptLanguageMenu"
            )
        ) {

            return true;

        }


        if (
            element.hasAttribute(
                "data-no-translate"
            )
        ) {

            return true;

        }


        if (
            element.classList &&
            element.classList.contains(
                "no-translate"
            )
        ) {

            return true;

        }


        return false;

    }


    /* =====================================================
       TEXT NODE COLLECTION
       ===================================================== */

    function collectTextNodes() {

        if (!document.body) {

            return [];

        }


        const walker =
            document.createTreeWalker(

                document.body,

                NodeFilter.SHOW_TEXT,

                {

                    acceptNode: function (node) {

                        if (!node.parentElement) {

                            return NodeFilter.FILTER_REJECT;

                        }


                        if (
                            shouldIgnoreElement(
                                node.parentElement
                            )
                        ) {

                            return NodeFilter.FILTER_REJECT;

                        }


                        if (
                            !cleanText(
                                node.nodeValue
                            )
                        ) {

                            return NodeFilter.FILTER_REJECT;

                        }


                        return NodeFilter.FILTER_ACCEPT;

                    }

                }

            );


        const nodes = [];

        let node;


        while (
            (node = walker.nextNode())
        ) {

            nodes.push(node);

        }


        return nodes;

    }


    /* =====================================================
       STORE ORIGINAL TEXT
       ===================================================== */

    function storeOriginalText(node) {

        if (
            !node.hasAttribute ||
            !node.parentElement
        ) {

            return;

        }


        if (
            node.__cptOriginalText === undefined
        ) {

            node.__cptOriginalText =
                node.nodeValue;

        }

    }


    /* =====================================================
       TRANSLATE ONE TEXT NODE
       ===================================================== */

    function translateTextNode(node) {

        if (!node) {

            return;

        }


        storeOriginalText(node);


        const originalRaw =
            node.__cptOriginalText;


        if (!originalRaw) {

            return;

        }


        const original =
            cleanText(
                originalRaw
            );


        if (!original) {

            return;

        }


        const translated =
            translateText(
                original,
                currentLanguage
            );


        /*
         * Preserve spaces around text.
         */

        const leading =
            String(originalRaw)
                .match(/^\s*/)?.[0] || "";


        const trailing =
            String(originalRaw)
                .match(/\s*$/)?.[0] || "";


        node.nodeValue =
            leading +
            translated +
            trailing;

    }


    /* =====================================================
       TRANSLATE ALL TEXT
       ===================================================== */

    function translateAllText() {

        const nodes =
            collectTextNodes();


        nodes.forEach(
            translateTextNode
        );

    }


    /* =====================================================
       ORIGINAL ATTRIBUTE STORAGE
       ===================================================== */

    function storeOriginalAttribute(
        element,
        attribute
    ) {

        const storageName =
            "cptOriginal_" +
            attribute;


        if (
            element.dataset &&
            element.dataset[
                storageName
            ] === undefined
        ) {

            element.dataset[
                storageName
            ] =
                element.getAttribute(
                    attribute
                ) || "";

        }


        return element.dataset
            ? element.dataset[
                storageName
            ]
            : "";

    }


    /* =====================================================
       TRANSLATABLE ATTRIBUTES
       ===================================================== */

    const TRANSLATABLE_ATTRIBUTES = [

        "placeholder",

        "title",

        "aria-label",

        "alt"

    ];


    /* =====================================================
       TRANSLATE ATTRIBUTES
       ===================================================== */

    function translateAttributes() {

        if (!document.body) {

            return;

        }


        const elements =
            document.body.querySelectorAll(
                "*"
            );


        elements.forEach(
            function (element) {

                if (
                    shouldIgnoreElement(
                        element
                    )
                ) {

                    return;

                }


                TRANSLATABLE_ATTRIBUTES.forEach(
                    function (attribute) {

                        if (
                            !element.hasAttribute(
                                attribute
                            )
                        ) {

                            return;

                        }


                        const original =
                            storeOriginalAttribute(
                                element,
                                attribute
                            );


                        const clean =
                            cleanText(
                                original
                            );


                        if (!clean) {

                            return;

                        }


                        const translated =
                            translateText(
                                clean,
                                currentLanguage
                            );


                        element.setAttribute(
                            attribute,
                            translated
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       TRANSLATE PAGE
       ===================================================== */

    function translatePage() {

        translateAllText();

        translateAttributes();

    }


    /* =====================================================
       SET HTML LANGUAGE
       ===================================================== */

    function setDocumentLanguage() {

        const info =
            getLanguageInfo(
                currentLanguage
            );


        document.documentElement
            .setAttribute(
                "lang",
                currentLanguage
            );


        document.documentElement
            .setAttribute(
                "dir",
                info.direction || "ltr"
            );


        /*
         * Useful for CSS:
         */

        document.documentElement
            .setAttribute(
                "data-language",
                currentLanguage
            );

    }
    /* =====================================================
       LANGUAGE BUTTON
       ===================================================== */

    function getLanguageButtons() {

        const buttons = [];

        /*
         * Existing language button from HTML.
         * Your website already uses #languageBtn.
         */

        const existingButton =
            document.getElementById(
                "languageBtn"
            );


        if (existingButton) {

            buttons.push(
                existingButton
            );

        }


        /*
         * Also support other common
         * language button selectors.
         */

        const extraButtons =
            document.querySelectorAll(
                "[data-language-button], .language-btn"
            );


        extraButtons.forEach(
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


        return buttons;

    }


    /* =====================================================
       UPDATE LANGUAGE BUTTON FLAG
       ===================================================== */

    function updateLanguageButtons() {

        const buttons =
            getLanguageButtons();


        const info =
            getLanguageInfo(
                currentLanguage
            );


        buttons.forEach(
            function (button) {

                if (!button) {

                    return;

                }


                /*
                 * Save original button text only once.
                 */

                if (
                    button.dataset
                        .cptOriginalButtonHTML ===
                    undefined
                ) {

                    button.dataset
                        .cptOriginalButtonHTML =
                        button.innerHTML;

                }


                /*
                 * Show ONLY the selected flag.
                 *
                 * Example:
                 * English  → 🇬🇧
                 * Bengali  → 🇧🇩
                 * Arabic   → 🇸🇦
                 */

                button.innerHTML =
                    '<span class="cpt-selected-flag">' +
                    info.flag +
                    '</span>';


                /*
                 * Accessibility
                 */

                button.setAttribute(
                    "aria-label",
                    info.name
                );


                button.setAttribute(
                    "title",
                    info.nativeName
                );


                button.dataset.language =
                    currentLanguage;

            }
        );

    }


    /* =====================================================
       CREATE LANGUAGE MENU
       ===================================================== */

    function createLanguageMenu() {

        /*
         * If menu already exists,
         * don't create another one.
         */

        let menu =
            document.getElementById(
                "cptLanguageMenu"
            );


        if (menu) {

            return menu;

        }


        menu =
            document.createElement(
                "div"
            );


        menu.id =
            "cptLanguageMenu";


        menu.className =
            "cpt-language-menu";


        menu.setAttribute(
            "role",
            "menu"
        );


        /*
         * Build language list.
         */

        LANGUAGE_ORDER.forEach(
            function (languageCode) {

                const info =
                    getLanguageInfo(
                        languageCode
                    );


                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.className =
                    "cpt-language-item";


                item.dataset.language =
                    languageCode;


                item.setAttribute(
                    "role",
                    "menuitem"
                );


                item.innerHTML =

                    '<span class="cpt-language-flag">' +
                        info.flag +
                    '</span>' +

                    '<span class="cpt-language-name">' +
                        info.nativeName +
                    '</span>' +

                    '<span class="cpt-language-check" aria-hidden="true">' +
                        '✓' +
                    '</span>';


                /*
                 * Language click.
                 */

                item.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        const selectedLanguage =
                            item.dataset.language;


                        setLanguage(
                            selectedLanguage
                        );


                        closeLanguageMenu();

                    }
                );


                menu.appendChild(
                    item
                );

            }
        );


        document.body.appendChild(
            menu
        );


        return menu;

    }


    /* =====================================================
       UPDATE LANGUAGE MENU
       ===================================================== */

    function updateLanguageMenu() {

        const menu =
            document.getElementById(
                "cptLanguageMenu"
            );


        if (!menu) {

            return;

        }


        const items =
            menu.querySelectorAll(
                ".cpt-language-item"
            );


        items.forEach(
            function (item) {

                const language =
                    item.dataset.language;


                const isSelected =
                    language ===
                    currentLanguage;


                item.classList.toggle(
                    "active",
                    isSelected
                );


                item.setAttribute(
                    "aria-selected",
                    isSelected
                        ? "true"
                        : "false"
                );


                const check =
                    item.querySelector(
                        ".cpt-language-check"
                    );


                if (check) {

                    check.style.visibility =
                        isSelected
                            ? "visible"
                            : "hidden";

                }

            }
        );

    }


    /* =====================================================
       POSITION LANGUAGE MENU
       ===================================================== */

    function positionLanguageMenu(
        button,
        menu
    ) {

        if (
            !button ||
            !menu
        ) {

            return;

        }


        /*
         * Make menu visible temporarily
         * so its dimensions can be measured.
         */

        menu.style.display =
            "block";


        menu.style.visibility =
            "hidden";


        const rect =
            button.getBoundingClientRect();


        const menuRect =
            menu.getBoundingClientRect();


        const gap = 8;


        let top =
            rect.bottom +
            gap;


        let left =
            rect.right -
            menuRect.width;


        /*
         * Keep menu inside viewport.
         */

        const margin = 10;


        if (
            left < margin
        ) {

            left =
                margin;

        }


        if (
            left +
            menuRect.width >
            window.innerWidth -
            margin
        ) {

            left =
                window.innerWidth -
                menuRect.width -
                margin;

        }


        if (
            top +
            menuRect.height >
            window.innerHeight -
            margin
        ) {

            top =
                rect.top -
                menuRect.height -
                gap;

        }


        if (
            top < margin
        ) {

            top =
                margin;

        }


        menu.style.top =
            top + "px";


        menu.style.left =
            left + "px";


        menu.style.visibility =
            "visible";

    }


    /* =====================================================
       OPEN LANGUAGE MENU
       ===================================================== */

    function openLanguageMenu(
        button
    ) {

        const menu =
            createLanguageMenu();


        updateLanguageMenu();


        menu.classList.add(
            "open"
        );


        menu.setAttribute(
            "aria-hidden",
            "false"
        );


        positionLanguageMenu(
            button,
            menu
        );

    }


    /* =====================================================
       CLOSE LANGUAGE MENU
       ===================================================== */

    function closeLanguageMenu() {

        const menu =
            document.getElementById(
                "cptLanguageMenu"
            );


        if (!menu) {

            return;

        }


        menu.classList.remove(
            "open"
        );


        menu.setAttribute(
            "aria-hidden",
            "true"
        );


        menu.style.display =
            "none";

    }


    /* =====================================================
       TOGGLE LANGUAGE MENU
       ===================================================== */

    function toggleLanguageMenu(
        button
    ) {

        const menu =
            document.getElementById(
                "cptLanguageMenu"
            );


        if (
            menu &&
            menu.classList.contains(
                "open"
            )
        ) {

            closeLanguageMenu();

            return;

        }


        openLanguageMenu(
            button
        );

    }


    /* =====================================================
       CONNECT LANGUAGE BUTTONS
       ===================================================== */

    function connectLanguageButtons() {

        const buttons =
            getLanguageButtons();


        buttons.forEach(
            function (button) {

                if (
                    button.dataset
                        .cptLanguageConnected ===
                    "true"
                ) {

                    return;

                }


                button.dataset
                    .cptLanguageConnected =
                    "true";


                /*
                 * Prevent browser default
                 * behavior where necessary.
                 */

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        toggleLanguageMenu(
                            button
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       CREATE AUTOMATIC LANGUAGE BUTTON
       =====================================================

       If a page does not contain #languageBtn,
       this function creates a floating flag button
       in the top-right corner.
       ===================================================== */

    function createAutomaticLanguageButton() {

        /*
         * Don't create if an existing button
         * is already available.
         */

        const existingButtons =
            getLanguageButtons();


        if (
            existingButtons.length > 0
        ) {

            return existingButtons[0];

        }


        /*
         * Create floating button.
         */

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.id =
            "cptAutoLanguageButton";


        button.className =
            "cpt-auto-language-button";


        button.setAttribute(
            "aria-label",
            "Language"
        );


        button.setAttribute(
            "title",
            "Language"
        );


        button.innerHTML =
            '<span class="cpt-selected-flag">' +
            getLanguageInfo(
                currentLanguage
            ).flag +
            '</span>';


        document.body.appendChild(
            button
        );


        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                toggleLanguageMenu(
                    button
                );

            }
        );


        button.dataset
            .cptLanguageConnected =
            "true";


        return button;

    }


    /* =====================================================
       UPDATE AUTOMATIC BUTTON
       ===================================================== */

    function updateAutomaticLanguageButton() {

        const button =
            document.getElementById(
                "cptAutoLanguageButton"
            );


        if (!button) {

            return;

        }


        const info =
            getLanguageInfo(
                currentLanguage
            );


        button.innerHTML =
            '<span class="cpt-selected-flag">' +
            info.flag +
            '</span>';


        button.setAttribute(
            "aria-label",
            info.name
        );


        button.setAttribute(
            "title",
            info.nativeName
        );

    }


    /* =====================================================
       APPLY LANGUAGE
       ===================================================== */

    function applyLanguage() {

        /*
         * First update HTML language
         * and text direction.
         */

        setDocumentLanguage();


        /*
         * Translate page text.
         */

        translatePage();


        /*
         * Update existing language button.
         */

        updateLanguageButtons();


        /*
         * Update automatic button.
         */

        updateAutomaticLanguageButton();


        /*
         * Update menu selected state.
         */

        updateLanguageMenu();

    }


    /* =====================================================
       SET LANGUAGE
       ===================================================== */

    function setLanguage(
        language
    ) {

        /*
         * Never allow an invalid language.
         */

        if (
            !isValidLanguage(
                language
            )
        ) {

            language =
                DEFAULT_LANGUAGE;

        }


        /*
         * Change global language.
         */

        currentLanguage =
            language;


        /*
         * Save for every other HTML page.
         */

        saveLanguage(
            currentLanguage
        );


        /*
         * Apply immediately.
         */

        applyLanguage();


        /*
         * Dispatch a custom event.
         *
         * Other scripts can listen to:
         *
         * document.addEventListener(
         *   "cptLanguageChanged",
         *   function(event) {}
         * );
         */

        try {

            document.dispatchEvent(
                new CustomEvent(
                    "cptLanguageChanged",
                    {
                        detail: {
                            language:
                                currentLanguage
                        }
                    }
                )
            );

        } catch (error) {

            /*
             * Older browser fallback.
             */

            const event =
                document.createEvent(
                    "Event"
                );


            event.initEvent(
                "cptLanguageChanged",
                true,
                true
            );


            document.dispatchEvent(
                event
            );

        }

    }


    /* =====================================================
       CLOSE MENU WHEN CLICKING OUTSIDE
       ===================================================== */

    function setupOutsideClick() {

        document.addEventListener(
            "click",
            function (event) {

                const menu =
                    document.getElementById(
                        "cptLanguageMenu"
                    );


                if (!menu) {

                    return;

                }


                const clickedInsideMenu =
                    menu.contains(
                        event.target
                    );


                const clickedLanguageButton =
                    event.target.closest &&
                    event.target.closest(
                        "#languageBtn, [data-language-button], .language-btn, #cptAutoLanguageButton"
                    );


                if (
                    !clickedInsideMenu &&
                    !clickedLanguageButton
                ) {

                    closeLanguageMenu();

                }

            }
        );

    }


    /* =====================================================
       CLOSE MENU WITH ESCAPE
       ===================================================== */

    function setupEscapeKey() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeLanguageMenu();

                }

            }
        );

    }


    /* =====================================================
       REPOSITION MENU ON RESIZE
       ===================================================== */

    function setupResizeHandler() {

        window.addEventListener(
            "resize",
            function () {

                const menu =
                    document.getElementById(
                        "cptLanguageMenu"
                    );


                if (
                    !menu ||
                    !menu.classList.contains(
                        "open"
                    )
                ) {

                    return;

                }


                const button =
                    document.querySelector(
                        "#languageBtn, [data-language-button], .language-btn, #cptAutoLanguageButton"
                    );


                if (button) {

                    positionLanguageMenu(
                        button,
                        menu
                    );

                }

            }
        );

    }    
