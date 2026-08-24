/* =========================================================
   CPTMARKETS TRADE
   trade.js
   FINAL REPLACEMENT
   MOBILE + TRADINGVIEW + TRADE SYSTEM
   CONNECTED WITH trade-popup.js
   ========================================================= */


/* =========================================================
   MOBILE VIEWPORT FIX
   ========================================================= */

(function fixMobileViewport() {

    let viewport =
        document.querySelector('meta[name="viewport"]');

    if (!viewport) {

        viewport =
            document.createElement("meta");

        viewport.name =
            "viewport";

        document.head.appendChild(viewport);

    }

    viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
    );

})();


/* =========================================================
   TRADE STATE
   ========================================================= */

let price = 4269.29;

let selectedSide = null;
let entryPrice = null;
let tradeAmountValue = 0;

let currentTradeId = null;
let currentTradeUID = null;

let selectedLeverage = 100;


/*
 * Pending trade is NOT an active trade.
 */

let pendingTradeSide = null;
let pendingTradeEntryPrice = null;


/* =========================================================
   FIREBASE
   ========================================================= */

let tradeAuth = null;
let tradeDB = null;
let tradeFirebaseUser = null;


/* =========================================================
   DOM ELEMENT REFERENCES
   IMPORTANT:
   These are assigned AFTER DOM is ready.
   ========================================================= */

let livePrice = null;
let changeBox = null;

let longButton = null;
let shortButton = null;

let tradeModal = null;
let modalPrice = null;
let modalTitle = null;
let confirmTradeBtn = null;
let modalClose = null;
let amountInput = null;


/* =========================================================
   DOM CACHE
   ========================================================= */

function cacheTradeElements() {

    livePrice =
        document.getElementById("livePrice");


    changeBox =
        document.getElementById("changeBox");


    longButton =
        document.querySelector(
            ".long-btn, #longBtn, button.long"
        );


    shortButton =
        document.querySelector(
            ".short-btn, #shortBtn, button.short"
        );


    tradeModal =
        document.getElementById("tradeModal");


    modalPrice =
        document.getElementById("modalPrice");


    modalTitle =
        document.getElementById("modalTitle");


    confirmTradeBtn =
        document.getElementById("confirmTradeBtn");


    modalClose =
        document.getElementById("modalClose");


    amountInput =
        document.getElementById("amount");

}


/* =========================================================
   PROFESSIONAL MESSAGE SYSTEM
   Connected with trade-popup.js
   ========================================================= */

function showTradeMessage(
    title,
    message,
    type = "error"
) {

    if (
        typeof window.cptShowTradeMessage ===
        "function"
    ) {

        window.cptShowTradeMessage(
            title,
            message,
            type
        );

        return;

    }


    setTimeout(
        function () {

            if (
                typeof window.cptShowTradeMessage ===
                "function"
            ) {

                window.cptShowTradeMessage(
                    title,
                    message,
                    type
                );

                return;

            }


            createFallbackTradeMessage(
                title,
                message,
                type
            );

        },
        60
    );

}


/* =========================================================
   FALLBACK PROFESSIONAL MESSAGE
   ========================================================= */

function createFallbackTradeMessage(
    title,
    message,
    type = "error"
) {

    let overlay =
        document.getElementById(
            "cptTradeFallbackMessage"
        );


    if (!overlay) {

        overlay =
            document.createElement("div");

        overlay.id =
            "cptTradeFallbackMessage";


        overlay.innerHTML =

            '<div class="cpt-fallback-message-card">' +

                '<div ' +
                    'class="cpt-fallback-message-icon" ' +
                    'id="cptFallbackMessageIcon">' +
                    '!' +
                '</div>' +

                '<div class="cpt-fallback-message-brand">' +
                    'CPT Markets' +
                '</div>' +

                '<div ' +
                    'class="cpt-fallback-message-title" ' +
                    'id="cptFallbackMessageTitle">' +
                '</div>' +

                '<div ' +
                    'class="cpt-fallback-message-text" ' +
                    'id="cptFallbackMessageText">' +
                '</div>' +

                '<button ' +
                    'type="button" ' +
                    'id="cptFallbackMessageOK">' +
                    'OK' +
                '</button>' +

            '</div>';


        document.body.appendChild(
            overlay
        );


        const style =
            document.createElement("style");


        style.id =
            "cptTradeFallbackMessageStyle";


        style.textContent = `

            #cptTradeFallbackMessage {
                position: fixed;
                inset: 0;
                z-index: 2147483000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                box-sizing: border-box;
                background: rgba(0, 0, 0, .72);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
            }

            .cpt-fallback-message-card {
                width: min(92vw, 390px);
                box-sizing: border-box;
                padding: 26px 22px 20px;
                border: 1px solid rgba(56, 189, 248, .20);
                border-radius: 22px;
                background:
                    linear-gradient(
                        180deg,
                        #101722 0%,
                        #080d15 100%
                    );
                box-shadow:
                    0 24px 70px rgba(0, 0, 0, .55),
                    0 0 30px rgba(56, 189, 248, .08);
                color: #fff;
                text-align: center;
                font-family: Arial, sans-serif;
            }

            .cpt-fallback-message-icon {
                width: 48px;
                height: 48px;
                margin: 0 auto 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: rgba(245, 158, 11, .12);
                border: 1px solid rgba(245, 158, 11, .30);
                color: #fbbf24;
                font-size: 25px;
                font-weight: 700;
            }

            .cpt-fallback-message-brand {
                color: #38bdf8;
                font-size: 13px;
                font-weight: 700;
                letter-spacing: .7px;
                margin-bottom: 8px;
            }

            .cpt-fallback-message-title {
                font-size: 21px;
                font-weight: 700;
                margin-bottom: 10px;
            }

            .cpt-fallback-message-text {
                color: #aab7c7;
                font-size: 14px;
                line-height: 1.55;
                margin-bottom: 20px;
            }

            #cptFallbackMessageOK {
                width: 100%;
                min-height: 46px;
                border: 0;
                border-radius: 12px;
                background:
                    linear-gradient(
                        135deg,
                        #0ea5e9,
                        #0284c7
                    );
                color: #fff;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
            }

        `;


        document.head.appendChild(
            style
        );


        const okButton =
            document.getElementById(
                "cptFallbackMessageOK"
            );


        if (okButton) {

            okButton.addEventListener(
                "click",
                function () {

                    overlay.style.display =
                        "none";

                }
            );

        }

    }


    const titleBox =
        document.getElementById(
            "cptFallbackMessageTitle"
        );


    const textBox =
        document.getElementById(
            "cptFallbackMessageText"
        );


    const icon =
        document.getElementById(
            "cptFallbackMessageIcon"
        );


    if (titleBox) {

        titleBox.innerText =
            title;

    }


    if (textBox) {

        textBox.innerText =
            message;

    }


    if (icon) {

        icon.innerText =
            type === "success"
                ? "✓"
                : "!";

    }


    overlay.style.display =
        "flex";

}


