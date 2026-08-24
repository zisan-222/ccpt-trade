/* =========================================================
   CPTMARKETS TRADE
   trade.js
   FINAL REPLACEMENT
   MOBILE + TRADINGVIEW + TRADE SYSTEM
   CONNECTED WITH trade-popup.js

   IMPORTANT FIX:
   LONG / SHORT BUTTON CLICK NEVER CHECKS BALANCE.

   FLOW:

   LONG / SHORT
        ↓
   Trade Interface
        ↓
   Enter Amount
        ↓
   Confirm
        ↓
   Validate Amount
        ↓
   Check Balance
        ↓
   Confirmation Popup
        ↓
   Continue
        ↓
   Deduct Balance
        ↓
   Open Trade
   ========================================================= */


/* =========================================================
   MOBILE VIEWPORT FIX
   ========================================================= */

(function fixMobileViewport() {

    let viewport =
        document.querySelector(
            'meta[name="viewport"]'
        );

    if (!viewport) {

        viewport =
            document.createElement("meta");

        viewport.name =
            "viewport";

        document.head.appendChild(
            viewport
        );

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
 *
 * LONG / SHORT click only creates pending state.
 *
 * selectedSide is changed ONLY after:
 *
 * 1. Valid amount
 * 2. Enough balance
 * 3. Confirmation Continue
 * 4. Balance successfully deducted
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


    /*
     * trade-popup.js may not yet be ready.
     */

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
                white-space: pre-line;
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
                : type === "warning"
                    ? "!"
                    : "!";

    }


    overlay.style.display =
        "flex";

}


/* =========================================================
   BASIC ELEMENTS
   ========================================================= */

const livePrice =
    document.getElementById(
        "livePrice"
    );


const changeBox =
    document.getElementById(
        "changeBox"
    );


/* =========================================================
   TRADE MODAL ELEMENTS
   ========================================================= */

const tradeModal =
    document.getElementById(
        "tradeModal"
    );


const modalPrice =
    document.getElementById(
        "modalPrice"
    );


const modalTitle =
    document.getElementById(
        "modalTitle"
    );


const confirmTradeBtn =
    document.getElementById(
        "confirmTradeBtn"
    );


const modalClose =
    document.getElementById(
        "modalClose"
    );


const amountInput =
    document.getElementById(
        "amount"
    );


/* =========================================================
   BUTTON SELECTORS
   ========================================================= */

const LONG_BUTTON_SELECTORS = [
    ".long-btn",
    "#longBtn",
    "button.long"
];


const SHORT_BUTTON_SELECTORS = [
    ".short-btn",
    "#shortBtn",
    "button.short"
];


function isLongButton(
    element
) {

    if (
        !element ||
        !element.matches
    ) {

        return false;

    }


    return LONG_BUTTON_SELECTORS.some(
        function (selector) {

            return element.matches(
                selector
            );

        }
    );

}


function isShortButton(
    element
) {

    if (
        !element ||
        !element.matches
    ) {

        return false;

    }


    return SHORT_BUTTON_SELECTORS.some(
        function (selector) {

            return element.matches(
                selector
            );

        }
    );

}


/* =========================================================
   FIND TRADE BUTTON FROM CLICK TARGET
   ========================================================= */

function findTradeButtonFromTarget(
    target
) {

    if (
        !target ||
        !target.closest
    ) {

        return null;

    }


    const possible =
        target.closest(
            ".long-btn, #longBtn, button.long, .short-btn, #shortBtn, button.short"
        );


    if (!possible) {

        return null;

    }


    if (
        isLongButton(possible) ||
        isShortButton(possible)
    ) {

        return possible;

    }


    return null;

}


/* =========================================================
   CHART HEIGHT
   ========================================================= */

function fixMobileChartHeight() {

    const chart =
        document.getElementById(
            "tvchart"
        );


    const card =
        document.querySelector(
            ".chart-card"
        );


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
   INITIAL CHART SIZING
   ========================================================= */

fixMobileChartHeight();


window.addEventListener(
    "resize",
    function () {

        fixMobileChartHeight();

    }
);


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

    localStorage.removeItem(
        "selectedSide"
    );


    localStorage.removeItem(
        "entryPrice"
    );


    localStorage.removeItem(
        "tradeAmountValue"
    );


    localStorage.removeItem(
        "currentTradeId"
    );


    localStorage.removeItem(
        "currentTradePrice"
    );


    localStorage.removeItem(
        "tradeLeverage"
    );


    localStorage.removeItem(
        "currentTradeUID"
    );

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


        const priceElement =
            document.getElementById(
                "livePrice"
            );


        const changeElement =
            document.getElementById(
                "changeBox"
            );


        if (priceElement) {

            priceElement.innerText =
                price.toFixed(2);

        }


        const percent =
            (
                (change / price) *
                100
            ).toFixed(2);


        if (changeElement) {

            if (change >= 0) {

                changeElement.className =
                    "change green";


                changeElement.innerText =
                    "+" + percent + "%";

            } else {

                changeElement.className =
                    "change red";


                changeElement.innerText =
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


/* =========================================================
   INDICATORS
   ========================================================= */

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


/* =========================================================
   LEVERAGE
   ========================================================= */

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


                    /*
                     * Only an already active trade
                     * may save leverage here.
                     *
                     * Pending trade is not saved.
                     */

                    if (
                        selectedSide &&
                        entryPrice &&
                        tradeAmountValue
                    ) {

                        saveActiveTrade();

                    }

                }
            );

        }
    );


