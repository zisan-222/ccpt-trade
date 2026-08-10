/* =========================================
   COPY SQUARE
   copytrade.js
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const backBtn = document.getElementById("backBtn");

    const traderTab = document.getElementById("traderTab");
    const followsTab = document.getElementById("followsTab");

    const traderContent = document.getElementById("traderContent");
    const followsContent = document.getElementById("followsContent");


    /* =========================================
       BACK BUTTON
    ========================================= */

    if (backBtn) {
        backBtn.addEventListener("click", function () {
            window.location.href = "dashboard.html";
        });
    }


    /* =========================================
       TRADER TAB
    ========================================= */

    if (traderTab) {
        traderTab.addEventListener("click", function () {

            traderTab.classList.add("active");
            followsTab.classList.remove("active");

            traderContent.classList.add("active");
            followsContent.classList.remove("active");

        });
    }


    /* =========================================
       MY FOLLOWS TAB
    ========================================= */

    if (followsTab) {
        followsTab.addEventListener("click", function () {

            followsTab.classList.add("active");
            traderTab.classList.remove("active");

            followsContent.classList.add("active");
            traderContent.classList.remove("active");

        });
    }

});
