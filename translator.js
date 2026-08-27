document.addEventListener("DOMContentLoaded", () => {
  // ১. বর্তমান ভাষা লোড করা (ডিফল্ট ইংরেজি UK)
  const currentLang = localStorage.getItem("selectedLang") || "en_UK";
  applyLanguage(currentLang);

  // ২. পতাকার বাটনটি খুঁজে বের করা
  const langBtn = document.getElementById("languageBtn");
  if (!langBtn) return;

  // ৩. ড্রপডাউন মেনু তৈরি করা
  let dropdown = document.getElementById("languageDropdown");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "languageDropdown";
    dropdown.style.cssText = `
      position: absolute;
      top: 45px;
      right: 0;
      background: #0b132b;
      border: 1px solid #1e293b;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.8);
      z-index: 9999;
      display: none;
      width: 170px;
      max-height: 220px;
      overflow-y: auto;
      text-align: left;
    `;

    // ভাষাগুলোর তালিকা ড্রপডাউনে যোগ করা
    for (const code in languageData) {
      const item = document.createElement("div");
      item.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #ffffff !important;
        font-size: 13px;
        border-bottom: 1px solid #1e293b;
        background: #0b132b;
      `;
      item.innerHTML = `<span style="font-size: 16px;">${languageData[code].flag}</span> <span style="color: #ffffff; font-weight: 500;">${languageData[code].langName}</span>`;
      
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        localStorage.setItem("selectedLang", code);
        applyLanguage(code);
        dropdown.style.display = "none";
      });

      item.addEventListener("mouseover", () => { item.style.background = "#1d2d50"; });
      item.addEventListener("mouseout", () => { item.style.background = "#0b132b"; });

      dropdown.appendChild(item);
    }

    // বাটনটিকে পজিশন রিলেটিভ করা যাতে ড্রপডাউনটি ঠিক এর নিচে খোলে
    langBtn.style.position = "relative";
    langBtn.appendChild(dropdown);
  }

  // ৪. পতাকায় ক্লিক করলে ড্রপডাউন ওপেন/ক্লোজ হওয়া
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  // পেজের বাইরে ক্লিক করলে ড্রপডাউন বন্ধ হয়ে যাওয়া
  document.addEventListener("click", () => {
    dropdown.style.display = "none";
  });
});

// ৫. ভাষা অনুযায়ী টেক্সট ও পতাকা পরিবর্তনের ফাংশন
function applyLanguage(langCode) {
  const lang = languageData[langCode];
  if (!lang) return;

  const langBtn = document.getElementById("languageBtn");
  if (langBtn) {
    const dropdown = document.getElementById("languageDropdown");
    // শুধু পতাকার ইমোজিটি দেখাবে এবং ড্রপডাউন সাথে রাখবে
    langBtn.innerHTML = `${lang.flag}`;
    if (dropdown) langBtn.appendChild(dropdown);
  }

  // পেজের সব ডেটা-কি (data-key) টেক্সটগুলো অনুবাদ করা
  document.querySelectorAll("[data-key]").forEach((element) => {
    const key = element.getAttribute("data-key");
    if (lang[key]) {
      element.textContent = lang[key];
    }
  });
}