/* =========================================================
   AMOUNT INPUT
   ========================================================= */

if (amountInput) {

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


            /*
             * IMPORTANT:
             *
             * Typing amount does NOT check balance.
             *
             * Balance is checked only when
             * Confirm Trade is pressed.
             */

        }
    );

}


/* =========================================================
   PROFESSIONAL LONG / SHORT CLICK HANDLER
   =========================================================

   IMPORTANT FIX:

   We intentionally use document CAPTURE phase.

   This prevents an older/duplicate LONG or SHORT
   click handler from running a direct balance check
   before our new trade interface opens.

   LONG / SHORT click itself NEVER checks balance.
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const button =
            findTradeButtonFromTarget(
                event.target
            );


        if (!button) {

            return;

        }


        /*
         * Stop older/duplicate click handlers.
         *
         * This is important because the previous
         * trade.js version may have attached a
         * different LONG / SHORT listener.
         */

        event.preventDefault();

        event.stopPropagation();

        event.stopImmediatePropagation();


        /*
         * Existing ACTIVE trade check only.
         *
         * No balance check here.
         */

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


        const side =
            isLongButton(button)
                ? "LONG"
                : "SHORT";


        openTradeModal(
            side
        );

    },
    true
);


/* =========================================================
   OPEN TRADE MODAL
   =========================================================

   IMPORTANT:

   This function DOES NOT check balance.

   This function DOES NOT check amount.

   This function DOES NOT deduct balance.

   It only opens the trading interface.
   ========================================================= */

