/* ===================================
   CPTMARKETS TRADE
   trade.js - PART 1
=================================== */

let price = 4269.29;
let selectedSide = null;
let entryPrice = null;
let tradeAmountValue = 0;

/* =========================
   BASIC ELEMENTS
========================= */

const livePrice = document.getElementById("livePrice");
const changeBox = document.getElementById("changeBox");

const longButton = document.querySelector(".long-btn");
const shortButton = document.querySelector(".short-btn");

const tradeModal = document.getElementById("tradeModal");

const modalSide = document.getElementById("modalSide");
const modalPrice = document.getElementById("modalPrice");

const confirmTradeBtn =
    document.getElementById("confirmTradeBtn");

const modalClose =
    document.getElementById("modalClose");

/* =========================
   LIVE PRICE
========================= */

setInterval(function () {

    const change = (Math.random() - 0.5) * 3;

    price += change;

    if (livePrice) {
        livePrice.innerText = price.toFixed(2);
    }

    const percent =
        ((change / price) * 100).toFixed(2);

    if (changeBox) {

        if (change >= 0) {

            changeBox.className = "change green";
            changeBox.innerText = "+" + percent + "%";

        } else {

            changeBox.className = "change red";
            changeBox.innerText = percent + "%";

        }
    }

}, 1000);


/* =========================
   TIMEFRAME BUTTONS
========================= */

document
    .querySelectorAll(".timeframe button")
    .forEach(function (btn) {

        btn.addEventListener("click", function () {

            document
                .querySelectorAll(".timeframe button")
                .forEach(function (b) {
                    b.classList.remove("active");
                });

            btn.classList.add("active");

        });

    });


/* =========================
   INDICATOR BUTTONS
========================= */

document
    .querySelectorAll(".indicator-bar button")
    .forEach(function (btn) {

        btn.addEventListener("click", function () {

            document
                .querySelectorAll(".indicator-bar button")
                .forEach(function (b) {
                    b.classList.remove("active");
                });

            btn.classList.add("active");

        });

    });


/* =========================
   LEVERAGE
========================= */

document
    .querySelectorAll(".leverage-grid button")
    .forEach(function (btn) {

        btn.addEventListener("click", function () {

            document
                .querySelectorAll(".leverage-grid button")
                .forEach(function (b) {
                    b.classList.remove("active");
                });

            btn.classList.add("active");

            const levValue =
                document.getElementById("levValue");

            if (levValue) {
                levValue.innerText = btn.innerText;
            }

        });

    });


/* =========================
   AMOUNT INPUT
========================= */

const amountInput =
    document.getElementById("amount");

if (amountInput) {

    amountInput.addEventListener("input", function () {

        const margin =
            parseFloat(amountInput.value) || 0;

        const marginValue =
            document.getElementById("marginValue");

        if (marginValue) {
            marginValue.innerText =
                "$" + margin.toFixed(2);
        }

    });

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

    longButton.addEventListener("click", function () {

        selectedSide = "LONG";

        entryPrice = price;

        if (modalSide) {
            modalSide.innerText = "LONG";
        }

        if (modalPrice) {
            modalPrice.innerText =
                entryPrice.toFixed(2);
        }

        if (tradeModal) {
            tradeModal.style.display = "flex";
        }

    });

}


/* =========================
   OPEN SHORT
========================= */

if (shortButton) {

    shortButton.addEventListener("click", function () {

        selectedSide = "SHORT";

        entryPrice = price;

        if (modalSide) {
            modalSide.innerText = "SHORT";
        }

        if (modalPrice) {
            modalPrice.innerText =
                entryPrice.toFixed(2);
        }

        if (tradeModal) {
            tradeModal.style.display = "flex";
        }

    });

}


/* =========================
   CLOSE MODAL
========================= */

if (modalClose) {

    modalClose.addEventListener("click", function () {

        if (tradeModal) {
            tradeModal.style.display = "none";
        }

    });

}


if (tradeModal) {

    tradeModal.addEventListener("click", function (event) {

        if (event.target === tradeModal) {

            tradeModal.style.display = "none";

        }

    });

}


/* =========================
   CONFIRM TRADE
========================= */

if (confirmTradeBtn) {

    confirmTradeBtn.addEventListener("click", function () {

        const orderAmountInput =
            document.getElementById("orderAmount");

        let orderAmount = 0;

        if (orderAmountInput) {

            orderAmount =
                parseFloat(orderAmountInput.value) || 0;

        }

        /* fallback */

        if (orderAmount <= 0 && amountInput) {

            orderAmount =
                parseFloat(amountInput.value) || 0;

        }


        if (orderAmount <= 0) {

            alert("Please enter a valid amount.");

            return;

        }


        if (!selectedSide || !entryPrice) {

            alert("Please select LONG or SHORT.");

            return;

        }


        tradeAmountValue = orderAmount;


        const openTradeCard =
            document.getElementById("openTradeCard");

        const positionSide =
            document.getElementById("positionSide");

        const entryPriceBox =
            document.getElementById("entryPrice");

        const currentTradePrice =
            document.getElementById("currentTradePrice");

        const tradeAmount =
            document.getElementById("tradeAmount");


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
            openTradeCard.style.display = "block";
        }


        if (tradeModal) {
            tradeModal.style.display = "none";
        }


        alert(
            selectedSide +
            " trade opened successfully."
        );

    });

}

