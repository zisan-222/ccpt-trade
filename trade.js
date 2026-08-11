/* ===================================
   CPTMARKETS TRADE
   Demo Trading Engine
=================================== */


/* ==========================
   DEMO ACCOUNT
========================== */

let demoBalance = parseFloat(
    localStorage.getItem("demoBalance") || "1000"
);

let openTrade =
    JSON.parse(localStorage.getItem("openTrade") || "null");

let tradeHistory =
    JSON.parse(localStorage.getItem("tradeHistory") || "[]");


/* ==========================
   LIVE PRICE
========================== */

let price = 4269.29;

const livePrice = document.getElementById("livePrice");
const changeBox = document.getElementById("changeBox");


setInterval(() => {

    let change = (Math.random() - 0.5) * 3;

    price += change;

    livePrice.innerHTML = price.toFixed(2);

    let percent = ((change / price) * 100).toFixed(2);

    if (change >= 0) {

        changeBox.className = "change green";
        changeBox.innerHTML = "+" + percent + "%";

    } else {

        changeBox.className = "change red";
        changeBox.innerHTML = percent + "%";

    }

    updateOpenTrade();

}, 1000);


/* ==========================
   TIMEFRAME
========================== */

document.querySelectorAll(".timeframe button").forEach(btn => {

    btn.onclick = () => {

        document
            .querySelectorAll(".timeframe button")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

    };

});


/* ==========================
   INDICATORS
========================== */

document.querySelectorAll(".indicator-bar button").forEach(btn => {

    btn.onclick = () => {

        document
            .querySelectorAll(".indicator-bar button")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

    };

});


/* ==========================
   LEVERAGE
========================== */

let selectedLeverage = 100;

document.querySelectorAll(".leverage-grid button").forEach(btn => {

    btn.onclick = () => {

        document
            .querySelectorAll(".leverage-grid button")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        selectedLeverage =
            parseInt(btn.innerText.replace("x", ""));

        document.getElementById("levValue").innerHTML =
            selectedLeverage + "x";

        updateTradeCalculation();

    };

});


/* ==========================
   AMOUNT
========================== */

const amountInput =
    document.getElementById("amount");

amountInput.oninput = () => {

    updateTradeCalculation();

};


/* ==========================
   CALCULATE TRADE
========================== */

function updateTradeCalculation() {

    let margin =
        parseFloat(amountInput.value) || 0;

    let contractValue =
        margin * selectedLeverage;

    /*
       1 Lot = $500,000 Contract
       Your existing design:
       $100 × 100x = $10,000
       $10,000 / $500,000 = 0.02 Lot
    */

    let lots =
        contractValue / 500000;

    document.getElementById("marginValue").innerHTML =
        "$" + margin.toFixed(2);

    document.getElementById("lotsValue").innerHTML =
        lots.toFixed(2) + " Lot";

    let contractElement =
        document.querySelector(".summary div:nth-child(3) strong");

    if (contractElement) {

        contractElement.innerHTML =
            "$" + contractValue.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }

}


/* ==========================
   LONG / SHORT BUTTON
========================== */

const longButton =
    document.querySelector(".long-btn");

const shortButton =
    document.querySelector(".short-btn");


longButton.onclick = () => {

    openOrderConfirmation("LONG");

};


shortButton.onclick = () => {

    openOrderConfirmation("SHORT");

};


/* ==========================
   ORDER CONFIRMATION
========================== */

function openOrderConfirmation(side) {

    if (openTrade) {

        alert(
            "You already have an open trade. Please close it first."
        );

        return;

    }

    let margin =
        parseFloat(amountInput.value) || 0;

    if (margin <= 0) {

        alert("Please enter a valid amount.");

        return;

    }

    if (margin > demoBalance) {

        alert(
            "Insufficient demo balance.\n\n" +
            "Available: $" +
            demoBalance.toFixed(2)
        );

        return;

    }

    let tp =
        document.querySelectorAll(".tp-sl input")[0].value;

    let sl =
        document.querySelectorAll(".tp-sl input")[1].value;


    let contractValue =
        margin * selectedLeverage;

    let lots =
        contractValue / 500000;


    showOrderModal({

        side: side,

        margin: margin,

        leverage: selectedLeverage,

        lots: lots,

        price: price,

        tp: tp,

        sl: sl

    });

}


