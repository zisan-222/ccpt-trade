/* ==========================================
   CPTMARKETS TRADE V2
   trade.js Part 1/4
========================================== */

// Chart Container
const chartContainer = document.getElementById("tvChart");

// Create Chart
const chart = LightweightCharts.createChart(chartContainer, {

    width: chartContainer.clientWidth,

    height: 360,

    layout: {

        background: {
            color: "#0d1525"
        },

        textColor: "#ffffff"

    },

    grid: {

        vertLines: {
            color: "#1d2940"
        },

        horzLines: {
            color: "#1d2940"
        }

    },

    crosshair: {

        mode: LightweightCharts.CrosshairMode.Normal

    },

    rightPriceScale: {

        borderColor: "#2c3b56"

    },

    timeScale: {

        borderColor: "#2c3b56",

        timeVisible: true,

        secondsVisible: false

    }

});

// Candlestick Series
const candleSeries = chart.addCandlestickSeries({

    upColor: "#00c853",

    downColor: "#e53935",

    borderVisible: false,

    wickUpColor: "#00e676",

    wickDownColor: "#ff5252"

});

// Initial Demo Data
const candleData = [

    { time: 1, open: 3250, high: 3258, low: 3248, close: 3255 },

    { time: 2, open: 3255, high: 3260, low: 3252, close: 3258 },

    { time: 3, open: 3258, high: 3265, low: 3256, close: 3262 },

    { time: 4, open: 3262, high: 3266, low: 3258, close: 3260 },

    { time: 5, open: 3260, high: 3268, low: 3257, close: 3266 }

];

candleSeries.setData(candleData);

// Responsive
window.addEventListener("resize", () => {

    chart.applyOptions({

        width: chartContainer.clientWidth

    });

});
/* ==========================================
   CPTMARKETS TRADE V2
   trade.js Part 2/4
========================================== */

// Live Demo Market

let lastTime = 5;

let lastClose = 3266;

setInterval(() => {

    lastTime++;

    const open = lastClose;

    const close =
        open + (Math.random() - 0.5) * 8;

    const high =
        Math.max(open, close) + Math.random() * 3;

    const low =
        Math.min(open, close) - Math.random() * 3;

    lastClose = close;

    candleSeries.update({

        time: lastTime,

        open: Number(open.toFixed(2)),

        high: Number(high.toFixed(2)),

        low: Number(low.toFixed(2)),

        close: Number(close.toFixed(2))

    });

    // Update Price

    document.getElementById("livePrice").innerText =
        close.toFixed(2);

    const change =
        close - open;

    const priceChange =
        document.getElementById("priceChange");

    if(change >= 0){

        priceChange.innerHTML =
            "+" + change.toFixed(2);

        priceChange.style.color =
            "#00e676";

    }else{

        priceChange.innerHTML =
            change.toFixed(2);

        priceChange.style.color =
            "#ff5252";

    }

},1500);


// Enable Zoom & Scroll

chart.timeScale().fitContent();

chart.applyOptions({

    handleScroll:{

        mouseWheel:true,

        pressedMouseMove:true,

        horzTouchDrag:true,

        vertTouchDrag:true

    },

    handleScale:{

        mouseWheel:true,

        pinch:true,

        axisPressedMouseMove:true

    }

});


// Crosshair

chart.applyOptions({

    crosshair:{

        mode:

        LightweightCharts.CrosshairMode.Normal

    }

});

/* ==========================================
   CPTMARKETS TRADE V2
   trade.js Part 3/4
========================================== */

let tradeRunning = false;

let tradeTimer = null;

let entryPrice = 0;

