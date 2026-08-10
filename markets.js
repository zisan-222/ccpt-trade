document.addEventListener("DOMContentLoaded", function () {

    const categoryButtons = document.querySelectorAll(".category-box button");
    const marketItems = document.querySelectorAll(".market-list .market-item");
    const searchInput = document.querySelector(".search-box input");

    // -----------------------------
    // MARKET CATEGORY
    // -----------------------------
    function getCategory(symbol) {

        symbol = symbol.toUpperCase();

        // CRYPTO
        const crypto = [
            "BTCUSD",
            "ETHUSD",
            "BNBUSD",
            "XRPUSD",
            "SOLUSD",
            "ADAUSD",
            "DOGEUSD"
        ];

        if (crypto.includes(symbol)) {
            return "Crypto";
        }

        // METALS
        if (
            symbol.includes("XAU") ||
            symbol.includes("XAG") ||
            symbol.includes("XPT") ||
            symbol.includes("XPD")
        ) {
            return "Metals";
        }

        // INDICES
        const indices = [
            "US30",
            "US100",
            "US500",
            "NAS100",
            "SPX500",
            "GER40",
            "UK100",
            "JPN225"
        ];

        if (indices.includes(symbol)) {
            return "Indices";
        }

        // DEFAULT = FOREX
        return "Forex";
    }


    // -----------------------------
    // SHOW / HIDE MARKETS
    // -----------------------------
    function filterMarkets(category) {

        marketItems.forEach(function (item) {

            const symbol = item.getAttribute("data-symbol") || "";
            const itemCategory = getCategory(symbol);

            if (category === "All" || itemCategory === category) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }

        });

        // Active button
        categoryButtons.forEach(function (button) {
            button.classList.remove("active");
        });

        categoryButtons.forEach(function (button) {

            const text = button.textContent.trim();

            if (text.toLowerCase() === category.toLowerCase()) {
                button.classList.add("active");
            }

        });

        // If no market exists
        let visibleCount = 0;

        marketItems.forEach(function (item) {
            if (item.style.display !== "none") {
                visibleCount++;
            }
        });

        let emptyMessage = document.getElementById("market-empty-message");

        if (visibleCount === 0) {

            if (!emptyMessage) {

                emptyMessage = document.createElement("div");

                emptyMessage.id = "market-empty-message";

                emptyMessage.innerHTML = `
                    <div style="
                        text-align:center;
                        padding:35px 20px;
                        margin:20px 0;
                        border-radius:18px;
                        background:#1b1b1b;
                        border:1px solid #303030;
                    ">
                        <div style="
                            font-size:38px;
                            margin-bottom:10px;
                        ">📊</div>

                        <div style="
                            font-size:18px;
                            font-weight:600;
                            color:#ffffff;
                            margin-bottom:6px;
                        ">
                            No ${category} Markets
                        </div>

                        <div style="
                            font-size:14px;
                            color:#999;
                        ">
                            This category currently has no available markets.
                        </div>
                    </div>
                `;

                document.querySelector(".market-list").appendChild(emptyMessage);
            }

            emptyMessage.style.display = "block";

        } else {

            if (emptyMessage) {
                emptyMessage.style.display = "none";
            }

        }
    }


    // -----------------------------
    // CATEGORY BUTTON CLICK
    // -----------------------------
    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const category = button.textContent.trim();

            filterMarkets(category);

        });

    });


    // -----------------------------
    // SEARCH MARKET
    // -----------------------------
    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchText = searchInput.value.toLowerCase().trim();

            marketItems.forEach(function (item) {

                const text = item.textContent.toLowerCase();

                if (text.includes(searchText)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }

            });

        });

    }


    // -----------------------------
    // MARKET CARD CLICK
    // -----------------------------
    marketItems.forEach(function (item) {

        item.style.cursor = "pointer";

        item.addEventListener("click", function () {

            const symbol = item.getAttribute("data-symbol");

            if (!symbol) return;

            // Save selected market
            localStorage.setItem("selectedMarket", symbol);

            // Open Trade page
            window.location.href =
                "trade.html?symbol=" + encodeURIComponent(symbol);

        });

    });


    // -----------------------------
    // DEFAULT
    // -----------------------------
    filterMarkets("All");

});
