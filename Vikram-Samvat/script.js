// current language: "en" or "hi"
let currentLanguage = "en";

// Map English month names -> Hindi names
const monthNameHindi = {
    "Chaitra":   "चैत्र",
    "Vaishakha": "वैशाख",
    "Jyeshtha":  "ज्येष्ठ",
    "Adhikmas":  "अधिकमास",
    "Ashadha":   "आषाढ़",
    "Shravana":  "श्रावण",
    "Bhadrapada":"भाद्रपद",
    "Ashwin":    "आश्विन",
    "Kartika":   "कार्तिक",
    "Agrahayana":"अग्रहायण",
    "Pausha":    "पौष",
    "Magha":     "माघ",
    "Phalguna":  "फाल्गुन"
  };

// Weekday display names (for row Ravi–Shani)
const weekdayNames = {
  en: ["Ravi","Som","Mangal","Budh","Guru","Shukra","Shani"],
  hi: ["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"]
};

// Use current year's month structure to get name
function getMonthDisplayName(index) {
    const engName = vikramMonths[index].name;
    if (currentLanguage === "hi") {
      return monthNameHindi[engName] || engName;
    }
    return engName;
  }


// Vikram Samvat months and their number of days
// 0 = Ravi, 1 = Som, 2 = Mangal, 3 = Budh, 4 = Guru, 5 = Shukra, 6 = Shani
const vikramMonths2082 = [
    { name: "Vaishakha",  days: 30, startDay: 0 }, // starts on Mangal
    { name: "Chaitra",    days: 29, startDay: 6 }, // starts on Ravi
    { name: "Jyeshtha",   days: 30, startDay: 2 }, // starts on Guru
    { name: "Ashadha",    days: 29, startDay: 4 }, // starts on Shani
    { name: "Shravana",   days: 30, startDay: 5 }, // starts on Som
    { name: "Bhadrapada", days: 29, startDay: 0 }, // starts on Budh
    { name: "Ashwin",     days: 30, startDay: 1 },
    { name: "Kartika",    days: 29, startDay: 3 },
    { name: "Agrahayana", days: 29, startDay: 4 },
    { name: "Pausha",     days: 30, startDay: 5 },
    { name: "Magha",      days: 29, startDay: 0 },
    { name: "Phalguna",   days: 30, startDay: 1 }
];

const vikramMonths2083 = [
    { name: "Chaitra",    days: 30, startDay: 3 },
    { name: "Vaishakha",  days: 29, startDay: 5 },
    { name: "Jyeshtha",   days: 30, startDay: 6 },
    { name: "Adhikmas",   days: 29, startDay: 1 }, // extra month
    { name: "Ashadha",    days: 30, startDay: 2 },
    { name: "Shravana",   days: 30, startDay: 4 },
    { name: "Bhadrapada", days: 29, startDay: 6 },
    { name: "Ashwin",     days: 30, startDay: 0 },
    { name: "Kartika",    days: 29, startDay: 2 },
    { name: "Agrahayana", days: 29, startDay: 3 },
    { name: "Pausha",     days: 30, startDay: 4 },
    { name: "Magha",      days: 29, startDay: 6 },
    { name: "Phalguna",   days: 30, startDay: 0 }
];

// use let so we can swap arrays
let vikramMonths = vikramMonths2082;
let TOTAL_VIKRAM_DAYS = vikramMonths.reduce((sum, m) => sum + m.days, 0);

// current Vikram Samvat year (changed by parent via window.setVikramYear)
let VIKRAM_YEAR = 2082;

/************  ANCHOR: 30 Nov 2025 = 25 Agrahayana  ************/
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// 30 Nov 2025 (Gregorian)
const ANCHOR_GREGORIAN = new Date(2025, 10, 30); // month 10 = November

// 25 Agrahayana (Hindu)
const ANCHOR_VIKRAM = { monthIndex: 8, day: 25 }; // 0-based: Agrahayana is index 8

/************  HELPER FUNCTIONS FOR CONVERSION  ************/
function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function vikramDayOfYear(monthIndex, day) {
    let total = 0;
    for (let i = 0; i < monthIndex; i++) {
        total += vikramMonths[i].days;
    }
    return total + (day - 1); // 0-based
}

// must be let so we can recompute when switching 2082 <-> 2083
let ANCHOR_DAY_OF_YEAR = vikramDayOfYear(ANCHOR_VIKRAM.monthIndex, ANCHOR_VIKRAM.day);

function dayOfYearToVikram(dayOfYear) {
    // keep in [0, TOTAL_VIKRAM_DAYS)
    let d = ((dayOfYear % TOTAL_VIKRAM_DAYS) + TOTAL_VIKRAM_DAYS) % TOTAL_VIKRAM_DAYS;

    let monthIndex = 0;
    while (d >= vikramMonths[monthIndex].days) {
        d -= vikramMonths[monthIndex].days;
        monthIndex++;
    }
    return { monthIndex, day: d + 1 };
}

