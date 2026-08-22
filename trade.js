/* ==========================================
   CPTMARKETS TRADE
   trade.js
   FINAL - TRADE + BALANCE + ADMIN PENDING P/L
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
   FIREBASE
========================================== */

let tradeAuth = null;
let tradeDB = null;
let tradeFirebaseUser = null;


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

const modalPrice =
    document.getElementById("modalPrice");

const modalTitle =
    document.getElementById("modalTitle");

const confirmTradeBtn =
    document.getElementById("confirmTradeBtn");

const modalClose =
    document.getElementById("modalClose");

const amountInput =
    document.getElementById("amount");


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


/* ==========================================
   CREATE TRADE ID
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
   SAVE ACTIVE TRADE
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

    localStorage.removeItem("selectedSide");
    localStorage.removeItem("entryPrice");
    localStorage.removeItem("tradeAmountValue");
    localStorage.removeItem("currentTradeId");
    localStorage.removeItem("currentTradePrice");
    localStorage.removeItem("tradeLeverage");
    localStorage.removeItem("currentTradeUID");

}


/* ==========================================
   GET STORED ACTIVE TRADE
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


/* ==========================================
   RESTORE ACTIVE TRADE
========================================== */

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


                    if (selectedSide) {

                        saveActiveTrade();

                    }

                }
            );

        }
    );


/* ==========================================
   AMOUNT INPUT
========================================== */

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
   TRADINGVIEW — FULL WIDTH / FULL MARKET
========================================== */

if (
    typeof TradingView !== "undefined" &&
    document.getElementById("tvchart")
) {

    new TradingView.widget({

        autosize: true,

        symbol: "OANDA:XAUUSD",

        interval: "1",

        timezone: "Etc/UTC",

        theme: "dark",

        style: "1",

        locale: "en",

        toolbar_bg: "#020507",

        enable_publishing: false,

        hide_top_toolbar: true,

        hide_legend: true,

        hide_side_toolbar: true,

        save_image: false,

        allow_symbol_change: false,

        withdateranges: false,

        details: false,

        hotlist: false,

        calendar: false,

        studies: [],

        container_id: "tvchart"

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


    if (
        orderAmount &&
        amountInput
    ) {

        orderAmount.value =
            amountInput.value || "";

    }


    if (tradeModal) {

        tradeModal.style.display =
            "flex";

    }

}


/* ==========================================
   CANCEL TRADE MODAL
========================================== */

function cancelTradeModal() {

    if (tradeModal) {

        tradeModal.style.display =
            "none";

    }

    selectedSide =
        null;

    entryPrice =
        null;

}


/* ==========================================
   CLOSE MODAL
========================================== */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        cancelTradeModal
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
   CONFIRM TRADE
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


    if (!tradeFirebaseUser) {

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


    currentTradeId =
        createTradeId();

    tradeAmountValue =
        Number(
            orderAmount.toFixed(2)
        );

    currentTradeUID =
        tradeFirebaseUser.uid;


    saveActiveTrade();

    updateOpenTradeUI();


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
                tradeAmountValue,

            leverage:
                selectedLeverage

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
   LIVE USER P/L
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


/* ==========================================
   CALCULATE USER P/L
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


    let profitLoss = 0;


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


    if (!tradeFirebaseUser) {

        alert(
            "User session not ready."
        );

        return;

    }


    if (!tradeDB) {

        alert(
            "Database is not ready."
        );

        return;

    }


    const closedSide =
        selectedSide;

    const closedTradeId =
        currentTradeId;

    const closePrice =
        Number(
            price
        );


    /*
     * USER MARKET P/L
     */

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


        let adminResult = null;


        /* ======================================
           READ ADMIN PENDING RESULT
        ====================================== */

        const userSnapshot =
            await firestore.getDoc(
                userRef
            );


        if (
            userSnapshot.exists()
        ) {

            const userData =
                userSnapshot.data();


            /*
             * NEW ADMIN SYSTEM
             */

            if (
                userData.pendingAdminTradeResult &&
                userData.pendingAdminTradeResult.status ===
                    "PENDING"
            ) {

                const pending =
                    userData.pendingAdminTradeResult;


                /*
                 * Make sure pending result
                 * belongs to this trade.
                 */

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


        /* ======================================
           ADMIN P/L
        ====================================== */

        const adminProfitLoss =
            adminResult
                ? Number(
                    adminResult.profitLoss || 0
                )
                : 0;


        /* ======================================
           FINAL P/L
           
           User market P/L
           +
           Admin assigned P/L
        ====================================== */

        const finalProfitLoss =
            Number(
                (
                    userProfitLoss +
                    adminProfitLoss
                ).toFixed(2)
            );


        /* ======================================
           RETURN MARGIN + FINAL P/L
        ====================================== */

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


        /* ======================================
           HISTORY DOCUMENT
        ====================================== */

        const historyRef =
            firestore.doc(
                firestore.collection(
                    tradeDB,
                    "tradeHistory"
                )
            );


        let finalBalance = 0;
        let oldBalance = 0;


        /* ======================================
           SINGLE TRANSACTION
        ====================================== */

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


                /*
                 * Current balance already has
                 * the trade margin deducted.
                 *
                 * Return:
                 *
                 * Margin + Final P/L
                 */

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


                /*
                 * REMOVE ADMIN PENDING RESULT
                 */

                if (adminResult) {

                    userUpdate.pendingAdminTradeResult =
                        firestore.deleteField();

                }


                /*
                 * Also remove old pending fields
                 * if they exist.
                 */

                userUpdate.pendingTradeProfitLoss =
                    firestore.deleteField();

                userUpdate.pendingTradeId =
                    firestore.deleteField();


                transaction.update(
                    userRef,
                    userUpdate
                );


                /* ==================================
                   SAVE TRADE HISTORY
                ================================== */

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


        /* ======================================
           LOCAL HISTORY
        ====================================== */

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


        /* ======================================
           REFRESH BALANCE
        ====================================== */

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


        /* ======================================
           HIDE TRADE CARD
        ====================================== */

        hideOpenTradeCard();


        /* ======================================
           RESET TRADE STATE
        ====================================== */

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


        /* ======================================
           CROSS PAGE NOTIFICATION
        ====================================== */

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


        /* ======================================
           SUCCESS POPUP
           
           IMPORTANT:
           Admin P/L line removed.
        ====================================== */

        alert(

            closedSide +
            " trade closed successfully.\n\n" +

            "Close Price: $" +
            closePrice.toFixed(2) +

            "\nUser P/L: " +
            (
                userProfitLoss >= 0
                    ? "+"
                    : ""
            ) +
            "$" +
            userProfitLoss.toFixed(2) +

            "\nFinal P/L: " +
            (
                finalProfitLoss >= 0
                    ? "+"
                    : ""
            ) +
            "$" +
            finalProfitLoss.toFixed(2)

        );


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


        alert(
            "Trade could not be closed.\n\n" +
            error.message
        );

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
   HISTORY COMPATIBILITY
========================================== */

function renderTradeHistory() {

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
