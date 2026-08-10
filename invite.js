/* =========================================
   CptMarkets - Invite Page JavaScript
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       ELEMENTS
       ===================================== */

    const inviteCodeElement =
        document.getElementById("inviteCode");

    const copyInviteBtn =
        document.getElementById("copyInviteBtn");

    const copyToast =
        document.getElementById("copyToast");

    const backBtn =
        document.getElementById("backBtn");

    const inviteCount =
        document.getElementById("inviteCount");

    const commission =
        document.getElementById("commission");

    const referralList =
        document.getElementById("referralList");


    /* =====================================
       GENERATE INVITE CODE
       ===================================== */

    function generateInviteCode() {

        const randomNumber =
            Math.floor(10000000 + Math.random() * 90000000);

        return String(randomNumber);
    }


    /* =====================================
       GET USER INVITE CODE
       ===================================== */

    function getInviteCode() {

        let savedCode =
            localStorage.getItem("cptmarkets_invite_code");

        if (!savedCode) {

            savedCode = generateInviteCode();

            localStorage.setItem(
                "cptmarkets_invite_code",
                savedCode
            );
        }

        return savedCode;
    }


    /* =====================================
       SHOW INVITE CODE
       ===================================== */

    const inviteCode = getInviteCode();

    if (inviteCodeElement) {
        inviteCodeElement.textContent = inviteCode;
    }


    /* =====================================
       INVITE LINK
       ===================================== */

    function getInviteLink() {

        const currentUrl =
            window.location.origin;

        return (
            currentUrl +
            "/register.html?ref=" +
            encodeURIComponent(inviteCode)
        );
    }


    /* =====================================
       COPY INVITE LINK
       ===================================== */

    async function copyInviteLink() {

        const inviteLink =
            getInviteLink();

        try {

            await navigator.clipboard.writeText(
                inviteLink
            );

            showCopySuccess();

        } catch (error) {

            /*
             Fallback for browsers where
             Clipboard API is unavailable.
            */

            const textArea =
                document.createElement("textarea");

            textArea.value = inviteLink;

            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";

            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            try {
                document.execCommand("copy");
                showCopySuccess();
            } catch (copyError) {
                alert("Unable to copy invite link.");
            }

            document.body.removeChild(textArea);
        }
    }


    /* =====================================
       COPY SUCCESS MESSAGE
       ===================================== */

    function showCopySuccess() {

        if (!copyToast) {
            return;
        }

        copyToast.classList.add("show");

        setTimeout(function () {

            copyToast.classList.remove("show");

        }, 2200);
    }


    /* =====================================
       COPY BUTTON
       ===================================== */

    if (copyInviteBtn) {

        copyInviteBtn.addEventListener(
            "click",
            copyInviteLink
        );
    }


    /* =====================================
       BACK BUTTON
       ===================================== */

    if (backBtn) {

        backBtn.addEventListener(
            "click",
            function () {

                /*
                 Go back if previous page exists.
                Otherwise go to dashboard.
                */

                if (document.referrer) {

                    window.history.back();

                } else {

                    window.location.href =
                        "dashboard.html";
                }
            }
        );
    }


    /* =====================================
       LOAD REFERRAL DATA
       ===================================== */

    function loadReferralData() {

        /*
         These values are temporary frontend
         values. Later they can be loaded
         from your backend/database.
        */

        const savedInvitees =
            localStorage.getItem(
                "cptmarkets_invitee_count"
            );

        const savedCommission =
            localStorage.getItem(
                "cptmarkets_total_commission"
            );


        const totalInvitees =
            savedInvitees
                ? parseInt(savedInvitees, 10)
                : 0;


        const totalCommission =
            savedCommission
                ? parseFloat(savedCommission)
                : 0;


        if (inviteCount) {

            inviteCount.textContent =
                totalInvitees;
        }


        if (commission) {

            commission.textContent =
                "$" + totalCommission.toFixed(2);
        }


        loadReferralList();
    }


    /* =====================================
       LOAD REFERRAL LIST
       ===================================== */

    function loadReferralList() {

        if (!referralList) {
            return;
        }


        const savedReferrals =
            localStorage.getItem(
                "cptmarkets_referrals"
            );


        let referrals = [];

        try {

            referrals =
                savedReferrals
                    ? JSON.parse(savedReferrals)
                    : [];

        } catch (error) {

            referrals = [];
        }


        /*
         No referrals
        */

        if (
            !Array.isArray(referrals) ||
            referrals.length === 0
        ) {

            referralList.innerHTML = `
                <div class="no-referrals">
                    No referrals
                </div>
            `;

            return;
        }


        /*
         Show referrals
        */

        referralList.innerHTML = "";


        referrals.forEach(function (referral) {

            const item =
                document.createElement("div");

            item.className =
                "referral-item";


            item.innerHTML = `
                <div class="referral-user">
                    <strong>
                        ${escapeHtml(
                            referral.name || "User"
                        )}
                    </strong>

                    <span>
                        ${escapeHtml(
                            referral.date || ""
                        )}
                    </span>
                </div>

                <div class="referral-commission">
                    $${Number(
                        referral.commission || 0
                    ).toFixed(2)}
                </div>
            `;


            referralList.appendChild(item);
        });
    }


    /* =====================================
       HTML ESCAPE
       ===================================== */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================
       INITIAL LOAD
       ===================================== */

    loadReferralData();

});