function gregorianToVikram(gregDate) {
    const g = stripTime(gregDate);
    const anchor = stripTime(ANCHOR_GREGORIAN);
    const diffDays = Math.round((g - anchor) / ONE_DAY_MS);
    const dayOfYear = ANCHOR_DAY_OF_YEAR + diffDays;
    return dayOfYearToVikram(dayOfYear);
}

function vikramToGregorian(monthIndex, day) {
    const anchor = stripTime(ANCHOR_GREGORIAN);
    const dayOfYear = vikramDayOfYear(monthIndex, day);
    const diffDays = dayOfYear - ANCHOR_DAY_OF_YEAR;
    return new Date(anchor.getTime() + diffDays * ONE_DAY_MS);
}

/************  RIGHT-SIDE BOX (TEXT) CONFIG  ************/
const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
];

// Predefined events for 2082
const predefinedEvents2082 = {
    7: { // Kartika
        4:  { text: "Govardhan Puja (National holiday)",   types: ["festival","holiday"] },
        15: { text: "National holiday demo", type: "holiday" }
    },
    6: { // Ashwin
        4:  { text: "Navratri event", type: "festival" }
    },
    8: { // Agrahayana
        25: { text: "Special day", type: "festival" }
    },
    9: { // Pausa
        1:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - प्रतिपदा <br>
                    नक्षत्र	- रोहिणी <br>
                    सूर्योदय : 6:58 <br>
                    सूर्यास्त : 5:36 <br>
                    रोहिणी व्रत
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         2:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - द्वितीय <br>
                    नक्षत्र	- म्रृगशीर्षा <br>
                    सूर्योदय : 6:59 <br>
                    सूर्यास्त: 5:36
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         3:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - तृतीया <br>
                    नक्षत्र	- पुनर्वसु <br>
                    सूर्योदय : 6:59 <br>
                    सूर्यास्त: 5:37 <br>
                    संकष्टी चतुर्थी
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         4:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - चतुर्थी <br>
                    नक्षत्र	- पुष्य <br>
                    सूर्योदय : 7:00 <br>
                    सूर्यास्त: 5:37
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         5:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - पंचमी <br>
                    नक्षत्र	- आश्लेषा <br>
                    सूर्योदय : 7:00 <br>
                    सूर्यास्त: 5:37
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         6:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - षष्ठी <br>
                    नक्षत्र	- मघा <br>
                    सूर्योदय : 7:01 <br>
                    सूर्यास्त: 5:37
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         7:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - सप्तमी <br>
                    नक्षत्र	- पूर्व फाल्गुनी <br>
                    सूर्योदय : 7:02 <br>
                    सूर्यास्त: 5:38 <br>
                    कालाष्टमी
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         8:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - अष्टमी <br>
                    नक्षत्र	- उत्तर फाल्गुनी <br>
                    सूर्योदय : 7:02 <br>
                    सूर्यास्त: 5:38
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         9:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - नवमी <br>
                    नक्षत्र	- हस्त <br>
                    सूर्योदय : 7:03 <br>
                    सूर्यास्त: 5:38
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         10:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - दशमी <br>
                    नक्षत्र	- हस्त (up to 8:18 am)
                    चित्रा <br>
                    सूर्योदय : 7:04 <br>
                    सूर्यास्त: 5:39
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         11:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - एकादशी <br>
                    नक्षत्र	- चित्रा (up to 11:08 am)
                    स्वाति <br>
                    सूर्योदय : 7:04 <br>
                    सूर्यास्त: 5:39 <br>
                    सफला एकादशी
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         12:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - द्वादशी <br>
                    नक्षत्र	- स्वाति (up to 2:09 pm)
                    विशाखा <br>
                    सूर्योदय : 7:05 <br>
                    सूर्यास्त: 5:39 <br>
                    धनु संक्रांति
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         13:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - त्रयोदशी <br>
                    नक्षत्र	- विशाखा (up to 5:11 pm)
                    अनुराधा <br>
                    सूर्योदय : 7:05 <br>
                    सूर्यास्त: 5:40 <br>
                    प्रदोष व्रत
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         14:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                कृष्ण पक्ष - चतुर्दशी <br>
                नक्षत्र	- अनुराधा (up to 8:06 pm)
                ज्येष्ठा <br>
                सूर्योदय : 7:06 <br>
                सूर्यास्त: 5:40 <br>
                मासिक शिवरात्रि
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         15:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                कृष्ण पक्ष - अमावस्या <br>
                नक्षत्र	- ज्येष्ठा (up to 10:51 pm)
                मूल <br>
                सूर्योदय : 7:06 <br>
                सूर्यास्त: 5:41 <br>
                अमावस्या 
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         16:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                कृष्ण पक्ष - अमावस्या (up to 7:13 am)
                प्रतिपदा <br>
                नक्षत्र	- मूल <br>
                सूर्योदय : 7:07 <br>
                सूर्यास्त: 5:41
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         17:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - प्रतिपदा (up to 9:11 am)
                द्वितीया <br>
                नक्षत्र	- पूर्वाषाढ़ा <br>
                सूर्योदय : 7:07 <br>
                सूर्यास्त: 5:41 <br>
                चंद्र दर्शन
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         18:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - द्वितीया (up to 10:52 am)
                तृतीया <br>
                नक्षत्र	- उत्तराषाढ़ा <br>
                सूर्योदय : 7:08 <br>
                सूर्यास्त: 5:42 <br>
                सोमवार व्रत
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         19:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - तृतीया (up to 12:13 pm)
                चतुर्थी <br>
                नक्षत्र	- श्रवण
                धनिष्ठा <br>
                सूर्योदय : 7:08 <br>
                सूर्यास्त: 5:43
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         20:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - चतुर्थी (up to 1:11 pm)
                पंचमी <br>
                नक्षत्र	- धनिष्ठा <br>
                सूर्योदय : 7:09 <br>
                सूर्यास्त: 5:43 <br>
                चतुर्थी व्रत
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         21:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - पंचमी (up to 1:43 pm)
                षष्ठी <br>
                नक्षत्र	- धनिष्ठा (up to 8:18 am)
                शतभिषा <br>
                सूर्योदय : 7:09 <br>
                सूर्यास्त: 5:44 <br>
                मालवीय जयंती <br><br>
                    <b>Christmas</b>
                </div>
                <div class="event-img">
                    <img src="../Christmas.jpeg" alt="img_err">
                </div>
            </div>
            `,
            type: "festival"
         },
         22:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - षष्ठी (up to 1:44 pm)
                सप्तमी <br>
                नक्षत्र	- शतभिषा (up to 9:00 am)
                पूर्वभाद्रपदा <br>
                सूर्योदय : 7:10 <br>
                सूर्यास्त: 5:44 <br>
                षष्ठी
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         23:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - सप्तमी (up to 1:10 pm)
                अष्टमी <br>
                नक्षत्र	- पूर्वभाद्रपदा (up to 9:09 am)
                उत्तरभाद्रपदा <br>
                सूर्योदय : 7:10 <br>
                सूर्यास्त: 5:45 <br>
                गुरु गोबिंद जयंती
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         24:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - अष्टमी (up to 12:00 pm)
                नवमी <br>
                नक्षत्र	- उत्तरभाद्रपदा (up to 8:43 am)
                रेवती <br>
                सूर्योदय : 7:11 <br>
                सूर्यास्त: 5:45 <br>
                दुर्गा अष्टमी व्रत
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         25:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - नवमी (up to 10:12 am)
                दशमी <br>
                नक्षत्र	- रेवती (up to 7:40 am)
                अश्विनी
                भरणी <br>
                सूर्योदय : 7:11 <br>
                सूर्यास्त: 5:46
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         26:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - दशमी (up to 7:51 am)
                एकादशी
                द्वादशी <br>
                नक्षत्र	- भरणी
                कृत्तिका <br>
                सूर्योदय : 7:11 <br>
                सूर्यास्त: 5:47 <br>
                वैकुंठ एकादशी <br>
                पौष पुत्रदा एकादशी
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         27:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - द्वादशी
                त्रयोदशी <br>
                नक्षत्र	- कृत्तिका
                रोहिणी <br>
                सूर्योदय : 7:12 <br>
                सूर्यास्त: 5:47
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         28:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - त्रयोदशी (up to 10:22 pm)
                चतुर्दशी <br>
                नक्षत्र	- रोहिणी (up to 10:48 pm)
                म्रृगशीर्षा <br>
                सूर्योदय : 7:12 <br>
                सूर्यास्त: 5:48 <br>
                रोहिणी व्रत <br>
                प्रदोष व्रत <br>
                New Year Day
                </div>
                <div class="event-img">
                <img src="../Bristish_newYear.jpg" alt="img err">
                </div>
            </div>
            `
         },
         29:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - चतुर्दशी (up to 6:53 pm)
                पूर्णिमा <br>
                नक्षत्र	- म्रृगशीर्षा (up to 8:04 pm)
                आद्रा <br>
                सूर्योदय : 7:12 <br>
                सूर्यास्त: 5:48
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         },
         30:  { 
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                शुक्ल पक्ष - पूर्णिमा (up to 3:32 pm)
                प्रतिपदा <br>
                नक्षत्र	- आद्रा (up to 5:27 pm)
                पुनर्वसु <br>
                सूर्योदय : 7:12 <br>
                सूर्यास्त: 5:49 <br>
                माघ स्नान का शुभारंभ <br>
                पूर्णिमा व्रत <br>
                सत्यनारायण पूजा / व्रत 
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
         }
    },
    10:{
        1:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष -प्रतिपदा (up to 12:30 pm)
                    द्वितीया <br>
                    नक्षत्र	- पुनर्वसु (up to 3:11 pm)
                    पुष्य <br>
                    सूर्योदय : 7:13 <br>
                    सूर्यास्त : 5:50 <br>
                   
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        2:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष -द्वितीया (up to 9:57 am)
                    तृतीया <br>
                    नक्षत्र	- पुष्य (up to 1:24 pm)
                    आश्लेषा <br>
                    सूर्योदय : 7:13 <br>
                    सूर्यास्त : 5:50 <br>
                   
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        3:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष -तृतीया (up to 8:02 am)
                    चतुर्थी
                    पंचमी <br>
                    नक्षत्र	- आश्लेषा (up to 12:17 pm)
                    मघा <br>
                    सूर्योदय : 7:13 <br>
                    सूर्यास्त : 5:51 <br>
                    संकष्टी चतुर्थी <br>
                    अंगारकी चतुर्थी <br>
                    सकट चौथ
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        4:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष -पंचमी
                    षष्ठी <br>
                    नक्षत्र	- मघा (up to 11:56 am)
                    पूर्व फाल्गुनी <br>
                    सूर्योदय : 7:13 <br>
                    सूर्यास्त : 5:52 <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        5:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष -षष्ठी
                    सप्तमी <br>
                    नक्षत्र	- पूर्व फाल्गुनी (up to 12:24 pm)
                    उत्तर फाल्गुनी <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 5:53 <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        6:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष -सप्तमी <br>
                    नक्षत्र	- उत्तर फाल्गुनी (up to 1:40 pm)
                    हस्त <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 5:53 <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        7:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - सप्तमी (up to 8:24 am)
                    अष्टमी <br>
                    नक्षत्र	- हस्त (up to 3:39 pm)
                    चित्रा <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 5:54 <br>
                    कालाष्टमी
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        8:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - अष्टमी (up to 10:20 am)
                    नवमी <br>
                    नक्षत्र	- चित्रा (up to 6:12 pm)
                    स्वाति <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 5:55 <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        9:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - नवमी (up to 12:43 pm)
                    दशमी <br>
                    नक्षत्र	- स्वाति (up to 9:05 pm)
                    विशाखा <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 5:55 <br>
                    स्वामी विवेकानंद जयंती <br>
                    National Youth day
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        10:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - दशमी (up to 3:18 pm)
                    एकादशी <br>
                    नक्षत्र	- विशाखा
                    अनुराधा <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 5:56 <br>
                    लोहड़ी
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `,
            type: "festival"
        },
        11:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - एकादशी (up to 5:53 pm)
                    द्वादशी <br>
                    नक्षत्र	- अनुराधा
                    ज्येष्ठा <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 5:57 <br>
                    गंगा सागर स्नान <br>
                    षटतिला एकादशी <br>
                   <b> मकर संक्रांति <br> </b>

                   
                </div>
                <div class="event-img">
                <img src="../Makar_sankranti.jpg" alt="img_err">
                </div>
            </div>
            `,
            type: "festival"
        },
        12:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - द्वादशी (up to 8:17 pm)
                    त्रयोदशी <br>
                    नक्षत्र	- ज्येष्ठा
                    मूल <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 5:57 <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        13:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - त्रयोदशी (up to 10:22 pm)
                    चतुर्दशी <br>
                    नक्षत्र	- मूल <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 5:58 <br>
                    मासिक शिवरात्रि <br>
                    प्रदोष व्रत
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        14:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - चतुर्दशी
                    अमावस्या<br>
                    नक्षत्र	- मूल (up to 8:12 am)
                    पूर्वाषाढ़ा <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 5:59 <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        15:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    कृष्ण पक्ष - अमावस्या
                    प्रतिपदा<br>
                    नक्षत्र	- पूर्वाषाढ़ा (up to 10:14 am)
                    उत्तराषाढ़ा <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 6:00 <br>
                    मौनी अमावस्या <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        16:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - प्रतिपदा
                    द्वितीया<br>
                    नक्षत्र	- उत्तराषाढ़ा (up to 11:52 am)
                    श्रवण <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 6:00 <br>
                    शिशिर ऋतु <br>
                    माघ गुप्त नवरात्रि <br>
                    सोमवार व्रत <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        17:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - द्वितीया
                    तृतीया<br>
                    नक्षत्र	- श्रवण (up to 1:06 pm)
                    धनिष्ठा <br>
                    सूर्योदय : 7:14 <br>
                    सूर्यास्त : 6:01 <br>
                    चंद्र दर्शन <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        18:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - तृतीया
                    चतुर्थी<br>
                    नक्षत्र	- धनिष्ठा (up to 1:58 pm)
                    शतभिषा <br>
                    सूर्योदय : 7:13 <br>
                    सूर्यास्त : 6:02 <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        19:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - चतुर्थी
                    पंचमी<br>
                    नक्षत्र	- शतभिषा (up to 2:26 pm)
                    पूर्वभाद्रपदा <br>
                    सूर्योदय : 7:13 <br>
                    सूर्यास्त : 6:03 <br>
                    गणेश चतुर्थी व्रत <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        20:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - पंचमी
                    षष्ठी<br>
                    नक्षत्र	- पूर्वभाद्रपदा (up to 2:32 pm)
                    उत्तरभाद्रपदा <br>
                    सूर्योदय : 7:13 <br>
                    सूर्यास्त : 6:03 <br>
                    बसंत पंचमी <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        21:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - षष्ठी
                    सप्तमी<br>
                    नक्षत्र	- उत्तरभाद्रपदा (up to 2:15 pm)
                    रेवती <br>
                    सूर्योदय : 7:13 <br>
                    सूर्यास्त : 6:04 <br>
                    षष्ठी <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        22:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - सप्तमी (up to 11:10 pm)
                    अष्टमी<br>
                    नक्षत्र	- रेवती (up to 1:35 pm)
                    अश्विनी <br>
                    सूर्योदय : 7:13 <br>
                    सूर्यास्त : 6:05 <br>
                    रथ सप्तमी <br>
                </div>
                <div class="event-img">
                    
                </div>
            </div>
            `
        },
        23:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - अष्टमी (up to 9:18 pm)
                    नवमी<br>
                    नक्षत्र	- अश्विनी (up to 12:32 pm)
                    भरणी <br>
                    सूर्योदय : 7:12 <br>
                    सूर्यास्त : 6:05 <br>
                    दुर्गा अष्टमी व्रत <br>
                    भीष्म अष्टमी <br>
                    <b>Republic day</b>
                </div>
                <div class="event-img">
                <img src="../Republic day.jpg" alt="img_err">
                </div>
            </div>
            `,
            type: "holiday"
        },
        24:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - नवमी (up to 7:05 pm)
                    दशमी<br>
                    नक्षत्र	- भरणी (up to 11:08 am)
                    कृत्तिका <br>
                    सूर्योदय : 7:12 <br>
                    सूर्यास्त : 6:06 <br>
                    महानंदा नवमी <br>
                </div>
                <div class="event-img">

                </div>
            </div>
            `
        },
        25:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - दशमी (up to 4:36 pm)
                    एकादशी<br>
                    नक्षत्र	- कृत्तिका (up to 9:26 am)
                    रोहिणी <br>
                    सूर्योदय : 7:12 <br>
                    सूर्यास्त : 6:07 <br>
                </div>
                <div class="event-img">

                </div>
            </div>
            `
        },
        26:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - एकादशी (up to 1:55 pm)
                    द्वादशी<br>
                    नक्षत्र	- रोहिणी (up to 7:31 am)
                    म्रृगशीर्षा
                    आद्रा <br>
                    सूर्योदय : 7:11 <br>
                    सूर्यास्त : 6:07 <br>
                    रोहिणी व्रत <br>
                    जया एकादशी <br>
                </div>
                <div class="event-img">

                </div>
            </div>
            `
        },
        27:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - द्वादशी (up to 11:09 am)
                    त्रयोदशी<br>
                    नक्षत्र	- आद्रा
                    पुनर्वसु <br>
                    सूर्योदय : 7:11 <br>
                    सूर्यास्त : 6:08 <br>
                    प्रदोष व्रत <br>
                    विश्वकर्मा जयंती <br>
                </div>
                <div class="event-img">

                </div>
            </div>
            `
        },
        28:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - त्रयोदशी (up to 8:26 am)
                    चतुर्दशी
                    पूर्णिमा<br>
                    नक्षत्र	- पुनर्वसु
                    पुष्य <br>
                    सूर्योदय : 7:11 <br>
                    सूर्यास्त : 6:09 <br>
                    
                </div>
                <div class="event-img">

                </div>
            </div>
            ` 
        },
        29:{
            html: `
            <div class="event-row">
                <div class="event-text" style="font-size: 16px;">
                    शुक्ल पक्ष - पूर्णिमा
                    प्रतिपदा<br>
                    नक्षत्र	- पुष्य (up to 11:57 pm)
                    आश्लेषा <br>
                    सूर्योदय : 7:10 <br>
                    सूर्यास्त : 6:10 <br>
                    पूर्णिमा<br>
                    श्री सत्यनारायण पूजा <br>
                    गुरु रविदास जयंती <br>                  
                </div>
                <div class="event-img">

                </div>
            </div>
            ` 
        }
    }
};

// Predefined events for 2083 (start empty, you will fill later)
const predefinedEvents2083 = {};

// Active object used by the rest of the code
let predefinedEventsVikram = predefinedEvents2082;


// --- Local storage key base; real key includes year ---
const STORAGE_KEY_BASE = "vikram_user_events_v1_";
let STORAGE_KEY = STORAGE_KEY_BASE + VIKRAM_YEAR;

// Load from localStorage
function loadUserEvents() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null) {
            return parsed;
        }
        return {};
    } catch (e) {
        console.error("Failed to load user events from localStorage", e);
        return {};
    }
}

// Save to localStorage
function saveUserEvents() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userEventsVikram));
    } catch (e) {
        console.error("Failed to save user events to localStorage", e);
    }
}

// User-added tasks/events (now loaded from storage instead of empty)
let userEventsVikram = loadUserEvents();

function formatDateFromDate(date) {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = monthNames[date.getMonth()];
    const yyyy = date.getFullYear();
    return `${dd} ${mm}, ${yyyy}`;
}

/************  MAIN UI LOGIC  ************/
document.addEventListener("DOMContentLoaded", () => {
    const title          = document.querySelector(".month-title");
    const btnLeft        = document.getElementById("btn-left");
    const btnRight       = document.getElementById("btn-right");
    const datesContainer = document.querySelector(".dates");

    const selectedDateBar = document.getElementById("selected-date-text");
    const dateContent     = document.getElementById("date-content");
    const addEventBtn     = document.getElementById("add-event-btn");

    const TODAY_GREGORIAN = stripTime(new Date());
    let TODAY_VIKRAM      = gregorianToVikram(TODAY_GREGORIAN); // let, so we can recompute after year change

    let currentMonthIndex = TODAY_VIKRAM.monthIndex; // show today's Hindu month

    let lastSelectedVikram = { 
        monthIndex: TODAY_VIKRAM.monthIndex, 
        day: TODAY_VIKRAM.day 
    };
    
    let lastSelectedGregorian = TODAY_GREGORIAN;    

    function renderWeekdays() {
        const dayEls = document.querySelectorAll(".day-name");
        const labels = weekdayNames[currentLanguage];

        dayEls.forEach((el, i) => {
            el.textContent = labels[i];
        });
    }

    function updateMonthTitle() {
        title.textContent = getMonthDisplayName(currentMonthIndex);
    }


    function showDateDetails(gregorianDate, label) {
        // convert Gregorian → Hindu date
        const v = gregorianToVikram(gregorianDate);
        const hinduMonthIndex = v.monthIndex;
        const hinduDay       = v.day;
        const hinduMonthName = getMonthDisplayName(hinduMonthIndex);
    
        // remember last selected date (for + button)
        lastSelectedVikram = { monthIndex: hinduMonthIndex, day: hinduDay };
        lastSelectedGregorian = gregorianDate;
    
        // Top blue bar text in detailed-box
        selectedDateBar.textContent = `${label} : ${hinduDay} ${hinduMonthName}, ${VIKRAM_YEAR}`;
    
        // --- 1) GET PREDEFINED EVENT FOR THIS HINDU DATE ---
        let predefined = null;
        if (predefinedEventsVikram[hinduMonthIndex] &&
            predefinedEventsVikram[hinduMonthIndex][hinduDay]) {
            predefined = predefinedEventsVikram[hinduMonthIndex][hinduDay];
        }
    
        // --- 2) GET USER TASKS FOR THIS HINDU DATE ---
        let userList = [];
        if (userEventsVikram[hinduMonthIndex] &&
            userEventsVikram[hinduMonthIndex][hinduDay]) {
            userList = userEventsVikram[hinduMonthIndex][hinduDay];
        }
    
        // --- 3) BUILD HTML ---
        let html = "";
    
        // Predefined block (your text+images)
        if (predefined) {
            if (predefined.html) {
                // if you want full custom HTML
                html += `<div class="predefined-event">${predefined.html}</div>`;
            } else {
                // simple text-only version
                html += `
                    <div class="predefined-event">
                        <p style="color:black; font-size:15px; margin:10px 15px;">
                            ${predefined.text}
                        </p>
                    </div>
                `;
            }
        } else {
            html += `
                <div class="predefined-event">
                    <p style="color:black; margin:10px 15px;">
                        No fixed event for this date.
                    </p>
                </div>
            `;
        }
    
        // User tasks block (only if something exists)
        if (userList.length > 0) {
            html += `
                <hr class="tasks-divider">
                <div class="user-events">
                    <p style="color:black; font-weight:bold; margin:10px 15px 5px;">
                        Your tasks:
                    </p>
                    <ul class="user-task-list" style="margin:0 15px 10px 30px; padding:0;">
    ${userList.map((t, i) => `
        <li data-index="${i}" style="position:relative; margin-bottom:4px;">
            ${t}
            <button class="delete-task-btn" data-index="${i}"
                style="position:absolute; right:-10px; top:0; border:none; background:none; color:red; cursor:pointer;">
                ❌
            </button>
        </li>
    `).join("")}
