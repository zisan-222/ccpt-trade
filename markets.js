document.addEventListener("DOMContentLoaded", function () {

    const categoryButtons = document.querySelectorAll(".category-box button");
    const marketItems = document.querySelectorAll(".market-list .market-item");
    const searchInput = document.querySelector(".search-box input");
    
    const notificationBtn = document.getElementById("notification-btn");
    const notificationModal = document.getElementById("notification-modal");
    const closeNotification = document.getElementById("close-notification");
    const settingsBtn = document.getElementById("settings-btn");

    // -----------------------------
    // NOTIFICATION MODAL LOGIC
    // -----------------------------
    if (notificationBtn && notificationModal) {
        notificationBtn.addEventListener("click", function () {
            notificationModal.style.display = "flex";
        });
    }

    if (closeNotification && notificationModal) {
        closeNotification.addEventListener("click", function () {
            notificationModal.style.display = "none";
        });
    }

    // Close modal on outside click
    window.addEventListener("click", function (e) {
        if (e.target === notificationModal) {
            notificationModal.style.display = "none";
        }
    });

    // -----------------------------
    // SETTINGS BUTTON LOGIC
    // -----------------------------
    if (settingsBtn) {
        settingsBtn.addEventListener("click", function () {
            // Settings পেজে রিডাইরেক্ট করবে (আপনার যদি settings.html থাকে)
            window.location.href = "settings.html";
        });
    }

    // -----------------------------
    // MARKET CATEGORY MAPPING
    // -----------------------------
    function getCategory(symbol) {
        symbol = symbol.toUpperCase();

        const crypto = ["BTCUSD", "ETHUSD", "BNBUSD", "XRPUSD", "SOLUSD", "ADAUSD", "DOGEUSD"];
        if (crypto.includes(symbol)) return "Crypto";

        if (symbol.includes("XAU") || symbol.includes("XAG") || symbol.includes("XPT") || symbol.includes("XPD")) {
            return "Metals";
        }

        const indices = ["US30", "US100", "US500", "NAS100", "SPX500", "GER40", "UK100", "JPN225"];
        if (indices.includes(symbol)) return "Indices";

        return "Forex";
    }

    // -----------------------------
    // SHOW / HIDE MARKETS
    // -----------------------------
    function filterMarkets(category) {
        marketItems.forEach(function (item) {
            const symbol = item.getAttribute("data-symbol") || "";
            const itemCategory = getCategory(symbol);

            if (category === "All" || itemCategory.toLowerCase() === category.toLowerCase()) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });

        // Active button style update
        categoryButtons.forEach(function (button) {
            if (button.textContent.trim().toLowerCase() === category.toLowerCase()) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
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
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }

    // -----------------------------
    // MARKET CARD CLICK (Navigation)
    // -----------------------------
    marketItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const symbol = item.getAttribute("data-symbol");
            if (!symbol) return;

            localStorage.setItem("selectedMarket", symbol);
            window.location.href = "trade.html?symbol=" + encodeURIComponent(symbol);
        });
    });

    // Default load
    filterMarkets("All");
});