/* ==========================
   ORDER MODAL
========================== */

function showOrderModal(data) {

    const oldModal =
        document.getElementById("orderModal");

    if (oldModal) oldModal.remove();


    const modal =
        document.createElement("div");

    modal.id = "orderModal";

    modal.innerHTML = `

        <div class="order-overlay">

            <div class="order-box">

                <h2>
                    Confirm ${data.side}
                </h2>

                <div class="order-row">
                    <span>Pair</span>
                    <strong>XAUUSD</strong>
                </div>

                <div class="order-row">
                    <span>Side</span>
                    <strong class="${data.side === "LONG"
                        ? "long-text"
                        : "short-text"}">
                        ${data.side}
                    </strong>
                </div>

                <div class="order-row">
                    <span>Entry Price</span>
                    <strong>
                        ${data.price.toFixed(2)}
                    </strong>
                </div>

                <div class="order-row">
                    <span>Margin</span>
                    <strong>
                        $${data.margin.toFixed(2)}
                    </strong>
                </div>

                <div class="order-row">
                    <span>Leverage</span>
                    <strong>
                        ${data.leverage}x
                    </strong>
                </div>

                <div class="order-row">
                    <span>Lots</span>
                    <strong>
                        ${data.lots.toFixed(2)}
                    </strong>
                </div>

                <div class="order-actions">

                    <button id="cancelOrder">
                        Cancel
                    </button>

                    <button id="confirmOrder"
                        class="${data.side === "LONG"
                            ? "confirm-long"
                            : "confirm-short"}">
                        Confirm ${data.side}
                    </button>

                </div>

            </div>

        </div>

    `;

    document.body.appendChild(modal);


    document.getElementById("cancelOrder").onclick =
        () => modal.remove();


    document.getElementById("confirmOrder").onclick =
        () => {

            createTrade(data);

            modal.remove();

        };

}


/* ==========================
   CREATE TRADE
========================== */

function createTrade(data) {

    demoBalance -= data.margin;

    openTrade = {

        id: Date.now(),

        pair: "XAUUSD",

        side: data.side,

        entryPrice: data.price,

        margin: data.margin,

        leverage: data.leverage,

        lots: data.lots,

        tp: parseFloat(data.tp) || null,

        sl: parseFloat(data.sl) || null,

        openTime: new Date().toISOString()

    };


    saveData();

    renderTradePanel();

    alert(
        data.side +
        " trade opened successfully!"
    );

}


/* ==========================
   UPDATE OPEN TRADE
========================== */

function updateOpenTrade() {

    if (!openTrade) return;


    let priceDifference =
        price - openTrade.entryPrice;


    let pnl;


    /*
       Long:
       Price up = Profit
       Price down = Loss

       Short:
       Price down = Profit
       Price up = Loss
    */

    if (openTrade.side === "LONG") {

        pnl =
            (priceDifference /
                openTrade.entryPrice)
            * openTrade.margin
            * openTrade.leverage;

    } else {

        pnl =
            (-priceDifference /
                openTrade.entryPrice)
            * openTrade.margin
            * openTrade.leverage;

    }


    openTrade.currentPrice = price;

    openTrade.pnl = pnl;


    saveData();

    updateOpenTradeUI();

    checkTPSL();

}


/* ==========================
   TP / SL
========================== */

