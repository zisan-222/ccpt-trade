/* =========================================================
   CptMarkets
   lang.js
   GLOBAL LANGUAGE DATABASE
   =========================================================

   Supported languages:

   🇬🇧 English
   🇧🇩 Bengali
   🇸🇦 Arabic
   🇮🇳 Hindi
   🇪🇸 Spanish
   🇨🇳 Chinese
   🇯🇵 Japanese
   🇫🇷 French
   🇩🇪 German
   🇷🇺 Russian

   IMPORTANT:
   Do not put translator logic in this file.
   This file contains LANGUAGE DATA only.
   ========================================================= */

(function (window) {

    "use strict";


    /* =====================================================
       LANGUAGE CONFIGURATION
       ===================================================== */

    const languages = {

        en: {
            code: "en",
            name: "English",
            nativeName: "English",
            flag: "🇬🇧",
            direction: "ltr"
        },

        bn: {
            code: "bn",
            name: "Bengali",
            nativeName: "বাংলা",
            flag: "🇧🇩",
            direction: "ltr"
        },

        ar: {
            code: "ar",
            name: "Arabic",
            nativeName: "العربية",
            flag: "🇸🇦",
            direction: "rtl"
        },

        hi: {
            code: "hi",
            name: "Hindi",
            nativeName: "हिन्दी",
            flag: "🇮🇳",
            direction: "ltr"
        },

        es: {
            code: "es",
            name: "Spanish",
            nativeName: "Español",
            flag: "🇪🇸",
            direction: "ltr"
        },

        zh: {
            code: "zh",
            name: "Chinese",
            nativeName: "中文",
            flag: "🇨🇳",
            direction: "ltr"
        },

        ja: {
            code: "ja",
            name: "Japanese",
            nativeName: "日本語",
            flag: "🇯🇵",
            direction: "ltr"
        },

        fr: {
            code: "fr",
            name: "French",
            nativeName: "Français",
            flag: "🇫🇷",
            direction: "ltr"
        },

        de: {
            code: "de",
            name: "German",
            nativeName: "Deutsch",
            flag: "🇩🇪",
            direction: "ltr"
        },

        ru: {
            code: "ru",
            name: "Russian",
            nativeName: "Русский",
            flag: "🇷🇺",
            direction: "ltr"
        }

    };


    /* =====================================================
       TRANSLATION DATABASE
       ===================================================== */

    const translations = {


        /* =================================================
           ENGLISH
           ================================================= */

        en: {

            "Home": "Home",
            "Markets": "Markets",
            "Assets": "Assets",
            "Mine": "Mine",
            "Trade": "Trade",
            "Orders": "Orders",
            "Settings": "Settings",
            "Support": "Support",

            "Login": "Login",
            "Sign In": "Sign In",
            "Sign Out": "Sign Out",
            "Logout": "Logout",
            "Register": "Register",
            "Create Account": "Create Account",
            "Account": "Account",

            "Username": "Username",
            "Password": "Password",
            "Confirm Password": "Confirm Password",
            "Email Address": "Email Address",
            "Invite Code": "Invite Code",

            "Forgot Password?": "Forgot Password?",
            "Remember Me": "Remember Me",

            "All": "All",
            "Forex": "Forex",
            "Crypto": "Crypto",
            "Metals": "Metals",
            "Indices": "Indices",

            "Open": "Open",
            "Close": "Close",
            "Long": "Long",
            "Short": "Short",

            "Amount": "Amount",
            "Balance": "Balance",
            "Available Balance": "Available Balance",
            "Total Assets": "Total Assets",
            "Profit": "Profit",
            "Loss": "Loss",
            "Profit / Loss": "Profit / Loss",
            "Today P/L": "Today P/L",
            "Total P/L": "Total P/L",

            "Deposit": "Deposit",
            "Withdraw": "Withdraw",
            "Withdrawal": "Withdrawal",
            "Transfer": "Transfer",

            "Confirm": "Confirm",
            "Cancel": "Cancel",
            "Submit": "Submit",
            "Save": "Save",
            "Search": "Search",
            "Copy": "Copy",
            "Copied": "Copied",

            "Loading...": "Loading...",
            "No records": "No records",
            "No data available": "No data available",

            "Language": "Language",
            "Dark Mode": "Dark Mode",
            "Notifications": "Notifications",

            "Leverage": "Leverage",
            "Entry Price": "Entry Price",
            "Current Price": "Current Price",
            "Open Trade": "Open Trade",
            "Close Trade": "Close Trade",

            "Customer Service": "Customer Service",
            "Contact Support": "Contact Support",

            "Invite Friends": "Invite Friends",
            "My Invite Code": "My Invite Code",
            "Copy Invite Link": "Copy Invite Link",

            "Security": "Security",
            "Account Security": "Account Security",

            "History": "History",
            "View All": "View All"

        },


        /* =================================================
           BANGLA
           ================================================= */

        bn: {

            "Home": "হোম",
            "Markets": "মার্কেটস",
            "Assets": "অ্যাসেটস",
            "Mine": "আমার অ্যাকাউন্ট",
            "Trade": "ট্রেড",
            "Orders": "অর্ডার",
            "Settings": "সেটিংস",
            "Support": "সাপোর্ট",

            "Login": "লগইন",
            "Sign In": "সাইন ইন",
            "Sign Out": "সাইন আউট",
            "Logout": "লগআউট",
            "Register": "রেজিস্টার",
            "Create Account": "অ্যাকাউন্ট তৈরি করুন",
            "Account": "অ্যাকাউন্ট",

            "Username": "ইউজারনেম",
            "Password": "পাসওয়ার্ড",
            "Confirm Password": "পাসওয়ার্ড নিশ্চিত করুন",
            "Email Address": "ইমেইল ঠিকানা",
            "Invite Code": "ইনভাইট কোড",

            "Forgot Password?": "পাসওয়ার্ড ভুলে গেছেন?",
            "Remember Me": "আমাকে মনে রাখুন",

            "All": "সব",
            "Forex": "ফরেক্স",
            "Crypto": "ক্রিপ্টো",
            "Metals": "মেটালস",
            "Indices": "ইনডেক্স",

            "Open": "খোলা",
            "Close": "বন্ধ",
            "Long": "লং",
            "Short": "শর্ট",

            "Amount": "পরিমাণ",
            "Balance": "ব্যালেন্স",
            "Available Balance": "উপলভ্য ব্যালেন্স",
            "Total Assets": "মোট অ্যাসেটস",
            "Profit": "লাভ",
            "Loss": "ক্ষতি",
            "Profit / Loss": "লাভ / ক্ষতি",
            "Today P/L": "আজকের P/L",
            "Total P/L": "মোট P/L",

            "Deposit": "ডিপোজিট",
            "Withdraw": "উইথড্র",
            "Withdrawal": "উইথড্রয়াল",
            "Transfer": "ট্রান্সফার",

            "Confirm": "নিশ্চিত করুন",
            "Cancel": "বাতিল",
            "Submit": "জমা দিন",
            "Save": "সেভ করুন",
            "Search": "সার্চ",
            "Copy": "কপি",
            "Copied": "কপি হয়েছে",

            "Loading...": "লোড হচ্ছে...",
            "No records": "কোনো রেকর্ড নেই",
            "No data available": "কোনো তথ্য নেই",

            "Language": "ভাষা",
            "Dark Mode": "ডার্ক মোড",
            "Notifications": "নোটিফিকেশন",

            "Leverage": "লিভারেজ",
            "Entry Price": "এন্ট্রি প্রাইস",
            "Current Price": "বর্তমান প্রাইস",
            "Open Trade": "ট্রেড ওপেন করুন",
            "Close Trade": "ট্রেড বন্ধ করুন",

            "Customer Service": "কাস্টমার সার্ভিস",
            "Contact Support": "সাপোর্টে যোগাযোগ করুন",

            "Invite Friends": "বন্ধুদের আমন্ত্রণ করুন",
            "My Invite Code": "আমার ইনভাইট কোড",
            "Copy Invite Link": "ইনভাইট লিংক কপি করুন",

            "Security": "নিরাপত্তা",
            "Account Security": "অ্যাকাউন্ট নিরাপত্তা",

            "History": "হিস্টোরি",
            "View All": "সব দেখুন"

        },


        /* =================================================
           ARABIC
           ================================================= */

        ar: {

            "Home": "الرئيسية",
            "Markets": "الأسواق",
            "Assets": "الأصول",
            "Mine": "حسابي",
            "Trade": "تداول",
            "Orders": "الطلبات",
            "Settings": "الإعدادات",
            "Support": "الدعم",

            "Login": "تسجيل الدخول",
            "Sign In": "تسجيل الدخول",
            "Sign Out": "تسجيل الخروج",
            "Logout": "تسجيل الخروج",
            "Register": "تسجيل",
            "Create Account": "إنشاء حساب",
            "Account": "الحساب",

            "Username": "اسم المستخدم",
            "Password": "كلمة المرور",
            "Confirm Password": "تأكيد كلمة المرور",
            "Email Address": "البريد الإلكتروني",
            "Invite Code": "رمز الدعوة",

            "Forgot Password?": "هل نسيت كلمة المرور؟",
            "Remember Me": "تذكرني",

            "All": "الكل",
            "Forex": "الفوركس",
            "Crypto": "العملات الرقمية",
            "Metals": "المعادن",
            "Indices": "المؤشرات",

            "Open": "مفتوح",
            "Close": "إغلاق",
            "Long": "شراء",
            "Short": "بيع",

            "Amount": "المبلغ",
            "Balance": "الرصيد",
            "Available Balance": "الرصيد المتاح",
            "Total Assets": "إجمالي الأصول",
            "Profit": "الربح",
            "Loss": "الخسارة",
            "Profit / Loss": "الربح / الخسارة",
            "Today P/L": "ربح/خسارة اليوم",
            "Total P/L": "إجمالي الربح/الخسارة",

            "Deposit": "إيداع",
            "Withdraw": "سحب",
            "Withdrawal": "السحب",
            "Transfer": "تحويل",

            "Confirm": "تأكيد",
            "Cancel": "إلغاء",
            "Submit": "إرسال",
            "Save": "حفظ",
            "Search": "بحث",
            "Copy": "نسخ",
            "Copied": "تم النسخ",

            "Loading...": "جارٍ التحميل...",
            "No records": "لا توجد سجلات",
            "No data available": "لا توجد بيانات",

            "Language": "اللغة",
            "Dark Mode": "الوضع الداكن",
            "Notifications": "الإشعارات",

            "Leverage": "الرافعة المالية",
            "Entry Price": "سعر الدخول",
            "Current Price": "السعر الحالي",
            "Open Trade": "فتح صفقة",
            "Close Trade": "إغلاق الصفقة",

            "Customer Service": "خدمة العملاء",
            "Contact Support": "التواصل مع الدعم",

            "Invite Friends": "دعوة الأصدقاء",
            "My Invite Code": "رمز الدعوة الخاص بي",
            "Copy Invite Link": "نسخ رابط الدعوة",

            "Security": "الأمان",
            "Account Security": "أمان الحساب",

            "History": "السجل",
            "View All": "عرض الكل"

        },


        /* =================================================
           HINDI
           ================================================= */

        hi: {

            "Home": "होम",
            "Markets": "मार्केट्स",
            "Assets": "एसेट्स",
            "Mine": "मेरा खाता",
            "Trade": "ट्रेड",
            "Orders": "ऑर्डर",
            "Settings": "सेटिंग्स",
            "Support": "सपोर्ट",

            "Login": "लॉगिन",
            "Sign In": "साइन इन",
            "Sign Out": "साइन आउट",
            "Logout": "लॉगआउट",
            "Register": "रजिस्टर",
            "Create Account": "खाता बनाएं",
            "Account": "खाता",

            "Username": "उपयोगकर्ता नाम",
            "Password": "पासवर्ड",
            "Confirm Password": "पासवर्ड की पुष्टि करें",
            "Email Address": "ईमेल पता",
            "Invite Code": "आमंत्रण कोड",

            "Forgot Password?": "पासवर्ड भूल गए?",
            "Remember Me": "मुझे याद रखें",

            "All": "सभी",
            "Forex": "फॉरेक्स",
            "Crypto": "क्रिप्टो",
            "Metals": "मेटल्स",
            "Indices": "इंडेक्स",

            "Open": "खुला",
            "Close": "बंद",
            "Long": "लॉन्ग",
            "Short": "शॉर्ट",

            "Amount": "राशि",
            "Balance": "बैलेंस",
            "Available Balance": "उपलब्ध बैलेंस",
            "Total Assets": "कुल एसेट्स",
            "Profit": "लाभ",
            "Loss": "हानि",
            "Profit / Loss": "लाभ / हानि",
            "Today P/L": "आज का P/L",
            "Total P/L": "कुल P/L",

            "Deposit": "जमा करें",
            "Withdraw": "निकासी",
            "Withdrawal": "निकासी",
            "Transfer": "ट्रांसफर",

            "Confirm": "पुष्टि करें",
            "Cancel": "रद्द करें",
            "Submit": "जमा करें",
            "Save": "सेव करें",
            "Search": "खोजें",
            "Copy": "कॉपी",
            "Copied": "कॉपी हो गया",

            "Loading...": "लोड हो रहा है...",
            "No records": "कोई रिकॉर्ड नहीं",
            "No data available": "कोई डेटा उपलब्ध नहीं",

            "Language": "भाषा",
            "Dark Mode": "डार्क मोड",
            "Notifications": "सूचनाएं",

            "Leverage": "लीवरेज",
            "Entry Price": "एंट्री प्राइस",
            "Current Price": "वर्तमान प्राइस",
            "Open Trade": "ट्रेड खोलें",
            "Close Trade": "ट्रेड बंद करें",

            "Customer Service": "ग्राहक सेवा",
            "Contact Support": "सपोर्ट से संपर्क करें",

            "Invite Friends": "दोस्तों को आमंत्रित करें",
            "My Invite Code": "मेरा आमंत्रण कोड",
            "Copy Invite Link": "आमंत्रण लिंक कॉपी करें",

            "Security": "सुरक्षा",
            "Account Security": "खाता सुरक्षा",

            "History": "इतिहास",
            "View All": "सभी देखें"

        },
               /* =================================================
           SPANISH
           ================================================= */

        es: {

            "Home": "Inicio",
            "Markets": "Mercados",
            "Assets": "Activos",
            "Mine": "Mi cuenta",
            "Trade": "Operar",
            "Orders": "Órdenes",
            "Settings": "Configuración",
            "Support": "Soporte",

            "Login": "Iniciar sesión",
            "Sign In": "Iniciar sesión",
            "Sign Out": "Cerrar sesión",
            "Logout": "Cerrar sesión",
            "Register": "Registrarse",
            "Create Account": "Crear cuenta",
            "Account": "Cuenta",

            "Username": "Nombre de usuario",
            "Password": "Contraseña",
            "Confirm Password": "Confirmar contraseña",
            "Email Address": "Correo electrónico",
            "Invite Code": "Código de invitación",

            "Forgot Password?": "¿Olvidaste tu contraseña?",
            "Remember Me": "Recuérdame",

            "All": "Todo",
            "Forex": "Forex",
            "Crypto": "Cripto",
            "Metals": "Metales",
            "Indices": "Índices",

            "Open": "Abrir",
            "Close": "Cerrar",
            "Long": "Largo",
            "Short": "Corto",

            "Amount": "Cantidad",
            "Balance": "Saldo",
            "Available Balance": "Saldo disponible",
            "Total Assets": "Activos totales",
            "Profit": "Ganancia",
            "Loss": "Pérdida",
            "Profit / Loss": "Ganancia / Pérdida",
            "Today P/L": "P/G de hoy",
            "Total P/L": "P/G total",

            "Deposit": "Depósito",
            "Withdraw": "Retirar",
            "Withdrawal": "Retiro",
            "Transfer": "Transferir",

            "Confirm": "Confirmar",
            "Cancel": "Cancelar",
            "Submit": "Enviar",
            "Save": "Guardar",
            "Search": "Buscar",
            "Copy": "Copiar",
            "Copied": "Copiado",

            "Loading...": "Cargando...",
            "No records": "No hay registros",
            "No data available": "No hay datos disponibles",

            "Language": "Idioma",
            "Dark Mode": "Modo oscuro",
            "Notifications": "Notificaciones",

            "Leverage": "Apalancamiento",
            "Entry Price": "Precio de entrada",
            "Current Price": "Precio actual",
            "Open Trade": "Abrir operación",
            "Close Trade": "Cerrar operación",

            "Customer Service": "Servicio al cliente",
            "Contact Support": "Contactar con soporte",

            "Invite Friends": "Invitar amigos",
            "My Invite Code": "Mi código de invitación",
            "Copy Invite Link": "Copiar enlace de invitación",

            "Security": "Seguridad",
            "Account Security": "Seguridad de la cuenta",

            "History": "Historial",
            "View All": "Ver todo"

        },


        /* =================================================
           CHINESE
           ================================================= */

        zh: {

            "Home": "首页",
            "Markets": "市场",
            "Assets": "资产",
            "Mine": "我的",
            "Trade": "交易",
            "Orders": "订单",
            "Settings": "设置",
            "Support": "客服",

            "Login": "登录",
            "Sign In": "登录",
            "Sign Out": "退出登录",
            "Logout": "退出",
            "Register": "注册",
            "Create Account": "创建账户",
            "Account": "账户",

            "Username": "用户名",
            "Password": "密码",
            "Confirm Password": "确认密码",
            "Email Address": "电子邮箱",
            "Invite Code": "邀请码",

            "Forgot Password?": "忘记密码？",
            "Remember Me": "记住我",

            "All": "全部",
            "Forex": "外汇",
            "Crypto": "加密货币",
            "Metals": "贵金属",
            "Indices": "指数",

            "Open": "开仓",
            "Close": "关闭",
            "Long": "做多",
            "Short": "做空",

            "Amount": "金额",
            "Balance": "余额",
            "Available Balance": "可用余额",
            "Total Assets": "总资产",
            "Profit": "利润",
            "Loss": "亏损",
            "Profit / Loss": "盈亏",
            "Today P/L": "今日盈亏",
            "Total P/L": "总盈亏",

            "Deposit": "充值",
            "Withdraw": "提现",
            "Withdrawal": "提现",
            "Transfer": "转账",

            "Confirm": "确认",
            "Cancel": "取消",
            "Submit": "提交",
            "Save": "保存",
            "Search": "搜索",
            "Copy": "复制",
            "Copied": "已复制",

            "Loading...": "加载中...",
            "No records": "没有记录",
            "No data available": "暂无数据",

            "Language": "语言",
            "Dark Mode": "深色模式",
            "Notifications": "通知",

            "Leverage": "杠杆",
            "Entry Price": "入场价格",
            "Current Price": "当前价格",
            "Open Trade": "开仓交易",
            "Close Trade": "平仓",

            "Customer Service": "客户服务",
            "Contact Support": "联系客服",

            "Invite Friends": "邀请好友",
            "My Invite Code": "我的邀请码",
            "Copy Invite Link": "复制邀请链接",

            "Security": "安全",
            "Account Security": "账户安全",

            "History": "历史记录",
            "View All": "查看全部"

        },


        /* =================================================
           JAPANESE
           ================================================= */

        ja: {

            "Home": "ホーム",
            "Markets": "マーケット",
            "Assets": "資産",
            "Mine": "マイページ",
            "Trade": "取引",
            "Orders": "注文",
            "Settings": "設定",
            "Support": "サポート",

            "Login": "ログイン",
            "Sign In": "サインイン",
            "Sign Out": "サインアウト",
            "Logout": "ログアウト",
            "Register": "登録",
            "Create Account": "アカウントを作成",
            "Account": "アカウント",

            "Username": "ユーザー名",
            "Password": "パスワード",
            "Confirm Password": "パスワードを確認",
            "Email Address": "メールアドレス",
            "Invite Code": "招待コード",

            "Forgot Password?": "パスワードを忘れましたか？",
            "Remember Me": "ログイン状態を保持",

            "All": "すべて",
            "Forex": "外国為替",
            "Crypto": "暗号資産",
            "Metals": "貴金属",
            "Indices": "指数",

            "Open": "開く",
            "Close": "閉じる",
            "Long": "ロング",
            "Short": "ショート",

            "Amount": "金額",
            "Balance": "残高",
            "Available Balance": "利用可能残高",
            "Total Assets": "総資産",
            "Profit": "利益",
            "Loss": "損失",
            "Profit / Loss": "損益",
            "Today P/L": "本日の損益",
            "Total P/L": "総損益",

            "Deposit": "入金",
            "Withdraw": "出金",
            "Withdrawal": "出金",
            "Transfer": "振込",

            "Confirm": "確認",
            "Cancel": "キャンセル",
            "Submit": "送信",
            "Save": "保存",
            "Search": "検索",
            "Copy": "コピー",
            "Copied": "コピーしました",

            "Loading...": "読み込み中...",
            "No records": "記録がありません",
            "No data available": "データがありません",

            "Language": "言語",
            "Dark Mode": "ダークモード",
            "Notifications": "通知",

            "Leverage": "レバレッジ",
            "Entry Price": "エントリー価格",
            "Current Price": "現在価格",
            "Open Trade": "取引を開始",
            "Close Trade": "取引を終了",

            "Customer Service": "カスタマーサービス",
            "Contact Support": "サポートに連絡",

            "Invite Friends": "友達を招待",
            "My Invite Code": "招待コード",
            "Copy Invite Link": "招待リンクをコピー",

            "Security": "セキュリティ",
            "Account Security": "アカウントセキュリティ",

            "History": "履歴",
            "View All": "すべて表示"

        },


        /* =================================================
           FRENCH
           ================================================= */

        fr: {

            "Home": "Accueil",
            "Markets": "Marchés",
            "Assets": "Actifs",
            "Mine": "Mon compte",
            "Trade": "Trader",
            "Orders": "Ordres",
            "Settings": "Paramètres",
            "Support": "Assistance",

            "Login": "Connexion",
            "Sign In": "Se connecter",
            "Sign Out": "Se déconnecter",
            "Logout": "Déconnexion",
            "Register": "S'inscrire",
            "Create Account": "Créer un compte",
            "Account": "Compte",

            "Username": "Nom d'utilisateur",
            "Password": "Mot de passe",
            "Confirm Password": "Confirmer le mot de passe",
            "Email Address": "Adresse e-mail",
            "Invite Code": "Code d'invitation",

            "Forgot Password?": "Mot de passe oublié ?",
            "Remember Me": "Se souvenir de moi",

            "All": "Tous",
            "Forex": "Forex",
            "Crypto": "Crypto",
            "Metals": "Métaux",
            "Indices": "Indices",

            "Open": "Ouvrir",
            "Close": "Fermer",
            "Long": "Long",
            "Short": "Court",

            "Amount": "Montant",
            "Balance": "Solde",
            "Available Balance": "Solde disponible",
            "Total Assets": "Actifs totaux",
            "Profit": "Bénéfice",
            "Loss": "Perte",
            "Profit / Loss": "Bénéfice / Perte",
            "Today P/L": "P/L du jour",
            "Total P/L": "P/L total",

            "Deposit": "Dépôt",
            "Withdraw": "Retirer",
            "Withdrawal": "Retrait",
            "Transfer": "Transfert",

            "Confirm": "Confirmer",
            "Cancel": "Annuler",
            "Submit": "Envoyer",
            "Save": "Enregistrer",
            "Search": "Rechercher",
            "Copy": "Copier",
            "Copied": "Copié",

            "Loading...": "Chargement...",
            "No records": "Aucun enregistrement",
            "No data available": "Aucune donnée disponible",

            "Language": "Langue",
            "Dark Mode": "Mode sombre",
            "Notifications": "Notifications",

            "Leverage": "Effet de levier",
            "Entry Price": "Prix d'entrée",
            "Current Price": "Prix actuel",
            "Open Trade": "Ouvrir une position",
            "Close Trade": "Fermer la position",

            "Customer Service": "Service client",
            "Contact Support": "Contacter l'assistance",

            "Invite Friends": "Inviter des amis",
            "My Invite Code": "Mon code d'invitation",
            "Copy Invite Link": "Copier le lien d'invitation",

            "Security": "Sécurité",
            "Account Security": "Sécurité du compte",

            "History": "Historique",
            "View All": "Voir tout"

        },


        /* =================================================
           GERMAN
           ================================================= */

        de: {

            "Home": "Startseite",
            "Markets": "Märkte",
            "Assets": "Vermögenswerte",
            "Mine": "Mein Konto",
            "Trade": "Handeln",
            "Orders": "Aufträge",
            "Settings": "Einstellungen",
            "Support": "Support",

            "Login": "Anmelden",
            "Sign In": "Einloggen",
            "Sign Out": "Abmelden",
            "Logout": "Ausloggen",
            "Register": "Registrieren",
            "Create Account": "Konto erstellen",
            "Account": "Konto",

            "Username": "Benutzername",
            "Password": "Passwort",
            "Confirm Password": "Passwort bestätigen",
            "Email Address": "E-Mail-Adresse",
            "Invite Code": "Einladungscode",

            "Forgot Password?": "Passwort vergessen?",
            "Remember Me": "Angemeldet bleiben",

            "All": "Alle",
            "Forex": "Forex",
            "Crypto": "Krypto",
            "Metals": "Metalle",
            "Indices": "Indizes",

            "Open": "Öffnen",
            "Close": "Schließen",
            "Long": "Long",
            "Short": "Short",

            "Amount": "Betrag",
            "Balance": "Kontostand",
            "Available Balance": "Verfügbares Guthaben",
            "Total Assets": "Gesamtvermögen",
            "Profit": "Gewinn",
            "Loss": "Verlust",
            "Profit / Loss": "Gewinn / Verlust",
            "Today P/L": "Heutiger G/V",
            "Total P/L": "Gesamter G/V",

            "Deposit": "Einzahlung",
            "Withdraw": "Auszahlung",
            "Withdrawal": "Auszahlung",
            "Transfer": "Überweisung",

            "Confirm": "Bestätigen",
            "Cancel": "Abbrechen",
            "Submit": "Absenden",
            "Save": "Speichern",
            "Search": "Suchen",
            "Copy": "Kopieren",
            "Copied": "Kopiert",

            "Loading...": "Wird geladen...",
            "No records": "Keine Einträge",
            "No data available": "Keine Daten verfügbar",

            "Language": "Sprache",
            "Dark Mode": "Dunkelmodus",
            "Notifications": "Benachrichtigungen",

            "Leverage": "Hebel",
            "Entry Price": "Einstiegspreis",
            "Current Price": "Aktueller Preis",
            "Open Trade": "Trade eröffnen",
            "Close Trade": "Trade schließen",

            "Customer Service": "Kundenservice",
            "Contact Support": "Support kontaktieren",

            "Invite Friends": "Freunde einladen",
            "My Invite Code": "Mein Einladungscode",
            "Copy Invite Link": "Einladungslink kopieren",

            "Security": "Sicherheit",
            "Account Security": "Kontosicherheit",

            "History": "Verlauf",
            "View All": "Alle anzeigen"

        },


        /* =================================================
           RUSSIAN
           ================================================= */

        ru: {

            "Home": "Главная",
            "Markets": "Рынки",
            "Assets": "Активы",
            "Mine": "Мой аккаунт",
            "Trade": "Торговля",
            "Orders": "Ордера",
            "Settings": "Настройки",
            "Support": "Поддержка",

            "Login": "Войти",
            "Sign In": "Войти",
            "Sign Out": "Выйти",
            "Logout": "Выйти",
            "Register": "Регистрация",
            "Create Account": "Создать аккаунт",
            "Account": "Аккаунт",

            "Username": "Имя пользователя",
            "Password": "Пароль",
            "Confirm Password": "Подтвердите пароль",
            "Email Address": "Электронная почта",
            "Invite Code": "Код приглашения",

            "Forgot Password?": "Забыли пароль?",
            "Remember Me": "Запомнить меня",

            "All": "Все",
            "Forex": "Форекс",
            "Crypto": "Криптовалюта",
            "Metals": "Металлы",
            "Indices": "Индексы",

            "Open": "Открыть",
            "Close": "Закрыть",
            "Long": "Лонг",
            "Short": "Шорт",

            "Amount": "Сумма",
            "Balance": "Баланс",
            "Available Balance": "Доступный баланс",
            "Total Assets": "Общие активы",
            "Profit": "Прибыль",
            "Loss": "Убыток",
            "Profit / Loss": "Прибыль / Убыток",
            "Today P/L": "P/L за сегодня",
            "Total P/L": "Общий P/L",

            "Deposit": "Пополнить",
            "Withdraw": "Вывести",
            "Withdrawal": "Вывод",
            "Transfer": "Перевод",

            "Confirm": "Подтвердить",
            "Cancel": "Отмена",
            "Submit": "Отправить",
            "Save": "Сохранить",
            "Search": "Поиск",
            "Copy": "Копировать",
            "Copied": "Скопировано",

            "Loading...": "Загрузка...",
            "No records": "Нет записей",
            "No data available": "Нет доступных данных",

            "Language": "Язык",
            "Dark Mode": "Тёмный режим",
            "Notifications": "Уведомления",

            "Leverage": "Плечо",
            "Entry Price": "Цена входа",
            "Current Price": "Текущая цена",
            "Open Trade": "Открыть сделку",
            "Close Trade": "Закрыть сделку",

            "Customer Service": "Служба поддержки",
            "Contact Support": "Связаться с поддержкой",

            "Invite Friends": "Пригласить друзей",
            "My Invite Code": "Мой код приглашения",
            "Copy Invite Link": "Скопировать ссылку приглашения",

            "Security": "Безопасность",
            "Account Security": "Безопасность аккаунта",

            "History": "История",
            "View All": "Показать все"

        }
              /* =================================================
           COMMON WEBSITE TEXT
           =================================================

           These are additional texts used across
           CPTMarkets pages.
           ================================================= */

    };


    /* =====================================================
       LANGUAGE FALLBACK SYSTEM
       =====================================================

       If a particular translation is not available,
       English will be used instead of breaking the page.
       ===================================================== */

    function getTranslation(language, text) {

        if (!text) {
            return text;
        }

        language = language || "en";

        if (
            translations[language] &&
            Object.prototype.hasOwnProperty.call(
                translations[language],
                text
            )
        ) {
            return translations[language][text];
        }

        if (
            translations.en &&
            Object.prototype.hasOwnProperty.call(
                translations.en,
                text
            )
        ) {
            return translations.en[text];
        }

        return text;
    }


    /* =====================================================
       LANGUAGE VALIDATION
       ===================================================== */

    function isValidLanguage(language) {

        return Object.prototype.hasOwnProperty.call(
            languages,
            language
        );

    }


    /* =====================================================
       DEFAULT LANGUAGE
       ===================================================== */

    const defaultLanguage = "en";


    /* =====================================================
       LANGUAGE STORAGE KEY
       =====================================================

       translator.js will use this same key.

       Because localStorage is shared between pages
       on the same domain, the selected language will
       remain active when the user moves from one
       HTML page to another.
       ===================================================== */

    const storageKey = "cptmarkets_language";


    /* =====================================================
       LANGUAGE ORDER
       ===================================================== */

    const languageOrder = [
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
       PUBLIC LANGUAGE DATA
       ===================================================== */

    window.CPT_LANGS = languages;

    window.CPT_TRANSLATIONS = translations;

    window.CPT_LANGUAGE_ORDER = languageOrder;

    window.CPT_DEFAULT_LANGUAGE = defaultLanguage;

    window.CPT_LANGUAGE_STORAGE_KEY = storageKey;


    /* =====================================================
       PUBLIC TRANSLATION FUNCTION
       ===================================================== */

    window.CPTTranslate = getTranslation;


    /* =====================================================
       LANGUAGE CHECK FUNCTION
       ===================================================== */

    window.CPTIsValidLanguage = isValidLanguage;


    /* =====================================================
       BACKWARD COMPATIBILITY
       =====================================================

       If an older HTML/JS file is using languageData,
       it will continue to work.
       ===================================================== */

    window.languageData = translations;


    /* =====================================================
       LANGUAGE CONFIG ALIAS
       ===================================================== */

    window.CPTLanguages = languages;


    /* =====================================================
       FINISH
       ===================================================== */

})(window); 
