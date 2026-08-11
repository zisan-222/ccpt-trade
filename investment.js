"use strict";

/* =========================================================
   INVESTMENT PAGE
   Wealth Fund + Mining Power + My Subscriptions
========================================================= */


/* =========================================================
   PRODUCT DATA
========================================================= */

const WEALTH_PRODUCTS = [
    {
        id: "wealth-1",
        name: "Wealth Fund",
        description: "Grow your funds with our wealth investment plan.",
        dailyIncome: 0.50,
        duration: 30,
        minimum: 10,
        icon: "fa-chart-line"
    },
    {
        id: "wealth-2",
        name: "Premium Wealth",
        description: "A higher return plan for long-term investors.",
        dailyIncome: 1.00,
        duration: 60,
        minimum: 50,
        icon: "fa-gem"
    }
];


const MINING_PRODUCTS = [
    {
        id: "mining-1",
        name: "Mining Power",
        description: "Get daily income through mining power.",
        dailyIncome: 0.75,
        duration: 30,
        minimum: 10,
        icon: "fa-bolt"
    },
    {
        id: "mining-2",
        name: "Premium Mining",
        description: "Advanced mining plan with higher daily income.",
        dailyIncome: 1.50,
        duration: 60,
        minimum: 50,
        icon: "fa-microchip"
    }
];


/* =========================================================
   STORAGE
========================================================= */

const SUBSCRIPTION_STORAGE_KEY =
    "cptmarkets_investment_subscriptions";


let subscriptions = [];


/* =========================================================
   CURRENT PRODUCT
========================================================= */

let selectedProduct = null;


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSubscriptions();

        setupTabs();

        setupBackButton();

        setupSubscribeControls();

        renderProducts(
            "wealthProducts",
            WEALTH_PRODUCTS
        );

        renderProducts(
            "miningProducts",
            MINING_PRODUCTS
        );

        renderSubscriptions();

    }
);


/* =========================================================
   LOAD SUBSCRIPTIONS
========================================================= */

function loadSubscriptions() {

    try {

        const saved =
            localStorage.getItem(
                SUBSCRIPTION_STORAGE_KEY
            );

        if (saved) {

            const parsed =
                JSON.parse(saved);

            if (Array.isArray(parsed)) {
                subscriptions = parsed;
            } else {
                subscriptions = [];
            }

        }

    } catch (error) {

        console.error(
            "Unable to load subscriptions:",
            error
        );

        subscriptions = [];
    }

}


/* =========================================================
   SAVE SUBSCRIPTIONS
========================================================= */

