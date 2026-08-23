/* =========================================================
   CPTMARKETS
   PROFESSIONAL TRADE POPUPS
   ========================================================= */


/* =========================================================
   CREATE POPUP CONTAINER
   ========================================================= */

function createCptPopup() {

    if (
        document.getElementById(
            "cptTradePopup"
        )
    ) {

        return;

    }


    const popup =
        document.createElement("div");

    popup.id =
        "cptTradePopup";

    popup.className =
        "cpt-popup-overlay";


    popup.innerHTML = `

        <div class="cpt-popup">

            <div class="cpt-popup-header">

                <h3
                    class="cpt-popup-brand"
                >
                    CPT MARKETS
                </h3>

                <button
                    type="button"
                    class="cpt-popup-close"
                    id="cptPopupClose"
                    aria-label="Close"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>

            </div>


            <div
                class="cpt-popup-content"
                id="cptPopupContent"
            >
            </div>

        </div>

    `;


    document.body.appendChild(
        popup
    );


    const closeButton =
        document.getElementById(
            "cptPopupClose"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                closeCptPopup();

            }
        );

    }


    popup.addEventListener(
        "click",
        function (event) {

            if (
                event.target === popup
            ) {

                closeCptPopup();

            }

        }
    );

}


/* =========================================================
   OPEN POPUP
   ========================================================= */

