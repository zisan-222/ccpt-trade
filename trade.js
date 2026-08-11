/* ===================================
   CPTMARKETS TRADE
   trade.js - Part 1
=================================== */

let price = 4269.29;

const livePrice = document.getElementById("livePrice");
const changeBox = document.getElementById("changeBox");

setInterval(() => {

    let change = (Math.random() - 0.5) * 3;

    price += change;

    livePrice.innerHTML = price.toFixed(2);

    let percent = ((change / price) * 100).toFixed(2);

    if(change >= 0){

        changeBox.className = "change green";
        changeBox.innerHTML = "+" + percent + "%";

    }else{

        changeBox.className = "change red";
        changeBox.innerHTML = percent + "%";

    }

},1000);


document.querySelectorAll(".timeframe button").forEach(btn=>{

    btn.onclick=()=>{

        document
        .querySelectorAll(".timeframe button")
        .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

    }

});


document.querySelectorAll(".indicator-bar button").forEach(btn=>{

    btn.onclick=()=>{

        document
        .querySelectorAll(".indicator-bar button")
        .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

    }

});


document.querySelectorAll(".leverage-grid button").forEach(btn=>{

    btn.onclick=()=>{

        document
        .querySelectorAll(".leverage-grid button")
        .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        document.getElementById("levValue").innerHTML =
        btn.innerHTML;

    }

});


const amount=document.getElementById("amount");

amount.oninput=function(){

    let margin=parseFloat(amount.value)||0;

    document.getElementById("marginValue").innerHTML=
    "$"+margin.toFixed(2);

}


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

/* =========================
   LONG BUTTON
========================= */

if (longButton) {

    longButton.addEventListener("click", function () {

        modalTitle.innerHTML = "Open Long";

        modalPrice.innerHTML = price.toFixed(2);

        tradeModal.classList.add("show");

    });

}


/* =========================
   SHORT BUTTON
========================= */

if (shortButton) {

    shortButton.addEventListener("click", function () {

        modalTitle.innerHTML = "Open Short";

        modalPrice.innerHTML = price.toFixed(2);

        tradeModal.classList.add("show");

    });

}


/* =========================
   CLOSE BUTTON
========================= */

if (modalClose) {

    modalClose.addEventListener("click", function () {

        tradeModal.classList.remove("show");

    });

}


/* =========================
   CLOSE BY CLICKING OUTSIDE
========================= */

if (tradeModal) {

    tradeModal.addEventListener("click", function (event) {

        if (event.target === tradeModal) {

            tradeModal.classList.remove("show");

        }

    });

/* =========================
   STEP 7
   LONG / SHORT TRADE
========================= */

const longButton = document.querySelector(".long-btn");
const shortButton = document.querySelector(".short-btn");

const tradeModal = document.getElementById("tradeModal");

const modalSide = document.getElementById("modalSide");
const modalPrice = document.getElementById("modalPrice");

const confirmTradeBtn =
document.getElementById("confirmTradeBtn");


let selectedSide = "";
let entryPrice = 0;


/* LONG BUTTON */

if(longButton){

    longButton.addEventListener("click", function(){

        selectedSide = "LONG";

        entryPrice = price;

        if(modalSide){
            modalSide.innerText = "LONG";
        }

        if(modalPrice){
            modalPrice.innerText = entryPrice.toFixed(2);
        }

        if(tradeModal){
            tradeModal.style.display = "flex";
        }

    });

}


/* SHORT BUTTON */

if(shortButton){

    shortButton.addEventListener("click", function(){

        selectedSide = "SHORT";

        entryPrice = price;

        if(modalSide){
            modalSide.innerText = "SHORT";
        }

        if(modalPrice){
            modalPrice.innerText = entryPrice.toFixed(2);
        }

        if(tradeModal){
            tradeModal.style.display = "flex";
        }

    });

}


/* CONFIRM TRADE */

if(confirmTradeBtn){

    confirmTradeBtn.addEventListener("click", function(){

        const orderAmount =
        parseFloat(
            document.getElementById("orderAmount").value
        ) || 0;


        if(orderAmount <= 0){

            alert("Please enter a valid amount.");

            return;

        }


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


        if(positionSide){

            positionSide.innerText =
            selectedSide;

        }


        if(entryPriceBox){

            entryPriceBox.innerText =
            entryPrice.toFixed(2);

        }


        if(currentTradePrice){

            currentTradePrice.innerText =
            price.toFixed(2);

        }


        if(tradeAmount){

            tradeAmount.innerText =
            "$" + orderAmount.toFixed(2);

        }


        if(openTradeCard){

            openTradeCard.style.display =
            "block";

        }


        if(tradeModal){

            tradeModal.style.display =
            "none";

        }


        alert(
            selectedSide +
            " trade opened successfully."
        );

    });

}
