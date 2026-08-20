/* ==========================================
   CPTMARKETS TRADE
   trade.js
   FINAL TRADE + BALANCE + HISTORY SYSTEM
========================================== */


/* ==========================================
   TRADE STATE
========================================== */

let price = 4269.29;

let selectedSide = null;
let entryPrice = null;
let tradeAmountValue = 0;

let currentTradeId = null;
let currentTradeUID = null;

let selectedLeverage = 100;


/* ==========================================
   BASIC ELEMENTS
========================================== */

const livePrice =
    document.getElementById("livePrice");

const changeBox =
    document.getElementById("changeBox");

const longButton =
    document.querySelector(".long-btn");

const shortButton =
    document.querySelector(".short-btn");

const tradeModal =
    document.getElementById("tradeModal");

const modalSide =
    document.getElementById("modalSide");

const modalPrice =
    document.getElementById("modalPrice");

const modalTitle =
    document.getElementById("modalTitle");

const confirmTradeBtn =
    document.getElementById("confirmTradeBtn");

const modalClose =
    document.getElementById("modalClose");


/* ==========================================
   FIREBASE
========================================== */

let tradeAuth = null;
let tradeDB = null;
let tradeFirebaseUser = null;


/* ==========================================
   FIREBASE INITIALIZATION
========================================== */

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
            function (user) {

                tradeFirebaseUser =
                    user || null;

                currentTradeUID =
                    user
                        ? user.uid
                        : null;


                restoreActiveTrade();

            }
        );


    } catch (error) {

        console.error(
            "Trade Firebase initialization failed:",
            error
        );

    }

}


/* ==========================================
   UNIQUE TRADE ID
========================================== */

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


/* ==========================================
   ACTIVE TRADE STORAGE
========================================== */

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


/* ==========================================
   CLEAR ACTIVE TRADE
========================================== */

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


/* ==========================================
   GET ACTIVE TRADE
========================================== */

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
        !savedEntry ||
        !amount ||
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


/* ==========================================
   RESTORE ACTIVE TRADE
========================================== */

function restoreActiveTrade() {

    const stored =
        getStoredActiveTrade();


    if (!stored) {

        hideOpenTradeCard();

        return;

    }


    /*
     * If Firebase user exists,
     * verify the trade belongs to
     * this user.
     */

    if (
        currentTradeUID &&
        stored.uid &&
        stored.uid !== currentTradeUID
    ) {

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


    console.log(
        "Active trade restored:",
        stored
    );

}


/* ==========================================
   LIVE PRICE
========================================== */

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


        /*
         * Save current price while
         * a trade is open.
         */

        if (
            selectedSide &&
            entryPrice &&
            tradeAmountValue
        ) {

            localStorage.setItem(
                "currentTradePrice",
                String(price)
            );

        }

    },
    1000
);


/* ==========================================
   TIMEFRAME
========================================== */

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


/* ==========================================
   INDICATORS
========================================== */

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


/* ==========================================
   LEVERAGE
========================================== */

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

                }
            );

        }
    );


/* ==========================================
   AMOUNT INPUT
========================================== */

const amountInput =
    document.getElementById(
        "amount"
    );


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

        }
    );

}


/* ==========================================
   TRADINGVIEW
========================================== */

if (
    typeof TradingView !== "undefined" &&
    document.getElementById("tvchart")
) {

    new TradingView.widget({

        autosize:
            true,

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
            "#08162f",

        enable_publishing:
            false,

        hide_top_toolbar:
            true,

        hide_legend:
            true,

        save_image:
            false,

        container_id:
            "tvchart"

    });

}


/* ==========================================
   OPEN LONG
========================================== */

if (longButton) {

    longButton.addEventListener(
        "click",
        function () {

            openTradeModal(
                "LONG"
            );

        }
    );

}


/* ==========================================
   OPEN SHORT
========================================== */

if (shortButton) {

    shortButton.addEventListener(
        "click",
        function () {

            openTradeModal(
                "SHORT"
            );

        }
    );

}


