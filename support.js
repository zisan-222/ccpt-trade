/* ==========================================
   CPTMARKETS SUPPORT
   support.js - Part 1
========================================== */

window.Tawk_API = window.Tawk_API || {};
window.Tawk_LoadStart = new Date();

let tawkLoaded = false;

/* ==========================================
   TAWK LOADED
========================================== */

window.Tawk_API.onLoad = function () {

    tawkLoaded = true;

    console.log("Tawk Customer Service Ready");


    /* ======================================
       HIDE TAWK WIDGET
    ====================================== */

    if (
        typeof window.Tawk_API.hideWidget ===
        "function"
    ) {

        window.Tawk_API.hideWidget();

    }


    /* ======================================
       HIDE GREEN LAUNCHER ICON
    ====================================== */

    if (
        typeof window.Tawk_API.hide ===
        "function"
    ) {

        window.Tawk_API.hide();

    }

};
/* ==========================================
   OPEN SUPPORT CHAT
========================================== */

function openSupportChat() {

    if (!tawkLoaded) {

        alert("Customer Service is loading...");

        return;

    }

    if (typeof window.Tawk_API.showWidget === "function") {

        window.Tawk_API.showWidget();

    }

    setTimeout(function () {

        if (typeof window.Tawk_API.maximize === "function") {

            window.Tawk_API.maximize();

        }

    }, 300);

}
/* ==========================================
   CPTMARKETS SUPPORT
   support.js - Part 2
========================================== */

/* ==========================================
   HIDE SUPPORT WIDGET
========================================== */

function hideSupportWidget() {

    if (
        window.Tawk_API &&
        typeof window.Tawk_API.hideWidget === "function"
    ) {
        window.Tawk_API.hideWidget();
    }

}


/* ==========================================
   SHOW SUPPORT WIDGET
========================================== */

function showSupportWidget() {

    if (
        window.Tawk_API &&
        typeof window.Tawk_API.showWidget === "function"
    ) {
        window.Tawk_API.showWidget();
    }

}


/* ==========================================
   MAXIMIZE SUPPORT CHAT
========================================== */

function maximizeSupportChat() {

    if (
        window.Tawk_API &&
        typeof window.Tawk_API.maximize === "function"
    ) {
        window.Tawk_API.maximize();
    }

}


/* ==========================================
   MINIMIZE SUPPORT CHAT
========================================== */

function minimizeSupportChat() {

    if (
        window.Tawk_API &&
        typeof window.Tawk_API.minimize === "function"
    ) {
        window.Tawk_API.minimize();
    }

}


/* ==========================================
   CLOSE SUPPORT CHAT
========================================== */

function closeSupportChat() {

    if (
        window.Tawk_API &&
        typeof window.Tawk_API.hideWidget === "function"
    ) {
        window.Tawk_API.hideWidget();
    }

}


/* ==========================================
   WAIT FOR TAWK
========================================== */

function waitForTawk(callback) {

    if (tawkLoaded) {

        callback();

        return;

    }

    let attempts = 0;

    const checker = setInterval(function () {

        attempts++;

        if (tawkLoaded) {

            clearInterval(checker);

            callback();

        }

        /* Stop checking after 20 seconds */

        if (attempts >= 40) {

            clearInterval(checker);

            console.log(
                "Tawk Customer Service is not ready."
            );

        }

    }, 500);

}


/* ==========================================
   OPEN CHAT AFTER TAWK LOAD
========================================== */

function openSupportChatWhenReady() {

    waitForTawk(function () {

        showSupportWidget();

        setTimeout(function () {

            maximizeSupportChat();

        }, 300);

    });

}


/* ==========================================
   AUTO HIDE LAUNCHER
========================================== */

const supportWidgetChecker =
    setInterval(function () {

        if (
            window.Tawk_API &&
            typeof window.Tawk_API.hideWidget ===
                "function"
        ) {

            /*
               Keep the normal Tawk launcher hidden.
               Chat opens only when the website
               calls openSupportChat().
            */

            window.Tawk_API.hideWidget();

        }

    }, 1000);
/* ==========================================
   CPTMARKETS SUPPORT
   support.js - Part 3
========================================== */

/* ==========================================
   TAWK STATUS
========================================== */

function isSupportReady() {

    return (
        typeof window.Tawk_API !== "undefined" &&
        tawkLoaded === true
    );

}


/* ==========================================
   SUPPORT BUTTON CONNECTION
========================================== */

function connectSupportButtons() {

    const supportButtons =
        document.querySelectorAll(
            ".support-btn, .deposit-btn"
        );

    supportButtons.forEach(function (button) {

        /*
           Prevent the same button from
           receiving the event twice.
        */

        if (
            button.dataset.supportConnected ===
            "true"
        ) {
            return;
        }

        button.dataset.supportConnected =
            "true";


        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openSupportChatWhenReady();

            }
        );

    });

}


/* ==========================================
   PAGE READY
========================================== */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            connectSupportButtons();

        }
    );

}

else {

    connectSupportButtons();

}


/* ==========================================
   RECONNECT AFTER DYNAMIC CONTENT
========================================== */

setInterval(function () {

    connectSupportButtons();

}, 1500);


/* ==========================================
   SUPPORT READY LOG
========================================== */

window.addEventListener(
    "load",
    function () {

        if (isSupportReady()) {

            console.log(
                "CptMarkets Support is ready."
            );

        }

        else {

            console.log(
                "Waiting for Tawk Customer Service..."
            );

        }

    }
);


/* ==========================================
   END OF SUPPORT.JS
========================================== */
