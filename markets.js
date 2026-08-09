/* ===================================
   CPTMARKETS
   markets.js
=================================== */


// ===============================
// MARKET CLICK TO TRADE PAGE
// ===============================


document.querySelectorAll(".market-item")
.forEach(item => {


    item.addEventListener("click", function(){


        let symbol = this.dataset.symbol;


        window.location.href =
        "trade.html?symbol=" + symbol;


    });


});




// ===============================
// CATEGORY BUTTON
// ===============================


const categoryButtons =
document.querySelectorAll(".category-box button");



categoryButtons.forEach(button=>{


    button.addEventListener("click",function(){


        categoryButtons.forEach(btn=>{

            btn.classList.remove("active");

        });


        this.classList.add("active");


    });


});




// ===============================
// SEARCH MARKET
// ===============================


const searchInput =
document.querySelector(".search-box input");



if(searchInput){


searchInput.addEventListener("input",function(){


    let value =
    this.value.toLowerCase();



    document.querySelectorAll(".market-item")
    .forEach(item=>{


        let text =
        item.innerText.toLowerCase();



        if(text.includes(value)){

            item.style.display="flex";

        }else{

            item.style.display="none";

        }


    });



});


}





// ===============================
// LIVE PRICE EFFECT
// ===============================


setInterval(()=>{


document.querySelectorAll(".price h3")
.forEach(price=>{


    let oldPrice =
    parseFloat(
    price.innerText.replace(",","")
    );


    if(!isNaN(oldPrice)){


        let change =
        (Math.random()-0.5)
        * 2;


        let newPrice =
        oldPrice + change;



        price.innerText =
        newPrice.toFixed(2);



    }



});


},3000);
