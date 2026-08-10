document.addEventListener("DOMContentLoaded", function () {

    const marketItems = document.querySelectorAll(".market-item[data-symbol]");

    marketItems.forEach(function (item) {

        item.style.cursor = "pointer";

        item.addEventListener("click", function () {

            const symbol = item.getAttribute("data-symbol");

            if (!symbol) return;

            window.location.href =
                "trade.html?symbol=" + encodeURIComponent(symbol);

        });

    });

});
