"use strict";


/* =========================
   FIXED INVITE CODE
========================= */

const INVITE_CODE = "56771056";


/* =========================
   PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const inviteCodeElement =
        document.getElementById("inviteCode");

    const copyButton =
        document.getElementById("copyInviteBtn");


    /*
     * Everyone gets the same
     * 8-digit invite code.
     */

    if (inviteCodeElement) {
        inviteCodeElement.textContent = INVITE_CODE;
    }


    /*
     * Copy button
     */

    if (copyButton) {

        copyButton.addEventListener(
            "click",
            copyInviteCode
        );

    }

});


/* =========================
   COPY INVITE CODE
========================= */

async function copyInviteCode() {

    const code = INVITE_CODE;

    try {

        /*
         * Modern browser
         */

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(code);

        } else {

            /*
             * Fallback for older browsers
             */

            const textarea =
                document.createElement("textarea");

            textarea.value = code;

            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";

            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();

            document.execCommand("copy");

            document.body.removeChild(textarea);
        }


        showCopyMessage();

    } catch (error) {

        console.error(
            "Copy failed:",
            error
        );

        /*
         * Even if clipboard is unavailable,
         * show the code to the user.
         */

        alert(
            "Invite Code: " + code
        );

    }

}


/* =========================
   COPY SUCCESS MESSAGE
========================= */

function showCopyMessage() {

    const toast =
        document.getElementById("copyToast");

    if (!toast) {
        return;
    }

    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 2000);

}


/* =========================
   BACK BUTTON
========================= */

function goBack() {

    /*
     * If browser history exists,
     * go back to dashboard.
     */

    if (window.history.length > 1) {

        window.history.back();

    } else {

        window.location.href =
            "dashboard.html";

    }

}
