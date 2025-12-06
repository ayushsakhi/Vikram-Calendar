
  const hamburger = document.getElementById('hamburger');
  const sidePanel = document.getElementById('sidePanel');
  const overlay = document.getElementById('overlay');
  const panelClose = document.getElementById('panelClose');

  function openPanel(){
    sidePanel.classList.add('open');
    overlay.classList.add('visible');
    overlay.hidden = false;
    sidePanel.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    // move focus into panel for accessibility
    panelClose.focus();
  }

  function closePanel(){
    sidePanel.classList.remove('open');
    overlay.classList.remove('visible');
    overlay.hidden = true;
    sidePanel.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    const isOpen = sidePanel.classList.contains('open');
    isOpen ? closePanel() : openPanel();
  });

  panelClose.addEventListener('click', closePanel);

  overlay.addEventListener('click', closePanel);

  // close on ESC
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && sidePanel.classList.contains('open')){
      closePanel();
    }
  });
  
  /* ========== Prahar logic (day divided into 8 prahar) ========== */
  
  // We approximate using fixed clock times (3-hour blocks)
  const PRAHARS = [
    {
      id: "purvahn",
      enName: "Purvahn (morning)",
      hiName: "पूर्वान्ह",
      enDesc: "Daytime 1st prahar: from sunrise to late morning (approx. 6am–9am).",
      hiDesc: "दिन का पहला पहर: सूर्योदय से लगभग सुबह 9 बजे तक।",
      from: 6,  // 06:00–09:00
      to: 9
    },
    {
      id: "madhyahn",
      enName: "Madhyahn (midday)",
      hiName: "मध्यान्ह",
      enDesc: "When the sun is high in the sky (approx. 9am–12pm).",
      hiDesc: "जब सूरज सिर के ऊपर होता है (लगभग 9 बजे से 12 बजे तक)।",
      from: 9,
      to: 12
    },
    {
      id: "aparanh",
      enName: "Aparanh (afternoon)",
      hiName: "अपरान्ह",
      enDesc: "Afternoon after midday (approx. 12pm–3pm).",
      hiDesc: "दोपहर के बाद का समय (लगभग 12 बजे से 3 बजे तक)।",
      from: 12,
      to: 15
    },
    {
      id: "sayankal",
      enName: "Sayankal (evening)",
      hiName: "सायंकाल",
      enDesc: "Evening time until sunset (approx. 3pm–6pm).",
      hiDesc: "शाम का समय, सूर्यास्त तक (लगभग 3 बजे से 6 बजे तक)।",
      from: 15,
      to: 18
    },
    {
      id: "pradosh",
      enName: "Pradosh (early night)",
      hiName: "प्रदोष",
      enDesc: "Just after sunset (approx. 6pm–9pm).",
      hiDesc: "सूर्यास्त के बाद का समय (लगभग 6 बजे से 9 बजे तक)।",
      from: 18,
      to: 21
    },
    {
      id: "nishith",
      enName: "Nishith (midnight)",
      hiName: "निशिथ",
      enDesc: "Deep night around midnight (approx. 9pm–12am).",
      hiDesc: "गहरी रात, लगभग मध्यरात्रि तक (9 बजे से 12 बजे तक)।",
      from: 21,
      to: 24
    },
    {
      id: "triyama",
      enName: "Triyama (late night)",
      hiName: "त्रियामा",
      enDesc: "Night’s third prahar (approx. 12am–3am).",
      hiDesc: "रात का तीसरा पहर (लगभग 12 बजे से 3 बजे तक)।",
      from: 0,
      to: 3
    },
    {
      id: "usha",
      enName: "Usha (dawn)",
      hiName: "उषा",
      enDesc: "Before sunrise, early dawn (approx. 3am–6am).",
      hiDesc: "भोर से ठीक पहले का समय (लगभग 3 बजे से 6 बजे तक)।",
      from: 3,
      to: 6
    }
  ];
  
  let currentLang = "en";
  
  function getCurrentPraharInfo(dateObj = new Date()) {
    const h = dateObj.getHours();
    // find first prahar whose [from, to) range contains this hour
    return PRAHARS.find(p => {
      if (p.from < p.to) {
        return h >= p.from && h < p.to;
      }
      // ranges that wrap midnight (not used above, but kept generic)
      return h >= p.from || h < p.to;
    }) || PRAHARS[0];
  }
  
  function updatePraharBox(lang) {
    const titleEl = document.getElementById("prahar-title");
    const nameEl  = document.getElementById("prahar-name");
    const descEl  = document.getElementById("prahar-desc");
  
    if (!titleEl || !nameEl || !descEl) return; // box not on this page
  
    currentLang = (lang === "hi") ? "hi" : "en";
  
    const info = getCurrentPraharInfo();
  
    // general description text
    const generalEn =
      "In 24 hours there are eight prahar, each about 3 hours.";
    const generalHi =
      "24 घंटे में आठ पहर माने जाते हैं, हर पहर लगभग 3 घंटे का होता है।";
  
    titleEl.textContent = (currentLang === "hi")
      ? "वर्तमान पहर"
      : "Current Prahar";
  
    if (currentLang === "hi") {
      nameEl.textContent = info.hiName + " – " + info.hiDesc;
      descEl.textContent = generalHi;
    } else {
      nameEl.textContent = info.enName + " – " + info.enDesc;
      descEl.textContent = generalEn;
    }
  }
  

 // ========== Language toggle ==========
