document.addEventListener("DOMContentLoaded", () => {
  // ১. বর্তমান ভাষা লোড করা (ডিফল্ট ইংরেজি UK)
  const currentLang = localStorage.getItem("selectedLang") || "en_UK";
  applyLanguage(currentLang);

  // ২. পতাকার বাটনটি খুঁজে বের করা
  const langBtn = document.getElementById("languageBtn");
  if (!langBtn) return;

  // ৩. ড্রপডাউন মেনু তৈরি করা (বডির সাথে যুক্ত করা যাতে পজিশনিং ঠিক থাকে)
  let dropdown = document.getElementById("languageDropdown");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "languageDropdown";
    dropdown.style.cssText = `
      position: fixed;
      background: #0b132b;
      border: 1px solid #1e293b;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.9);
      z-index: 99999;
      display: none;
      width: 180px;
      max-height: 250px;
      overflow-y: auto;
      text-align: left;
    `;

    // ভাষাগুলোর তালিকা ড্রপডাউনে যোগ করা
    for (const code in languageData) {
      const item = document.createElement("div");
      item.style.cssText = `
        padding: 10px 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        color: #ffffff !important;
        font-size: 14px;
        border-bottom: 1px solid #1e293b;
        background: #0b132b;
      `;
      item.innerHTML = `<span style="font-size: 18px;">${languageData[code].flag}</span> <span style="color: #ffffff; font-weight: 500;">${languageData[code].langName}</span>`;
      
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

    document.body.appendChild(dropdown);
  }

  // ৪. পতাকায় ক্লিক করলে ড্রপডাউন ওপেন/ক্লোজ হওয়া এবং সঠিক জায়গায় পজিশন হওয়া
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      const rect = langBtn.getBoundingClientRect();
      dropdown.style.top = (rect.bottom + 8) + "px";
      dropdown.style.left = (rect.right - 180) + "px"; // ডান দিক থেকে পজিশন হবে
      dropdown.style.display = "block";
    }
  });

  // পেজের বাইরে ক্লিক করলে ড্রপডাউন বন্ধ হয়ে যাওয়া
  document.addEventListener("click", () => {
    if (dropdown) dropdown.style.display = "none";
  });
});

// ৫. ভাষা অনুযায়ী টেক্সট ও পতাকা পরিবর্তনের ফাংশন
function applyLanguage(langCode) {
  const lang = languageData[langCode];
  if (!lang) return;

  const langBtn = document.getElementById("languageBtn");
  if (langBtn) {
    langBtn.innerHTML = `${lang.flag}`;
  }

  // পেজের সব ডেটা-কি (data-key) টেক্সটগুলো অনুবাদ করা
  document.querySelectorAll("[data-key]").forEach((element) => {
    const key = element.getAttribute("data-key");
    if (lang[key]) {
      element.textContent = lang[key];
    }
  });
}