/* =========================================================
   CHART HEIGHT
   ========================================================= */

function fixMobileChartHeight() {

    const chart =
        document.getElementById("tvchart");


    const card =
        document.querySelector(".chart-card");


    if (!chart) {

        return;

    }


    const height =
        window.innerWidth <= 600
            ? 360
            : 430;


    chart.style.setProperty(
        "width",
        "100%",
        "important"
    );


    chart.style.setProperty(
        "height",
        height + "px",
        "important"
    );


    chart.style.setProperty(
        "min-height",
        height + "px",
        "important"
    );


    chart.style.setProperty(
        "max-height",
        height + "px",
        "important"
    );


    chart.style.setProperty(
        "display",
        "block",
        "important"
    );


    chart.style.setProperty(
        "position",
        "relative",
        "important"
    );


    chart.style.setProperty(
        "overflow",
        "hidden",
        "important"
    );


    if (card) {

        card.style.setProperty(
            "width",
            "100%",
            "important"
        );


        card.style.setProperty(
            "height",
            height + "px",
            "important"
        );


        card.style.setProperty(
            "min-height",
            height + "px",
            "important"
        );


        card.style.setProperty(
            "max-height",
            height + "px",
            "important"
        );


        card.style.setProperty(
            "overflow",
            "hidden",
            "important"
        );


        card.style.setProperty(
            "padding",
            "0",
            "important"
        );


        card.style.setProperty(
            "margin-left",
            "0",
            "important"
        );


        card.style.setProperty(
            "margin-right",
            "0",
            "important"
        );


        card.style.setProperty(
            "box-sizing",
            "border-box",
            "important"
        );

    }

}


/* =========================================================
   FIREBASE INITIALIZATION
   ========================================================= */

async function initializeTradeFirebase() {

    try {

        const config =
            await import(
                "./firebase/firebase-config.js"
            );


        tradeAuth =
            config.auth;


        tradeDB =
            config.db;


        const firebaseAuth =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"
            );


        firebaseAuth.onAuthStateChanged(
            tradeAuth,
            async function (user) {

                tradeFirebaseUser =
                    user || null;


                currentTradeUID =
                    user
                        ? user.uid
                        : null;


                if (!user) {

                    hideOpenTradeCard();

                    return;

                }


                await restoreActiveTrade();

            }
        );


    } catch (error) {

        console.error(
            "Trade Firebase initialization failed:",
            error
        );

    }

}


/* =========================================================
   CREATE TRADE ID
   ========================================================= */

function createTradeId() {

    return (
        "TRD-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 9)
            .toUpperCase()
    );

}


/* =========================================================
   SAVE ACTIVE TRADE
   ========================================================= */

function saveActiveTrade() {

    if (
        !selectedSide ||
        !entryPrice ||
        !tradeAmountValue ||
        !currentTradeId
    ) {

        return;

    }


    localStorage.setItem(
        "selectedSide",
        selectedSide
    );


    localStorage.setItem(
        "entryPrice",
        String(entryPrice)
    );


    localStorage.setItem(
        "tradeAmountValue",
        String(tradeAmountValue)
    );


    localStorage.setItem(
        "currentTradeId",
        currentTradeId
    );


    localStorage.setItem(
        "currentTradePrice",
        String(price)
    );


    localStorage.setItem(
        "tradeLeverage",
        String(selectedLeverage)
    );


    if (currentTradeUID) {

        localStorage.setItem(
            "currentTradeUID",
            currentTradeUID
        );

    }

}


/* =========================================================
   CLEAR ACTIVE TRADE
   ========================================================= */

function clearActiveTrade() {

    localStorage.removeItem("selectedSide");
    localStorage.removeItem("entryPrice");
    localStorage.removeItem("tradeAmountValue");
    localStorage.removeItem("currentTradeId");
    localStorage.removeItem("currentTradePrice");
    localStorage.removeItem("tradeLeverage");
    localStorage.removeItem("currentTradeUID");

}


/* =========================================================
   GET STORED ACTIVE TRADE
   ========================================================= */

