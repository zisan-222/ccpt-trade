/* ===================================
   CPTMARKETS TRADE
   trade.js - Part 1
=================================== */

// Demo Live Price
let currentPrice = 4269.29;

const priceElement = document.getElementById("livePrice");
const changeElement = document.getElementById("priceChange");

// Demo price update
setInterval(() => {

    let change = (Math.random() * 2 - 1) * 0.80;

    currentPrice += change;

    priceElement.textContent = currentPrice.toFixed(2);

    let percent = ((change / currentPrice) * 100).toFixed(2);

    if (change >= 0) {

        changeElement.textContent = "+" + percent + "%";
        changeElement.classList.remove("down");
        changeElement.classList.add("up");

    } else {

        changeElement.textContent = percent + "%";
        changeElement.classList.remove("up");
        changeElement.classList.add("down");

    }

}, 1000);


// Timeframe Button
document.querySelectorAll(".timeframe button").forEach(btn => {

    btn.addEventListener("click", () => {

        document
            .querySelectorAll(".timeframe button")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

    });

});


// Leverage Button
document.querySelectorAll(".leverage-grid button").forEach(btn => {

    btn.addEventListener("click", () => {

        document
            .querySelectorAll(".leverage-grid button")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        document.getElementById("showLeverage").textContent =
            btn.textContent;

    });

});

/* ===================================
   CANDLE CHART
=================================== */

const chartContainer = document.getElementById("tradeChart");

if (chartContainer && window.LightweightCharts) {

    const chart = LightweightCharts.createChart(chartContainer, {

        width: chartContainer.clientWidth,
        height: 340,

        layout: {
            background: { color: "#08111f" },
            textColor: "#cfcfcf"
        },

        grid: {
            vertLines: { color: "#1f2d4d" },
            horzLines: { color: "#1f2d4d" }
        },

        rightPriceScale: {
            borderColor: "#334155"
        },

        timeScale: {
            borderColor: "#334155",
            timeVisible: true
        }

    });

    const candleSeries = chart.addCandlestickSeries({

        upColor: "#00d26a",
        downColor: "#ff4d4f",

        borderUpColor: "#00d26a",
        borderDownColor: "#ff4d4f",

        wickUpColor: "#00d26a",
        wickDownColor: "#ff4d4f"

    });

    candleSeries.setData([

        { time: 1, open: 4252, high: 4260, low: 4248, close: 4258 },
        { time: 2, open: 4258, high: 4268, low: 4255, close: 4265 },
        { time: 3, open: 4265, high: 4272, low: 4261, close: 4268 },
        { time: 4, open: 4268, high: 4276, low: 4264, close: 4271 },
        { time: 5, open: 4271, high: 4278, low: 4267, close: 4269 },
        { time: 6, open: 4269, high: 4275, low: 4262, close: 4264 }

    ]);

    window.addEventListener("resize", () => {

        chart.applyOptions({
            width: chartContainer.clientWidth
        });

    });

}
