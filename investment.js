/* =========================================================
   CptMarkets - Investment / Wealth / Mining
   investment.js
   ========================================================= */


/* =========================================================
   1. PAGE MODE
   ---------------------------------------------------------
   URL examples:

   investment.html?mode=wealth
   investment.html?mode=mining
   ========================================================= */

const urlParams = new URLSearchParams(window.location.search);

let currentMode = urlParams.get("mode") || "wealth";

if (currentMode !== "wealth" && currentMode !== "mining") {
    currentMode = "wealth";
}


/* =========================================================
   2. PRODUCT DATA
   ---------------------------------------------------------
   Frontend/demo data only.
   ========================================================= */

const wealthProducts = [
    {
        id: "ai-theme",
        name: "Artificial Intelligence Theme",
        category: "Wealth Fund",

        description:
            "A diversified theme focused on artificial intelligence and related technology markets.",

        dailyIncome: 2.88,
        minimum: 10,
        duration: 1,

        icon: "fa-solid fa-microchip",

        popular: true
    },

    {
        id: "gold-futures",
        name: "Gold futures",
        category: "Wealth Fund",

        description:
            "A gold-focused market product designed for users interested in the gold market.",

        dailyIncome: 31.68,
        minimum: 100,
        duration: 3,

        icon: "fa-solid fa-coins",

        popular: false
    }
];


/*
   Mining products.

   Currently kept empty to reproduce the
   "No products" state from the reference flow.

   When you have real mining products,
   add them here.
*/

const miningProducts = [];


/* =========================================================
   3. DOM ELEMENTS
   ========================================================= */

const pageTitle = document.getElementById("pageTitle");

const backButton = document.getElementById("backButton");

const tabs = document.querySelectorAll(".investment-tab");

const tabContents = document.querySelectorAll(".tab-content");

const wealthProductsContainer =
    document.getElementById("wealthProducts");

const miningProductsContainer =
    document.getElementById("miningProducts");

const subscriptionsContainer =
    document.getElementById("subscriptionsContainer");


/* Subscribe elements */

const subscribeOverlay =
    document.getElementById("subscribeOverlay");

const closeSubscribe =
    document.getElementById("closeSubscribe");

const subscribeProductIcon =
    document.getElementById("subscribeProductIcon");

const subscribeProductName =
    document.getElementById("subscribeProductName");

const subscribeProductDescription =
    document.getElementById("subscribeProductDescription");

const subscribeDailyIncome =
    document.getElementById("subscribeDailyIncome");

const subscribeDuration =
    document.getElementById("subscribeDuration");

const subscribeMinimum =
    document.getElementById("subscribeMinimum");

const subscriptionAmount =
    document.getElementById("subscriptionAmount");

const amountError =
    document.getElementById("amountError");

const confirmSubscription =
    document.getElementById("confirmSubscription");


/* Toast */

const successToast =
    document.getElementById("successToast");

const successToastText =
    document.getElementById("successToastText");


/* =========================================================
   4. CURRENT PRODUCT
   ========================================================= */

let selectedProduct = null;


/* =========================================================
   5. STORAGE
   ========================================================= */

const STORAGE_KEY = "cptmarkets_demo_subscriptions";


function getSubscriptions() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return [];
        }

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Unable to load subscriptions:",
            error
        );

        return [];
    }
}


function saveSubscriptions(subscriptions) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(subscriptions)
        );

    } catch (error) {

        console.error(
            "Unable to save subscriptions:",
            error
        );
    }
}


/* =========================================================
   6. INITIALIZE PAGE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializePage
);


function initializePage() {

    updatePageMode();

    renderWealthProducts();

    renderMiningProducts();

    renderSubscriptions();

    setupTabs();

    setupBackButton();

    setupSubscribeEvents();
}


/* =========================================================
   7. UPDATE PAGE MODE
   ========================================================= */

function updatePageMode() {

    if (currentMode === "mining") {

        pageTitle.textContent = "Mining";

        /*
           Start Mining page on Mining Power tab,
           because that is the relevant section.
        */

        activateTab("miningPower");

    } else {

        pageTitle.textContent = "Wealth";

        activateTab("wealthFund");
    }
}


