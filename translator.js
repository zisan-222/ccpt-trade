document.addEventListener("DOMContentLoaded", () => {
  // ১. বর্তমান ভাষা লোড করা (ডিফল্ট ইংরেজি UK)
  const currentLang = localStorage.getItem("selectedLang") || "en_UK";
  applyLanguage(currentLang);

  // ২. পতাকার বাটনটি খুঁজে বের করা
  const langBtn = document.getElementById("languageBtn");
  if (!langBtn) return;

  // ৩. ড্রপডাউন মেনু তৈরি করা (যদি আগে থেকে না থাকে)
  let dropdown = document.getElementById("languageDropdown");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "languageDropdown";
    dropdown.style.cssText = `
      position: absolute;
      top: 60px;
      right: 0;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      z-index: 1000;
      display: none;
      width: 180px;
      max-height: 250px;
      overflow-y: auto;
    `;

    // ভাষাগুলোর তালিকা ড্রপডাউনে যোগ করা
    for (const code in languageData) {
      const item = document.createElement("div");
      item.style.cssText = `
        padding: 10px 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #fff;
        font-size: 14px;
        border-bottom: 1px solid #1e293b;
      `;
      item.innerHTML = `<span>${languageData[code].flag}</span> <span>${languageData[code].langName}</span>`;
      
      item.addEventListener("click", () => {
        localStorage.setItem("selectedLang", code);
        applyLanguage(code);
        dropdown.style.display = "none";
      });

      item.addEventListener("mouseover", () => { item.style.background = "#1e293b"; });
      item.addEventListener("mouseout", () => { item.style.background = "transparent"; });

      dropdown.appendChild(item);
    }

    // বাটনটির প্যারেন্ট এলিমেন্টে ড্রপডাউন যুক্ত করা
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

  // বাটন বা পতাকার আইকন আপডেট করা
  const langBtn = document.getElementById("languageBtn");
  if (langBtn) {
    // শুধু পতাকা বা নাম দেখানোর জন্য
    const dropdown = document.getElementById("languageDropdown");
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