/* ==========================================
   OPEN TRADE MODAL
========================================== */

function openTradeModal(
    side
) {

    /*
     * Do not allow a second trade
     * while another trade is active.
     */

    if (
        selectedSide &&
        entryPrice &&
        tradeAmountValue
    ) {

        alert(
            "You already have an open trade. Close it before opening another trade."
        );

        return;

    }


    selectedSide =
        side;


    entryPrice =
        price;


    if (modalSide) {

        modalSide.innerText =
            side;

    }


    if (modalTitle) {

        modalTitle.innerText =
            "Open " + side;

    }


    if (modalPrice) {

        modalPrice.innerText =
            entryPrice.toFixed(2);

    }


    const orderAmount =
        document.getElementById(
            "orderAmount"
        );


    if (orderAmount && amountInput) {

        orderAmount.value =
            amountInput.value || "";

    }


    if (tradeModal) {

        tradeModal.style.display =
            "flex";

    }

}


/* ==========================================
   CLOSE MODAL
========================================== */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        function () {

            if (tradeModal) {

                tradeModal.style.display =
                    "none";

            }

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

                tradeModal.style.display =
                    "none";

            }

        }
    );

}


/* ==========================================
   CONFIRM TRADE
========================================== */

if (confirmTradeBtn) {

    confirmTradeBtn.addEventListener(
        "click",
        async function () {

            await confirmTrade();

        }
    );

}


/* ==========================================
   CONFIRM TRADE FUNCTION
========================================== */

async function confirmTrade() {

    if (
        !selectedSide ||
        !entryPrice
    ) {

        alert(
            "Please select LONG or SHORT."
        );

        return;

    }


    /*
     * Firebase user is required.
     */

    if (
        !tradeFirebaseUser
    ) {

        alert(
            "Please login before opening a trade."
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


    /*
     * Fallback to main amount input.
     */

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

        alert(
            "Please enter a valid amount."
        );

        return;

    }


    /*
     * Balance API check.
     */

    if (
        typeof window.hasEnoughBalance !==
        "function" ||
        typeof window.subtractBalance !==
        "function"
    ) {

        alert(
            "Balance system is not ready. Please reload the page."
        );

        return;

    }


    /*
     * Check current balance.
     */

    if (
        !window.hasEnoughBalance(
            orderAmount
        )
    ) {

        alert(
            "Insufficient balance."
        );

        return;

    }


    /*
     * Deduct from Firebase.
     */

    const deducted =
        await window.subtractBalance(
            orderAmount
        );


    if (!deducted) {

        alert(
            "Unable to deduct balance. Please try again."
        );

        return;

    }


    /*
     * Create unique ID.
     */

    currentTradeId =
        createTradeId();


    tradeAmountValue =
        Number(
            orderAmount.toFixed(2)
        );


    currentTradeUID =
        tradeFirebaseUser.uid;


    /*
     * Save active trade.
     */

    saveActiveTrade();


    /*
     * Update UI.
     */

    updateOpenTradeUI();


    /*
     * Close modal.
     */

    if (tradeModal) {

        tradeModal.style.display =
            "none";

    }


    alert(
        selectedSide +
        " trade opened successfully."
    );


    console.log(
        "Trade opened:",
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
                tradeAmountValue

        }
    );

}


/* ==========================================
   OPEN TRADE UI
========================================== */

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


/* ==========================================
   HIDE OPEN TRADE
========================================== */

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


/* ==========================================
   LIVE PROFIT / LOSS
========================================== */

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


        let profitLoss =
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


/* ==========================================
   CALCULATE PROFIT / LOSS
========================================== */

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
        selectedSide === "LONG"
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
        selectedSide === "SHORT"
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


/* ==========================================
   CLOSE TRADE BUTTON
========================================== */

const closeTradeBtn =
    document.getElementById(
        "closeTradeBtn"
    );