function openTrade(type){

    if(tradeRunning){

        alert("A trade is already running.");

        return;

    }

    tradeRunning = true;

    entryPrice = Number(lastClose.toFixed(2));

    document.getElementById("direction").innerText = type;

    document.getElementById("entryPrice").innerText =
        entryPrice.toFixed(2);

    document.getElementById("currentPrice").innerText =
        entryPrice.toFixed(2);

    document.getElementById("tradeStatus").innerText =
        "Running";

    let seconds = 60;

    document.getElementById("countdown").innerText =
        "01:00";

    tradeTimer = setInterval(function(){

        seconds--;

        let m = Math.floor(seconds / 60);

        let s = seconds % 60;

        document.getElementById("countdown").innerText =
            String(m).padStart(2,"0") + ":" +
            String(s).padStart(2,"0");

        let current = Number(lastClose.toFixed(2));

        document.getElementById("currentPrice").innerText =
            current.toFixed(2);

        let pnl = current - entryPrice;

        if(type === "SHORT"){

            pnl = entryPrice - current;

        }

        const pnlBox =
            document.getElementById("profitLoss");

        pnlBox.innerText =
            "$" + pnl.toFixed(2);

        if(pnl >= 0){

            pnlBox.style.color = "#00e676";

        }else{

            pnlBox.style.color = "#ff5252";

        }

        if(seconds <= 0){

            clearInterval(tradeTimer);

            finishTrade(type,pnl);

        }

    },1000);

}

function finishTrade(type
/* ==========================================
   CPTMARKETS TRADE V2
   trade.js Part 3/4
========================================== */

let tradeRunning = false;

let tradeTimer = null;

let entryPrice = 0;

function openTrade(type){

    if(tradeRunning){

        alert("A trade is already running.");

        return;

    }

    tradeRunning = true;

    entryPrice = Number(lastClose.toFixed(2));

    document.getElementById("direction").innerText = type;

    document.getElementById("entryPrice").innerText =
        entryPrice.toFixed(2);

    document.getElementById("currentPrice").innerText =
        entryPrice.toFixed(2);

    document.getElementById("tradeStatus").innerText =
        "Running";

    let seconds = 60;

    document.getElementById("countdown").innerText =
        "01:00";

    tradeTimer = setInterval(function(){

        seconds--;

        let m = Math.floor(seconds / 60);

        let s = seconds % 60;

        document.getElementById("countdown").innerText =
            String(m).padStart(2,"0") + ":" +
            String(s).padStart(2,"0");

        let current = Number(lastClose.toFixed(2));

        document.getElementById("currentPrice").innerText =
            current.toFixed(2);

        let pnl = current - entryPrice;

        if(type === "SHORT"){

            pnl = entryPrice - current;

        }

        const pnlBox =
            document.getElementById("profitLoss");

        pnlBox.innerText =
            "$" + pnl.toFixed(2);

        if(pnl >= 0){

            pnlBox.style.color = "#00e676";

        }else{

            pnlBox.style.color = "#ff5252";

        }

        if(seconds <= 0){

            clearInterval(tradeTimer);

            finishTrade(type,pnl);

        }

    },1000);

}

function finishTrade(type,pnl){

    tradeRunning = false;

    document.getElementById("tradeStatus").innerText =
        pnl >= 0 ? "WIN" : "LOSE";

    addHistory(type,pnl);

}

document.getElementById("longBtn")
.addEventListener("click",function(){

    openTrade("LONG");

});

document.getElementById("shortBtn")
.addEventListener("click",function(){

    openTrade("SHORT");

});
/* ==========================================
   CPTMARKETS TRADE V2
   trade.js Part 4/4
========================================== */

// ==============================
// Trade History
// ==============================

function addHistory(direction, pnl){

    const historyList =
        document.getElementById("historyList");

    const empty =
        document.querySelector(".empty-history");

    if(empty){

        empty.remove();

    }

    const item =
        document.createElement("div");

    item.className =
        "history-item";

    const result =
        pnl >= 0 ? "WIN" : "LOSE";

    const cls =
        pnl >= 0 ? "win" : "lose";

    item.innerHTML = `

        <span>${direction}</span>

        <span>${entryPrice.toFixed(2)}</span>

        <span class="${cls}">

            ${result}

        </span>

    `;

    historyList.prepend(item);

}


// ==============================
// Leverage Button
// ==============================

document.querySelectorAll(".lev-btn")
.forEach(function(btn){

    btn.onclick = function(){

        document
        .
