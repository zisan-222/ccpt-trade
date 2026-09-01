/* =========================================================
   CPTMARKETS
   translator.js
   GLOBAL MULTI-LANGUAGE SYSTEM
   ========================================================= */

(function (window, document) {

    "use strict";


    /* =====================================================
       CONFIG
       ===================================================== */

    const LANGUAGES =
        window.CPT_LANGS || {};

    const TRANSLATIONS =
        window.CPT_TRANSLATIONS || {};

    const LANGUAGE_ORDER =
        window.CPT_LANGUAGE_ORDER || [
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

    const STORAGE_KEY =
        window.CPT_LANGUAGE_STORAGE_KEY ||
        "cptmarkets_language";

    const DEFAULT_LANGUAGE =
        window.CPT_DEFAULT_LANGUAGE ||
        "en";


    /* =====================================================
       CURRENT LANGUAGE
       ===================================================== */

    let currentLanguage =
        getSavedLanguage();


    /* =====================================================
       LANGUAGE KEY MAP
       =====================================================

       These are the actual data-key values used by
       your HTML files.
       ===================================================== */

    const KEY_TEXT = {

        navHome: "Home",
        navMarkets: "Markets",
        navAssets: "Assets",
        navMine: "Mine",
        navTrade: "Trade",

        fundingAccount: "Funding Account",
        withdraw: "Withdraw",
        transfer: "Transfer",
        loan: "Loan",
        myOrders: "My Orders",

        totalAssets: "Total Assets",
        deposit: "Deposit",
        myAssets: "My Assets",
        history: "History",
        support: "Support",

        username: "Username",
        password: "Password",
        security: "Security",

        announcements: "Announcements",
        accountSecurity: "Account Security",
        leverage: "Leverage",

        available: "Available",
        frozen: "Frozen",
        mainWalletBalance: "Main Wallet Balance",
        spotAccount: "Spot Account",
        spotTradingAssets: "Spot Trading Assets",
        futuresAccount: "Futures Account",
        futuresBalance: "Futures Balance",

        noRecords: "No records",

        copyTrade: "Copy Trade",
        wealth: "Wealth",
        mining: "Mining",
        invite: "Invite",

        hotMarkets: "Hot Markets",

        signin: "Sign In",
        createAccount: "Create Account",
        forgotPassword: "Forgot Password?",

        todayPL: "Today P/L",
        totalPL: "Total P/L",

        open: "Open",

        copyTrading: "Copy Trading",
        wealthMining: "Wealth Mining",
        inviteFriends: "Invite Friends",
        walletManagement: "Wallet Management",

        signOut: "Sign Out",

        loginPassword: "Login Password",
        protectAccount: "Protect your account",
        keepAccountSafe: "Keep your account safe",

        securityVerification: "Security Verification",
        manageVerification: "Manage Verification",

        confirmPassword: "Confirm Password",
        inviteCode: "Invite Code",

        register: "Register",
        alreadyAccount: "Already have an account?",

        settingsTitle: "Settings",
        changePassword: "Change Password",
        language: "Language",
        darkMode: "Dark Mode",
        appVersion: "App Version",

        latest: "Latest",
        accountHelp: "Account Help",
        manageProfile: "Manage Profile",

        addFunds: "Add Funds",
        payoutRequests: "Payout Requests",
        generalSupport: "General Support",

        convertedLots: "Converted Lots",
        contractValue: "Contract Value",
        entryPrice: "Entry Price",
        currentPrice: "Current Price",
        amount: "Amount",

        transferFunds: "Transfer Funds",
        transferAmount: "Transfer Amount",

        globalWithdrawal: "Global Withdrawal",
        globalPlatform: "Global Platform",
        availableUSDT: "Available USDT",

        paymentMethod: "Payment Method",
        selectPayout: "Select Payout",
        confirmWithdrawal: "Confirm Withdrawal",
        payoutGateway: "Payout Gateway",

        bankWire: "Bank Wire",
        cryptoWallet: "Crypto Wallet"

    };


    /* =====================================================
       PLACEHOLDER KEY MAP
       ===================================================== */

    const PLACEHOLDER_TEXT = {

        username: "Enter Username",

        password: "Password (min. 6 chars)",

        confirmPassword: "Confirm Password",

        inviteCode: "Invite Code (optional)",

        enterAmount: "Enter Amount",

        enterMobile: "Enter Mobile",

        cryptoAddress: "Crypto Address",

        securityPassword: "Security Password"

    };


    /* =====================================================
       EXTRA TRANSLATIONS
       =====================================================

       These keys are used by your actual HTML but were
       missing from the previous lang.js database.
       ===================================================== */

    const EXTRA_TRANSLATIONS = {

        en: {

            "Funding Account": "Funding Account",
            "My Orders": "My Orders",
            "Loan": "Loan",
            "Available": "Available",
            "Frozen": "Frozen",
            "Main Wallet Balance": "Main Wallet Balance",
            "Spot Account": "Spot Account",
            "Spot Trading Assets": "Spot Trading Assets",
            "Futures Account": "Futures Account",
            "Futures Balance": "Futures Balance",
            "Copy Trade": "Copy Trade",
            "Wealth": "Wealth",
            "Mining": "Mining",
            "Invite": "Invite",
            "Hot Markets": "Hot Markets",
            "Already have an account?":
                "Already have an account?",
            "Create Account": "Create Account",
            "Protect your account":
                "Protect your account",
            "Keep your account safe":
                "Keep your account safe",
            "Announcements": "Announcements",
            "Latest": "Latest",
            "Account Help": "Account Help",
            "Manage Profile": "Manage Profile",
            "Add Funds": "Add Funds",
            "Payout Requests": "Payout Requests",
            "General Support": "General Support",
            "Converted Lots": "Converted Lots",
            "Contract Value": "Contract Value",
            "Transfer Funds": "Transfer Funds",
            "Transfer Amount": "Transfer Amount",
            "Global Withdrawal": "Global Withdrawal",
            "Global Platform": "Global Platform",
            "Available USDT": "Available USDT",
            "Payment Method": "Payment Method",
            "Select Payout": "Select Payout",
            "Confirm Withdrawal":
                "Confirm Withdrawal",
            "Payout Gateway": "Payout Gateway",
            "Bank Wire": "Bank Wire",
            "Crypto Wallet": "Crypto Wallet"

        },

        bn: {

            "Funding Account": "ফান্ডিং অ্যাকাউন্ট",
            "My Orders": "আমার অর্ডার",
            "Loan": "লোন",
            "Available": "উপলভ্য",
            "Frozen": "ফ্রোজেন",
            "Main Wallet Balance": "মেইন ওয়ালেট ব্যালেন্স",
            "Spot Account": "স্পট অ্যাকাউন্ট",
            "Spot Trading Assets":
                "স্পট ট্রেডিং অ্যাসেটস",
            "Futures Account": "ফিউচার্স অ্যাকাউন্ট",
            "Futures Balance": "ফিউচার্স ব্যালেন্স",
            "Copy Trade": "কপি ট্রেড",
            "Wealth": "সম্পদ",
            "Mining": "মাইনিং",
            "Invite": "আমন্ত্রণ",
            "Hot Markets": "জনপ্রিয় মার্কেট",
            "Already have an account?":
                "ইতিমধ্যে অ্যাকাউন্ট আছে?",
            "Create Account":
                "অ্যাকাউন্ট তৈরি করুন",
            "Protect your account":
                "আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন",
            "Keep your account safe":
                "আপনার অ্যাকাউন্ট নিরাপদ রাখুন",
            "Announcements": "ঘোষণা",
            "Latest": "সর্বশেষ",
            "Account Help": "অ্যাকাউন্ট সহায়তা",
            "Manage Profile":
                "প্রোফাইল পরিচালনা করুন",
            "Add Funds": "ফান্ড যোগ করুন",
            "Payout Requests":
                "পেআউট অনুরোধ",
            "General Support":
                "সাধারণ সহায়তা",
            "Converted Lots":
                "কনভার্টেড লট",
            "Contract Value":
                "কনট্রাক্ট মূল্য",
            "Transfer Funds":
                "ফান্ড ট্রান্সফার",
            "Transfer Amount":
                "ট্রান্সফার পরিমাণ",
            "Global Withdrawal":
                "গ্লোবাল উইথড্রয়াল",
            "Global Platform":
                "গ্লোবাল প্ল্যাটফর্ম",
            "Available USDT":
                "উপলভ্য USDT",
            "Payment Method":
                "পেমেন্ট পদ্ধতি",
            "Select Payout":
                "পেআউট নির্বাচন করুন",
            "Confirm Withdrawal":
                "উইথড্রয়াল নিশ্চিত করুন",
            "Payout Gateway":
                "পেআউট গেটওয়ে",
            "Bank Wire":
                "ব্যাংক ওয়্যার",
            "Crypto Wallet":
                "ক্রিপ্টো ওয়ালেট"

        },

        ar: {

            "Funding Account": "حساب التمويل",
            "My Orders": "طلباتي",
            "Loan": "القرض",
            "Available": "متاح",
            "Frozen": "مجمد",
            "Main Wallet Balance":
                "رصيد المحفظة الرئيسية",
            "Spot Account": "حساب التداول الفوري",
            "Spot Trading Assets":
                "أصول التداول الفوري",
            "Futures Account":
                "حساب العقود الآجلة",
            "Futures Balance":
                "رصيد العقود الآجلة",
            "Copy Trade": "نسخ التداول",
            "Wealth": "الثروة",
            "Mining": "التعدين",
            "Invite": "دعوة",
            "Hot Markets": "الأسواق الرائجة",
            "Already have an account?":
                "هل لديك حساب بالفعل؟",
            "Create Account": "إنشاء حساب",
            "Protect your account":
                "احمِ حسابك",
            "Keep your account safe":
                "حافظ على أمان حسابك",
            "Announcements": "الإعلانات",
            "Latest": "الأحدث",
            "Account Help": "مساعدة الحساب",
            "Manage Profile": "إدارة الملف الشخصي",
            "Add Funds": "إضافة أموال",
            "Payout Requests":
                "طلبات الدفع",
            "General Support":
                "الدعم العام",
            "Converted Lots":
                "اللوتات المحولة",
            "Contract Value":
                "قيمة العقد",
            "Transfer Funds":
                "تحويل الأموال",
            "Transfer Amount":
                "مبلغ التحويل",
            "Global Withdrawal":
                "السحب العالمي",
            "Global Platform":
                "المنصة العالمية",
            "Available USDT":
                "USDT المتاح",
            "Payment Method":
                "طريقة الدفع",
            "Select Payout":
                "اختر طريقة الدفع",
            "Confirm Withdrawal":
                "تأكيد السحب",
            "Payout Gateway":
                "بوابة الدفع",
            "Bank Wire":
                "تحويل بنكي",
            "Crypto Wallet":
                "محفظة العملات الرقمية"

        },

        hi: {

            "Funding Account": "फंडिंग अकाउंट",
            "My Orders": "मेरे ऑर्डर",
            "Loan": "लोन",
            "Available": "उपलब्ध",
            "Frozen": "फ्रोजन",
            "Main Wallet Balance":
                "मुख्य वॉलेट बैलेंस",
            "Spot Account": "स्पॉट अकाउंट",
            "Spot Trading Assets":
                "स्पॉट ट्रेडिंग एसेट्स",
            "Futures Account":
                "फ्यूचर्स अकाउंट",
            "Futures Balance":
                "फ्यूचर्स बैलेंस",
            "Copy Trade": "कॉपी ट्रेड",
            "Wealth": "संपत्ति",
            "Mining": "माइनिंग",
            "Invite": "आमंत्रित करें",
            "Hot Markets": "लोकप्रिय मार्केट",
            "Already have an account?":
                "क्या आपके पास पहले से खाता है?",
            "Create Account":
                "खाता बनाएं",
            "Protect your account":
                "अपने खाते को सुरक्षित रखें",
            "Keep your account safe":
                "अपने खाते को सुरक्षित रखें",
            "Announcements": "घोषणाएं",
            "Latest": "नवीनतम",
            "Account Help": "खाता सहायता",
            "Manage Profile":
                "प्रोफ़ाइल प्रबंधित करें",
            "Add Funds": "फंड जोड़ें",
            "Payout Requests":
                "भुगतान अनुरोध",
            "General Support":
                "सामान्य सहायता",
            "Converted Lots":
                "कन्वर्टेड लॉट्स",
            "Contract Value":
                "कॉन्ट्रैक्ट वैल्यू",
            "Transfer Funds":
                "फंड ट्रांसफर करें",
            "Transfer Amount":
                "ट्रांसफर राशि",
            "Global Withdrawal":
                "ग्लोबल निकासी",
            "Global Platform":
                "ग्लोबल प्लेटफॉर्म",
            "Available USDT":
                "उपलब्ध USDT",
            "Payment Method":
                "भुगतान विधि",
            "Select Payout":
                "भुगतान चुनें",
            "Confirm Withdrawal":
                "निकासी की पुष्टि करें",
            "Payout Gateway":
                "भुगतान गेटवे",
            "Bank Wire":
                "बैंक वायर",
            "Crypto Wallet":
                "क्रिप्टो वॉलेट"

        },

        es: {

            "Funding Account": "Cuenta de fondos",
            "My Orders": "Mis órdenes",
            "Loan": "Préstamo",
            "Available": "Disponible",
            "Frozen": "Congelado",
            "Main Wallet Balance":
                "Saldo de la billetera principal",
            "Spot Account": "Cuenta spot",
            "Spot Trading Assets":
                "Activos de trading spot",
            "Futures Account":
                "Cuenta de futuros",
            "Futures Balance":
                "Saldo de futuros",
            "Copy Trade": "Copy Trading",
            "Wealth": "Patrimonio",
            "Mining": "Minería",
            "Invite": "Invitar",
            "Hot Markets": "Mercados populares",
            "Already have an account?":
                "¿Ya tienes una cuenta?",
            "Create Account":
                "Crear cuenta",
            "Protect your account":
                "Protege tu cuenta",
            "Keep your account safe":
                "Mantén tu cuenta segura",
            "Announcements": "Anuncios",
            "Latest": "Último",
            "Account Help": "Ayuda de cuenta",
            "Manage Profile":
                "Administrar perfil",
            "Add Funds": "Añadir fondos",
            "Payout Requests":
                "Solicitudes de pago",
            "General Support":
                "Soporte general",
            "Converted Lots":
                "Lotes convertidos",
            "Contract Value":
                "Valor del contrato",
            "Transfer Funds":
                "Transferir fondos",
            "Transfer Amount":
                "Importe de transferencia",
            "Global Withdrawal":
                "Retiro global",
            "Global Platform":
                "Plataforma global",
            "Available USDT":
                "USDT disponible",
            "Payment Method":
                "Método de pago",
            "Select Payout":
                "Seleccionar pago",
            "Confirm Withdrawal":
                "Confirmar retiro",
            "Payout Gateway":
                "Pasarela de pago",
            "Bank Wire":
                "Transferencia bancaria",
            "Crypto Wallet":
                "Billetera de criptomonedas"

        },

        zh: {

            "Funding Account": "资金账户",
            "My Orders": "我的订单",
            "Loan": "贷款",
            "Available": "可用",
            "Frozen": "冻结",
            "Main Wallet Balance":
                "主钱包余额",
            "Spot Account": "现货账户",
            "Spot Trading Assets":
                "现货交易资产",
            "Futures Account":
                "合约账户",
            "Futures Balance":
                "合约余额",
            "Copy Trade": "跟单交易",
            "Wealth": "财富",
            "Mining": "挖矿",
            "Invite": "邀请",
            "Hot Markets": "热门市场",
            "Already have an account?":
                "已经有账户了吗？",
            "Create Account": "创建账户",
            "Protect your account":
                "保护您的账户",
            "Keep your account safe":
                "确保您的账户安全",
            "Announcements": "公告",
            "Latest": "最新",
            "Account Help": "账户帮助",
            "Manage Profile": "管理个人资料",
            "Add Funds": "添加资金",
            "Payout Requests": "付款请求",
            "General Support": "一般支持",
            "Converted Lots": "转换手数",
            "Contract Value": "合约价值",
            "Transfer Funds": "转账",
            "Transfer Amount": "转账金额",
            "Global Withdrawal": "全球提现",
            "Global Platform": "全球平台",
            "Available USDT": "可用 USDT",
            "Payment Method": "支付方式",
            "Select Payout": "选择付款方式",
            "Confirm Withdrawal": "确认提现",
            "Payout Gateway": "付款网关",
            "Bank Wire": "银行电汇",
            "Crypto Wallet": "加密钱包"

        },

        ja: {

            "Funding Account": "資金口座",
            "My Orders": "注文履歴",
            "Loan": "ローン",
            "Available": "利用可能",
            "Frozen": "凍結",
            "Main Wallet Balance":
                "メインウォレット残高",
            "Spot Account": "現物口座",
            "Spot Trading Assets":
                "現物取引資産",
            "Futures Account":
                "先物口座",
            "Futures Balance":
                "先物残高",
            "Copy Trade": "コピートレード",
            "Wealth": "資産",
            "Mining": "マイニング",
            "Invite": "招待",
            "Hot Markets": "人気市場",
            "Already have an account?":
                "すでにアカウントをお持ちですか？",
            "Create Account": "アカウントを作成",
            "Protect your account":
                "アカウントを保護する",
            "Keep your account safe":
                "アカウントを安全に保つ",
            "Announcements": "お知らせ",
            "Latest": "最新",
            "Account Help": "アカウントヘルプ",
            "Manage Profile": "プロフィール管理",
            "Add Funds": "資金を追加",
            "Payout Requests": "支払いリクエスト",
            "General Support": "一般サポート",
            "Converted Lots": "変換ロット",
            "Contract Value": "契約価値",
            "Transfer Funds": "資金を送金",
            "Transfer Amount": "送金額",
            "Global Withdrawal": "グローバル出金",
            "Global Platform": "グローバルプラットフォーム",
            "Available USDT": "利用可能なUSDT",
            "Payment Method": "支払い方法",
            "Select Payout": "支払い方法を選択",
            "Confirm Withdrawal": "出金を確認",
            "Payout Gateway": "支払いゲートウェイ",
            "Bank Wire": "銀行送金",
            "Crypto Wallet": "暗号資産ウォレット"

        },

        fr: {

            "Funding Account": "Compte de financement",
            "My Orders": "Mes ordres",
            "Loan": "Prêt",
            "Available": "Disponible",
            "Frozen": "Gelé",
            "Main Wallet Balance":
                "Solde du portefeuille principal",
            "Spot Account": "Compte spot",
            "Spot Trading Assets":
                "Actifs de trading spot",
            "Futures Account":
                "Compte futures",
            "Futures Balance":
                "Solde futures",
            "Copy Trade": "Copy Trading",
            "Wealth": "Patrimoine",
            "Mining": "Minage",
            "Invite": "Inviter",
            "Hot Markets": "Marchés populaires",
            "Already have an account?":
                "Vous avez déjà un compte ?",
            "Create Account":
                "Créer un compte",
            "Protect your account":
                "Protégez votre compte",
            "Keep your account safe":
                "Gardez votre compte sécurisé",
            "Announcements": "Annonces",
            "Latest": "Dernières nouveautés",
            "Account Help": "Aide du compte",
            "Manage Profile":
                "Gérer le profil",
            "Add Funds": "Ajouter des fonds",
            "Payout Requests":
                "Demandes de paiement",
            "General Support":
                "Assistance générale",
            "Converted Lots":
                "Lots convertis",
            "Contract Value":
                "Valeur du contrat",
            "Transfer Funds":
                "Transférer des fonds",
            "Transfer Amount":
                "Montant du transfert",
            "Global Withdrawal":
                "Retrait global",
            "Global Platform":
                "Plateforme mondiale",
            "Available USDT":
                "USDT disponible",
            "Payment Method":
                "Mode de paiement",
            "Select Payout":
                "Sélectionner le paiement",
            "Confirm Withdrawal":
                "Confirmer le retrait",
            "Payout Gateway":
                "Passerelle de paiement",
            "Bank Wire":
                "Virement bancaire",
            "Crypto Wallet":
                "Portefeuille crypto"

        },

        de: {

            "Funding Account": "Finanzkonto",
            "My Orders": "Meine Aufträge",
            "Loan": "Darlehen",
            "Available": "Verfügbar",
            "Frozen": "Eingefroren",
            "Main Wallet Balance":
                "Guthaben der Haupt-Wallet",
            "Spot Account": "Spot-Konto",
            "Spot Trading Assets":
                "Spot-Handelsvermögen",
            "Futures Account":
                "Futures-Konto",
            "Futures Balance":
                "Futures-Guthaben",
            "Copy Trade": "Copy Trading",
            "Wealth": "Vermögen",
            "Mining": "Mining",
            "Invite": "Einladen",
            "Hot Markets": "Beliebte Märkte",
            "Already have an account?":
                "Haben Sie bereits ein Konto?",
            "Create Account":
                "Konto erstellen",
            "Protect your account":
                "Schützen Sie Ihr Konto",
            "Keep your account safe":
                "Halten Sie Ihr Konto sicher",
            "Announcements": "Ankündigungen",
            "Latest": "Neueste",
            "Account Help": "Kontohilfe",
            "Manage Profile":
                "Profil verwalten",
            "Add Funds": "Guthaben hinzufügen",
            "Payout Requests":
                "Auszahlungsanfragen",
            "General Support":
                "Allgemeiner Support",
            "Converted Lots":
                "Konvertierte Lots",
            "Contract Value":
                "Vertragswert",
            "Transfer Funds":
                "Guthaben übertragen",
            "Transfer Amount":
                "Überweisungsbetrag",
            "Global Withdrawal":
                "Globale Auszahlung",
            "Global Platform":
                "Globale Plattform",
            "Available USDT":
                "Verfügbares USDT",
            "Payment Method":
                "Zahlungsmethode",
            "Select Payout":
                "Auszahlung auswählen",
            "Confirm Withdrawal":
                "Auszahlung bestätigen",
            "Payout Gateway":
                "Auszahlungs-Gateway",
            "Bank Wire":
                "Banküberweisung",
            "Crypto Wallet":
                "Krypto-Wallet"

        },

        ru: {

            "Funding Account": "Финансовый счёт",
            "My Orders": "Мои ордера",
            "Loan": "Кредит",
            "Available": "Доступно",
            "Frozen": "Заморожено",
            "Main Wallet Balance":
                "Баланс основного кошелька",
            "Spot Account": "Спотовый счёт",
            "Spot Trading Assets":
                "Спотовые активы",
            "Futures Account":
                "Фьючерсный счёт",
            "Futures Balance":
                "Баланс фьючерсов",
            "Copy Trade": "Копитрейдинг",
            "Wealth": "Капитал",
            "Mining": "Майнинг",
            "Invite": "Пригласить",
            "Hot Markets": "Популярные рынки",
            "Already have an account?":
                "Уже есть аккаунт?",
            "Create Account":
                "Создать аккаунт",
            "Protect your account":
                "Защитите свой аккаунт",
            "Keep your account safe":
                "Обеспечьте безопасность аккаунта",
            "Announcements": "Объявления",
            "Latest": "Последние",
            "Account Help": "Помощь по аккаунту",
            "Manage Profile":
                "Управление профилем",
            "Add Funds": "Пополнить счёт",
            "Payout Requests":
                "Запросы на выплату",
            "General Support":
                "Общая поддержка",
            "Converted Lots":
                "Конвертированные лоты",
            "Contract Value":
                "Стоимость контракта",
            "Transfer Funds":
                "Перевести средства",
            "Transfer Amount":
                "Сумма перевода",
            "Global Withdrawal":
                "Глобальный вывод",
            "Global Platform":
                "Глобальная платформа",
            "Available USDT":
                "Доступный USDT",
            "Payment Method":
                "Способ оплаты",
            "Select Payout":
                "Выберите выплату",
            "Confirm Withdrawal":
                "Подтвердить вывод",
            "Payout Gateway":
                "Платёжный шлюз",
            "Bank Wire":
                "Банковский перевод",
            "Crypto Wallet":
                "Криптокошелёк"

        }

    };


    /* =====================================================
       LANGUAGE HELPERS
       ===================================================== */

    function isValidLanguage(language) {

        return Object.prototype.hasOwnProperty.call(
            LANGUAGES,
            language
        );

    }


    function getSavedLanguage() {

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (
                saved &&
                isValidLanguage(saved)
            ) {

                return saved;

            }

        } catch (error) {

            console.warn(
                "CPTMarkets language storage error:",
                error
            );

        }

        return DEFAULT_LANGUAGE;

    }


    function saveLanguage(language) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                language
            );

        } catch (error) {

            console.warn(
                "CPTMarkets could not save language:",
                error
            );

        }

    }


    function getLanguageInfo(language) {

        return LANGUAGES[language] ||
               LANGUAGES[DEFAULT_LANGUAGE];

    }


    /* =====================================================
       TRANSLATION LOOKUP
       ===================================================== */

    function translateText(
        text,
        language = currentLanguage
    ) {

        if (!text) {

            return text;

        }


        const clean =
            String(text)
                .replace(/\s+/g, " ")
                .trim();


        /*
         * First use lang.js
         */

        if (
            TRANSLATIONS[language] &&
            Object.prototype.hasOwnProperty.call(
                TRANSLATIONS[language],
                clean
            )
        ) {

            return TRANSLATIONS[language][clean];

        }


        /*
         * Then use extra translations.
         */

        if (
            EXTRA_TRANSLATIONS[language] &&
            Object.prototype.hasOwnProperty.call(
                EXTRA_TRANSLATIONS[language],
                clean
            )
        ) {

            return EXTRA_TRANSLATIONS[language][clean];

        }


        /*
         * English fallback.
         */

        if (
            TRANSLATIONS.en &&
            Object.prototype.hasOwnProperty.call(
                TRANSLATIONS.en,
                clean
            )
        ) {

            return TRANSLATIONS.en[clean];

        }


        return clean;

    }


    /* =====================================================
       KEY → TRANSLATION
       ===================================================== */

    function translateKey(
        key,
        language = currentLanguage
    ) {

        if (!key) {

            return "";

        }


        const englishText =
            KEY_TEXT[key];


        if (!englishText) {

            return "";

        }


        return translateText(
            englishText,
            language
        );

    }


    /* =====================================================
       PLACEHOLDER TRANSLATION
       ===================================================== */

    function translatePlaceholder(
        key,
        language = currentLanguage
    ) {

        const englishText =
            PLACEHOLDER_TEXT[key];


        if (!englishText) {

            return "";

        }


        return translateText(
            englishText,
            language
        );

    }


    /* =====================================================
       TRANSLATE DATA-KEY ELEMENTS
       ===================================================== */

    function translateDataKeys() {

        const elements =
            document.querySelectorAll(
                "[data-key]"
            );


        elements.forEach(
            function (element) {

                if (
                    element.closest(
                        "#cptLanguageMenu"
                    )
                ) {

                    return;

                }


                const key =
                    element.getAttribute(
                        "data-key"
                    );


                const translated =
                    translateKey(
                        key
                    );


                if (!translated) {

                    return;

                }


                /*
                 * Save original HTML only once.
                 *
                 * This is important because some of your
                 * HTML has icons inside the same element.
                 */

                if (
                    element.dataset
                        .cptOriginalHTML ===
                    undefined
                ) {

                    element.dataset
                        .cptOriginalHTML =
                        element.innerHTML;

                }


                /*
                 * If element contains child elements
                 * such as icons, only replace text nodes.
                 */

                replaceElementText(
                    element,
                    translated
                );

            }
        );

    }


    /* =====================================================
       REPLACE ELEMENT TEXT
       ===================================================== */

    function replaceElementText(
        element,
        translated
    ) {

        /*
         * Find the first meaningful text node.
         */

        const walker =
            document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null
            );


        let textNode = null;


        while (
            walker.nextNode()
        ) {

            const node =
                walker.currentNode;


            if (
                node.parentElement &&
                !node.parentElement.closest(
                    "#cptLanguageMenu"
                ) &&
                node.nodeValue.trim()
            ) {

                textNode = node;

                break;

            }

        }


        if (textNode) {

            if (
                textNode.__cptOriginalText ===
                undefined
            ) {

                textNode.__cptOriginalText =
                    textNode.nodeValue;

            }


            const original =
                textNode.__cptOriginalText;


            const leading =
                original.match(
                    /^\s*/
                )?.[0] || "";


            const trailing =
                original.match(
                    /\s*$/
                )?.[0] || "";


            textNode.nodeValue =
                leading +
                translated +
                trailing;

        } else {

            /*
             * If there is no child text node,
             * set text directly.
             */

            element.textContent =
                translated;

        }

    }


    /* =====================================================
       TRANSLATE PLACEHOLDERS
       ===================================================== */

    function translatePlaceholders() {

        const elements =
            document.querySelectorAll(
                "[data-ph-key]"
            );


        elements.forEach(
            function (element) {

                const key =
                    element.getAttribute(
                        "data-ph-key"
                    );


                const translated =
                    translatePlaceholder(
                        key
                    );


                if (!translated) {

                    return;

                }


                element.placeholder =
                    translated;

            }
        );

    }


    /* =====================================================
       TRANSLATE NORMAL TEXT
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


            if (!node.parentElement) {

                continue;

            }


            const parent =
                node.parentElement;


            if (
                parent.closest(
                    "#cptLanguageMenu"
                )
            ) {

                continue;

            }


            const tag =
                parent.tagName;


            if (
                [
                    "SCRIPT",
                    "STYLE",
                    "NOSCRIPT",
                    "CODE",
                    "PRE",
                    "TEXTAREA"
                ].includes(tag)
            ) {

                continue;

            }


            /*
             * data-key elements are handled separately.
             */

            if (
                parent.closest(
                    "[data-key]"
                )
            ) {

                continue;

            }


            const text =
                node.nodeValue;


            if (
                !text ||
                !text.trim()
            ) {

                continue;

            }


            nodes.push(
                node
            );

        }


        nodes.forEach(
            function (node) {

                if (
                    node.__cptOriginalText ===
                    undefined
                ) {

                    node.__cptOriginalText =
                        node.nodeValue;

                }


                const original =
                    node.__cptOriginalText
                        .replace(/\s+/g, " ")
                        .trim();


                if (!original) {

                    return;

                }


                const translated =
                    translateText(
                        original
                    );


                const leading =
                    node.__cptOriginalText
                        .match(/^\s*/)?.[0] ||
                    "";


                const trailing =
                    node.__cptOriginalText
                        .match(/\s*$/)?.[0] ||
                    "";


                node.nodeValue =
                    leading +
                    translated +
                    trailing;

            }
        );

    }


    /* =====================================================
       PAGE TRANSLATION
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
       DOCUMENT DIRECTION
       ===================================================== */

    function updateDocumentDirection() {

        const info =
            getLanguageInfo(
                currentLanguage
            );


        document.documentElement
            .setAttribute(
                "lang",
                currentLanguage
            );


        document.documentElement
            .setAttribute(
                "dir",
                info.direction || "ltr"
            );


        document.documentElement
            .setAttribute(
                "data-language",
                currentLanguage
            );

    }


    /* =====================================================
       LANGUAGE BUTTONS
       ===================================================== */

    function getLanguageButtons() {

        const buttons = [];


        const selectors = [
            "#languageBtn",
            "[data-language-button]",
            ".language-btn"
        ];


        selectors.forEach(
            function (selector) {

                document
                    .querySelectorAll(selector)
                    .forEach(
                        function (button) {

                            if (
                                !buttons.includes(
                                    button
                                )
                            ) {

                                buttons.push(
                                    button
                                );

                            }

                        }
                    );

            }
        );


        return buttons;

    }


    /* =====================================================
       UPDATE SELECTED FLAG
       ===================================================== */

    function updateLanguageButtons() {

        const info =
            getLanguageInfo(
                currentLanguage
            );


        getLanguageButtons()
            .forEach(
                function (button) {

                    /*
                     * Your HTML button should show
                     * only the selected flag.
                     */

                    button.innerHTML =
                        '<span class="cpt-selected-flag">' +
                        info.flag +
                        '</span>';


                    button.setAttribute(
                        "aria-label",
                        info.name
                    );


                    button.setAttribute(
                        "title",
                        info.nativeName
                    );


                    button.dataset.language =
                        currentLanguage;

                }
            );

    }


    /* =====================================================
       LANGUAGE MENU
       ===================================================== */

    function createLanguageMenu() {

        let menu =
            document.getElementById(
                "cptLanguageMenu"
            );


        if (menu) {

            return menu;

        }


        menu =
            document.createElement(
                "div"
            );


        menu.id =
            "cptLanguageMenu";


        menu.setAttribute(
            "role",
            "menu"
        );


        LANGUAGE_ORDER.forEach(
            function (code) {

                const info =
                    getLanguageInfo(
                        code
                    );


                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.className =
                    "cpt-language-item";


                item.dataset.language =
                    code;


                item.innerHTML =

                    '<span class="cpt-language-flag">' +
                    info.flag +
                    '</span>' +

                    '<span class="cpt-language-name">' +
                    info.nativeName +
                    '</span>' +

                    '<span class="cpt-language-check">' +
                    '✓' +
                    '</span>';


                item.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        setLanguage(
                            code
                        );


                        closeLanguageMenu();

                    }
                );


                menu.appendChild(
                    item
                );

            }
        );


        document.body.appendChild(
            menu
        );


        updateLanguageMenu();


        return menu;

    }


    /* =====================================================
       UPDATE MENU
       ===================================================== */

    function updateLanguageMenu() {

        const menu =
            document.getElementById(
                "cptLanguageMenu"
            );


        if (!menu) {

            return;

        }


        menu.querySelectorAll(
            ".cpt-language-item"
        )
        .forEach(
            function (item) {

                const selected =
                    item.dataset.language ===
                    currentLanguage;


                item.classList.toggle(
                    "active",
                    selected
                );


                item.setAttribute(
                    "aria-selected",
                    selected
                        ? "true"
                        : "false"
                );


                const check =
                    item.querySelector(
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
       OPEN MENU
       ===================================================== */

    function openLanguageMenu(
        button
    ) {

        const menu =
            createLanguageMenu();


        updateLanguageMenu();


        menu.style.display =
            "block";


        menu.classList.add(
            "open"
        );


        const rect =
            button.getBoundingClientRect();


        const menuRect =
            menu.getBoundingClientRect();


        let top =
            rect.bottom + 8;


        let left =
            rect.right -
            menuRect.width;


        const margin =
            10;


        if (
            left < margin
        ) {

            left =
                margin;

        }


        if (
            left +
            menuRect.width >
            window.innerWidth -
            margin
        ) {

            left =
                window.innerWidth -
                menuRect.width -
                margin;

        }


        if (
            top +
            menuRect.height >
            window.innerHeight -
            margin
        ) {

            top =
                rect.top -
                menuRect.height -
                8;

        }


        menu.style.top =
            Math.max(
                margin,
                top
            ) + "px";


        menu.style.left =
            Math.max(
                margin,
                left
            ) + "px";

    }


    /* =====================================================
       CLOSE MENU
       ===================================================== */

    function closeLanguageMenu() {

        const menu =
            document.getElementById(
                "cptLanguageMenu"
            );


        if (!menu) {

            return;

        }


        menu.classList.remove(
            "open"
        );


        menu.style.display =
            "none";

    }


    /* =====================================================
       BUTTON EVENTS
       ===================================================== */

    function connectLanguageButtons() {

        getLanguageButtons()
            .forEach(
                function (button) {

                    if (
                        button.dataset
                            .cptConnected ===
                        "true"
                    ) {

                        return;

                    }


                    button.dataset
                        .cptConnected =
                        "true";


                    button.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();

                            event.stopPropagation();


                            const menu =
                                document.getElementById(
                                    "cptLanguageMenu"
                                );


                            if (
                                menu &&
                                menu.classList.contains(
                                    "open"
                                )
                            ) {

                                closeLanguageMenu();

                            } else {

                                openLanguageMenu(
                                    button
                                );

                            }

                        }
                    );

                }
            );

    }


    /* =====================================================
       SET LANGUAGE
       ===================================================== */

    function setLanguage(
        language
    ) {

        if (
            !isValidLanguage(
                language
            )
        ) {

            language =
                DEFAULT_LANGUAGE;

        }


        currentLanguage =
            language;


        /*
         * THIS IS THE IMPORTANT PART:
         *
         * Save selected language globally.
         *
         * All HTML pages on the same domain
         * will read this value.
         */

        saveLanguage(
            currentLanguage
        );


        updateDocumentDirection();

        translatePage();

        updateLanguageButtons();

        updateLanguageMenu();


        /*
         * Notify other website scripts.
         */

        document.dispatchEvent(
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
       OUTSIDE CLICK
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const menu =
                document.getElementById(
                    "cptLanguageMenu"
                );


            if (!menu) {

                return;

            }


            if (
                menu.contains(
                    event.target
                )
            ) {

                return;

            }


            if (
                event.target.closest &&
                event.target.closest(
                    "#languageBtn, .language-btn, [data-language-button]"
                )
            ) {

                return;

            }


            closeLanguageMenu();

        }
    );


    /* =====================================================
       ESC KEY
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
       STORAGE SYNC
       ===================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key !==
                STORAGE_KEY
            ) {

                return;

            }


            if (
                !event.newValue ||
                !isValidLanguage(
                    event.newValue
                )
            ) {

                return;

            }


            if (
                event.newValue ===
                currentLanguage
            ) {

                return;

            }


            currentLanguage =
                event.newValue;


            updateDocumentDirection();

            translatePage();

            updateLanguageButtons();

            updateLanguageMenu();

        }
    );


    /* =====================================================
       RESIZE
       ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            closeLanguageMenu();

        }
    );


    /* =====================================================
       MUTATION OBSERVER
       ===================================================== */

    function setupMutationObserver() {

        if (
            typeof MutationObserver ===
            "undefined"
        ) {

            return;

        }


        if (!document.body) {

            return;

        }


        let timer = null;


        const observer =
            new MutationObserver(
                function () {

                    clearTimeout(
                        timer
                    );


                    timer =
                        setTimeout(
                            function () {

                                connectLanguageButtons();

                                translateDataKeys();

                                translatePlaceholders();

                                updateLanguageButtons();

                            },
                            100
                        );

                }
            );


        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.CPTSetLanguage =
        function (language) {

            setLanguage(
                language
            );

        };


    window.CPTGetLanguage =
        function () {

            return currentLanguage;

        };


    window.CPTGetLanguageInfo =
        function () {

            return getLanguageInfo(
                currentLanguage
            );

        };


    window.CPTTranslateText =
        function (text) {

            return translateText(
                text
            );

        };


    window.CPTRefreshTranslation =
        function () {

            updateDocumentDirection();

            translatePage();

            updateLanguageButtons();

            updateLanguageMenu();

        };


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initialize() {

        /*
         * Make sure saved language exists.
         */

        if (
            !isValidLanguage(
                currentLanguage
            )
        ) {

            currentLanguage =
                DEFAULT_LANGUAGE;

        }


        updateDocumentDirection();


        /*
         * IMPORTANT:
         * Create menu BEFORE translating.
         */

        createLanguageMenu();


        connectLanguageButtons();


        /*
         * Translate actual website.
         */

        translatePage();


        /*
         * Show selected flag.
         */

        updateLanguageButtons();


        updateLanguageMenu();


        /*
         * Watch dynamically generated content.
         */

        setupMutationObserver();


        /*
         * Ready event.
         */

        document.dispatchEvent(
            new CustomEvent(
                "cptTranslatorReady",
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
       START
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


})(window, document);