if (closeTradeBtn) {

    closeTradeBtn.addEventListener(
        "click",
        async function () {

            await closeCurrentTrade();

        }
    );

}


/* ==========================================
   CLOSE CURRENT TRADE
========================================== */

async function closeCurrentTrade() {

    if (
        !selectedSide ||
        !entryPrice ||
        !tradeAmountValue ||
        !currentTradeId
    ) {

        alert(
            "No open trade."
        );

        return;

    }


    if (
        !tradeFirebaseUser
    ) {

        alert(
            "User session not ready."
        );

        return;

    }


    const closePrice =
        price;


    const finalProfitLoss =
        calculateProfitLoss(
            closePrice
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

        alert(
            "Invalid trade result."
        );

        return;

    }


    /*
     * First save the trade history.
     * If history fails, do NOT return
     * the balance yet.
     */

    const historySaved =
        await saveTradeHistory({

            tradeId:
                currentTradeId,

            uid:
                tradeFirebaseUser.uid,

            side:
                selectedSide,

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

            source:
                "USER"

        });


    if (!historySaved) {

        alert(
            "Trade history could not be saved. Balance was not returned. Please try again."
        );

        return;

    }


    /*
     * Return margin + profit/loss.
     */

    const balanceReturned =
        await window.addBalance(
            returnAmount
        );


    if (!balanceReturned) {

        alert(
            "Trade history was saved, but balance could not be returned. Please contact admin."
        );

        return;

    }


    /*
     * Hide trade.
     */

    hideOpenTradeCard();


    /*
     * Message.
     */

    alert(

        selectedSide +
        " trade closed successfully.\n\n" +

        "Close Price: $" +
        closePrice.toFixed(2) +

        "\nProfit/Loss: " +
        (
            finalProfitLoss >= 0
                ? "+"
                : ""
        ) +
        "$" +
        finalProfitLoss.toFixed(2)

    );


    /*
     * Reset state.
     */

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


    clearActiveTrade();


    console.log(
        "Trade closed successfully."
    );

}


/* ==========================================
   SAVE FIREBASE TRADE HISTORY
========================================== */

async function saveTradeHistory(
    trade
) {

    try {

        if (
            !tradeDB ||
            !tradeFirebaseUser
        ) {

            return false;

        }


        const firestore =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
            );


        /*
         * Check whether this trade was
         * already saved.
         */

        const existingQuery =
            firestore.query(

                firestore.collection(
                    tradeDB,
                    "tradeHistory"
                ),

                firestore.where(
                    "tradeId",
                    "==",
                    trade.tradeId
                )

            );


        const existingSnapshot =
            await firestore.getDocs(
                existingQuery
            );


        if (
            !existingSnapshot.empty
        ) {

            console.warn(
                "Trade already exists:",
                trade.tradeId
            );

            return true;

        }


        /*
         * Create history document.
         */

        await firestore.addDoc(

            firestore.collection(
                tradeDB,
                "tradeHistory"
            ),

            {

                tradeId:
                    trade.tradeId,

                uid:
                    trade.uid,

                userId:
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
                        .toLocaleString(),

                createdAt:
                    firestore.serverTimestamp()

            }

        );


        /*
         * Also save local history.
         */

        saveLocalTradeHistory(
            trade
        );


        return true;


    } catch (error) {

        console.error(
            "Trade history save failed:",
            error
        );


        return false;

    }

}


/* ==========================================
   LOCAL TRADE HISTORY
========================================== */

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


        /*
         * Prevent duplicate trade.
         */

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


/* ==========================================
   LOAD HISTORY FUNCTION
========================================== */

function renderTradeHistory() {

    /*
     * History is rendered by orders.html.
     * This function is intentionally kept
     * for compatibility with the old system.
     */

    return;

}


/* ==========================================
   START
========================================== */

initializeTradeFirebase();


/* ==========================================
   ERROR PROTECTION
========================================== */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "CptMarkets Trade JS Error:",
            event.error ||
            event.message
        );

    }
);


/* ==========================================
   END
========================================== */
