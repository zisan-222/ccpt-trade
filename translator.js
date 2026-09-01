/* =========================================================
   CPT MARKETS - GLOBAL TRANSLATOR
   Version 3.0
   ========================================================= */

(function () {

    "use strict";

    /* =====================================================
       LANGUAGE DATABASE
       ===================================================== */

    const LANGUAGES = {

        en: {
            name: "English",
            native: "English",
            flag: "🇬🇧",
            dir: "ltr"
        },

        bn: {
            name: "Bengali",
            native: "বাংলা",
            flag: "🇧🇩",
            dir: "ltr"
        },

        ar: {
            name: "Arabic",
            native: "العربية",
            flag: "🇸🇦",
            dir: "rtl"
        },

        hi: {
            name: "Hindi",
            native: "हिन्दी",
            flag: "🇮🇳",
            dir: "ltr"
        },

        es: {
            name: "Spanish",
            native: "Español",
            flag: "🇪🇸",
            dir: "ltr"
        },

        zh: {
            name: "Chinese",
            native: "中文",
            flag: "🇨🇳",
            dir: "ltr"
        },

        ja: {
            name: "Japanese",
            native: "日本語",
            flag: "🇯🇵",
            dir: "ltr"
        },

        fr: {
            name: "French",
            native: "Français",
            flag: "🇫🇷",
            dir: "ltr"
        },

        de: {
            name: "German",
            native: "Deutsch",
            flag: "🇩🇪",
            dir: "ltr"
        },

        ru: {
            name: "Russian",
            native: "Русский",
            flag: "🇷🇺",
            dir: "ltr"
        }

    };


    const LANGUAGE_ORDER = [
        "en",
        "bn",
        "ar",
        "hi",
        "es",
        "zh",
        "ja",
        "fr",
        "de",
        "ru"
    ];


    /* =====================================================
       STORAGE
       ===================================================== */

    const STORAGE_KEY =
        "cptmarkets_language";


    const DEFAULT_LANGUAGE =
        "en";


    let currentLanguage =
        localStorage.getItem(STORAGE_KEY) ||
        DEFAULT_LANGUAGE;


    if (!LANGUAGES[currentLanguage]) {
        currentLanguage = DEFAULT_LANGUAGE;
    }


    /* =====================================================
       TRANSLATION DATA
       ===================================================== */

    /*
       lang.js থাকলে তার translation database ব্যবহার করবে।
       না থাকলেও language selector কাজ করবে।
    */

    const externalTranslations =
        window.CPT_TRANSLATIONS ||
        window.translations ||
        window.TRANSLATIONS ||
        {};


    /* =====================================================
       EXTRA COMMON TRANSLATIONS
       ===================================================== */

    const translations = {

        en: {

            "Username": "Username",
            "Password": "Password",
            "Confirm Password": "Confirm Password",
            "Invite Code": "Invite Code",
            "Invite Code (optional)": "Invite Code (optional)",
            "Enter Username": "Enter Username",
            "Password (min. 6 chars)": "Password (min. 6 chars)",
            "Confirm Password": "Confirm Password",
            "Sign In": "Sign In",
            "Register": "Register",
            "Create Account": "Create Account",
            "Already have an account?":
                "Already have an account?",
            "Forgot Password?":
                "Forgot Password?",
            "Home": "Home",
            "Markets": "Markets",
            "Assets": "Assets",
            "Trade": "Trade",
            "Mine": "Mine",
            "Settings": "Settings",
            "Support": "Support",
            "Deposit": "Deposit",
            "Withdraw": "Withdraw",
            "Transfer": "Transfer",
            "Loan": "Loan",
            "My Orders": "My Orders",
            "Available": "Available",
            "Frozen": "Frozen",
            "History": "History",
            "Announcements": "Announcements",
            "Copy Trade": "Copy Trade",
            "Wealth": "Wealth",
            "Mining": "Mining",
            "Invite": "Invite"

        },


        bn: {

            "Username": "ইউজারনেম",
            "Password": "পাসওয়ার্ড",
            "Confirm Password":
                "পাসওয়ার্ড নিশ্চিত করুন",
            "Invite Code": "ইনভাইট কোড",
            "Invite Code (optional)":
                "ইনভাইট কোড (ঐচ্ছিক)",
            "Enter Username":
                "ইউজারনেম লিখুন",
            "Password (min. 6 chars)":
                "পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)",
            "Sign In": "সাইন ইন",
            "Register": "রেজিস্টার",
            "Create Account":
                "অ্যাকাউন্ট তৈরি করুন",
            "Already have an account?":
                "ইতিমধ্যে অ্যাকাউন্ট আছে?",
            "Forgot Password?":
                "পাসওয়ার্ড ভুলে গেছেন?",
            "Home": "হোম",
            "Markets": "মার্কেট",
            "Assets": "অ্যাসেটস",
            "Trade": "ট্রেড",
            "Mine": "আমার",
            "Settings": "সেটিংস",
            "Support": "সাপোর্ট",
            "Deposit": "ডিপোজিট",
            "Withdraw": "উইথড্র",
            "Transfer": "ট্রান্সফার",
            "Loan": "লোন",
            "My Orders": "আমার অর্ডার",
            "Available": "উপলভ্য",
            "Frozen": "ফ্রোজেন",
            "History": "ইতিহাস",
            "Announcements": "ঘোষণা",
            "Copy Trade": "কপি ট্রেড",
            "Wealth": "সম্পদ",
            "Mining": "মাইনিং",
            "Invite": "আমন্ত্রণ"

        },


        ar: {

            "Username": "اسم المستخدم",
            "Password": "كلمة المرور",
            "Confirm Password":
                "تأكيد كلمة المرور",
            "Invite Code": "رمز الدعوة",
            "Invite Code (optional)":
                "رمز الدعوة (اختياري)",
            "Enter Username":
                "أدخل اسم المستخدم",
            "Password (min. 6 chars)":
                "كلمة المرور (6 أحرف على الأقل)",
            "Sign In": "تسجيل الدخول",
            "Register": "تسجيل",
            "Create Account": "إنشاء حساب",
            "Already have an account?":
                "هل لديك حساب بالفعل؟",
            "Forgot Password?":
                "هل نسيت كلمة المرور؟",
            "Home": "الرئيسية",
            "Markets": "الأسواق",
            "Assets": "الأصول",
            "Trade": "تداول",
            "Mine": "حسابي",
            "Settings": "الإعدادات",
            "Support": "الدعم",
            "Deposit": "إيداع",
            "Withdraw": "سحب",
            "Transfer": "تحويل",
            "Loan": "قرض",
            "My Orders": "طلباتي",
            "Available": "متاح",
            "Frozen": "مجمد",
            "History": "السجل",
            "Announcements": "الإعلانات",
            "Copy Trade": "نسخ التداول",
            "Wealth": "الثروة",
            "Mining": "التعدين",
            "Invite": "دعوة"

        },


        hi: {

            "Username": "यूज़रनेम",
            "Password": "पासवर्ड",
            "Confirm Password":
                "पासवर्ड की पुष्टि करें",
            "Invite Code": "इनवाइट कोड",
            "Invite Code (optional)":
                "इनवाइट कोड (वैकल्पिक)",
            "Enter Username":
                "यूज़रनेम दर्ज करें",
            "Password (min. 6 chars)":
                "पासवर्ड (कम से कम 6 अक्षर)",
            "Sign In": "साइन इन",
            "Register": "रजिस्टर",
            "Create Account":
                "खाता बनाएं",
            "Already have an account?":
                "क्या आपके पास पहले से खाता है?",
            "Forgot Password?":
                "पासवर्ड भूल गए?",
            "Home": "होम",
            "Markets": "मार्केट",
            "Assets": "एसेट्स",
            "Trade": "ट्रेड",
            "Mine": "मेरा",
            "Settings": "सेटिंग्स",
            "Support": "सपोर्ट",
            "Deposit": "जमा करें",
            "Withdraw": "निकासी",
            "Transfer": "ट्रांसफर",
            "Loan": "लोन",
            "My Orders": "मेरे ऑर्डर",
            "Available": "उपलब्ध",
            "Frozen": "फ्रोजन",
            "History": "इतिहास",
            "Announcements": "घोषणाएं",
            "Copy Trade": "कॉपी ट्रेड",
            "Wealth": "संपत्ति",
            "Mining": "माइनिंग",
            "Invite": "आमंत्रित करें"

        },


        es: {

            "Username": "Nombre de usuario",
            "Password": "Contraseña",
            "Confirm Password":
                "Confirmar contraseña",
            "Invite Code": "Código de invitación",
            "Invite Code (optional)":
                "Código de invitación (opcional)",
            "Enter Username":
                "Ingrese nombre de usuario",
            "Password (min. 6 chars)":
                "Contraseña (mín. 6 caracteres)",
            "Sign In": "Iniciar sesión",
            "Register": "Registrarse",
            "Create Account":
                "Crear cuenta",
            "Already have an account?":
                "¿Ya tienes una cuenta?",
            "Forgot Password?":
                "¿Olvidaste tu contraseña?",
            "Home": "Inicio",
            "Markets": "Mercados",
            "Assets": "Activos",
            "Trade": "Comercio",
            "Mine": "Mi cuenta",
            "Settings": "Configuración",
            "Support": "Soporte",
            "Deposit": "Depositar",
            "Withdraw": "Retirar",
            "Transfer": "Transferir",
            "Loan": "Préstamo",
            "My Orders": "Mis órdenes",
            "Available": "Disponible",
            "Frozen": "Congelado",
            "History": "Historial",
            "Announcements": "Anuncios",
            "Copy Trade": "Copy Trading",
            "Wealth": "Patrimonio",
            "Mining": "Minería",
            "Invite": "Invitar"

        },


        zh: {

            "Username": "用户名",
            "Password": "密码",
            "Confirm Password": "确认密码",
            "Invite Code": "邀请码",
            "Invite Code (optional)":
                "邀请码（可选）",
            "Enter Username":
                "输入用户名",
            "Password (min. 6 chars)":
                "密码（至少6个字符）",
            "Sign In": "登录",
            "Register": "注册",
            "Create Account": "创建账户",
            "Already have an account?":
                "已经有账户了吗？",
            "Forgot Password?":
                "忘记密码？",
            "Home": "首页",
            "Markets": "市场",
            "Assets": "资产",
            "Trade": "交易",
            "Mine": "我的",
            "Settings": "设置",
            "Support": "客服",
            "Deposit": "充值",
            "Withdraw": "提现",
            "Transfer": "转账",
            "Loan": "贷款",
            "My Orders": "我的订单",
            "Available": "可用",
            "Frozen": "冻结",
            "History": "历史",
            "Announcements": "公告",
            "Copy Trade": "跟单",
            "Wealth": "财富",
            "Mining": "挖矿",
            "Invite": "邀请"

        },


        ja: {

            "Username": "ユーザー名",
            "Password": "パスワード",
            "Confirm Password":
                "パスワードを確認",
            "Invite Code": "招待コード",
            "Invite Code (optional)":
                "招待コード（任意）",
            "Enter Username":
                "ユーザー名を入力",
            "Password (min. 6 chars)":
                "パスワード（6文字以上）",
            "Sign In": "ログイン",
            "Register": "登録",
            "Create Account":
                "アカウントを作成",
            "Already have an account?":
                "すでにアカウントをお持ちですか？",
            "Forgot Password?":
                "パスワードをお忘れですか？",
            "Home": "ホーム",
            "Markets": "マーケット",
            "Assets": "資産",
            "Trade": "取引",
            "Mine": "マイページ",
            "Settings": "設定",
            "Support": "サポート",
            "Deposit": "入金",
            "Withdraw": "出金",
            "Transfer": "送金",
            "Loan": "ローン",
            "My Orders": "注文履歴",
            "Available": "利用可能",
            "Frozen": "凍結",
            "History": "履歴",
            "Announcements": "お知らせ",
            "Copy Trade": "コピートレード",
            "Wealth": "資産",
            "Mining": "マイニング",
            "Invite": "招待"

        },


        fr: {

            "Username": "Nom d'utilisateur",
            "Password": "Mot de passe",
            "Confirm Password":
                "Confirmer le mot de passe",
            "Invite Code": "Code d'invitation",
            "Invite Code (optional)":
                "Code d'invitation (facultatif)",
            "Enter Username":
                "Entrez votre nom d'utilisateur",
            "Password (min. 6 chars)":
                "Mot de passe (6 caractères min.)",
            "Sign In": "Se connecter",
            "Register": "S'inscrire",
            "Create Account":
                "Créer un compte",
            "Already have an account?":
                "Vous avez déjà un compte ?",
            "Forgot Password?":
                "Mot de passe oublié ?",
            "Home": "Accueil",
            "Markets": "Marchés",
            "Assets": "Actifs",
            "Trade": "Trader",
            "Mine": "Mon compte",
            "Settings": "Paramètres",
            "Support": "Assistance",
            "Deposit": "Dépôt",
            "Withdraw": "Retrait",
            "Transfer": "Transfert",
            "Loan": "Prêt",
            "My Orders": "Mes ordres",
            "Available": "Disponible",
            "Frozen": "Gelé",
            "History": "Historique",
            "Announcements": "Annonces",
            "Copy Trade": "Copy Trading",
            "Wealth": "Patrimoine",
            "Mining": "Minage",
            "Invite": "Inviter"

        },


        de: {

            "Username": "Benutzername",
            "Password": "Passwort",
            "Confirm Password":
                "Passwort bestätigen",
            "Invite Code": "Einladungscode",
            "Invite Code (optional)":
                "Einladungscode (optional)",
            "Enter Username":
                "Benutzernamen eingeben",
            "Password (min. 6 chars)":
                "Passwort (mind. 6 Zeichen)",
            "Sign In": "Anmelden",
            "Register": "Registrieren",
            "Create Account":
                "Konto erstellen",
            "Already have an account?":
                "Haben Sie bereits ein Konto?",
            "Forgot Password?":
                "Passwort vergessen?",
            "Home": "Startseite",
            "Markets": "Märkte",
            "Assets": "Vermögenswerte",
            "Trade": "Handeln",
            "Mine": "Mein Konto",
            "Settings": "Einstellungen",
            "Support": "Support",
            "Deposit": "Einzahlen",
            "Withdraw": "Auszahlen",
            "Transfer": "Überweisen",
            "Loan": "Kredit",
            "My Orders": "Meine Aufträge",
            "Available": "Verfügbar",
            "Frozen": "Eingefroren",
            "History": "Verlauf",
            "Announcements": "Ankündigungen",
            "Copy Trade": "Copy Trading",
            "Wealth": "Vermögen",
            "Mining": "Mining",
            "Invite": "Einladen"

        },


        ru: {

            "Username": "Имя пользователя",
            "Password": "Пароль",
            "Confirm Password":
                "Подтвердите пароль",
            "Invite Code": "Код приглашения",
            "Invite Code (optional)":
                "Код приглашения (необязательно)",
            "Enter Username":
                "Введите имя пользователя",
            "Password (min. 6 chars)":
                "Пароль (минимум 6 символов)",
            "Sign In": "Войти",
            "Register": "Регистрация",
            "Create Account":
                "Создать аккаунт",
            "Already have an account?":
                "Уже есть аккаунт?",
            "Forgot Password?":
                "Забыли пароль?",
            "Home": "Главная",
            "Markets": "Рынки",
            "Assets": "Активы",
            "Trade": "Торговля",
            "Mine": "Мой аккаунт",
            "Settings": "Настройки",
            "Support": "Поддержка",
            "Deposit": "Пополнить",
            "Withdraw": "Вывести",
            "Transfer": "Перевести",
            "Loan": "Кредит",
            "My Orders": "Мои ордера",
            "Available": "Доступно",
            "Frozen": "Заморожено",
            "History": "История",
            "Announcements": "Объявления",
            "Copy Trade": "Копитрейдинг",
            "Wealth": "Капитал",
            "Mining": "Майнинг",
            "Invite": "Пригласить"

        }

    };


    /* =====================================================
       GET TRANSLATION
       ===================================================== */

    function translate(text) {

        if (!text) return text;

        const clean =
            String(text)
                .replace(/\s+/g, " ")
                .trim();

        if (
            currentLanguage === "en"
        ) {
            return clean;
        }


        /*
         * First use lang.js
         */

        if (
            externalTranslations[currentLanguage] &&
            externalTranslations[currentLanguage][clean]
        ) {

            return externalTranslations
                [currentLanguage][clean];

        }


        /*
         * Then use built-in translations.
         */

        if (
            translations[currentLanguage] &&
            translations[currentLanguage][clean]
        ) {

            return translations
                [currentLanguage][clean];

        }


        return clean;

    }


    /* =====================================================
       CREATE CSS
       ===================================================== */

    function createLanguageCSS() {

        if (
            document.getElementById(
                "cpt-language-css"
            )
        ) {
            return;
        }


        const style =
            document.createElement("style");


        style.id =
            "cpt-language-css";


        style.textContent = `

            #cpt-language-menu {

                position: fixed;

                z-index: 2147483647;

                width: 265px;

                max-width: calc(100vw - 20px);

                max-height: 70vh;

                overflow-y: auto;

                padding: 8px;

                background:
                    #15151c;

                border:
                    1px solid
                    rgba(0,220,255,.35);

                border-radius:
                    16px;

                box-shadow:
                    0 15px 45px
                    rgba(0,0,0,.65);

                display: none;

                box-sizing: border-box;

                font-family:
                    Arial,
                    sans-serif;

            }


            #cpt-language-menu.cpt-open {

                display: block;

                animation:
                    cptLanguageOpen
                    .18s ease;

            }


            @keyframes cptLanguageOpen {

                from {

                    opacity: 0;

                    transform:
                        translateY(-6px)
                        scale(.98);

                }

                to {

                    opacity: 1;

                    transform:
                        translateY(0)
                        scale(1);

                }

            }


            .cpt-language-option {

                width: 100%;

                min-height: 54px;

                display: flex;

                align-items: center;

                gap: 13px;

                border: 0;

                outline: 0;

                border-radius: 12px;

                background:
                    transparent;

                color: #ffffff;

                padding:
                    8px 12px;

                margin:
                    2px 0;

                cursor: pointer;

                font-size: 16px;

                text-align: left;

                box-sizing: border-box;

            }


            .cpt-language-option:hover {

                background:
                    rgba(255,255,255,.09);

            }


            .cpt-language-option.cpt-selected {

                background:
                    rgba(255,255,255,.12);

            }


            .cpt-language-flag {

                width: 38px;

                min-width: 38px;

                height: 30px;

                display: flex;

                align-items: center;

                justify-content: center;

                font-size: 27px;

            }


            .cpt-language-name {

                flex: 1;

                white-space: nowrap;

                overflow: hidden;

                text-overflow: ellipsis;

            }


            .cpt-language-check {

                width: 24px;

                min-width: 24px;

                text-align: center;

                color:
                    #ffffff;

                font-size: 20px;

                font-weight: bold;

            }


            .cpt-current-language-flag {

                display: inline-flex;

                align-items: center;

                justify-content: center;

                font-size: 27px;

                line-height: 1;

            }


            #cpt-language-menu::-webkit-scrollbar {

                width: 5px;

            }


            #cpt-language-menu::-webkit-scrollbar-thumb {

                background:
                    rgba(255,255,255,.2);

                border-radius: 10px;

            }

        `;


        document.head.appendChild(style);

    }


    /* =====================================================
       CREATE MENU
       ===================================================== */

    function createLanguageMenu() {

        let menu =
            document.getElementById(
                "cpt-language-menu"
            );


        if (menu) {

            updateLanguageMenu();

            return menu;

        }


        menu =
            document.createElement("div");


        menu.id =
            "cpt-language-menu";


        menu.setAttribute(
            "role",
            "menu"
        );


        LANGUAGE_ORDER.forEach(
            function (code) {

                const lang =
                    LANGUAGES[code];


                const button =
                    document.createElement("button");


                button.type =
                    "button";


                button.className =
                    "cpt-language-option";


                button.dataset.lang =
                    code;


                button.innerHTML = `

                    <span
                        class="cpt-language-flag"
                    >
                        ${lang.flag}
                    </span>

                    <span
                        class="cpt-language-name"
                    >
                        ${lang.native}
                    </span>

                    <span
                        class="cpt-language-check"
                    >
                        ✓
                    </span>

                `;


                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        setLanguage(code);

                    }
                );


                menu.appendChild(button);

            }
        );


        document.body.appendChild(menu);


        updateLanguageMenu();


        return menu;

    }


    /* =====================================================
       FIND LANGUAGE BUTTON
       ===================================================== */

    function getLanguageButton() {

        return (

            document.getElementById(
                "languageBtn"
            ) ||

            document.querySelector(
                ".language-btn"
            ) ||

            document.querySelector(
                "[data-language-button]"
            )

        );

    }


    /* =====================================================
       UPDATE FLAG
       ===================================================== */

    function updateCurrentFlag() {

        const button =
            getLanguageButton();


        if (!button) {

            return;

        }


        const lang =
            LANGUAGES[currentLanguage];


        if (!lang) {

            return;

        }


        /*
         * শুধু flag রাখছি।
         */

        button.innerHTML = `

            <span
                class="cpt-current-language-flag"
                aria-hidden="true"
            >
                ${lang.flag}
            </span>

        `;


        button.dataset.currentLanguage =
            currentLanguage;


        button.setAttribute(
            "aria-label",
            lang.native
        );


        button.setAttribute(
            "title",
            lang.native
        );

    }


    /* =====================================================
       POSITION MENU
       ===================================================== */

    function positionMenu() {

        const button =
            getLanguageButton();


        const menu =
            document.getElementById(
                "cpt-language-menu"
            );


        if (!button || !menu) {

            return;

        }


        /*
         * Temporarily show it to calculate size.
         */

        const rect =
            button.getBoundingClientRect();


        const menuWidth =
            Math.min(
                265,
                window.innerWidth - 20
            );


        menu.style.width =
            menuWidth + "px";


        const menuHeight =
            Math.min(
                menu.scrollHeight,
                window.innerHeight * .70
            );


        let left =
            rect.right - menuWidth;


        let top =
            rect.bottom + 8;


        if (
            left < 10
        ) {

            left = 10;

        }


        if (
            left + menuWidth >
            window.innerWidth - 10
        ) {

            left =
                window.innerWidth -
                menuWidth -
                10;

        }


        /*
         * If there is no room below,
         * open above the button.
         */

        if (
            top + menuHeight >
            window.innerHeight - 10
        ) {

            top =
                rect.top -
                menuHeight -
                8;

        }


        if (top < 10) {

            top = 10;

        }


        menu.style.left =
            left + "px";


        menu.style.top =
            top + "px";

    }


    /* =====================================================
       OPEN MENU
       ===================================================== */

    function openLanguageMenu() {

        const menu =
            createLanguageMenu();


        updateLanguageMenu();


        menu.classList.add(
            "cpt-open"
        );


        /*
         * Need actual dimensions
         * after display.
         */

        requestAnimationFrame(
            function () {

                positionMenu();

            }
        );

    }


    /* =====================================================
       CLOSE MENU
       ===================================================== */

    function closeLanguageMenu() {

        const menu =
            document.getElementById(
                "cpt-language-menu"
            );


        if (!menu) {

            return;

        }


        menu.classList.remove(
            "cpt-open"
        );

    }


    /* =====================================================
       TOGGLE MENU
       ===================================================== */

    function toggleLanguageMenu(
        event
    ) {

        if (event) {

            event.preventDefault();

            event.stopPropagation();

        }


        const menu =
            document.getElementById(
                "cpt-language-menu"
            );


        if (
            menu &&
            menu.classList.contains(
                "cpt-open"
            )
        ) {

            closeLanguageMenu();

        } else {

            openLanguageMenu();

        }

    }


    /* =====================================================
       CONNECT BUTTON
       ===================================================== */

    function connectButton() {

        const button =
            getLanguageButton();


        if (!button) {

            console.warn(
                "CPT Translator: #languageBtn not found."
            );

            return;

        }


        if (
            button.dataset.cptLanguageConnected ===
            "true"
        ) {

            updateCurrentFlag();

            return;

        }


        button.dataset.cptLanguageConnected =
            "true";


        /*
         * IMPORTANT:
         * Do NOT replace the original button.
         */

        button.addEventListener(
            "click",
            toggleLanguageMenu,
            true
        );


        updateCurrentFlag();

    }


    /* =====================================================
       UPDATE MENU CHECK
       ===================================================== */

    function updateLanguageMenu() {

        const menu =
            document.getElementById(
                "cpt-language-menu"
            );


        if (!menu) {

            return;

        }


        menu.querySelectorAll(
            ".cpt-language-option"
        )
        .forEach(
            function (button) {

                const selected =
                    button.dataset.lang ===
                    currentLanguage;


                button.classList.toggle(
                    "cpt-selected",
                    selected
                );


                const check =
                    button.querySelector(
                        ".cpt-language-check"
                    );


                if (check) {

                    check.style.visibility =
                        selected
                            ? "visible"
                            : "hidden";

                }

            }
        );

    }


    /* =====================================================
       SET LANGUAGE
       ===================================================== */

    function setLanguage(
        language
    ) {

        if (!LANGUAGES[language]) {

            return;

        }


        currentLanguage =
            language;


        /*
         * SAVE GLOBALLY
         */

        localStorage.setItem(
            STORAGE_KEY,
            currentLanguage
        );


        /*
         * HTML language + RTL
         */

        const info =
            LANGUAGES[currentLanguage];


        document.documentElement
            .setAttribute(
                "lang",
                currentLanguage
            );


        document.documentElement
            .setAttribute(
                "dir",
                info.dir
            );


        document.documentElement
            .setAttribute(
                "data-language",
                currentLanguage
            );


        /*
         * Update flag
         */

        updateCurrentFlag();


        /*
         * Update menu
         */

        updateLanguageMenu();


        /*
         * Translate page
         */

        translatePage();


        /*
         * Close menu
         */

        closeLanguageMenu();


        /*
         * Tell other scripts
         */

        window.dispatchEvent(
            new CustomEvent(
                "cptLanguageChanged",
                {
                    detail: {
                        language:
                            currentLanguage
                    }
                }
            )
        );

    }


    /* =====================================================
       TRANSLATE DATA-KEY
       ===================================================== */

    function translateDataKeys() {

        document
            .querySelectorAll(
                "[data-key]"
            )
            .forEach(
                function (element) {

                    /*
                     * Language menu বাদ
                     */

                    if (
                        element.closest(
                            "#cpt-language-menu"
                        )
                    ) {

                        return;

                    }


                    const key =
                        element.getAttribute(
                            "data-key"
                        );


                    /*
                     * If key directly exists
                     * in translation database.
                     */

                    let result = "";


                    if (
                        externalTranslations[
                            currentLanguage
                        ] &&
                        externalTranslations[
                            currentLanguage
                        ][key]
                    ) {

                        result =
                            externalTranslations[
                                currentLanguage
                            ][key];

                    }


                    /*
                     * If no direct key,
                     * use key as English text.
                     */

                    if (!result) {

                        result =
                            translate(key);

                    }


                    if (!result) {

                        return;

                    }


                    /*
                     * If element contains icons,
                     * preserve icons.
                     */

                    const textNodes = [];

                    const walker =
                        document.createTreeWalker(
                            element,
                            NodeFilter.SHOW_TEXT,
                            null
                        );


                    while (
                        walker.nextNode()
                    ) {

                        const node =
                            walker.currentNode;


                        if (
                            node.nodeValue.trim()
                        ) {

                            textNodes.push(node);

                        }

                    }


                    if (textNodes.length) {

                        textNodes[
                            textNodes.length - 1
                        ].nodeValue =
                            " " + result;

                    } else {

                        element.textContent =
                            result;

                    }

                }
            );

    }


    /* =====================================================
       TRANSLATE PLACEHOLDERS
       ===================================================== */

    function translatePlaceholders() {

        document
            .querySelectorAll(
                "[data-ph-key]"
            )
            .forEach(
                function (element) {

                    const key =
                        element.getAttribute(
                            "data-ph-key"
                        );


                    let result =
                        translate(key);


                    if (
                        translations[
                            currentLanguage
                        ] &&
                        translations[
                            currentLanguage
                        ][key]
                    ) {

                        result =
                            translations[
                                currentLanguage
                            ][key];

                    }


                    if (result) {

                        element.placeholder =
                            result;

                    }

                }
            );

    }


    /* =====================================================
       NORMAL TEXT TRANSLATION
       ===================================================== */

    function translateNormalText() {

        const walker =
            document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null
            );


        const nodes = [];


        while (
            walker.nextNode()
        ) {

            const node =
                walker.currentNode;


            const parent =
                node.parentElement;


            if (!parent) {

                continue;

            }


            /*
             * Don't touch menu.
             */

            if (
                parent.closest(
                    "#cpt-language-menu"
                )
            ) {

                continue;

            }


            /*
             * Don't touch scripts.
             */

            if (
                [
                    "SCRIPT",
                    "STYLE",
                    "NOSCRIPT",
                    "CODE",
                    "PRE"
                ].includes(
                    parent.tagName
                )
            ) {

                continue;

            }


            /*
             * data-key handled separately.
             */

            if (
                parent.closest(
                    "[data-key]"
                )
            ) {

                continue;

            }


            if (
                !node.nodeValue.trim()
            ) {

                continue;

            }


            nodes.push(node);

        }


        nodes.forEach(
            function (node) {

                const original =
                    node.nodeValue
                        .replace(/\s+/g, " ")
                        .trim();


                const result =
                    translate(original);


                if (
                    result &&
                    result !== original
                ) {

                    const leading =
                        node.nodeValue.match(
                            /^\s*/
                        )?.[0] || "";


                    const trailing =
                        node.nodeValue.match(
                            /\s*$/
                        )?.[0] || "";


                    node.nodeValue =
                        leading +
                        result +
                        trailing;

                }

            }
        );

    }


    /* =====================================================
       TRANSLATE PAGE
       ===================================================== */

    function translatePage() {

        if (!document.body) {

            return;

        }


        translateDataKeys();

        translatePlaceholders();

        translateNormalText();

    }


    /* =====================================================
       OUTSIDE CLICK
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const menu =
                document.getElementById(
                    "cpt-language-menu"
                );


            if (!menu) {

                return;

            }


            const button =
                getLanguageButton();


            if (
                menu.contains(
                    event.target
                )
            ) {

                return;

            }


            if (
                button &&
                button.contains(
                    event.target
                )
            ) {

                return;

            }


            closeLanguageMenu();

        },
        true
    );


    /* =====================================================
       ESCAPE
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeLanguageMenu();

            }

        }
    );


    /* =====================================================
       RESIZE
       ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            const menu =
                document.getElementById(
                    "cpt-language-menu"
                );


            if (
                menu &&
                menu.classList.contains(
                    "cpt-open"
                )
            ) {

                positionMenu();

            }

        }
    );


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.CPTTranslator = {

        setLanguage: setLanguage,

        getLanguage: function () {

            return currentLanguage;

        },

        open: openLanguageMenu,

        close: closeLanguageMenu,

        translate: translate,

        refresh: translatePage

    };


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initialize() {

        createLanguageCSS();


        /*
         * Make sure page knows current language.
         */

        const info =
            LANGUAGES[currentLanguage];


        document.documentElement
            .setAttribute(
                "lang",
                currentLanguage
            );


        document.documentElement
            .setAttribute(
                "dir",
                info.dir
            );


        document.documentElement
            .setAttribute(
                "data-language",
                currentLanguage
            );


        /*
         * Create selector.
         */

        createLanguageMenu();


        /*
         * Connect existing button.
         */

        connectButton();


        /*
         * Translate page.
         */

        translatePage();


        /*
         * Update flag again after translation.
         */

        updateCurrentFlag();


        updateLanguageMenu();


        console.log(
            "CPT Translator ready:",
            currentLanguage
        );

    }


    /* =====================================================
       DOM READY
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();

    }


})();
