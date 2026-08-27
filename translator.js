document.addEventListener("DOMContentLoaded", () => {
  // à§§. à¦¬à¦°à§à¦¤à¦®à¦¾à¦¨ à¦­à¦¾à¦·à¦¾ à¦²à§‹à¦¡ à¦•à¦°à¦¾ (à¦¡à¦¿à¦«à¦²à§à¦Ÿ à¦‡à¦‚à¦°à§‡à¦œà¦¿ UK)
  const currentLang = localStorage.getItem("selectedLang") || "en_UK";
  applyLanguage(currentLang);

  // à§¨. à¦ªà¦¤à¦¾à¦•à¦¾à¦° à¦¬à¦¾à¦Ÿà¦¨à¦Ÿà¦¿ à¦–à§à¦à¦œà§‡ à¦¬à§‡à¦° à¦•à¦°à¦¾
  const langBtn = document.getElementById("languageBtn");
  if (!langBtn) return;

  // à§©. à¦¡à§à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦®à§‡à¦¨à§ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ (à¦¬à¦¡à¦¿à¦° à¦¸à¦¾à¦¥à§‡ à¦¯à§à¦•à§à¦¤ à¦•à¦°à¦¾ à¦¯à¦¾à¦¤à§‡ à¦ªà¦œà¦¿à¦¶à¦¨à¦¿à¦‚ à¦ à¦¿à¦• à¦¥à¦¾à¦•à§‡)
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

    // à¦­à¦¾à¦·à¦¾à¦—à§à¦²à§‹à¦° à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦¡à§à¦°à¦ªà¦¡à¦¾à¦‰à¦¨à§‡ à¦¯à§‹à¦— à¦•à¦°à¦¾
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

  // à§ª. à¦ªà¦¤à¦¾à¦•à¦¾à§Ÿ à¦•à§à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦¡à§à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦“à¦ªà§‡à¦¨/à¦•à§à¦²à§‹à¦œ à¦¹à¦“à§Ÿà¦¾ à¦à¦¬à¦‚ à¦¸à¦ à¦¿à¦• à¦œà¦¾à§Ÿà¦—à¦¾à§Ÿ à¦ªà¦œà¦¿à¦¶à¦¨ à¦¹à¦“à§Ÿà¦¾
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      const rect = langBtn.getBoundingClientRect();
      dropdown.style.top = (rect.bottom + 8) + "px";
      dropdown.style.left = (rect.right - 180) + "px"; // à¦¡à¦¾à¦¨ à¦¦à¦¿à¦• à¦¥à§‡à¦•à§‡ à¦ªà¦œà¦¿à¦¶à¦¨ à¦¹à¦¬à§‡
      dropdown.style.display = "block";
    }
  });

  // à¦ªà§‡à¦œà§‡à¦° à¦¬à¦¾à¦‡à¦°à§‡ à¦•à§à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦¡à§à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¬à¦¨à§à¦§ à¦¹à§Ÿà§‡ à¦¯à¦¾à¦“à§Ÿà¦¾
  document.addEventListener("click", () => {
    if (dropdown) dropdown.style.display = "none";
  });
});

// à§«. à¦­à¦¾à¦·à¦¾ à¦…à¦¨à§à¦¯à¦¾à§Ÿà§€ à¦Ÿà§‡à¦•à§à¦¸à¦Ÿ à¦“ à¦ªà¦¤à¦¾à¦•à¦¾ à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨à§‡à¦° à¦«à¦¾à¦‚à¦¶à¦¨
function applyLanguage(langCode) {
  const lang = languageData[langCode];
  if (!lang) return;

  const langBtn = document.getElementById("languageBtn");
  if (langBtn) {
    langBtn.innerHTML = `${lang.flag}`;
  }

  // à¦ªà§‡à¦œà§‡à¦° à¦¸à¦¬ à¦¡à§‡à¦Ÿà¦¾-à¦•à¦¿ (data-key) à¦Ÿà§‡à¦•à§à¦¸à¦Ÿà¦—à§à¦²à§‹ à¦…à¦¨à§à¦¬à¦¾à¦¦ à¦•à¦°à¦¾
  document.querySelectorAll("[data-key]").forEach((element) => {
    const key = element.getAttribute("data-key");
    if (lang[key]) {
      element.textContent = lang[key];
    }
  });
}
