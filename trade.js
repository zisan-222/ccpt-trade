// ======================================
// CPTMARKETS DEMO TRADE
// trade.js (Part 1)
// ======================================

// Demo Balance
let balance = 10000;

// Chart
const ctx = document.getElementById("tradeChart").getContext("2d");

// Random Chart Data
let chartData = [
    100, 102, 101, 103, 104,
    102, 105, 107, 106, 108
];

const tradeChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [
            "", "", "", "", "",
            "", "", "", "", ""
        ],
        datasets: [{
            label: "XAU/USD",
            data: chartData,
            borderWidth: 3,
            tension: 0.4,
            fill: false
        }]
    },

    options: {

        responsive: true,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {

            x: {
                display: false
            },

            y: {
                display: false
            }

        }

    }

});

// Update Chart Every Second

setInterval(() => {

    chartData.shift();

    let last = chartData[chartData.length - 1];

    let next = last + (Math.random() * 4 - 2);

    chartData.push(next);

    tradeChart.update();

}, 1000);

// Update Balance Text

function updateBalance() {

    document.getElementById("demoBalance").innerText =
        "$" + balance.toFixed(2);

}

updateBalance();
// ======================================
// BUY / SELL TRADE SYSTEM
// trade.js (Part 2)
// ======================================

let trading = false;
let historyList = document.getElementById("historyList");

function startTrade(direction){

    if(trading){
        alert("A trade is already running.");
        return;
    }

    const amount = Number(document.getElementById("tradeAmount").value);
    const duration = Number(document.getElementById("tradeTime").value);

    if(amount <= 0){
        alert("Enter a valid amount.");
        return;
    }

    if(amount > balance){
        alert("Insufficient demo balance.");
        return;
    }

    trading = true;

    document.getElementById("direction").innerText = direction;
    document.getElementById("amount").innerText = "$" + amount;

    let timeLeft = duration;

    const timer = setInterval(() => {

        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;

        document.getElementById("countdown").innerText =
            String(min).padStart(2,"0") + ":" +
            String(sec).padStart(2,"0");

        timeLeft--;

        if(timeLeft < 0){

            clearInterval(timer);

            finishTrade(direction, amount);

        }

    },1000);

}

function finishTrade(direction, amount){

    const win = Math.random() > 0.5;

    let text = "";
    let cls = "";

    if(win){

        let profit = amount * 0.8;

        balance += profit;

        text = "WIN +$" + profit.toFixed(2);

        cls = "win";

    }else{

        balance -= amount;

        text = "LOSE -$" + amount.toFixed(2);

        cls = "lose";

    }

    updateBalance();

    document.getElementById("result").innerText = text;

    historyList.innerHTML =
        `<div class="history-item">
            <span>${direction}</span>
            <span>$${amount}</span>
            <span class="${cls}">${text}</span>
        </div>` + historyList.innerHTML;

    trading = false;

}

document.getElementById("buyBtn")
.addEventListener("click",function(){

    startTrade("BUY");

});

document.getElementById("sellBtn")
.addEventListener("click",function(){

    startTrade("SELL");

});
