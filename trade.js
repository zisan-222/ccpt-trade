/* =========================================================
   CPTMARKETS TRADE POPUPS
   Professional Trade Confirmation System
   ========================================================= */


/* =========================================================
   POPUP ELEMENT
   ========================================================= */

let cptPopupOverlay = null;


/* =========================================================
   CREATE POPUP
   ========================================================= */

function createCptPopup() {

    if (document.getElementById("cptPopupOverlay")) {

        cptPopupOverlay =
            document.getElementById("cptPopupOverlay");

        return cptPopupOverlay;

    }


    const overlay =
        document.createElement("div");

    overlay.id =
        "cptPopupOverlay";

    overlay.className =
        "cpt-popup-overlay";


    overlay.innerHTML = `

        <div class="cpt-popup" role="dialog">

            <div class="cpt-popup-header">

                <div class="cpt-popup-icon">
                    <i class="fa-solid fa-chart-line"></i>
                </div>

                <div>

                    <h3
                        class="cpt-popup-title"
                        id="cptPopupTitle"
                    >
                        Trade Confirmation
                    </h3>

                    <p
                        class="cpt-popup-subtitle"
                        id="cptPopupSubtitle"
                    >
                        Please review your order
                    </p>

                </div>

            </div>


            <div
                class="cpt-popup-message"
                id="cptPopupMessage"
            >
                Please review the trade details before continuing.
            </div>


            <div
                class="cpt-popup-info"
                id="cptPopupInfo"
            ></div>


            <div
                class="cpt-popup-warning"
                id="cptPopupWarning"
            >

                <div class="cpt-popup-warning-icon">
                    <i class="fa-solid fa-circle-info"></i>
                </div>

                <div>
                    Please review the selected direction,
                    amount and current market price before
                    continuing with your trade.
                </div>

            </div>


            <div class="cpt-popup-actions">

                <button
                    type="button"
                    class="cpt-popup-btn secondary"
                    id="cptPopupCancel"
                >
                    Review Again
                </button>


                <button
                    type="button"
                    class="cpt-popup-btn primary"
                    id="cptPopupContinue"
                >
                    Continue
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    cptPopupOverlay =
        overlay;


    /* =====================================================
       CANCEL
       ===================================================== */

    const cancelButton =
        document.getElementById(
            "cptPopupCancel"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                closeCptPopup();

            }
        );

    }


    /* =====================================================
       BACKDROP CLICK
       ===================================================== */

    overlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                overlay
            ) {

                closeCptPopup();

            }

        }
    );


    return overlay;

}


/* =========================================================
   CLOSE POPUP
   ========================================================= */

function closeCptPopup() {

    if (!cptPopupOverlay) {

        return;

    }


    cptPopupOverlay.classList.remove(
        "show"
    );


    setTimeout(
        function () {

            if (cptPopupOverlay) {

                cptPopupOverlay.style.display =
                    "";

            }

        },
        250
    );

}


/* =========================================================
   GET CURRENT PRICE
   ========================================================= */

function getCurrentTradePrice() {

    const priceElement =
        document.getElementById(
            "livePrice"
        );


    if (!priceElement) {

        return 0;

    }


    const value =
        Number(
            priceElement.innerText
                .replace(/[^0-9.-]/g, "")
        );


    return Number.isFinite(value)
        ? value
        : 0;

}


/* =========================================================
   GET SELECTED AMOUNT
   ========================================================= */

function getSelectedTradeAmount() {

    const orderAmount =
        document.getElementById(
            "orderAmount"
        );


    const amount =
        document.getElementById(
            "amount"
        );


    let value = 0;


    if (
        orderAmount &&
        orderAmount.value
    ) {

        value =
            Number(
                orderAmount.value
            );

    }


    if (
        !value &&
        amount &&
        amount.value
    ) {

        value =
            Number(
                amount.value
            );

    }


    return Number.isFinite(value)
        ? value
        : 0;

}


/* =========================================================
   SHOW TRADE POPUP
   ========================================================= */

function showTradePopup(
    side
) {

    const overlay =
        createCptPopup();


    const title =
        document.getElementById(
            "cptPopupTitle"
        );


    const subtitle =
        document.getElementById(
            "cptPopupSubtitle"
        );


    const message =
        document.getElementById(
            "cptPopupMessage"
        );


    const info =
        document.getElementById(
            "cptPopupInfo"
        );


    const continueButton =
        document.getElementById(
            "cptPopupContinue"
        );


    const price =
        getCurrentTradePrice();


    const amount =
        getSelectedTradeAmount();


    const leverageButton =
        document.querySelector(
            ".leverage-grid button.active"
        );


    const leverage =
        leverageButton
            ? leverageButton.innerText.trim()
            : "100x";


    /* =====================================================
       TITLE
       ===================================================== */

    if (title) {

        title.innerText =
            side === "LONG"
                ? "Long Trade"
                : "Short Trade";

    }


    /* =====================================================
       SUBTITLE
       ===================================================== */

    if (subtitle) {

        subtitle.innerText =
            "Review your order details";

    }


    /* =====================================================
       MESSAGE
       ===================================================== */

    if (message) {

        message.innerText =
            side === "LONG"
                ? "You are preparing a Long order. Please review the current market information before continuing."
                : "You are preparing a Short order. Please review the current market information before continuing.";

    }


    /* =====================================================
       TRADE INFORMATION
       ===================================================== */

    if (info) {

        info.innerHTML = `

            <div class="cpt-popup-info-item">

                <span class="cpt-popup-info-label">
                    Direction
                </span>

                <strong class="cpt-popup-info-value">
                    ${side}
                </strong>

            </div>


            <div class="cpt-popup-info-item">

                <span class="cpt-popup-info-label">
                    Market Price
                </span>

                <strong class="cpt-popup-info-value">
                    $${price.toFixed(2)}
                </strong>

            </div>


            <div class="cpt-popup-info-item">

                <span class="cpt-popup-info-label">
                    Amount
                </span>

                <strong class="cpt-popup-info-value">
                    $${amount.toFixed(2)}
                </strong>

            </div>


            <div class="cpt-popup-info-item">

                <span class="cpt-popup-info-label">
                    Leverage
                </span>

                <strong class="cpt-popup-info-value">
                    ${leverage}
                </strong>

            </div>

        `;

    }


    /* =====================================================
       CONTINUE BUTTON
       ===================================================== */

    if (continueButton) {

        continueButton.innerText =
            "Continue";


        continueButton.className =
            "cpt-popup-btn " +
            (
                side === "LONG"
                    ? "long"
                    : "short"
            );


        continueButton.onclick =
            function () {

                closeCptPopup();


                /*
                 * Existing trade.js function.
                 *
                 * We call the original trading
                 * modal after the user reviews
                 * this popup.
                 */

                if (
                    typeof window.openTradeModal ===
                    "function"
                ) {

                    window.openTradeModal(
                        side
                    );

                    return;

                }


                /*
                 * Fallback:
                 * trigger the existing button
                 * if the function is not global.
                 */

                const originalButton =
                    side === "LONG"
                        ? document.querySelector(
                            ".long-btn, #longBtn, button.long"
                        )
                        : document.querySelector(
                            ".short-btn, #shortBtn, button.short"
                        );


                if (originalButton) {

                    originalButton.dataset
                        .popupApproved = "true";

                    originalButton.click();

                }

            };

    }


    /* =====================================================
       SHOW
       ===================================================== */

    overlay.style.display =
        "flex";


    requestAnimationFrame(
        function () {

            overlay.classList.add(
                "show"
            );

        }
    );

}


/* =========================================================
   CONNECT LONG / SHORT BUTTONS
   ========================================================= */

function connectTradeButtons() {

    const longButton =
        document.querySelector(
            ".long-btn, #longBtn, button.long"
        );


    const shortButton =
        document.querySelector(
            ".short-btn, #shortBtn, button.short"
        );


    /* =====================================================
       LONG
       ===================================================== */

    if (longButton) {

        longButton.addEventListener(
            "click",
            function (event) {

                /*
                 * Prevent the original trade.js
                 * click handler from opening its
                 * modal immediately.
                 */

                if (
                    longButton.dataset.popupApproved ===
                    "true"
                ) {

                    longButton.dataset.popupApproved =
                        "false";

                    return;

                }


                event.preventDefault();

                event.stopImmediatePropagation();


                showTradePopup(
                    "LONG"
                );

            },
            true
        );

    }


    /* =====================================================
       SHORT
       ===================================================== */

    if (shortButton) {

        shortButton.addEventListener(
            "click",
            function (event) {

                /*
                 * Allow the original button
                 * event after popup approval.
                 */

                if (
                    shortButton.dataset.popupApproved ===
                    "true"
                ) {

                    shortButton.dataset.popupApproved =
                        "false";

                    return;

                }


                event.preventDefault();

                event.stopImmediatePropagation();


                showTradePopup(
                    "SHORT"
                );

            },
            true
        );

    }

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeTradePopups() {

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                connectTradeButtons();

            }
        );

    } else {

        connectTradeButtons();

    }

}


/* =========================================================
   GLOBAL ACCESS
   ========================================================= */

window.showTradePopup =
    showTradePopup;


window.closeCptPopup =
    closeCptPopup;


/* =========================================================
   START
   ========================================================= */

initializeTradePopups();
