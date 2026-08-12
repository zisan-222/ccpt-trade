/* ===================================
   CPTMARKETS TRADE
   trade.js - FIXED VERSION
=================================== */

let price = 4269.29;

let selectedSide = "";
let entryPrice = 0;


/* =========================
   DOM ELEMENTS
========================= */

const livePrice = document.getElementById("livePrice");
const changeBox = document.getElementById("changeBox");

const amount = document.getElementById("amount");

const longButton = document.querySelector(".long-btn");
const shortButton = document.querySelector(".short-btn");

const tradeModal = document.getElementById("tradeModal");

const modalTitle = document.getElementById("modalTitle");
const modalSide = document.getElementById("modalSide");
const modalPrice = document.getElementById("modalPrice");

const modalClose = document.getElementById("modalClose");

const confirmTradeBtn =
    document.getElementById("confirmTradeBtn");

const openTradeCard =
    document.getElementById("openTradeCard");

const closeTradeBtn =
    document.getElementById("closeTradeBtn");


/* =========================
   LIVE PRICE
========================= */

setInterval(() => {

    let change = (Math.random() - 0.5) * 3;

    price += change;

    if (livePrice) {
        livePrice.innerHTML = price.toFixed(2);
    }

    let percent =
        ((change / price) * 100).toFixed(2);

    if (changeBox) {

        if (change >= 0) {

            changeBox.className = "change green";
            changeBox.innerHTML =
                "+" + percent + "%";

        } else {

            changeBox.className = "change red";
            changeBox.innerHTML =
                percent + "%";

        }

    }

}, 1000);


/* =========================
   TIMEFRAME BUTTONS
========================= */

document
    .querySelectorAll(".timeframe button")
    .forEach(btn => {

        btn.onclick = () => {

            document
                .querySelectorAll(".timeframe button")
                .forEach(b =>
                    b.classList.remove("active")
                );

            btn.classList.add("active");

        };

    });


/* =========================
   INDICATOR BUTTONS
========================= */

document
    .querySelectorAll(".indicator-bar button")
    .forEach(btn => {

        btn.onclick = () => {

            document
                .querySelectorAll(".indicator-bar button")
                .forEach(b =>
                    b.classList.remove("active")
                );

            btn.classList.add("active");

        };

    });


/* =========================
   LEVERAGE BUTTONS
========================= */

document
    .querySelectorAll(".leverage-grid button")
    .forEach(btn => {

        btn.onclick = () => {

            document
                .querySelectorAll(".leverage-grid button")
                .forEach(b =>
                    b.classList.remove("active")
                );

            btn.classList.add("active");

            const levValue =
                document.getElementById("levValue");

            if (levValue) {
                levValue.innerHTML =
                    btn.innerHTML;
            }

        };

    });


/* =========================
   AMOUNT INPUT
========================= */

if (amount) {

    amount.oninput = function () {

        let margin =
            parseFloat(amount.value) || 0;

        const marginValue =
            document.getElementById("marginValue");

        if (marginValue) {

            marginValue.innerHTML =
                "$" + margin.toFixed(2);

        }

    };

}


/* =========================
   TRADINGVIEW
========================= */

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

        toolbar_bg: "#08162f",

        enable_publishing: false,

        hide_top_toolbar: true,

        hide_legend: true,

        save_image: false,

        container_id: "tvchart"

    });

}


/* =========================
   OPEN LONG
========================= */

if (longButton) {

    longButton.addEventListener(
        "click",
        function () {

            selectedSide = "LONG";

            entryPrice = price;

            if (modalTitle) {
                modalTitle.innerText =
                    "Open Long";
            }

            if (modalSide) {
                modalSide.innerText =
                    "LONG";
            }

            if (modalPrice) {
                modalPrice.innerText =
                    entryPrice.toFixed(2);
            }

            if (tradeModal) {
                tradeModal.style.display =
                    "flex";
            }

        }
    );

}


/* =========================
   OPEN SHORT
========================= */

if (shortButton) {

    shortButton.addEventListener(
        "click",
        function () {

            selectedSide = "SHORT";

            entryPrice = price;

            if (modalTitle) {
                modalTitle.innerText =
                    "Open Short";
            }

            if (modalSide) {
                modalSide.innerText =
                    "SHORT";
            }

            if (modalPrice) {
                modalPrice.innerText =
                    entryPrice.toFixed(2);
            }

            if (tradeModal) {
                tradeModal.style.display =
                    "flex";
            }

        }
    );

}


