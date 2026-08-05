// ===============================
// CPTMarkets Dashboard Script
// ===============================

// Deposit Button
document.querySelector(".deposit").addEventListener("click", function () {
    alert("Deposit page will be added soon.");
});

// Withdraw Button
document.querySelectorAll(".action-buttons button")[1].addEventListener("click", function () {
    alert("Withdraw page will be added soon.");
});

// Transfer Button
document.querySelectorAll(".action-buttons button")[2].addEventListener("click", function () {
    alert("Transfer page will be added soon.");
});

// Menu Items
document.querySelectorAll(".menu-item").forEach(function(item){

    item.addEventListener("click", function(){

        const name = this.querySelector("span").innerText;

        alert(name + " page will be available soon.");

    });

});

// Bottom Navigation
document.querySelectorAll(".bottom-nav a").forEach(function(nav){

    nav.addEventListener("click", function(e){

        e.preventDefault();

        document.querySelectorAll(".bottom-nav a").forEach(function(x){
            x.classList.remove("active");
        });

        this.classList.add("active");

    });

});

// Eye Button
const eye = document.querySelector(".asset-top i");
const balance = document.querySelector(".asset-card h2");

let visible = true;

eye.addEventListener("click", function(){

    if(visible){

        balance.innerText = "******";
        eye.className = "fa-regular fa-eye-slash";
        visible = false;

    }else{

        balance.innerText = "$0.00";
        eye.className = "fa-regular fa-eye";
        visible = true;

    }

});