function saveSubscriptions() {

    try {

        localStorage.setItem(
            SUBSCRIPTION_STORAGE_KEY,
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
   TABS
========================================================= */

function setupTabs() {

    const tabs =
        document.querySelectorAll(
            ".investment-tab"
        );

    const contents =
        document.querySelectorAll(
            ".tab-content"
        );


    tabs.forEach(function (tab) {

        tab.addEventListener(
            "click",
            function () {

                const targetId =
                    tab.dataset.tab;


                /*
                 * Remove active
                 * from all tabs.
                 */

                tabs.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                 * Hide all content.
                 */

                contents.forEach(
                    function (content) {

                        content.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                 * Activate clicked tab.
                 */

                tab.classList.add(
                    "active"
                );


                const target =
                    document.getElementById(
                        targetId
                    );


                if (target) {

                    target.classList.add(
                        "active"
                    );

                }

            }
        );

    });

}


/* =========================================================
   BACK BUTTON
========================================================= */

function setupBackButton() {

    const backButton =
        document.getElementById(
            "backButton"
        );


    if (!backButton) {
        return;
    }


    backButton.addEventListener(
        "click",
        function () {

            if (
                window.history.length > 1
            ) {

                window.history.back();

            } else {

                window.location.href =
                    "dashboard.html";

            }

        }
    );

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(
    containerId,
    products
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    products.forEach(
        function (product) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";


            card.innerHTML = `

                <div class="product-icon">
                    <i class="fa-solid ${product.icon}"></i>
                </div>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-info">

                    <div class="product-info-row">

                        <span>
                            Daily Income
                        </span>

                        <strong class="product-income">
                            $${formatMoney(product.dailyIncome)}/day
                        </strong>

                    </div>

                    <div class="product-info-row">

                        <span>
                            Duration
                        </span>

                        <strong>
                            ${product.duration} days
                        </strong>

                    </div>

                    <div class="product-info-row">

                        <span>
                            Minimum
                        </span>

                        <strong>
                            $${formatMoney(product.minimum)}
                        </strong>

                    </div>

                </div>

                <button
                    type="button"
                    class="subscribe-button"
                    data-product-id="${product.id}"
                >
                    Subscribe
                </button>

            `;


            container.appendChild(card);

        }
    );


    /*
     * Subscribe buttons
     */

    const buttons =
        container.querySelectorAll(
            ".subscribe-button"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const productId =
                    button.dataset.productId;


                const product =
                    findProduct(productId);


                if (product) {

                    openSubscribeSheet(
                        product
                    );

                }

            }
        );

    });

}


/* =========================================================
   FIND PRODUCT
========================================================= */

function findProduct(productId) {

    const allProducts =
        WEALTH_PRODUCTS.concat(
            MINING_PRODUCTS
        );


    return allProducts.find(
        function (product) {

            return product.id === productId;

        }
    );

}


/* =========================================================
   SUBSCRIBE CONTROLS
========================================================= */

function setupSubscribeControls() {

    const closeButton =
        document.getElementById(
            "closeSubscribe"
        );


    const confirmButton =
        document.getElementById(
            "confirmSubscription"
        );


    const overlay =
        document.getElementById(
            "subscribeOverlay"
        );


    const amountInput =
        document.getElementById(
            "subscriptionAmount"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeSubscribeSheet
        );

    }


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            confirmSubscription
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === overlay
                ) {

                    closeSubscribeSheet();

                }

            }
        );

    }


    if (amountInput) {

        amountInput.addEventListener(
            "input",
            function () {

                clearAmountError();

            }
        );

    }


    /*
     * ESC key
     */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeSubscribeSheet();

            }

        }
    );

}


/* =========================================================
   OPEN SUBSCRIBE SHEET
========================================================= */

function openSubscribeSheet(product) {

    selectedProduct = product;


    const overlay =
        document.getElementById(
            "subscribeOverlay"
        );


    const name =
        document.getElementById(
            "subscribeProductName"
        );


    const description =
        document.getElementById(
            "subscribeProductDescription"
        );


    const dailyIncome =
        document.getElementById(
            "subscribeDailyIncome"
        );


    const duration =
        document.getElementById(
            "subscribeDuration"
        );


    const minimum =
        document.getElementById(
            "subscribeMinimum"
        );


    const icon =
        document.getElementById(
            "subscribeProductIcon"
        );


    const amount =
        document.getElementById(
            "subscriptionAmount"
        );


    if (name) {

        name.textContent =
            product.name;

    }


    if (description) {

        description.textContent =
            product.description;

    }


    if (dailyIncome) {

        dailyIncome.textContent =
            "$" +
            formatMoney(
                product.dailyIncome
            ) +
            "/day";

    }


    if (duration) {

        duration.textContent =
            product.duration +
            " days";

    }


    if (minimum) {

        minimum.textContent =
            "$" +
            formatMoney(
                product.minimum
            );

    }


    if (icon) {

        icon.innerHTML =
            `<i class="fa-solid ${product.icon}"></i>`;

    }


    if (amount) {

        amount.value = "";

        amount.min =
            product.minimum;

        amount.placeholder =
            formatMoney(
                product.minimum
            );

    }


    clearAmountError();


    if (overlay) {

        overlay.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }

}


/* =========================================================
   CLOSE SUBSCRIBE SHEET
========================================================= */

function closeSubscribeSheet() {

    const overlay =
        document.getElementById(
            "subscribeOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

        overlay.classList.remove(
            "show"
        );

    }


    document.body.style.overflow = "";


    selectedProduct = null;

}


/* =========================================================
   CONFIRM SUBSCRIPTION
========================================================= */