function openTradeModal(
    side
) {

    if (
        side !== "LONG" &&
        side !== "SHORT"
    ) {

        return;

    }


    /*
     * Active trade check only.
     */

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


    /*
     * Store temporary/pending values only.
     */

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


    /*
     * Copy main amount into modal amount
     * if it exists.
     */

    if (
        orderAmount &&
        amountInput
    ) {

        orderAmount.value =
            amountInput.value || "";

    }


    /*
     * OPEN INTERFACE.
     *
     * No balance check here.
     */

    if (tradeModal) {

        tradeModal.style.display =
            "flex";

    } else {

        /*
         * If the actual modal element does not
         * exist, show a professional message.
         *
         * This is NOT a balance error.
         */

        showTradeMessage(
            "Trading Interface Unavailable",
            "The trading interface could not be loaded. Please reload the page and try again.",
            "warning"
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


    /*
     * Cancel only pending order.
     */

    pendingTradeSide =
        null;


    pendingTradeEntryPrice =
        null;

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

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


/* =========================================================
   CONFIRM TRADE BUTTON
   ========================================================= */

if (confirmTradeBtn) {

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
   =========================================================

   Balance is checked HERE.

   NOT on LONG.
   NOT on SHORT.
   NOT while typing amount.

   Only after user presses Confirm.
   ========================================================= */

async function confirmTrade() {

    /*
     * Must have pending side.
     */

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


    /*
     * Login check.
     *
     * This happens after opening the interface,
     * not on the LONG / SHORT button.
     */

    if (!tradeFirebaseUser) {

        showTradeMessage(
            "Login Required",
            "Please login before opening a trade.",
            "warning"
        );

        return;

    }


    /*
     * Read amount.
     */

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


    /*
     * If modal amount is empty,
     * try the main amount input.
     */

    if (
        !Number.isFinite(orderAmount) ||
        orderAmount <= 0
    ) {

        orderAmount =
            Number(
                amountInput
                    ? amountInput.value
                    : 0
            );

    }


    /*
     * Validate amount BEFORE balance check.
     *
     * This prevents:
     *
     * empty amount
     * ↓
     * hasEnoughBalance(0)
     * ↓
     * false
     * ↓
     * Insufficient Balance
     *
     * That was one of the previous problems.
     */

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


    /*
     * Normalize amount.
     */

    orderAmount =
        Number(
            orderAmount.toFixed(2)
        );


    /*
     * Balance functions must exist.
     */

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
     * ONLY NOW check balance.
     */

    let enoughBalance = false;


    try {

        enoughBalance =
            Boolean(
                window.hasEnoughBalance(
                    orderAmount
                )
            );

    } catch (balanceError) {

        console.error(
            "Balance validation failed:",
            balanceError
        );


        showTradeMessage(
            "Balance Check Failed",
            "The available balance could not be verified. Please reload the page and try again.",
            "error"
        );

        return;

    }


    /*
     * Insufficient balance ONLY here.
     */

    if (!enoughBalance) {

        showTradeMessage(
            "Insufficient Balance",
            "Your available balance is not enough to open this trade.",
            "warning"
        );

        return;

    }


    /*
     * =====================================================
     * IMPORTANT:
     *
     * Balance is NOT deducted here.
     *
     * First show confirmation popup.
     * Continue -> completeTradeOpen()
     * =====================================================
     */

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
     * Make sure trade-popup.js is loaded.
     */

    if (
        typeof window.cptShowTradeConfirmation !==
        "function"
    ) {

        showTradeMessage(
            "Trade Confirmation Unavailable",
            "The trade confirmation system is not ready. Please reload the page and try again.",
            "error"
        );

        return;

    }


    /*
     * Show CPT Markets confirmation popup.
     */

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
   Runs ONLY after confirmation Continue
   ========================================================= */

async function completeTradeOpen(
    confirmationSide,
    confirmationPrice,
    confirmationAmount,
    confirmationLeverage
) {

    /*
     * Re-check login.
     */

    if (!tradeFirebaseUser) {

        showTradeMessage(
            "Session Expired",
            "Your user session has expired. Please login again.",
            "warning"
        );

        return;

    }


    /*
     * Re-check balance system.
     */

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
     * Re-check balance immediately before
     * deduction.
     */

    let stillEnough = false;


    try {

        stillEnough =
            Boolean(
                window.hasEnoughBalance(
                    confirmationAmount
                )
            );

    } catch (balanceError) {

        console.error(
            "Final balance validation failed:",
            balanceError
        );


        showTradeMessage(
            "Balance Check Failed",
            "The available balance could not be verified. Please try again.",
            "error"
        );

        return;

    }


    if (!stillEnough) {

        showTradeMessage(
            "Insufficient Balance",
            "Your available balance is no longer enough to open this trade.",
            "warning"
        );

        return;

    }


    /*
     * Deduct balance ONLY after Continue.
     */

    let deducted = false;


    try {

        deducted =
            await window.subtractBalance(
                confirmationAmount
            );

    } catch (deductError) {

        console.error(
            "Balance deduction failed:",
            deductError
        );


        showTradeMessage(
            "Trade Could Not Be Opened",
            "We could not update your balance. Please try again.",
            "error"
        );

        return;

    }


    if (!deducted) {

        showTradeMessage(
            "Trade Could Not Be Opened",
            "We could not update your balance. Please try again.",
            "error"
        );

        return;

    }


    /*
     * Set FINAL active trade state.
     */

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


    /*
     * Clear pending state.
     */

    pendingTradeSide =
        null;


    pendingTradeEntryPrice =
        null;


    /*
     * Save active trade.
     */

    saveActiveTrade();


    /*
     * Update UI.
     */

    updateOpenTradeUI();


    /*
     * Close trade modal.
     */

    if (tradeModal) {

        tradeModal.style.display =
            "none";

    }


    /*
     * Refresh displayed balance.
     */

    if (
        typeof window.reloadBalance ===
        "function"
    ) {

        try {

            window.reloadBalance();

        } catch (error) {

            console.error(
                "reloadBalance failed:",
                error
            );

        }

    }


    if (
        typeof window.refreshBalance ===
        "function"
    ) {

        try {

            window.refreshBalance();

        } catch (error) {

            console.error(
                "refreshBalance failed:",
                error
            );

        }

    }


    /*
     * Show success popup.
     */

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
   CLOSE TRADE BUTTON
   ========================================================= */

const closeTradeBtn =
    document.getElementById(
        "closeTradeBtn"
    );


if (closeTradeBtn) {

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
   CLOSE CURRENT TRADE
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


        /* =================================================
           LOCAL HISTORY
           ================================================= */

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


        /* =================================================
           REFRESH BALANCE
           ================================================= */

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


        /* =================================================
           SAVE VALUES BEFORE CLEARING
           ================================================= */

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


        /* =================================================
           CLEAR ACTIVE TRADE
           ================================================= */

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


        /* =================================================
           CLOSE NOTIFICATION
           ================================================= */

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