/* =========================================================
   8. TABS
   ========================================================= */

function setupTabs() {

    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            function () {

                const targetTab =
                    this.dataset.tab;

                activateTab(targetTab);
            }
        );

    });
}


function activateTab(tabName) {

    tabs.forEach(tab => {

        const isActive =
            tab.dataset.tab === tabName;

        tab.classList.toggle(
            "active",
            isActive
        );
    });


    tabContents.forEach(content => {

        const isActive =
            content.id === tabName;

        content.classList.toggle(
            "active",
            isActive
        );
    });


    /*
       If the user opens Mining page,
       automatically show Mining Power.

       If the user opens Wealth page,
       automatically show Wealth Fund.
    */

    if (tabName === "wealthFund") {

        renderWealthProducts();

    }

    if (tabName === "miningPower") {

        renderMiningProducts();

    }

    if (tabName === "subscriptions") {

        renderSubscriptions();

    }
}


/* =========================================================
   9. WEALTH PRODUCTS
   ========================================================= */

function renderWealthProducts() {

    if (!wealthProductsContainer) {
        return;
    }


    if (wealthProducts.length === 0) {

        wealthProductsContainer.innerHTML =
            createEmptyState(
                "No products",
                "There are currently no wealth products available."
            );

        return;
    }


    wealthProductsContainer.innerHTML =
        wealthProducts
            .map(product => createProductCard(product))
            .join("");


    attachSubscribeButtons(
        wealthProductsContainer
    );
}


/* =========================================================
   10. MINING PRODUCTS
   ========================================================= */

function renderMiningProducts() {

    if (!miningProductsContainer) {
        return;
    }


    if (miningProducts.length === 0) {

        miningProductsContainer.innerHTML =
            createEmptyState(
                "No products",
                "There are currently no mining products available."
            );

        return;
    }


    miningProductsContainer.innerHTML =
        miningProducts
            .map(product => createProductCard(product))
            .join("");


    attachSubscribeButtons(
        miningProductsContainer
    );
}


/* =========================================================
   11. PRODUCT CARD
   ========================================================= */