/* =========================
   CLOSE MODAL BUTTON
========================= */

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


/* =========================
   CLOSE MODAL OUTSIDE
========================= */

if (tradeModal) {

    tradeModal.addEventListener(
        "click",
        function (event) {

            if (event.target === tradeModal) {

                tradeModal.style.display =
                    "none";

            }

        }
    );

}


/* =========================
   CONFIRM TRADE
========================= */

if (confirmTradeBtn) {

    confirmTradeBtn.addEventListener(
        "click",
        function () {

            const orderAmountBox =
                document.getElementById("orderAmount");

            const orderAmount =
                orderAmountBox
                    ? parseFloat(orderAmountBox.value) || 0
                    : 0;


            if (!selectedSide) {

                alert(
                    "Please select LONG or SHORT."
                );

                return;

            }


            if (orderAmount <= 0) {

                alert(
                    "Please enter a valid amount."
                );

                return;

            }


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


            if (positionSide) {

                positionSide.innerText =
                    selectedSide;

            }


            if (entryPriceBox) {

                entryPriceBox.innerText =
                    entryPrice.toFixed(2);

            }


            if (currentTradePrice) {

                currentTradePrice.innerText =
                    price.toFixed(2);

            }


            if (tradeAmount) {

                tradeAmount.innerText =
                    "$" + orderAmount.toFixed(2);

            }


            if (openTradeCard) {

                openTradeCard.style.display =
                    "block";

            }


            if (tradeModal) {

                tradeModal.style.display =
                    "none";

            }


            alert(
                selectedSide +
                " trade opened successfully."
            );

        }
    );

}


/* =========================
   LIVE PROFIT / LOSS
========================= */

setInterval(function () {

    const currentPriceBox =
        document.getElementById(
            "currentTradePrice"
        );

    const tradeAmountBox =
        document.getElementById(
            "tradeAmount"
        );

    const profitLossBox =
        document.getElementById(
            "profitLoss"
        );


    if (
        !currentPriceBox ||
        !tradeAmountBox
    ) {

        return;

    }


    if (
        !selectedSide ||
        !entryPrice
    ) {

        return;

    }


    const currentPrice = price;


    const amount =
        parseFloat(
            tradeAmountBox.innerText
                .replace("$", "")
        ) || 0;


    let profitLoss = 0;


    if (selectedSide === "LONG") {

        profitLoss =
            (
                (currentPrice - entryPrice)
                / entryPrice
            ) * amount;

    }


    else if (selectedSide === "SHORT") {

        profitLoss =
            (
                (entryPrice - currentPrice)
                / entryPrice
            ) * amount;

    }


    currentPriceBox.innerText =
        currentPrice.toFixed(2);


    if (profitLossBox) {

        profitLossBox.innerText =
            "$" + profitLoss.toFixed(2);

    }

}, 1000);


/* =========================
   CLOSE TRADE
========================= */

if (closeTradeBtn) {

    closeTradeBtn.addEventListener(
        "click",
        function () {

            if (
                !selectedSide ||
                !entryPrice
            ) {

                alert(
                    "No open trade."
                );

                return;

            }


            const tradeAmountBox =
                document.getElementById(
                    "tradeAmount"
                );


            const amount =
                tradeAmountBox
                    ? parseFloat(
                        tradeAmountBox.innerText
                            .replace("$", "")
                    ) || 0
                    : 0;


            const closePrice = price;


            let finalProfitLoss = 0;


            if (selectedSide === "LONG") {

                finalProfitLoss =
                    (
                        (closePrice - entryPrice)
                        / entryPrice
                    ) * amount;

            }


            else if (selectedSide === "SHORT") {

                finalProfitLoss =
                    (
                        (entryPrice - closePrice)
                        / entryPrice
                    ) * amount;

            }


            const closedTrade = {

                side: selectedSide,

                entryPrice: entryPrice,

                closePrice: closePrice,

                profitLoss: finalProfitLoss,

                amount: amount,

                time: new Date()
                    .toLocaleString()

            };


            console.log(
                "Trade Closed:",
                closedTrade
            );


            alert(
                selectedSide +
                " trade closed.\n" +
                "Close Price: $" +
                closePrice.toFixed(2) +
                "\nProfit/Loss: $" +
                finalProfitLoss.toFixed(2)
            );


            if (openTradeCard) {

                openTradeCard.style.display =
                    "none";

            }


            selectedSide = "";

            entryPrice = 0;

        }
    );

}
