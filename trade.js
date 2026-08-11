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
