(function () {
    "use strict";

    function addPasswordToggle(input) {
        if (!input) return;

        const box = input.closest(".input-box");
        if (!box) return;

        box.style.position = "relative";
        input.style.paddingRight = "52px";

        const button = document.createElement("button");

        button.type = "button";
        button.className = "password-toggle";
        button.setAttribute("aria-label", "Show password");
        button.innerHTML = '<i class="fa-solid fa-eye"></i>';

        button.addEventListener("click", function () {
            const hidden = input.type === "password";

            input.type = hidden ? "text" : "password";

            button.innerHTML = hidden
                ? '<i class="fa-solid fa-eye-slash"></i>'
                : '<i class="fa-solid fa-eye"></i>';

            button.setAttribute(
                "aria-label",
                hidden ? "Hide password" : "Show password"
            );
        });

        box.appendChild(button);
    }

    const style = document.createElement("style");

    style.textContent = `
        .password-toggle {
            position: absolute;
            top: 50%;
            right: 14px;
            transform: translateY(-50%);
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: transparent;
            color: #7f8ba3;
            font-size: 16px;
            cursor: pointer;
            padding: 0;
            z-index: 10;
        }

        .password-toggle:hover {
            color: #f5b700;
        }

        .password-toggle:active {
            transform: translateY(-50%) scale(0.9);
        }
    `;

    document.head.appendChild(style);

    function init() {
        addPasswordToggle(document.getElementById("password"));
        addPasswordToggle(document.getElementById("confirmPassword"));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