/* ===================================
   CPTMARKETS TRADE
   trade.js - PART 2
=================================== */


/* =========================
   LIVE PROFIT / LOSS
========================= */

setInterval(function () {

    const currentTradePrice =
        document.getElementById("currentTradePrice");

    const tradeAmount =
        document.getElementById("tradeAmount");

    const profitLossBox =
        document.getElementById("tradePL");

    if (!currentTradePrice || !tradeAmount) {
        return;
    }

    if (!selectedSide || !entryPrice) {
        return;
    }


    const currentPrice = price;

    const amount =
        tradeAmountValue ||
        parseFloat(
            tradeAmount.innerText
                .replace("$", "")
        ) || 0;


    let profitLoss = 0;


    if (selectedSide === "LONG") {

        profitLoss =
            ((currentPrice - entryPrice) /
                entryPrice) * amount;

    }


    if (selectedSide === "SHORT") {

        profitLoss =
            ((entryPrice - currentPrice) /
                entryPrice) * amount;

    }


    currentTradePrice.innerText =
        currentPrice.toFixed(2);


    if (profitLossBox) {

        profitLossBox.innerText =
            "$" + profitLoss.toFixed(2);

    }

}, 1000);


/* =========================
   CLOSE TRADE
========================= */

const closeTradeBtn =
    document.getElementById("closeTradeBtn");


if (closeTradeBtn) {

    closeTradeBtn.addEventListener(
        "click",
        function () {

            if (!selectedSide || !entryPrice) {

                alert("No open trade.");

                return;

            }


            const closePrice = price;


            const amount =
                tradeAmountValue ||
                parseFloat(
                    document
                        .getElementById("tradeAmount")
                        ?.innerText
                        .replace("$", "")
                ) || 0;


            let finalProfitLoss = 0;


            if (selectedSide === "LONG") {

                finalProfitLoss =
                    ((closePrice - entryPrice) /
                        entryPrice) * amount;

            }


            if (selectedSide === "SHORT") {

                finalProfitLoss =
                    ((entryPrice - closePrice) /
                        entryPrice) * amount;

            }


            /* =========================
               CLOSED TRADE OBJECT
            ========================= */

            const closedTrade = {

                side: selectedSide,

                entryPrice:
                    Number(entryPrice.toFixed(2)),

                closePrice:
                    Number(closePrice.toFixed(2)),

                profitLoss:
                    Number(finalProfitLoss.toFixed(2)),

                amount:
                    Number(amount.toFixed(2)),

                time:
                    new Date().toLocaleString()

            };


            /* =========================
               SAVE HISTORY
            ========================= */

            let history =
                JSON.parse(
                    localStorage.getItem(
                        "cptTradeHistory"
                    )
                ) || [];


            history.unshift(closedTrade);


            localStorage.setItem(
                "cptTradeHistory",
                JSON.stringify(history)
            );


            /* =========================
               SHOW HISTORY
            ========================= */

            renderTradeHistory();


            /* =========================
               HIDE OPEN TRADE
            ========================= */

            const openTradeCard =
                document.getElementById(
                    "openTradeCard"
                );


            if (openTradeCard) {

                openTradeCard.style.display =
                    "none";

            }


            /* =========================
               MESSAGE
            ========================= */

            alert(
                selectedSide +
                " trade closed.\n\n" +

                "Close Price: $" +
                closePrice.toFixed(2) +

                "\nProfit/Loss: $" +
                finalProfitLoss.toFixed(2)
            );


            /* =========================
               RESET
            ========================= */

            selectedSide = null;

            entryPrice = null;

            tradeAmountValue = 0;

        }
    );

}


/* =========================
   TRADE HISTORY
========================= */

function renderTradeHistory() {

    const list =
        document.getElementById(
            "closedTradesList"
        );


    if (!list) {
        return;
    }


    let history =
        JSON.parse(
            localStorage.getItem(
                "cptTradeHistory"
            )
        ) || [];


    list.innerHTML = "";


    if (history.length === 0) {

        list.innerHTML =
            '<p id="noClosedTrades">No closed trades yet.</p>';

        return;

    }


    history.forEach(function (trade) {

        const card =
            document.createElement("div");


        card.className =
            "closed-trade-card";


        const profitClass =
            trade.profitLoss >= 0
                ? "profit"
                : "loss";


        card.innerHTML = `

            <div>
                <strong>${trade.side}</strong>
                <span>${trade.time}</span>
            </div>

            <div>
                <span>Entry</span>
                <strong>
                    $${trade.entryPrice.toFixed(2)}
                </strong>
            </div>

            <div>
                <span>Close</span>
                <strong>
                    $${trade.closePrice.toFixed(2)}
                </strong>
            </div>

            <div>
                <span>Amount</span>
                <strong>
                    $${trade.amount.toFixed(2)}
                </strong>
            </div>

            <div>
                <span>P/L</span>
                <strong class="${profitClass}">
                    $${trade.profitLoss.toFixed(2)}
                </strong>
            </div>

        `;


        list.appendChild(card);

    });

}


/* =========================
   LOAD HISTORY ON START
========================= */

renderTradeHistory();


/* =========================
   PAGE ERROR PROTECTION
========================= */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "Trade JS Error:",
            event.error || event.message
        );

    }
);