function getStoredActiveTrade() {

    const side =
        localStorage.getItem(
            "selectedSide"
        );


    const savedEntry =
        Number(
            localStorage.getItem(
                "entryPrice"
            )
        );


    const amount =
        Number(
            localStorage.getItem(
                "tradeAmountValue"
            )
        );


    const tradeId =
        localStorage.getItem(
            "currentTradeId"
        );


    const uid =
        localStorage.getItem(
            "currentTradeUID"
        );


    if (
        !side ||
        !Number.isFinite(savedEntry) ||
        savedEntry <= 0 ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !tradeId
    ) {

        return null;

    }


    if (
        side !== "LONG" &&
        side !== "SHORT"
    ) {

        return null;

    }


    return {

        side:
            side,

        entryPrice:
            savedEntry,

        amount:
            amount,

        tradeId:
            tradeId,

        uid:
            uid || null

    };

}


/* =========================================================
   RESTORE ACTIVE TRADE
   ========================================================= */

async function restoreActiveTrade() {

    const stored =
        getStoredActiveTrade();


    if (!stored) {

        hideOpenTradeCard();

        return;

    }


    if (
        currentTradeUID &&
        stored.uid &&
        stored.uid !== currentTradeUID
    ) {

        clearActiveTrade();

        hideOpenTradeCard();

        return;

    }


    selectedSide =
        stored.side;


    entryPrice =
        stored.entryPrice;


    tradeAmountValue =
        stored.amount;


    currentTradeId =
        stored.tradeId;


    const savedLeverage =
        Number(
            localStorage.getItem(
                "tradeLeverage"
            )
        );


    if (
        Number.isFinite(savedLeverage) &&
        savedLeverage > 0
    ) {

        selectedLeverage =
            savedLeverage;

    }


    updateOpenTradeUI();

}


/* =========================================================
   LIVE PRICE
   ========================================================= */

setInterval(
    function () {

        const change =
            (Math.random() - 0.5) * 3;


        price += change;


        if (price <= 0) {

            price = 1;

        }


        if (livePrice) {

            livePrice.innerText =
                price.toFixed(2);

        }


        const percent =
            (
                (change / price) *
                100
            ).toFixed(2);


        if (changeBox) {

            if (change >= 0) {

                changeBox.className =
                    "change green";

                changeBox.innerText =
                    "+" + percent + "%";

            } else {

                changeBox.className =
                    "change red";

                changeBox.innerText =
                    percent + "%";

            }

        }


        if (
            selectedSide &&
            entryPrice &&
            tradeAmountValue
        ) {

            localStorage.setItem(
                "currentTradePrice",
                String(price)
            );


            updateOpenTradeUI();

        }

    },
    1000
);


/* =========================================================
   TIMEFRAME
   ========================================================= */

