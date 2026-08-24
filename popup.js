/* =====================================================
   CPT MARKETS - PROFESSIONAL POPUP SYSTEM
===================================================== */

(function () {

    /* Create Popup HTML */

    const popupHTML = `
        <div id="cptPopup" class="cpt-popup">

            <div class="cpt-popup-overlay"></div>

            <div class="cpt-popup-box">

                <div id="cptPopupIcon"
                     class="cpt-popup-icon">
                    ✓
                </div>

                <h2 id="cptPopupTitle"
                    class="cpt-popup-title">
                    Success
                </h2>

                <p id="cptPopupMessage"
                   class="cpt-popup-message">
                    Your action was completed successfully.
                </p>

                <div id="cptPopupUser"
                     class="cpt-popup-user">

                    <span class="cpt-popup-user-label">
                        USER ID
                    </span>

                    <strong id="cptPopupUserValue"
                            class="cpt-popup-user-value">
                    </strong>

                </div>

                <button id="cptPopupButton"
                        class="cpt-popup-button">
                    Continue
                </button>

            </div>

        </div>
    `;

    /* Add Popup to Page */

    function createPopup() {

        if (document.getElementById("cptPopup")) {
            return;
        }

        document.body.insertAdjacentHTML(
            "beforeend",
            popupHTML
        );

        setupPopupEvents();
    }


    /* Popup Events */

    function setupPopupEvents() {

        const popup =
            document.getElementById("cptPopup");

        const button =
            document.getElementById("cptPopupButton");

        const overlay =
            document.querySelector(
                ".cpt-popup-overlay"
            );

        button.addEventListener(
            "click",
            closePopup
        );

        overlay.addEventListener(
            "click",
            closePopup
        );

    }


    /* Open Popup */

    window.showCPTPopup = function (
        type,
        title,
        message,
        userId = null,
        buttonText = "Continue",
        callback = null
    ) {

        createPopup();

        const popup =
            document.getElementById("cptPopup");

        const icon =
            document.getElementById("cptPopupIcon");

        const titleElement =
            document.getElementById("cptPopupTitle");

        const messageElement =
            document.getElementById("cptPopupMessage");

        const userBox =
            document.getElementById("cptPopupUser");

        const userValue =
            document.getElementById("cptPopupUserValue");

        const button =
            document.getElementById("cptPopupButton");


        /* Remove Previous Types */

        popup.classList.remove(
            "success",
            "error",
            "warning",
            "info"
        );


        /* Add Current Type */

        popup.classList.add(type);


        /* Set Content */

        titleElement.textContent =
            title;

        messageElement.textContent =
            message;

        button.textContent =
            buttonText;


        /* Icons */

        if (type === "success") {
            icon.textContent = "✓";
        }

        else if (type === "error") {
            icon.textContent = "!";
        }

        else if (type === "warning") {
            icon.textContent = "!";
        }

        else {
            icon.textContent = "i";
        }


        /* User ID */

        if (userId) {

            userBox.style.display =
                "block";

            userValue.textContent =
                userId;

        } else {

            userBox.style.display =
                "none";

            userValue.textContent =
                "";

        }


        /* Button Action */

        button.onclick = function () {

            closePopup();

            if (typeof callback === "function") {
                callback();
            }

        };


        /* Show */

        popup.classList.add("show");

        document.body.style.overflow =
            "hidden";
    };


    /* Close Popup */

    function closePopup() {

        const popup =
            document.getElementById("cptPopup");

        if (!popup) {
            return;
        }

        popup.classList.remove("show");

        document.body.style.overflow =
            "";

    }


    /* Global Close Function */

    window.closeCPTPopup =
        closePopup;


    /* Auto Create */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            createPopup
        );

    } else {

        createPopup();

    }

})();
