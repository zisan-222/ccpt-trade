/* ==========================================
   CPTMARKETS
   transfer.js
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const amountInput = document.getElementById("transferAmount");
    const availableBalance = document.getElementById("availableBalance");
    const confirmButton = document.getElementById("confirmTransfer");

    /* Show current balance */
    function updateTransferBalance() {

        if (typeof getBalance !== "function") {
            console.error("balance.js is not connected.");
            return;
        }

        const balance = getBalance();

        if (availableBalance) {
            availableBalance.textContent =
                "$" + balance.toFixed(2);
        }
    }

    updateTransferBalance();


    /* Confirm Transfer */
    if (confirmButton) {

        confirmButton.addEventListener("click", function () {

            const amount = Number(amountInput.value);

            /* Empty / invalid amount */
            if (isNaN(amount) || amount <= 0) {

                alert("Please enter a valid transfer amount.");

                return;
            }


            /* Get current balance */
            const balance = getBalance();


            /* Insufficient balance */
            if (balance < amount) {

                alert("Insufficient Balance");

                return;
            }


            /* Balance is available */
            alert("Contact Your Customer Service");

        });

    }

});