const langToggle = document.getElementById("langToggle");

function broadcastLanguage() {
  const lang = (langToggle && langToggle.checked) ? "hi" : "en";

  // 1) Update Prahar box on this page
  updatePraharBox(lang);

  // 2) (optional) change labels near switch
  const leftLabel  = document.getElementById("lang-left");
  const rightLabel = document.getElementById("lang-right");
  if (leftLabel && rightLabel) {
    if (lang === "hi") {
      leftLabel.textContent  = "अंग्रेज़ी";
      rightLabel.textContent = "हिन्दी";
    } else {
      leftLabel.textContent  = "English";
      rightLabel.textContent = "Hindi";
    }
  }

  // 3) Tell Vikram Samvat calendar iframe
  const vikramFrame = document.querySelector(".right-calendar-wrapper iframe");
  if (
    vikramFrame &&
    vikramFrame.contentWindow &&
    typeof vikramFrame.contentWindow.setLanguage === "function"
  ) {
    vikramFrame.contentWindow.setLanguage(lang);
  }

  // 4) (optional) Gregorian iframe if later you add setLanguage() there
  const gregFrame = document.querySelector(".left-side-calendar iframe");
  if (
    gregFrame &&
    gregFrame.contentWindow &&
    typeof gregFrame.contentWindow.setLanguage === "function"
  ) {
    gregFrame.contentWindow.setLanguage(lang);
  }
}

if (langToggle) {
  langToggle.addEventListener("change", broadcastLanguage);

  // initial setup when page first loads
  window.addEventListener("load", () => {
    broadcastLanguage();
  });
}

// ========== Nav search for events / holidays / tasks ==========
const searchInput = document.getElementById("searchInput");
const searchBtn   = document.getElementById("searchBtn");

function triggerCalendarSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (!query) return;

    const vikramFrame = document.querySelector(".right-calendar-wrapper iframe");
    if (
        vikramFrame &&
        vikramFrame.contentWindow &&
        typeof vikramFrame.contentWindow.searchEvent === "function"
    ) {
        vikramFrame.contentWindow.searchEvent(query);
    }
}

if (searchBtn) {
    searchBtn.addEventListener("click", triggerCalendarSearch);
}

if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            triggerCalendarSearch();
        }
    });
}

// ========== Year selector: tell Vikram Samvat calendar which year to show ==========
const yearSelect = document.getElementById("yearSelect");

if (yearSelect) {
  yearSelect.addEventListener("change", () => {
    const year = parseInt(yearSelect.value, 10);

    // Right-side Vikram Samvat iframe
    const vikramFrame = document.querySelector(".right-calendar-wrapper iframe");
    if (
      vikramFrame &&
      vikramFrame.contentWindow &&
      typeof vikramFrame.contentWindow.setVikramYear === "function"
    ) {
      vikramFrame.contentWindow.setVikramYear(year);
    }
  });
}



   