function openCptPopup(
    content
) {

    createCptPopup();


    const popup =
        document.getElementById(
            "cptTradePopup"
        );


    const contentBox =
        document.getElementById(
            "cptPopupContent"
        );


    if (
        !popup ||
        !contentBox
    ) {

        return;

    }


    contentBox.innerHTML =
        content;


    popup.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE POPUP
   ========================================================= */

function closeCptPopup() {

    const popup =
        document.getElementById(
            "cptTradePopup"
        );


    if (!popup) {

        return;

    }


    popup.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   FORMAT MONEY
   ========================================================= */

function cptFormatMoney(
    value
) {

    const number =
        Number(value) || 0;


    return (
        "$" +
        number.toFixed(2)
    );

}


/* =========================================================
   OPEN TRADE CONFIRMATION
   ========================================================= */

function showTradeConfirmationPopup(
    side,
    entryPrice,
    amount,
    leverage,
    onConfirm
) {

    const sideUpper =
        String(side)
            .toUpperCase();


    const isLong =
        sideUpper === "LONG";


    const iconClass =
        isLong
            ? "long"
            : "short";


    const icon =
        isLong
            ? "fa-arrow-trend-up"
            : "fa-arrow-trend-down";


    const valueClass =
        isLong
            ? "long"
            : "short";


    openCptPopup(`

        <div class="
            cpt-popup-icon
            ${iconClass}
        ">

            <i
                class="fa-solid ${icon}"
            ></i>

        </div>


        <h2
            class="cpt-popup-title"
        >
            Open ${sideUpper} Position
        </h2>


        <p
            class="cpt-popup-description"
        >
            Confirm your ${sideUpper}
            trade details and proceed.
        </p>


        <div
            class="cpt-trade-details"
        >

            <div
                class="cpt-trade-detail"
            >

                <span
                    class="cpt-trade-detail-label"
                >
                    Position
                </span>

                <span
                    class="
                        cpt-trade-detail-value
                        ${valueClass}
                    "
                >
                    ${sideUpper}
                </span>

            </div>


            <div
                class="cpt-trade-detail"
            >

                <span
                    class="cpt-trade-detail-label"
                >
                    Entry Price
                </span>

                <span
                    class="
                        cpt-trade-detail-value
                    "
                >
                    ${cptFormatMoney(entryPrice)}
                </span>

            </div>


            <div
                class="cpt-trade-detail"
            >

                <span
                    class="cpt-trade-detail-label"
                >
                    Amount
                </span>

                <span
                    class="
                        cpt-trade-detail-value
                    "
                >
                    ${cptFormatMoney(amount)}
                </span>

            </div>


            <div
                class="cpt-trade-detail"
            >

                <span
                    class="cpt-trade-detail-label"
                >
                    Leverage
                </span>

                <span
                    class="
                        cpt-trade-detail-value
                    "
                >
                    ${Number(leverage) || 0}x
                </span>

            </div>

        </div>


        <div
            class="cpt-popup-actions"
        >

            <button
                type="button"
                class="
                    cpt-popup-btn
                    cancel
                "
                id="cptCancelTrade"
            >
                Cancel
            </button>


            <button
                type="button"
                class="
                    cpt-popup-btn
                    confirm
                "
                id="cptConfirmTrade"
            >
                Confirm ${sideUpper}
            </button>

        </div>

    `);


    const cancel =
        document.getElementById(
            "cptCancelTrade"
        );


    const confirm =
        document.getElementById(
            "cptConfirmTrade"
        );


    if (cancel) {

        cancel.addEventListener(
            "click",
            function () {

                closeCptPopup();

            }
        );

    }


    if (confirm) {

        confirm.addEventListener(
            "click",
            function () {

                closeCptPopup();


                if (
                    typeof onConfirm ===
                    "function"
                ) {

                    onConfirm();

                }

            }
        );

    }

}


/* =========================================================
   TRADE OPENED SUCCESS
   ========================================================= */

function showTradeOpenedPopup(
    side,
    entryPrice,
    amount,
    leverage
) {

    const sideUpper =
        String(side)
            .toUpperCase();


    const isLong =
        sideUpper === "LONG";


    const icon =
        isLong
            ? "fa-arrow-trend-up"
            : "fa-arrow-trend-down";


    openCptPopup(`

        <div class="
            cpt-popup-icon
            success
        ">

            <i
                class="
                    fa-solid
                    ${icon}
                "
            ></i>

        </div>


        <h2
            class="cpt-popup-title"
        >
            Trade Opened Successfully
        </h2>


        <p
            class="cpt-popup-description"
        >
            Your ${sideUpper}
            position is now active.
        </p>


        <div
            class="cpt-trade-details"
        >

            <div
                class="cpt-trade-detail"
            >

                <span
                    class="cpt-trade-detail-label"
                >
                    Position
                </span>

                <span
                    class="
                        cpt-trade-detail-value
                        ${isLong ? "long" : "short"}
                    "
                >
                    ${sideUpper}
                </span>

            </div>


            <div
                class="cpt-trade-detail"
            >

                <span
                    class="cpt-trade-detail-label"
                >
                    Entry Price
                </span>

                <span
                    class="cpt-trade-detail-value"
                >
                    ${cptFormatMoney(entryPrice)}
                </span>

            </div>


            <div
                class="cpt-trade-detail"
            >

                <span
                    class="cpt-trade-detail-label"
                >
                    Amount
                </span>

                <span
                    class="cpt-trade-detail-value"
                >
                    ${cptFormatMoney(amount)}
                </span>

            </div>


            <div
                class="cpt-trade-detail"
            >

                <span
                    class="cpt-trade-detail-label"
                >
                    Leverage
                </span>

                <span
                    class="cpt-trade-detail-value"
                >
                    ${Number(leverage) || 0}x
                </span>

            </div>

        </div>


        <div
            class="cpt-popup-actions"
        >

            <button
                type="button"
                class="
                    cpt-popup-btn
                    done
                "
                id="cptTradeOpenedDone"
            >
                Done
            </button>

        </div>

    `);


    const done =
        document.getElementById(
            "cptTradeOpenedDone"
        );


    if (done) {

        done.addEventListener(
            "click",
            function () {

                closeCptPopup();

            }
        );

    }

}


/* =========================================================
   TRADE CLOSED SUCCESS
   ========================================================= */

function showTradeClosedPopup(
    closePrice,
    totalProfitLoss
) {

    const profitLoss =
        Number(
            totalProfitLoss
        ) || 0;


    const resultClass =
        profitLoss >= 0
            ? "profit"
            : "loss";


    const resultSign =
        profitLoss >= 0
            ? "+"
            : "";


    openCptPopup(`

        <div
            class="
                cpt-popup-icon
                success
            "
        >

            <i
                class="
                    fa-solid
                    fa-check
                "
            ></i>

        </div>


        <h2
            class="cpt-popup-title"
        >
            Trade Closed Successfully
        </h2>


        <p
            class="cpt-popup-description"
        >
            Your trade has been completed.
        </p>


        <div
            class="cpt-trade-details"
        >

            <div
                class="cpt-trade-detail"
            >

                <span
                    class="cpt-trade-detail-label"
                >
                    Close Price
                </span>

                <span
                    class="
                        cpt-trade-detail-value
                    "
                >
                    ${cptFormatMoney(closePrice)}
                </span>

            </div>


            <div
                class="cpt-trade-detail"
            >

                <span
                    class="cpt-trade-detail-label"
                >
                    Total Profit/Loss
                </span>

                <span
                    class="
                        cpt-trade-detail-value
                        ${resultClass}
                    "
                >
                    ${resultSign}${cptFormatMoney(profitLoss)}
                </span>

            </div>

        </div>


        <div
            class="cpt-popup-actions"
        >

            <button
                type="button"
                class="
                    cpt-popup-btn
                    done
                "
                id="cptTradeClosedDone"
            >
                Done
            </button>

        </div>

    `);


    const done =
        document.getElementById(
            "cptTradeClosedDone"
        );


    if (done) {

        done.addEventListener(
            "click",
            function () {

                closeCptPopup();

            }
        );

    }

}


/* =========================================================
   GLOBAL ACCESS
   ========================================================= */

window.showTradeConfirmationPopup =
    showTradeConfirmationPopup;

window.showTradeOpenedPopup =
    showTradeOpenedPopup;

window.showTradeClosedPopup =
    showTradeClosedPopup;

window.closeCptPopup =
    closeCptPopup;