function createProductCard(product) {

    const popularBadge = product.popular
        ? `
            <span class="popular-badge">
                Popular
            </span>
          `
        : "";


    return `
        <article
            class="product-card"
            data-product-id="${escapeHtml(product.id)}"
        >

            <div class="product-card-top">

                <div class="product-icon">
                    <i class="${escapeHtml(product.icon)}"></i>
                </div>

                <div class="product-heading">

                    ${popularBadge}

                    <h3>
                        ${escapeHtml(product.name)}
                    </h3>

                    <span class="product-category">
                        ${escapeHtml(product.category)}
                    </span>

                </div>

            </div>


            <div class="product-income">

                <strong>
                    ${formatCurrency(product.dailyIncome)}/day
                </strong>

                <span>
                    Daily income
                </span>

            </div>


            <p class="product-description">
                ${escapeHtml(product.description)}
            </p>


            <div class="product-footer">

                <div class="product-meta">

                    <span>
                        Min ${formatCurrency(product.minimum)}
                    </span>

                    <span>
                        ${product.duration} day${product.duration === 1 ? "" : "s"}
                    </span>

                </div>


                <button
                    type="button"
                    class="subscribe-button"
                    data-product-id="${escapeHtml(product.id)}"
                >
                    Subscribe
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   12. EMPTY STATE
   ========================================================= */

function createEmptyState(
    title,
    description
) {

    return `
        <div class="empty-state">

            <div class="empty-icon">
                <i class="fa-solid fa-chart-pie"></i>
            </div>

            <h3>
                ${escapeHtml(title)}
            </h3>

            <p>
                ${escapeHtml(description)}
            </p>

        </div>
    `;
}


/* =========================================================
   13. SUBSCRIBE BUTTONS
   ========================================================= */

function attachSubscribeButtons(container) {

    const buttons =
        container.querySelectorAll(
            ".subscribe-button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const productId =
                    this.dataset.productId;

                const product =
                    findProduct(productId);

                if (!product) {
                    return;
                }

                openSubscribeSheet(product);
            }
        );

    });
}


/* =========================================================
   14. FIND PRODUCT
   ========================================================= */

function findProduct(productId) {

    const allProducts = [
        ...wealthProducts,
        ...miningProducts
    ];

    return allProducts.find(
        product => product.id === productId
    );
}


/* =========================================================
   15. OPEN SUBSCRIBE SHEET
   ========================================================= */

function openSubscribeSheet(product) {

    selectedProduct = product;


    subscribeProductIcon.innerHTML =
        `<i class="${escapeHtml(product.icon)}"></i>`;


    subscribeProductName.textContent =
        product.name;


    subscribeProductDescription.textContent =
        product.description;


    subscribeDailyIncome.textContent =
        `${formatCurrency(product.dailyIncome)}/day`;


    subscribeDuration.textContent =
        `${product.duration} day${product.duration === 1 ? "" : "s"}`;


    subscribeMinimum.textContent =
        formatCurrency(product.minimum);


    subscriptionAmount.value = "";

    clearAmountError();


    subscribeOverlay.classList.add(
        "show"
    );


    document.body.classList.add(
        "modal-open"
    );


    /*
       Prevent background scrolling.
    */

    setTimeout(() => {

        subscriptionAmount.focus();

    }, 250);
}


/* =========================================================
   16. CLOSE SUBSCRIBE SHEET
   ========================================================= */

function closeSubscribeSheet() {

    subscribeOverlay.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "modal-open"
    );


    selectedProduct = null;

    subscriptionAmount.value = "";

    clearAmountError();
}


/* =========================================================
   17. SUBSCRIBE EVENTS
   ========================================================= */

function setupSubscribeEvents() {

    if (closeSubscribe) {

        closeSubscribe.addEventListener(
            "click",
            closeSubscribeSheet
        );
    }


    /*
       Click outside the bottom sheet.
    */

    if (subscribeOverlay) {

        subscribeOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    subscribeOverlay
                ) {

                    closeSubscribeSheet();
                }
            }
        );
    }


    /*
       Escape key.
    */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                subscribeOverlay.classList.contains("show")
            ) {

                closeSubscribeSheet();
            }
        }
    );


    /*
       Confirm button.
    */

    if (confirmSubscription) {

        confirmSubscription.addEventListener(
            "click",
            handleSubscription
        );
    }


    /*
       Validate while typing.
    */

    if (subscriptionAmount) {

        subscriptionAmount.addEventListener(
            "input",
            function () {

                clearAmountError();

                /*
                   Remove negative values.
                */

                if (
                    Number(this.value) < 0
                ) {

                    this.value = "";
                }
            }
        );
    }
}


/* =========================================================
   18. HANDLE SUBSCRIPTION
   ========================================================= */

function handleSubscription() {

    if (!selectedProduct) {
        return;
    }


    const amount =
        Number(subscriptionAmount.value);


    /*
       Empty amount.
    */

    if (
        !subscriptionAmount.value ||
        Number.isNaN(amount)
    ) {

        showAmountError(
            "Please enter an amount."
        );

        return;
    }


    /*
       Minimum amount.
    */

    if (
        amount <
        selectedProduct.minimum
    ) {

        showAmountError(
            `Minimum amount is ${formatCurrency(selectedProduct.minimum)}.`
        );

        return;
    }


    /*
       Limit excessive decimal precision.
    */

    const decimalPlaces =
        (subscriptionAmount.value.split(".")[1] || "").length;


    if (decimalPlaces > 2) {

        showAmountError(
            "Please enter a maximum of 2 decimal places."
        );

        return;
    }


    /*
       Create local/demo subscription.
    */

    const subscription = {

        id:
            "SUB-" +
            Date.now(),

        productId:
            selectedProduct.id,

        productName:
            selectedProduct.name,

        amount:
            Number(amount.toFixed(2)),

        dailyIncome:
            selectedProduct.dailyIncome,

        duration:
            selectedProduct.duration,

        createdAt:
            new Date().toISOString(),

        status:
            "active"
    };


    const subscriptions =
        getSubscriptions();


    subscriptions.unshift(
        subscription
    );


    saveSubscriptions(
        subscriptions
    );


    /*
       Close sheet.
    */

    closeSubscribeSheet();


    /*
       Refresh subscriptions.
    */

    renderSubscriptions();


    /*
       Show success notification.
    */

    showSuccessToast(
        "Subscription added successfully"
    );
}


/* =========================================================
   19. MY SUBSCRIPTIONS
   ========================================================= */

function renderSubscriptions() {

    if (!subscriptionsContainer) {
        return;
    }


    const subscriptions =
        getSubscriptions();


    if (subscriptions.length === 0) {

        subscriptionsContainer.innerHTML =
            createEmptyState(
                "No subscriptions",
                "Your active subscriptions will appear here."
            );

        return;
    }


    subscriptionsContainer.innerHTML =
        subscriptions
            .map(subscription =>
                createSubscriptionCard(subscription)
            )
            .join("");
}


/* =========================================================
   20. SUBSCRIPTION CARD
   ========================================================= */

function createSubscriptionCard(
    subscription
) {

    return `
        <article class="subscription-card">

            <div class="subscription-card-header">

                <div class="subscription-icon">
                    <i class="fa-solid fa-receipt"></i>
                </div>

                <div>

                    <h3>
                        ${escapeHtml(subscription.productName)}
                    </h3>

                    <span class="subscription-status">
                        ${escapeHtml(subscription.status)}
                    </span>

                </div>

            </div>


            <div class="subscription-details">

                <div class="subscription-detail">

                    <span>
                        Amount
                    </span>

                    <strong>
                        ${formatCurrency(subscription.amount)}
                    </strong>

                </div>


                <div class="subscription-detail">

                    <span>
                        Daily Income
                    </span>

                    <strong class="income-value">
                        ${formatCurrency(subscription.dailyIncome)}/day
                    </strong>

                </div>


                <div class="subscription-detail">

                    <span>
                        Duration
                    </span>

                    <strong>
                        ${subscription.duration}
                        day${subscription.duration === 1 ? "" : "s"}
                    </strong>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   21. SUCCESS TOAST
   ========================================================= */

let toastTimer = null;


function showSuccessToast(message) {

    if (!successToast) {
        return;
    }


    if (successToastText) {

        successToastText.textContent =
            message;
    }


    successToast.classList.add(
        "show"
    );


    if (toastTimer) {

        clearTimeout(toastTimer);
    }


    toastTimer =
        setTimeout(() => {

            successToast.classList.remove(
                "show"
            );

        }, 3000);
}


/* =========================================================
   22. AMOUNT ERROR
   ========================================================= */

function showAmountError(message) {

    if (!amountError) {
        return;
    }


    amountError.textContent =
        message;


    amountError.classList.add(
        "show"
    );


    subscriptionAmount.classList.add(
        "input-error"
    );
}


function clearAmountError() {

    if (!amountError) {
        return;
    }


    amountError.textContent =
        "";


    amountError.classList.remove(
        "show"
    );


    if (subscriptionAmount) {

        subscriptionAmount.classList.remove(
            "input-error"
        );
    }
}


/* =========================================================
   23. BACK BUTTON
   ========================================================= */

function setupBackButton() {

    if (!backButton) {
        return;
    }


    backButton.addEventListener(
        "click",
        function () {

            /*
               Return to Dashboard.
            */

            window.location.href =
                "dashboard.html";
        }
    );
}


/* =========================================================
   24. CURRENCY FORMAT
   ========================================================= */

function formatCurrency(value) {

    const number =
        Number(value);


    if (Number.isNaN(number)) {

        return "$0.00";
    }


    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(number);
}


/* =========================================================
   25. HTML ESCAPE
   ---------------------------------------------------------
   Helps prevent product text from being interpreted
   as HTML.
   ========================================================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