function initializeTimeframes() {

    document
        .querySelectorAll(
            ".timeframe button"
        )
        .forEach(
            function (btn) {

                btn.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                ".timeframe button"
                            )
                            .forEach(
                                function (button) {

                                    button.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        btn.classList.add(
                            "active"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   INDICATORS
   ========================================================= */

function initializeIndicators() {

    document
        .querySelectorAll(
            ".indicator-bar button"
        )
        .forEach(
            function (btn) {

                btn.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                ".indicator-bar button"
                            )
                            .forEach(
                                function (button) {

                                    button.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        btn.classList.add(
                            "active"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   LEVERAGE
   ========================================================= */

function initializeLeverage() {

    document
        .querySelectorAll(
            ".leverage-grid button"
        )
        .forEach(
            function (btn) {

                btn.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                ".leverage-grid button"
                            )
                            .forEach(
                                function (button) {

                                    button.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        btn.classList.add(
                            "active"
                        );


                        selectedLeverage =
                            Number(
                                btn.innerText
                                    .replace("x", "")
                            );


                        const levValue =
                            document.getElementById(
                                "levValue"
                            );


                        if (levValue) {

                            levValue.innerText =
                                btn.innerText;

                        }


                        if (selectedSide) {

                            saveActiveTrade();

                        }

                    }
                );

            }
        );

}


/* =========================================================
   AMOUNT INPUT
   ========================================================= */

function initializeAmountInput() {

    if (!amountInput) {

        return;

    }


    amountInput.addEventListener(
        "input",
        function () {

            const margin =
                Number(
                    amountInput.value
                ) || 0;


            const marginValue =
                document.getElementById(
                    "marginValue"
                );


            if (marginValue) {

                marginValue.innerText =
                    "$" +
                    margin.toFixed(2);

            }

        }
    );

}


/* =========================================================
   TRADINGVIEW
   ========================================================= */

let tradingViewWidget = null;
let tradingViewLoading = false;


/* =========================================================
   LOAD TRADINGVIEW LIBRARY
   ========================================================= */

function loadTradingViewLibrary() {

    return new Promise(
        function (resolve, reject) {

            if (
                typeof TradingView !==
                "undefined"
            ) {

                resolve();

                return;

            }


            const existingScript =
                document.querySelector(
                    'script[src="https://s3.tradingview.com/tv.js"]'
                );


            if (existingScript) {

                let attempts = 0;


                const checker =
                    setInterval(
                        function () {

                            attempts++;


                            if (
                                typeof TradingView !==
                                "undefined"
                            ) {

                                clearInterval(
                                    checker
                                );

                                resolve();

                                return;

                            }


                            if (
                                attempts >= 50
                            ) {

                                clearInterval(
                                    checker
                                );

                                reject(
                                    new Error(
                                        "TradingView library did not load."
                                    )
                                );

                            }

                        },
                        100
                    );


                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://s3.tradingview.com/tv.js";


            script.async =
                true;


            script.onload =
                function () {

                    if (
                        typeof TradingView !==
                        "undefined"
                    ) {

                        resolve();

                    } else {

                        reject(
                            new Error(
                                "TradingView object unavailable."
                            )
                        );

                    }

                };


            script.onerror =
                function () {

                    reject(
                        new Error(
                            "Unable to load TradingView library."
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        }
    );

}


/* =========================================================
   CREATE TRADINGVIEW CHART
   ========================================================= */

async function initializeTradingView() {

    const chart =
        document.getElementById(
            "tvchart"
        );


    if (!chart) {

        return;

    }


    if (tradingViewLoading) {

        return;

    }


    tradingViewLoading =
        true;


    fixMobileChartHeight();


    chart.innerHTML = "";


    try {

        await loadTradingViewLibrary();


        fixMobileChartHeight();


        const width =
            chart.clientWidth || 320;


        const height =
            window.innerWidth <= 600
                ? 360
                : 430;


        tradingViewWidget =
            new TradingView.widget({

                container_id:
                    "tvchart",

                width:
                    width,

                height:
                    height,

                symbol:
                    "OANDA:XAUUSD",

                interval:
                    "1",

                timezone:
                    "Etc/UTC",

                theme:
                    "dark",

                style:
                    "1",

                locale:
                    "en",

                toolbar_bg:
                    "#050a11",

                enable_publishing:
                    false,

                allow_symbol_change:
                    false,

                save_image:
                    false,

                hide_top_toolbar:
                    true,

                hide_legend:
                    false,

                hide_side_toolbar:
                    true,

                withdateranges:
                    false,

                details:
                    false,

                hotlist:
                    false,

                calendar:
                    false,

                studies:
                    [],

                disabled_features: [

                    "header_widget",
                    "header_symbol_search",
                    "header_compare",
                    "header_settings",
                    "header_saveload",
                    "header_fullscreen_button",
                    "header_indicators",
                    "left_toolbar",
                    "timeframes_toolbar"

                ],

                enabled_features: [

                    "hide_left_toolbar_by_default"

                ],

                overrides: {

                    "paneProperties.background":
                        "#050a11",

                    "paneProperties.backgroundType":
                        "solid",

                    "paneProperties.vertGridProperties.color":
                        "rgba(90,110,130,0.10)",

                    "paneProperties.horzGridProperties.color":
                        "rgba(90,110,130,0.10)",

                    "scalesProperties.textColor":
                        "#8ea2b8",

                    "scalesProperties.lineColor":
                        "rgba(120,140,160,0.20)",

                    "mainSeriesProperties.candleStyle.upColor":
                        "#16c784",

                    "mainSeriesProperties.candleStyle.downColor":
                        "#ea3943",

                    "mainSeriesProperties.candleStyle.borderUpColor":
                        "#16c784",

                    "mainSeriesProperties.candleStyle.borderDownColor":
                        "#ea3943",

                    "mainSeriesProperties.candleStyle.wickUpColor":
                        "#16c784",

                    "mainSeriesProperties.candleStyle.wickDownColor":
                        "#ea3943"

                },

                time_scale: {

                    right_bar_stays_on_scroll:
                        true,

                    bar_spacing:
                        6,

                    min_bar_spacing:
                        2

                }

            });


    } catch (error) {

        console.error(
            "TradingView initialization failed:",
            error
        );


        chart.innerHTML =

            '<div style="' +
            'height:100%;' +
            'width:100%;' +
            'display:flex;' +
            'align-items:center;' +
            'justify-content:center;' +
            'flex-direction:column;' +
            'gap:8px;' +
            'background:#050a11;' +
            'color:#8ea2b8;' +
            'font-family:Arial,sans-serif;' +
            'text-align:center;' +
            '">' +

            '<div style="font-size:28px;color:#38bdf8;">◌</div>' +

            '<div style="font-size:14px;">Chart connection failed</div>' +

            '<div style="font-size:11px;opacity:.65;">' +
            'Please check your internet connection.' +
            '</div>' +

            '</div>';

    }


    tradingViewLoading =
        false;

}


/* =========================================================
   OPEN TRADE MODAL
   IMPORTANT:
   Long/Short click ALWAYS comes here first.
   Balance is checked ONLY during confirmation.
   ========================================================= */

function openTradeModal(side) {

    if (
        selectedSide &&
        entryPrice &&
        tradeAmountValue
    ) {

        showTradeMessage(
            "Trade Already Open",
            "You already have an open trade. Close it before opening another trade.",
            "warning"
        );

        return;

    }


    if (
        side !== "LONG" &&
        side !== "SHORT"
    ) {

        return;

    }


    pendingTradeSide =
        side;


    pendingTradeEntryPrice =
        Number(price);


    if (modalTitle) {

        modalTitle.innerText =
            "Open " + side;

    }


    if (modalPrice) {

        modalPrice.innerText =
            pendingTradeEntryPrice.toFixed(2);

    }


    const orderAmount =
        document.getElementById(
            "orderAmount"
        );


    if (
        orderAmount &&
        amountInput
    ) {

        orderAmount.value =
            amountInput.value || "";

    }


    /*
     * IMPORTANT:
     * Do NOT check balance here.
     * Do NOT call trade-popup here.
     * The actual trade modal must open first.
     */

    if (tradeModal) {

        tradeModal.style.display =
            "flex";

        tradeModal.style.visibility =
            "visible";

        tradeModal.style.opacity =
            "1";

        tradeModal.style.zIndex =
            "999999";

    } else {

        /*
         * If the HTML trade modal itself is missing,
         * show a real diagnostic message.
         */

        showTradeMessage(
            "Trade Interface Unavailable",
            "The trade interface could not be loaded. Please check that #tradeModal exists in the trade page.",
            "error"
        );

    }

}


/* =========================================================
   CANCEL TRADE MODAL
   ========================================================= */

function cancelTradeModal() {

    if (tradeModal) {

        tradeModal.style.display =
            "none";

    }


    pendingTradeSide =
        null;


    pendingTradeEntryPrice =
        null;

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function initializeTradeModalEvents() {

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                cancelTradeModal();

            }
        );

    }


    if (tradeModal) {

        tradeModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    tradeModal
                ) {

                    cancelTradeModal();

                }

            }
        );

    }

}


/* =========================================================
   LONG / SHORT BUTTON SYSTEM
   CRITICAL FIX
   ========================================================= */

function initializeLongShortButtons() {

    /*
     * Re-cache in case HTML was rendered dynamically.
     */

    longButton =
        document.querySelector(
            ".long-btn, #longBtn, button.long"
        );


    shortButton =
        document.querySelector(
            ".short-btn, #shortBtn, button.short"
        );


    /*
     * Capture-phase handler.
     *
     * This prevents another old/incorrect click handler
     * from showing "Trading Interface Unavailable"
     * before the correct trade modal opens.
     */

    document.addEventListener(
        "click",
        function (event) {

            const target =
                event.target.closest(
                    ".long-btn, #longBtn, button.long, .short-btn, #shortBtn, button.short"
                );


            if (!target) {

                return;

            }


            const isLong =
                target.matches(
                    ".long-btn, #longBtn, button.long"
                );


            const isShort =
                target.matches(
                    ".short-btn, #shortBtn, button.short"
                );


            if (!isLong && !isShort) {

                return;

            }


            /*
             * Stop old trade-interface handlers.
             */

            event.preventDefault();
            event.stopImmediatePropagation();


            /*
             * IMPORTANT:
             * Do NOT check balance here.
             */

            openTradeModal(
                isLong
                    ? "LONG"
                    : "SHORT"
            );

        },
        true
    );


    /*
     * Also protect direct button listeners.
     */

    if (longButton) {

        longButton.setAttribute(
            "type",
            "button"
        );

    }


    if (shortButton) {

        shortButton.setAttribute(
            "type",
            "button"
        );

    }

}


/* =========================================================
   CONFIRM TRADE BUTTON
   ========================================================= */

function initializeConfirmButton() {

    if (!confirmTradeBtn) {

        return;

    }


    confirmTradeBtn.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();
            event.stopPropagation();

            await confirmTrade();

        }
    );

}


/* =========================================================
   CONFIRM TRADE
   ========================================================= */

async function confirmTrade() {

    if (
        !pendingTradeSide ||
        !pendingTradeEntryPrice
    ) {

        showTradeMessage(
            "Select a Position",
            "Please select LONG or SHORT before continuing.",
            "warning"
        );

        return;

    }


    if (!tradeFirebaseUser) {

        showTradeMessage(
            "Login Required",
            "Please login before opening a trade.",
            "warning"
        );

        return;

    }


    const orderAmountInput =
        document.getElementById(
            "orderAmount"
        );


    let orderAmount =
        Number(
            orderAmountInput
                ? orderAmountInput.value
                : 0
        );


    if (
        !orderAmount ||
        orderAmount <= 0
    ) {

        orderAmount =
            Number(
                amountInput
                    ? amountInput.value
                    : 0
            );

    }


    if (
        !Number.isFinite(orderAmount) ||
        orderAmount <= 0
    ) {

        showTradeMessage(
            "Invalid Amount",
            "Please enter a valid trading amount before continuing.",
            "warning"
        );

        return;

    }


    if (
        typeof window.hasEnoughBalance !==
        "function" ||
        typeof window.subtractBalance !==
        "function"
    ) {

        showTradeMessage(
            "Balance System Unavailable",
            "The balance system is not ready. Please reload the page and try again.",
            "error"
        );

        return;

    }


    /*
     * Balance check happens HERE,
     * not when Long/Short is clicked.
     */

    if (
        !window.hasEnoughBalance(
            orderAmount
        )
    ) {

        showTradeMessage(
            "Insufficient Balance",
            "Your available balance is not enough to open this trade.",
            "warning"
        );

        return;

    }


    const confirmationSide =
        pendingTradeSide;


    const confirmationPrice =
        Number(
            pendingTradeEntryPrice
        );


    const confirmationLeverage =
        Number(
            selectedLeverage
        );


    const confirmationAmount =
        Number(
            orderAmount.toFixed(2)
        );


    /*
     * trade-popup.js is needed only now.
     * It is NOT needed just to open the trade modal.
     */

    if (
        typeof window.cptShowTradeConfirmation !==
        "function"
    ) {

        /*
         * Professional fallback confirmation.
         */

        const proceed =
            window.confirm(
                "Open " +
                confirmationSide +
                " trade?\n\n" +
                "Amount: $" +
                confirmationAmount.toFixed(2) +
                "\nLeverage: " +
                confirmationLeverage +
                "x\nEntry Price: " +
                confirmationPrice.toFixed(2)
            );


        if (proceed) {

            await completeTradeOpen(
                confirmationSide,
                confirmationPrice,
                confirmationAmount,
                confirmationLeverage
            );

        }

        return;

    }


    window.cptShowTradeConfirmation(

        confirmationSide,

        confirmationPrice,

        confirmationLeverage,

        function () {

            completeTradeOpen(
                confirmationSide,
                confirmationPrice,
                confirmationAmount,
                confirmationLeverage
            );

        }

    );

}


/* =========================================================
   COMPLETE TRADE OPEN
   ========================================================= */

async function completeTradeOpen(
    confirmationSide,
    confirmationPrice,
    confirmationAmount,
    confirmationLeverage
) {

    if (!tradeFirebaseUser) {

        showTradeMessage(
            "Session Expired",
            "Your user session has expired. Please login again.",
            "warning"
        );

        return;

    }


    if (
        typeof window.hasEnoughBalance !==
        "function" ||
        typeof window.subtractBalance !==
        "function"
    ) {

        showTradeMessage(
            "Balance System Unavailable",
            "The balance system is not ready. Please reload the page and try again.",
            "error"
        );

        return;

    }


    if (
        !window.hasEnoughBalance(
            confirmationAmount
        )
    ) {

        showTradeMessage(
            "Insufficient Balance",
            "Your available balance is no longer enough to open this trade.",
            "warning"
        );

        return;

    }


    const deducted =
        await window.subtractBalance(
            confirmationAmount
        );


    if (!deducted) {

        showTradeMessage(
            "Trade Could Not Be Opened",
            "We could not update your balance. Please try again.",
            "error"
        );

        return;

    }


    selectedSide =
        confirmationSide;


    entryPrice =
        Number(
            confirmationPrice
        );


    tradeAmountValue =
        Number(
            confirmationAmount.toFixed(2)
        );


    selectedLeverage =
        Number(
            confirmationLeverage
        );


    currentTradeId =
        createTradeId();


    currentTradeUID =
        tradeFirebaseUser.uid;


    pendingTradeSide =
        null;


    pendingTradeEntryPrice =
        null;


    saveActiveTrade();


    updateOpenTradeUI();


    if (tradeModal) {

        tradeModal.style.display =
            "none";

    }


    if (
        typeof window.cptShowTradeOpened ===
        "function"
    ) {

        window.cptShowTradeOpened(

            selectedSide,

            entryPrice,

            tradeAmountValue,

            selectedLeverage

        );

    } else {

        showTradeMessage(
            "Trade Opened",
            selectedSide +
            " trade opened successfully.",
            "success"
        );

    }


    console.log(
        "Trade opened successfully:",
        {
            tradeId:
                currentTradeId,

            uid:
                currentTradeUID,

            side:
                selectedSide,

            entryPrice:
                entryPrice,

            amount:
                tradeAmountValue,

            leverage:
                selectedLeverage
        }
    );

}


/* =========================================================
   OPEN TRADE UI
   ========================================================= */

function updateOpenTradeUI() {

    const openTradeCard =
        document.getElementById(
            "openTradeCard"
        );


    const positionSide =
        document.getElementById(
            "positionSide"
        );


    const entryPriceBox =
        document.getElementById(
            "entryPrice"
        );


    const currentTradePrice =
        document.getElementById(
            "currentTradePrice"
        );


    const tradeAmount =
        document.getElementById(
            "tradeAmount"
        );


    if (!selectedSide) {

        hideOpenTradeCard();

        return;

    }


    if (positionSide) {

        positionSide.innerText =
            selectedSide;

    }


    if (entryPriceBox) {

        entryPriceBox.innerText =
            Number(
                entryPrice || 0
            ).toFixed(2);

    }


    if (currentTradePrice) {

        currentTradePrice.innerText =
            price.toFixed(2);

    }


    if (tradeAmount) {

        tradeAmount.innerText =
            "$" +
            Number(
                tradeAmountValue || 0
            ).toFixed(2);

    }


    if (openTradeCard) {

        openTradeCard.style.display =
            "block";

    }

}


/* =========================================================
   HIDE OPEN TRADE CARD
   ========================================================= */

function hideOpenTradeCard() {

    const card =
        document.getElementById(
            "openTradeCard"
        );


    if (card) {

        card.style.display =
            "none";

    }

}


/* =========================================================
   LIVE USER P/L
   ========================================================= */

setInterval(
    function () {

        if (
            !selectedSide ||
            !entryPrice ||
            !tradeAmountValue
        ) {

            return;

        }


        const currentTradePrice =
            document.getElementById(
                "currentTradePrice"
            );


        const profitLossBox =
            document.getElementById(
                "tradePL"
            );


        const profitLoss =
            calculateProfitLoss(
                price
            );


        if (currentTradePrice) {

            currentTradePrice.innerText =
                price.toFixed(2);

        }


        if (profitLossBox) {

            profitLossBox.innerText =
                (
                    profitLoss >= 0
                        ? "+"
                        : ""
                ) +
                "$" +
                profitLoss.toFixed(2);


            profitLossBox.className =
                profitLoss >= 0
                    ? "profit"
                    : "loss";

        }

    },
    1000
);


/* =========================================================
   CALCULATE USER P/L
   ========================================================= */

function calculateProfitLoss(
    currentPrice
) {

    if (
        !selectedSide ||
        !entryPrice ||
        !tradeAmountValue
    ) {

        return 0;

    }


    let profitLoss =
        0;


    if (
        selectedSide ===
        "LONG"
    ) {

        profitLoss =
            (
                (
                    currentPrice -
                    entryPrice
                )
                /
                entryPrice
            )
            *
            tradeAmountValue;

    }


    if (
        selectedSide ===
        "SHORT"
    ) {

        profitLoss =
            (
                (
                    entryPrice -
                    currentPrice
                )
                /
                entryPrice
            )
            *
            tradeAmountValue;

    }


    return Number(
        profitLoss.toFixed(2)
    );

}


/* =========================================================
   CLOSE TRADE
   ========================================================= */

async function closeCurrentTrade() {

    if (
        !selectedSide ||
        !entryPrice ||
        !tradeAmountValue ||
        !currentTradeId
    ) {

        showTradeMessage(
            "No Open Trade",
            "There is currently no open trade to close.",
            "warning"
        );

        return;

    }


    if (!tradeFirebaseUser) {

        showTradeMessage(
            "Session Not Ready",
            "Your user session is not ready. Please login again.",
            "warning"
        );

        return;

    }


    if (!tradeDB) {

        showTradeMessage(
            "Database Not Ready",
            "The trading database is not ready. Please try again.",
            "error"
        );

        return;

    }


    const closedSide =
        selectedSide;


    const closedTradeId =
        currentTradeId;


    const closePrice =
        Number(price);


    const userProfitLoss =
        calculateProfitLoss(
            closePrice
        );


    try {

        const firestore =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
            );


        const userRef =
            firestore.doc(
                tradeDB,
                "users",
                tradeFirebaseUser.uid
            );


        let adminResult =
            null;


        const userSnapshot =
            await firestore.getDoc(
                userRef
            );


        if (
            userSnapshot.exists()
        ) {

            const userData =
                userSnapshot.data();


            if (
                userData.pendingAdminTradeResult &&
                userData.pendingAdminTradeResult.status ===
                    "PENDING"
            ) {

                const pending =
                    userData.pendingAdminTradeResult;


                if (
                    !pending.tradeId ||
                    pending.tradeId ===
                    closedTradeId
                ) {

                    adminResult =
                        pending;

                }

            }

        }


        const adminProfitLoss =
            adminResult
                ? Number(
                    adminResult.profitLoss || 0
                )
                : 0;


        const finalProfitLoss =
            Number(
                (
                    userProfitLoss +
                    adminProfitLoss
                ).toFixed(2)
            );


        const returnAmount =
            Number(
                (
                    tradeAmountValue +
                    finalProfitLoss
                ).toFixed(2)
            );


        if (
            returnAmount < 0
        ) {

            showTradeMessage(
                "Invalid Trade Result",
                "The calculated trade result is invalid. The trade was not closed.",
                "error"
            );

            return;

        }


        const historyRef =
            firestore.doc(
                firestore.collection(
                    tradeDB,
                    "tradeHistory"
                )
            );


        let finalBalance =
            0;


        let oldBalance =
            0;


        await firestore.runTransaction(
            tradeDB,
            async function (transaction) {

                const userSnapshot =
                    await transaction.get(
                        userRef
                    );


                if (
                    !userSnapshot.exists()
                ) {

                    throw new Error(
                        "User account not found."
                    );

                }


                const userData =
                    userSnapshot.data();


                oldBalance =
                    Number(
                        userData.balance || 0
                    );


                finalBalance =
                    Number(
                        (
                            oldBalance +
                            returnAmount
                        ).toFixed(2)
                    );


                if (
                    finalBalance < 0
                ) {

                    throw new Error(
                        "Final balance cannot be negative."
                    );

                }


                const userUpdate = {

                    balance:
                        finalBalance

                };


                if (adminResult) {

                    userUpdate.pendingAdminTradeResult =
                        firestore.deleteField();

                }


                userUpdate.pendingTradeProfitLoss =
                    firestore.deleteField();


                userUpdate.pendingTradeId =
                    firestore.deleteField();


                transaction.update(
                    userRef,
                    userUpdate
                );


                transaction.set(
                    historyRef,
                    {

                        tradeId:
                            closedTradeId,

                        uid:
                            tradeFirebaseUser.uid,

                        userId:
                            userData.userId ||
                            "",

                        username:
                            userData.username ||
                            userData.name ||
                            "User",

                        email:
                            userData.email ||
                            "",

                        side:
                            closedSide,

                        entryPrice:
                            Number(
                                entryPrice.toFixed(2)
                            ),

                        closePrice:
                            Number(
                                closePrice.toFixed(2)
                            ),

                        amount:
                            Number(
                                tradeAmountValue.toFixed(2)
                            ),

                        userProfitLoss:
                            userProfitLoss,

                        adminProfitLoss:
                            adminProfitLoss,

                        profitLoss:
                            finalProfitLoss,

                        leverage:
                            selectedLeverage,

                        type:
                            "TRADE",

                        source:
                            "USER",

                        adminResultSource:
                            adminResult
                                ? "ADMIN"
                                : null,

                        adminResultType:
                            adminResult
                                ? adminResult.type ||
                                  (
                                      adminProfitLoss >= 0
                                          ? "PROFIT"
                                          : "LOSS"
                                  )
                                : null,

                        status:
                            "COMPLETED",

                        oldBalance:
                            Number(
                                oldBalance.toFixed(2)
                            ),

                        returnedAmount:
                            returnAmount,

                        newBalance:
                            finalBalance,

                        time:
                            new Date()
                                .toLocaleString(),

                        createdAt:
                            firestore.serverTimestamp()

                    }

                );

            }
        );


        saveLocalTradeHistory({

            tradeId:
                closedTradeId,

            uid:
                tradeFirebaseUser.uid,

            side:
                closedSide,

            entryPrice:
                Number(
                    entryPrice.toFixed(2)
                ),

            closePrice:
                Number(
                    closePrice.toFixed(2)
                ),

            amount:
                Number(
                    tradeAmountValue.toFixed(2)
                ),

            profitLoss:
                finalProfitLoss,

            leverage:
                selectedLeverage,

            type:
                "TRADE",

            source:
                "USER"

        });


        if (
            typeof window.reloadBalance ===
            "function"
        ) {

            window.reloadBalance();

        }


        if (
            typeof window.refreshBalance ===
            "function"
        ) {

            window.refreshBalance();

        }


        const notificationSide =
            closedSide;


        const notificationEntry =
            Number(
                entryPrice
            );


        const notificationClose =
            Number(
                closePrice
            );


        const notificationPL =
            Number(
                finalProfitLoss
            );


        hideOpenTradeCard();


        selectedSide =
            null;


        entryPrice =
            null;


        tradeAmountValue =
            0;


        currentTradeId =
            null;


        currentTradeUID =
            tradeFirebaseUser
                ? tradeFirebaseUser.uid
                : null;


        pendingTradeSide =
            null;


        pendingTradeEntryPrice =
            null;


        clearActiveTrade();


        localStorage.setItem(
            "cptTradeClosedAt",
            String(Date.now())
        );


        setTimeout(
            function () {

                localStorage.removeItem(
                    "cptTradeClosedAt"
                );

            },
            1000
        );


        if (
            typeof window.cptShowTradeClosed ===
            "function"
        ) {

            window.cptShowTradeClosed(
                notificationSide,
                notificationEntry,
                notificationClose,
                notificationPL
            );

        } else {

            showTradeMessage(
                "Trade Closed",
                notificationSide +
                " trade closed successfully.\n\n" +
                "P/L: " +
                (
                    notificationPL >= 0
                        ? "+"
                        : ""
                ) +
                "$" +
                notificationPL.toFixed(2),
                "success"
            );

        }


        console.log(
            "Trade closed successfully:",
            {
                tradeId:
                    closedTradeId,

                userProfitLoss:
                    userProfitLoss,

                adminProfitLoss:
                    adminProfitLoss,

                finalProfitLoss:
                    finalProfitLoss,

                returnedAmount:
                    returnAmount,

                newBalance:
                    finalBalance
            }
        );


    } catch (error) {

        console.error(
            "Trade close failed:",
            error
        );


        showTradeMessage(
            "Trade Could Not Be Closed",
            "The trade could not be closed. " +
            (
                error && error.message
                    ? error.message
                    : "Please try again."
            ),
            "error"
        );

    }

}


/* =========================================================
   CLOSE BUTTON
   ========================================================= */

function initializeCloseButton() {

    const closeTradeBtn =
        document.getElementById(
            "closeTradeBtn"
        );


    if (!closeTradeBtn) {

        return;

    }


    closeTradeBtn.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();
            event.stopPropagation();

            await closeCurrentTrade();

        }
    );

}


/* =========================================================
   LOCAL TRADE HISTORY
   ========================================================= */

function saveLocalTradeHistory(
    trade
) {

    try {

        let history =
            JSON.parse(
                localStorage.getItem(
                    "cptTradeHistory"
                )
            ) || [];


        const alreadyExists =
            history.some(
                function (item) {

                    return (
                        item.tradeId ===
                        trade.tradeId
                    );

                }
            );


        if (
            alreadyExists
        ) {

            return;

        }


        history.unshift({

            tradeId:
                trade.tradeId,

            uid:
                trade.uid,

            side:
                trade.side,

            entryPrice:
                trade.entryPrice,

            closePrice:
                trade.closePrice,

            amount:
                trade.amount,

            profitLoss:
                trade.profitLoss,

            leverage:
                trade.leverage,

            type:
                "TRADE",

            source:
                "USER",

            time:
                new Date()
                    .toLocaleString()

        });


        localStorage.setItem(
            "cptTradeHistory",
            JSON.stringify(
                history
            )
        );


    } catch (error) {

        console.error(
            "Local trade history error:",
            error
        );

    }

}


/* =========================================================
   HISTORY COMPATIBILITY
   ========================================================= */

function renderTradeHistory() {

    return;

}


/* =========================================================
   START TRADINGVIEW
   ========================================================= */

function startTradingViewChart() {

    fixMobileChartHeight();


    setTimeout(
        function () {

            initializeTradingView();

        },
        300
    );

}


/* =========================================================
   INITIALIZE ENTIRE TRADE UI
   CRITICAL FIX
   ========================================================= */

function initializeTradeUI() {

    /*
     * DOM is guaranteed to exist here.
     */

    cacheTradeElements();


    /*
     * Recalculate chart.
     */

    fixMobileChartHeight();


    /*
     * Initialize all controls.
     */

    initializeTimeframes();

    initializeIndicators();

    initializeLeverage();

    initializeAmountInput();

    initializeTradeModalEvents();

    initializeConfirmButton();

    initializeCloseButton();


    /*
     * CRITICAL:
     * Long/Short button capture handler.
     */

    initializeLongShortButtons();


    /*
     * Start chart.
     */

    startTradingViewChart();


    /*
     * Firebase.
     */

    initializeTradeFirebase();


    console.log(
        "CPT Markets Trade UI initialized successfully."
    );

}


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    function () {

        fixMobileChartHeight();

    }
);


/* =========================================================
   DOM READY
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeTradeUI,
        {
            once: true
        }
    );

} else {

    initializeTradeUI();

}


/* =========================================================
   EXPOSE TRADE FUNCTIONS
   IMPORTANT FOR HTML / OTHER JS FILES
   ========================================================= */

window.openTradeModal =
    openTradeModal;


window.cancelTradeModal =
    cancelTradeModal;


window.confirmTrade =
    confirmTrade;


window.closeCurrentTrade =
    closeCurrentTrade;


window.updateOpenTradeUI =
    updateOpenTradeUI;


window.calculateProfitLoss =
    calculateProfitLoss;


/* =========================================================
   ERROR PROTECTION
   ========================================================= */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "CPT Markets Trade JS Error:",
            event.error ||
            event.message
        );

    }
);


/* =========================================================
   END
   ========================================================= */