function checkTPSL() {

    if (!openTrade) return;


    if (openTrade.side === "LONG") {

        if (
            openTrade.tp &&
            price >= openTrade.tp
        ) {

            closeTrade("TP");

            return;

        }

        if (
            openTrade.sl &&
            price <= openTrade.sl
        ) {

            closeTrade("SL");

            return;

        }

    }


    if (openTrade.side === "SHORT") {

        if (
            openTrade.tp &&
            price <= openTrade.tp
        ) {

            closeTrade("TP");

            return;

        }

        if (
            openTrade.sl &&
            price >= openTrade.sl
        ) {

            closeTrade("SL");

        }

    }

}


/* ==========================
   OPEN TRADE UI
========================== */

function renderTradePanel() {

    let old =
        document.getElementById("openTradePanel");

    if (old) old.remove();


    if (!openTrade) return;


    const panel =
        document.createElement("section");

    panel.id =
        "openTradePanel";

    panel.innerHTML = `

        <div class="open-trade-card">

            <div class="open-trade-header">

                <div>

                    <span>OPEN POSITION</span>

                    <h2>
                        ${openTrade.pair}
                    </h2>

                </div>

                <strong class="${
                    openTrade.side === "LONG"
                    ? "long-text"
                    : "short-text"
                }">

                    ${openTrade.side}

                </strong>

            </div>


            <div class="open-trade-info">

                <div>
                    <span>Entry Price</span>
                    <strong>
                        ${openTrade.entryPrice.toFixed(2)}
                    </strong>
                </div>

                <div>
                    <span>Current Price</span>
                    <strong id="positionPrice">
                        ${price.toFixed(2)}
                    </strong>
                </div>

                <div>
                    <span>Margin</span>
                    <strong>
                        $${openTrade.margin.toFixed(2)}
                    </strong>
                </div>

                <div>
                    <span>Leverage</span>
                    <strong>
                        ${openTrade.leverage}x
                    </strong>
                </div>

            </div>


            <div class="position-pnl">

                <span>Profit / Loss</span>

                <strong id="positionPnl">
                    $0.00
                </strong>

            </div>


            <button
                class="close-position-btn"
                id="closePositionBtn">

                CLOSE TRADE

            </button>

        </div>

    `;


    const tradePanel =
        document.querySelector(".trade-panel");

    tradePanel.after(panel);


    document.getElementById(
        "closePositionBtn"
    ).onclick = () => {

        closeTrade("MANUAL");

    };


    updateOpenTradeUI();

}


/* ==========================
   UPDATE OPEN TRADE UI
========================== */

function updateOpenTradeUI() {

    if (!openTrade) return;


    const priceElement =
        document.getElementById("positionPrice");

    const pnlElement =
        document.getElementById("positionPnl");


    if (priceElement) {

        priceElement.innerHTML =
            price.toFixed(2);

    }


    if (pnlElement) {

        let pnl =
            openTrade.pnl || 0;

        pnlElement.innerHTML =
            (pnl >= 0 ? "+" : "") +
            "$" +
            pnl.toFixed(2);

        pnlElement.className =
            pnl >= 0
            ? "profit"
            : "loss";

    }

}


/* ==========================
   CLOSE TRADE
========================== */

function closeTrade(reason) {

    if (!openTrade) return;


    let finalPrice =
        price;


    let finalPnl =
        openTrade.pnl || 0;


    /*
       Return margin + P/L
    */

    demoBalance +=
        openTrade.margin + finalPnl;


    const historyTrade = {

        ...openTrade,

        closePrice: finalPrice,

        finalPnl: finalPnl,

        closeReason: reason,

        closeTime:
            new Date().toISOString()

    };


    tradeHistory.unshift(
        historyTrade
    );


    openTrade = null;


    saveData();


    const panel =
        document.getElementById(
            "openTradePanel"
        );

    if (panel) panel.remove();


    renderHistory();


    alert(

        "Trade Closed\n\n" +

        "P/L: " +

        (finalPnl >= 0 ? "+" : "") +

        "$" +

        finalPnl.toFixed(2)

    );

}


/* ==========================
   MY ORDERS / HISTORY
========================== */

