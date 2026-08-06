// ==========================================
// CPTMARKETS TRADE
// trade.js (Part 1)
// ==========================================

// Demo Balance
let balance = 10000;

// Live Price
let currentPrice = 3253.20;

// Elements
const priceText = document.getElementById("livePrice");
const priceChange = document.getElementById("priceChange");

// Chart
const ctx = document.getElementById("tradeChart").getContext("2d");

// Chart Data
let chartData = [
3250,
3251,
3252,
3253,
3252,
3254,
3255,
3254,
3256,
3255
];

// Create Chart

const tradeChart = new Chart(ctx, {

type: "line",

data: {

labels: ["","","","","","","","","",""],

datasets: [{

data: chartData,

borderColor: "#f5c84c",

borderWidth: 3,

pointRadius: 0,

fill: false,

tension: 0.35

}]

},

options: {

responsive: true,

maintainAspectRatio: false,

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

// Update Price

setInterval(() => {

let change = (Math.random() - 0.5) * 3;

currentPrice += change;

priceText.innerText = currentPrice.toFixed(2);

if(change >= 0){

priceChange.innerText = "+" + change.toFixed(2);

priceChange.className = "up";

}else{

priceChange.innerText = change.toFixed(2);

priceChange.className = "down";

}

chartData.shift();

chartData.push(currentPrice);

tradeChart.update();

},1000);

// ==========================================
// CPTMARKETS TRADE
// trade.js (Part 2)
// ==========================================

let trading = false;

const historyList = document.getElementById("historyList");

function startTrade(direction){

    if(trading){
        alert("A trade is already running.");
        return;
    }

    const amount = Number(document.getElementById("tradeAmount").value);
    const duration = Number(document.getElementById("tradeTime").value);

    if(amount < 10){
        alert("Minimum trade amount is $10");
        return;
    }

    trading = true;

    document.getElementById("direction").innerText = direction;
    document.getElementById("amount").innerText = "$" + amount.toFixed(2);

    let timeLeft = duration;

    const timer = setInterval(function(){

        const min = Math.floor(timeLeft / 60);
        const sec = timeLeft % 60;

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

    let resultText = "";
    let resultClass = "";

    if(win){

        const profit = amount * 0.80;

        balance += profit;

        resultText = "WIN +$" + profit.toFixed(2);

        resultClass = "win";

    }else{

        balance -= amount;

        resultText = "LOSE -$" + amount.toFixed(2);

        resultClass = "lose";

    }

    document.getElementById("result").innerText = resultText;

    const item = document.createElement("div");

    item.className = "history-item";

    item.innerHTML = `
        <span>${direction}</span>
        <span>$${amount.toFixed(2)}</span>
        <span class="${resultClass}">
            ${resultText}
        </span>
    `;

    if(document.querySelector(".empty-history")){
        document.querySelector(".empty-history").remove();
    }

    historyList.prepend(item);

    trading = false;

}

document.getElementById("buyBtn").addEventListener("click",function(){

    startTrade("BUY");

});

document.getElementById("sellBtn").addEventListener("click",function(){

    startTrade("SELL");

});