</ul>

                </div>
            `;
        }
    
        // If no user tasks and no predefined?
        // (this case only happens if you remove all predefined entries)
        if (!predefined && userList.length === 0) {
            html = `
                <p style="color:black; margin:10px 15px;">
                    No event or task stored for this date.
                </p>
            `;
        }
    
        dateContent.innerHTML = html;

        // enable delete buttons for user tasks
        const deleteButtons = dateContent.querySelectorAll(".delete-task-btn");
        deleteButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const taskIndex = parseInt(btn.dataset.index);
                const m = lastSelectedVikram.monthIndex;
                const d = lastSelectedVikram.day;

                // remove task
                userEventsVikram[m][d].splice(taskIndex, 1);

                // if empty, delete the whole date entry
                if (userEventsVikram[m][d].length === 0) {
                    delete userEventsVikram[m][d];
                }

                // save updated data
                saveUserEvents();

                // refresh UI
                showDateDetails(lastSelectedGregorian, "Selected date");

                const selector = `.date-cell[data-month-index="${m}"][data-day="${d}"]`;
                const cell = document.querySelector(selector);
                if (cell) {
                    applyIndicatorsToCell(cell, m, d);
                }
            });
        });

    }
    
    
    function setupDateSelection() {
        const allDates = datesContainer.querySelectorAll(".date-cell");

        allDates.forEach(cell => {
            cell.addEventListener("click", () => {
                allDates.forEach(c => c.classList.remove("selected"));

                cell.classList.add("selected");

                const mIndex = parseInt(cell.dataset.monthIndex, 10);
                const day    = parseInt(cell.dataset.day, 10);

                const gregDate = vikramToGregorian(mIndex, day);
                showDateDetails(gregDate, "Selected date");
            });
        });
    }

    function highlightTodayCell() {
        const allDates = datesContainer.querySelectorAll(".date-cell");
        allDates.forEach(cell => {
            const mIndex = parseInt(cell.dataset.monthIndex, 10);
            const day    = parseInt(cell.dataset.day, 10);

            if (mIndex === TODAY_VIKRAM.monthIndex && day === TODAY_VIKRAM.day) {
                cell.classList.add("today", "selected");
            } else {
                cell.classList.remove("today");
            }
        });

        // show today's Gregorian date text
        showDateDetails(TODAY_GREGORIAN, "Today's date");
    }

    function renderMonth(index) {
        const month = vikramMonths[index];
        currentMonthIndex = index;

        // update nav title
        updateMonthTitle();

        // clear old cells
        datesContainer.innerHTML = "";

        // empty cells so the month starts on correct weekday
        for (let i = 0; i < month.startDay; i++) {
            const empty = document.createElement("div");
            empty.className = "empty-cell";
            datesContainer.appendChild(empty);
        }

        // actual dates
        for (let day = 1; day <= month.days; day++) {
            const cell = document.createElement("div");
            cell.className = "date-cell";
        
            // show the number
            cell.textContent = day;
        
            // store which Hindu date this is
            cell.dataset.monthIndex = index;
            cell.dataset.day = day;
        
            // add indicators based on data
            applyIndicatorsToCell(cell, index, day);
        
            datesContainer.appendChild(cell);
        }
        
        setupDateSelection();
        highlightTodayCell();
    }

    // Arrow buttons
    btnRight.addEventListener("click", () => {
        currentMonthIndex = (currentMonthIndex + 1) % vikramMonths.length;
        renderMonth(currentMonthIndex);
    });

    btnLeft.addEventListener("click", () => {
        currentMonthIndex = (currentMonthIndex - 1 + vikramMonths.length) % vikramMonths.length;
        renderMonth(currentMonthIndex);
    });

    // Keyboard left/right arrows
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
        }

        if (event.key === "ArrowRight") {
            currentMonthIndex = (currentMonthIndex + 1) % vikramMonths.length;
            renderMonth(currentMonthIndex);
        }

        if (event.key === "ArrowLeft") {
            currentMonthIndex = (currentMonthIndex - 1 + vikramMonths.length) % vikramMonths.length;
            renderMonth(currentMonthIndex);
        }
    });

    renderWeekdays();
    // Initial render – will show the Hindu month that matches today's Gregorian date
    renderMonth(currentMonthIndex);

    addEventBtn.addEventListener("click", () => {
        const text = prompt("Enter event/task for this date:");
        if (!text) return;  // cancelled or empty
    
        const m = lastSelectedVikram.monthIndex;
        const d = lastSelectedVikram.day;
    
        if (!userEventsVikram[m]) {
            userEventsVikram[m] = {};
        }
        if (!userEventsVikram[m][d]) {
            userEventsVikram[m][d] = [];
        }
    
        // add one more task instead of overwriting
        userEventsVikram[m][d].push(text);

        // save to localStorage
        saveUserEvents();
    
        // refresh view
        showDateDetails(lastSelectedGregorian, "Selected date");

        // refresh the dot on that date cell
        const selector = `.date-cell[data-month-index="${m}"][data-day="${d}"]`;
        const cell = document.querySelector(selector);
        if (cell) {
            applyIndicatorsToCell(cell, m, d);
        }
    });

    function applyIndicatorsToCell(cell, mIndex, day) {
        // remove previous indicator row (if re-rendering)
        const oldRow = cell.querySelector(".indicator-row");
        if (oldRow) oldRow.remove();
    
        const row = document.createElement("div");
        row.className = "indicator-row";
    
        const predefined =
            predefinedEventsVikram[mIndex] &&
            predefinedEventsVikram[mIndex][day];
    
        // read types: support both {type:"..."} and {types:[...]}
        let isFestival = false;
        let isHoliday  = false;
    
        if (predefined) {
            const typesArray = predefined.types
                ? predefined.types
                : (predefined.type ? [predefined.type] : []);
    
            isFestival = typesArray.includes("festival");
            isHoliday  = typesArray.includes("holiday");
        }
    
        const hasUserTasks =
            userEventsVikram[mIndex] &&
            userEventsVikram[mIndex][day] &&
            userEventsVikram[mIndex][day].length > 0;
    
        // GREEN dot for festival
        if (isFestival) {
            const dot = document.createElement("span");
            dot.className = "indicator-dot festival-dot";
            row.appendChild(dot);
        }
    
        // YELLOW dot for holiday
        if (isHoliday) {
            const dot = document.createElement("span");
            dot.className = "indicator-dot holiday-dot";
            row.appendChild(dot);
        }
    
        // RED dot for user tasks
        if (hasUserTasks) {
            const dot = document.createElement("span");
            dot.className = "indicator-dot user-dot";
            row.appendChild(dot);
        }
    
        // If no indicators at all, add transparent one so layout stays aligned
        if (!isFestival && !isHoliday && !hasUserTasks) {
            const dot = document.createElement("span");
            dot.className = "indicator-dot transparent-dot";
            row.appendChild(dot);
        }
    
        cell.appendChild(row);
    }    

    // ========== Search by event / holiday / task text (all months) ==========

    function findEventByText(query) {
        if (!query) return null;
        const q = query.toLowerCase();
    
        // ---- 1) Search predefined events (festivals / holidays) in ALL months ----
        if (typeof predefinedEventsVikram === "object" && predefinedEventsVikram) {
            for (let m = 0; m < vikramMonths.length; m++) {
                const monthObj = predefinedEventsVikram[m];
                if (!monthObj) continue;
    
                for (const dayStr in monthObj) {
                    const d   = Number(dayStr);
                    const evt = monthObj[dayStr];
                    if (!evt) continue;
    
                    // 🟢 NEW: build a searchable text blob from text + html
                    let textBlob = "";
    
                    if (typeof evt.text === "string") {
                        textBlob += " " + evt.text;
                    }
                    if (typeof evt.html === "string") {
                        // strip HTML tags so we only search the readable text
                        textBlob += " " + evt.html.replace(/<[^>]*>/g, " ");
                    }
    
                    if (!textBlob) continue;
    
                    if (textBlob.toLowerCase().includes(q)) {
                        return {
                            monthIndex: m,
                            day: d,
                            source: "fixed",
                            event: evt
                        };
                    }
                }
            }
        }
    
        // ---- 2) Search user-added tasks in ALL months ----
        if (typeof userEventsVikram === "object" && userEventsVikram) {
            for (let m = 0; m < vikramMonths.length; m++) {
                const monthObj = userEventsVikram[m];
                if (!monthObj) continue;
    
                for (const dayStr in monthObj) {
                    const d     = Number(dayStr);
                    const tasks = monthObj[dayStr] || [];
    
                    for (const text of tasks) {
                        if (!text) continue;
                        if (text.toLowerCase().includes(q)) {
                            return {
                                monthIndex: m,
                                day: d,
                                source: "task",
                                text
                            };
                        }
                    }
                }
            }
        }
    
        // nothing found
        return null;
    }
    

    // Go to a Vikram month/day and select its cell
    function goToVikramDate(monthIndex, day) {
        // 1. change month
        currentMonthIndex = monthIndex;

        // 2. re-render that month
        renderMonth(currentMonthIndex);

        // 3. click the right date cell so normal handler runs
        const selector = `.date-cell[data-month-index="${monthIndex}"][data-day="${day}"]`;
        const cell = document.querySelector(selector);
        if (cell) {
            cell.click();
        }
    }

    // Called from parent page (Home) to search and jump
    window.searchEvent = function (query) {
        const q = (query || "").trim();
        if (!q) return;

        const result = findEventByText(q);

        if (!result) {
            const msg = (currentLanguage === "hi")
                ? "इस नाम से कोई तिथि नहीं मिली।"
                : "No date found for that name.";
            alert(msg);
            return;
        }

        goToVikramDate(result.monthIndex, result.day);
    };

    // Called from parent page (Home) when toggle changes
    window.setLanguage = function (lang) {
        currentLanguage = (lang === "hi") ? "hi" : "en";

        // update weekday row
        renderWeekdays();

        // update month title
        updateMonthTitle();

        // re-render selected date text in detail box
        showDateDetails(lastSelectedGregorian, "Selected date");
    };

    // ========== Called from parent (Home page) to change the Vikram year ==========
    window.setVikramYear = function (year) {
        const y = parseInt(year, 10);
        if (!isNaN(y)) VIKRAM_YEAR = y;
        else VIKRAM_YEAR = 2082;
    
        // 1. swap month structure
        if (VIKRAM_YEAR === 2082) {
            vikramMonths = vikramMonths2082;
            predefinedEventsVikram = predefinedEvents2082;
        } else if (VIKRAM_YEAR === 2083) {
            vikramMonths = vikramMonths2083;
            predefinedEventsVikram = predefinedEvents2083; // currently empty
        } else {
            vikramMonths = vikramMonths2082;
            predefinedEventsVikram = predefinedEvents2082;
        }
    
        // 2. recalc totals + anchor
        TOTAL_VIKRAM_DAYS = vikramMonths.reduce((sum, m) => sum + m.days, 0);
        ANCHOR_DAY_OF_YEAR = vikramDayOfYear(ANCHOR_VIKRAM.monthIndex, ANCHOR_VIKRAM.day);
        TODAY_VIKRAM = gregorianToVikram(TODAY_GREGORIAN);
    
        // 3. switch task storage to this year
        STORAGE_KEY = STORAGE_KEY_BASE + VIKRAM_YEAR;
        userEventsVikram = loadUserEvents();   // for 2083 this will be empty first time
    
        // 4. start from first month of that year
        currentMonthIndex = 0;
        renderMonth(currentMonthIndex);
    
        // 5. refresh selected-date panel
        showDateDetails(lastSelectedGregorian, "Selected date");
    };
    

});