function renderHistory() {

    let history =
        document.getElementById(
            "myOrdersPanel"
        );

    if (history) history.remove();


    const panel =
        document.createElement("section");

    panel.id =
        "myOrdersPanel";


    let html = `

        <div class="history-card">

            <div class="history-title">

                <h2>My Orders</h2>

                <span>
                    ${tradeHistory.length} Trades
                </span>

            </div>

    `;


    if (tradeHistory.length === 0) {

        html += `

            <div class="empty-history">

                No trade history yet.

            </div>

        `;

    }


    tradeHistory.forEach(trade => {

        let pnl =
            trade.finalPnl || 0;


        html += `

            <div class="history-item">

                <div class="history-top">

                    <div>

                        <strong>
                            ${trade.pair}
                        </strong>

                        <span class="${
                            trade.side === "LONG"
                            ? "long-text"
                            : "short-text"
                        }">

                            ${trade.side}

                        </span>

                    </div>

                    <strong class="${
                        pnl >= 0
                        ? "profit"
                        : "loss"
                    }">

                        ${pnl >= 0 ? "+" : ""}
                        $${pnl.toFixed(2)}

                    </strong>

                </div>


                <div class="history-details">

                    <span>
                        Entry:
                        ${trade.entryPrice.toFixed(2)}
                    </span>

                    <span>
                        Close:
                        ${trade.closePrice.toFixed(2)}
                    </span>

                    <span>
                        Margin:
                        $${trade.margin.toFixed(2)}
                    </span>

                    <span>
                        ${trade.leverage}x
                    </span>

                </div>


                <div class="history-date">

                    ${new Date(
                        trade.closeTime
                    ).toLocaleString()}

                </div>

            </div>

        `;

    });


    html += `</div>`;


    panel.innerHTML = html;


    const openPanel =
        document.getElementById(
            "openTradePanel"
        );


    if (openPanel) {

        openPanel.after(panel);

    } else {

        document
            .querySelector(".trade-panel")
            .after(panel);

    }

}


/* ==========================
   SAVE DATA
========================== */

function saveData() {

    localStorage.setItem(
        "demoBalance",
        demoBalance.toString()
    );

    localStorage.setItem(
        "openTrade",
        JSON.stringify(openTrade)
    );

    localStorage.setItem(
        "tradeHistory",
        JSON.stringify(tradeHistory)
    );

}


/* ==========================
   DEMO BALANCE UI
========================== */

function createBalanceDisplay() {

    const balance =
        document.createElement("div");

    balance.id =
        "demoBalanceDisplay";

    balance.innerHTML = `

        <div class="balance-card">

            <span>Demo Balance</span>

            <strong id="balanceValue">
                $${demoBalance.toFixed(2)}
            </strong>

        </div>

    `;


    document
        .querySelector(".trade-panel")
        .before(balance);

}


/* ==========================
   UPDATE BALANCE
========================== */

function updateBalanceDisplay() {

    const element =
        document.getElementById(
            "balanceValue"
        );

    if (element) {

        element.innerHTML =
            "$" +
            demoBalance.toFixed(2);

    }

}


/* ==========================
   BALANCE UPDATE LOOP
========================== */

setInterval(() => {

    updateBalanceDisplay();

}, 500);


/* ==========================
   INITIALIZE
========================== */

updateTradeCalculation();

createBalanceDisplay();

renderTradePanel();

renderHistory();


/* ==========================
   TRADINGVIEW CHART
========================== */

new TradingView.widget({

    "autosize": true,

    "symbol": "OANDA:XAUUSD",

    "interval": "1",

    "timezone": "Etc/UTC",

    "theme": "dark",

    "style": "1",

    "locale": "en",

    "toolbar_bg": "#08162f",

    "enable_publishing": false,

    "hide_top_toolbar": true,

    "hide_legend": true,

    "save_image": false,

    "container_id": "tvchart"

});
