// ============================================================
//  CptMarkets — translator.js (Multi-Selector & Sync Updated)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    // ১. লোকাল স্টোরেজ থেকে সেভ করা ভাষা নিয়ে আসা, না থাকলে ডিফল্ট en_UK
    const savedLang = localStorage.getItem("cpt_lang") || "en_UK";
    
    // ২. পেজ লোড হওয়ার সাথেই ভাষা এপ্লাই করা
    applyTranslation(savedLang);

    // ৩. প্রজেক্টের যেকোনো পেজে থাকা সব ভাষা সিলেক্টর বা ড্রপডাউন হ্যান্ডেল করা
    const langSelectors = document.querySelectorAll("#languageSelector, .language-selector, [data-lang-select]");
    
    langSelectors.forEach(selector => {
        selector.value = savedLang; // সিলেক্টরের ভ্যালু সঠিক ভাষায় সেট করা
        
        selector.addEventListener("change", (e) => {
            const selectedLang = e.target.value;
            localStorage.setItem("cpt_lang", selectedLang); // লোকাল স্টোরেজে সেভ করা
            
            // সব পেজে এবং বর্তমান পেজে ভাষা এপ্লাই করা
            applyTranslation(selectedLang);
            
            // অন্যান্য ওপেন থাকা ট্যাবেও সিঙ্ক করার জন্য
            syncAllSelectors(selectedLang);
        });
    });
});

// ভাষা পরিবর্তনের মূল ফাংশন
function applyTranslation(langCode) {
    if (typeof languageData === 'undefined' || !languageData[langCode]) {
        langCode = "en_UK"; 
    }

    const translations = languageData[langCode];

    // পেজের সমস্ত [data-i18n] ট্যাগ আপডেট করা
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (translations[key]) {
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                element.placeholder = translations[key];
            } else {
                element.textContent = translations[key];
            }
        }
    });

    // ডকুমেন্টের ভাষা অ্যাট্রিবিউট আপডেট
    document.documentElement.lang = langCode.split("_")[0];
    
    // সব সিলেক্টরের ভ্যালু আপডেট করে রাখা যাতে মিল থাকে
    syncAllSelectors(langCode);
}

// পেজে থাকা একাধিক সিলেক্টরের ভ্যালু এক রাখার ফাংশন
function syncAllSelectors(langCode) {
    const langSelectors = document.querySelectorAll("#languageSelector, .language-selector, [data-lang-select]");
    langSelectors.forEach(selector => {
        selector.value = langCode;
    });
}

// ব্রাউজারের অন্য ট্যাবে বা পেজে পরিবর্তন হলে সাথে সাথে ধরে রাখার জন্য স্টোরেজ লিসেনার
window.addEventListener("storage", (event) => {
    if (event.key === "cpt_lang") {
        applyTranslation(event.newValue);
    }
});