function confirmSubscription() {

    if (!selectedProduct) {

        return;

    }


    const amountInput =
        document.getElementById(
            "subscriptionAmount"
        );


    if (!amountInput) {
        return;
    }


    const amount =
        Number(
            amountInput.value
        );


    /*
     * Empty amount
     */

    if (
        !amountInput.value ||
        !Number.isFinite(amount)
    ) {

        showAmountError(
            "Please enter an amount."
        );

        return;

    }


    /*
     * Minimum amount
     */

    if (
        amount <
        selectedProduct.minimum
    ) {

        showAmountError(
            "Minimum amount is $" +
            formatMoney(
                selectedProduct.minimum
            ) +
            "."
        );

        return;

    }


    /*
     * Prevent invalid amount
     */

    if (amount <= 0) {

        showAmountError(
            "Please enter a valid amount."
        );

        return;

    }


    /*
     * Calculate daily income
     */

    const dailyIncome =
        amount *
        (
            selectedProduct.dailyIncome /
            selectedProduct.minimum
        );


    /*
     * Create subscription
     */

    const subscription = {

        id:
            Date.now().toString(),

        productId:
            selectedProduct.id,

        productName:
            selectedProduct.name,

        amount:
            Number(
                amount.toFixed(2)
            ),

        dailyIncome:
            Number(
                dailyIncome.toFixed(2)
            ),

        duration:
            selectedProduct.duration,

        createdAt:
            new Date().toISOString()

    };


    subscriptions.push(
        subscription
    );


    saveSubscriptions();


    renderSubscriptions();


    closeSubscribeSheet();


    showSuccessMessage(
        "Subscription successful"
    );

}


/* =========================================================
   RENDER SUBSCRIPTIONS
========================================================= */

function renderSubscriptions() {

    const container =
        document.getElementById(
            "subscriptionsContainer"
        );


    if (!container) {
        return;
    }


    /*
     * No subscriptions
     */

    if (
        subscriptions.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    <i class="fa-solid fa-chart-pie"></i>
                </div>

                <h3>
                    No subscriptions
                </h3>

                <p>
                    Your active subscriptions will appear here.
                </p>

            </div>

        `;

        return;

    }


    /*
     * Subscription cards
     */

    container.innerHTML = "";


    subscriptions.forEach(
        function (subscription) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";


            card.innerHTML = `

                <div class="product-icon">

                    <i class="fa-solid fa-circle-check"></i>

                </div>

                <h3>
                    ${escapeHTML(
                        subscription.productName
                    )}
                </h3>

                <p>
                    Active subscription
                </p>

                <div class="product-info">

                    <div class="product-info-row">

                        <span>
                            Amount
                        </span>

                        <strong>
                            $${formatMoney(
                                subscription.amount
                            )}
                        </strong>

                    </div>

                    <div class="product-info-row">

                        <span>
                            Daily Income
                        </span>

                        <strong class="product-income">
                            $${formatMoney(
                                subscription.dailyIncome
                            )}/day
                        </strong>

                    </div>

                    <div class="product-info-row">

                        <span>
                            Duration
                        </span>

                        <strong>
                            ${subscription.duration} days
                        </strong>

                    </div>

                </div>

            `;


            container.appendChild(card);

        }
    );

}


/* =========================================================
   AMOUNT ERROR
========================================================= */

function showAmountError(message) {

    const error =
        document.getElementById(
            "amountError"
        );


    if (!error) {
        return;
    }


    error.textContent =
        message;

}


/* =========================================================
   CLEAR AMOUNT ERROR
========================================================= */

function clearAmountError() {

    const error =
        document.getElementById(
            "amountError"
        );


    if (error) {

        error.textContent = "";

    }

}


/* =========================================================
   SUCCESS MESSAGE
========================================================= */

function showSuccessMessage(message) {

    const toast =
        document.getElementById(
            "successToast"
        );


    const toastText =
        document.getElementById(
            "successToastText"
        );


    if (!toast) {
        return;
    }


    if (toastText) {

        toastText.textContent =
            message;

    }


    toast.classList.add(
        "show"
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =========================================================
   MONEY FORMAT
========================================================= */

function formatMoney(value) {

    const number =
        Number(value);


    if (
        !Number.isFinite(number)
    ) {

        return "0.00";

    }


    return number.toFixed(2);

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
