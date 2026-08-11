"use strict";

const INVITE_CODE = "56771056";

document.addEventListener("DOMContentLoaded", function () {

    const code = document.getElementById("inviteCode");
    const copyBtn = document.getElementById("copyInviteBtn");

    if (code) {
        code.textContent = INVITE_CODE;
    }

    if (copyBtn) {
        copyBtn.addEventListener("click", copyInviteCode);
    }
});


async function copyInviteCode() {

    try {

        await navigator.clipboard.writeText(INVITE_CODE);

        showToast();

    } catch (error) {

        const textarea = document.createElement("textarea");

        textarea.value = INVITE_CODE;
        document.body.appendChild(textarea);

        textarea.select();
        document.execCommand("copy");

        textarea.remove();

        showToast();
    }
}


function showToast() {

    const toast = document.getElementById("copyToast");

    if (!toast) return;

    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 1800);
}


/* =========================
   BACK TO DASHBOARD
========================= */

function goBack() {

    window.location.href = "dashboard.html";

}
