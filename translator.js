// ============================================================
// CptMarkets — translator.js (Universal 10-language translator)
// ============================================================
(function () {
  'use strict';

  const STORAGE_KEY = 'cpt_lang';
  const DEFAULT_LANG = 'en_UK';

  function normalize(text) {
    return String(text ?? '').replace(/\s+/g, ' ').trim();
  }

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && languageData[saved] ? saved : DEFAULT_LANG;
  }

  function translateExact(text, code) {
    const value = normalize(text);
    if (!value) return text;
    if (typeof cptTranslatePhrase === 'function') return cptTranslatePhrase(value, code);
    const dict = (window.cptStaticTranslations || {})[code] || {};
    return Object.prototype.hasOwnProperty.call(dict, value) ? dict[value] : text;
  }

  function translateNode(el, code) {
    if (!el || el.nodeType !== 1) return;
    if (el.matches('script,style,noscript,svg,[contenteditable="true"]')) return;
    if (el.closest('script,style,noscript,svg')) return;

    // data-key has priority.
    const key = el.getAttribute('data-key');
    const dict = languageData[code];
    if (key && dict && dict[key] !== undefined) {
      if (!el.children.length) el.textContent = dict[key];
      else {
        // Preserve nested icons/elements where possible.
        const textNodes = [];
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let n; while ((n = walker.nextNode())) textNodes.push(n);
        if (textNodes.length === 1) textNodes[0].nodeValue = dict[key];
      }
    } else if (!el.children.length) {
      const original = normalize(el.textContent);
      if (original) {
        const translated = translateExact(original, code);
        if (translated !== original) el.textContent = translated;
      }
    }

    // Placeholder / title / aria-label, including data-ph-key.
    const phKey = el.getAttribute('data-ph-key');
    if (phKey && dict && dict[phKey] !== undefined) el.setAttribute('placeholder', dict[phKey]);
    ['placeholder','title','aria-label'].forEach(attr => {
      const value = el.getAttribute(attr);
      if (!value) return;
      const translated = translateExact(value, code);
      if (translated !== value) el.setAttribute(attr, translated);
    });
  }

  function applyLanguage(code) {
    if (!languageData[code]) code = DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, code);
    const dict = languageData[code];

    document.documentElement.setAttribute('lang', code.replace('_','-'));
    document.querySelectorAll('[data-key], body *').forEach(el => translateNode(el, code));

    // Update language controls after translating.
    document.querySelectorAll('#languageBtn,.language-btn').forEach(btn => {
      btn.textContent = dict.flag;
      btn.title = dict.langName;
    });
    const stText=document.getElementById('settingsLangText'); if(stText) stText.textContent=dict.langName;
    const stFlag=document.getElementById('settingsLangFlag'); if(stFlag) stFlag.textContent=dict.flag;
    buildDropdown();
  }

  function closeDrop() {
    const d=document.getElementById('cpt-lang-dropdown'); if(d) d.style.display='none';
  }

  function openDrop(anchor) {
    const d=document.getElementById('cpt-lang-dropdown'); if(!d) return;
    const r=anchor.getBoundingClientRect();
    d.style.top=(r.bottom+8)+'px';
    d.style.right=(window.innerWidth-r.right)+'px';
    d.style.left='auto';
    d.style.display='block';
  }

  function buildDropdown() {
    let drop=document.getElementById('cpt-lang-dropdown');
    if (drop) drop.remove();
    drop=document.createElement('div'); drop.id='cpt-lang-dropdown';
    drop.style.cssText='position:fixed;z-index:999999;display:none;width:210px;max-height:340px;overflow-y:auto;background:#0a1628;border:1.5px solid #ffc928;border-radius:14px;box-shadow:0 12px 48px rgba(0,0,0,.95),0 0 24px rgba(255,201,40,.12);padding:6px 0;';
    const current=getLang();
    Object.keys(languageData).forEach(code=>{
      const active=code===current, item=document.createElement('div');
      item.dataset.langCode=code;
      item.style.cssText=`padding:11px 16px;cursor:pointer;display:flex;align-items:center;gap:12px;font-size:14px;font-family:inherit;border-bottom:1px solid #1a2540;background:${active?'#16264a':'transparent'};border-left:${active?'3px solid #ffc928':'3px solid transparent'};transition:background .15s;`;
      item.innerHTML=`<span style="font-size:20px;line-height:1;">${languageData[code].flag}</span><span style="color:#fff;font-weight:500;flex:1;">${languageData[code].langName}</span>${active?'<span style="color:#ffc928;font-size:16px;font-weight:bold;">✓</span>':''}`;
      item.addEventListener('click',e=>{e.stopPropagation();localStorage.setItem(STORAGE_KEY,code);applyLanguage(code);});
      drop.appendChild(item);
    });
    document.body.appendChild(drop);
  }

  function wireControls() {
    document.querySelectorAll('#languageBtn,.language-btn,#settingsLangItem').forEach(btn=>{
      if(btn.dataset.cptListened) return;
      btn.dataset.cptListened='1';
      btn.addEventListener('click',e=>{e.stopPropagation();const d=document.getElementById('cpt-lang-dropdown'); if(d && d.style.display==='block') closeDrop(); else openDrop(btn);});
    });
    document.addEventListener('click',closeDrop);
  }

  function init() {
    applyLanguage(getLang());
    wireControls();
  }

  window.applyLanguage=applyLanguage;
  window.cptTranslatePhrase=translateExact;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
