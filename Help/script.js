// script.js

// Toggle + labels
const langToggle = document.getElementById("langToggle");
const langLeft   = document.getElementById("lang-left");
const langRight  = document.getElementById("lang-right");

// Text elements
const title1 = document.querySelector(".title-1");
const desc1  = document.querySelector(".child-1 .desc");
const title2 = document.querySelector(".title-2");
const desc2  = document.querySelector(".child-2 .desc");

// Save original English text directly from HTML
const EN = {
  title1: title1.textContent.trim(),
  title2: title2.textContent.trim(),
  desc1 : desc1.innerHTML,
  desc2 : desc2.innerHTML
};

// Hindi text
const HI = {
  title1: "विक्रम संवत क्या है?",
  desc1: `
  विक्रम संवत एक पारंपरिक हिन्दू पंचांग है, जिसका उपयोग भारत और नेपाल सहित 
  उत्तर तथा मध्य भारत के कई क्षेत्रों में किया जाता है। यह एक चन्द्रसौर 
  (लूनिसोलर) कैलेंडर है, जिसमें सूर्य और चन्द्र दोनों की गति को ध्यान में रखकर 
  तिथि और मास तय किए जाते हैं।
  <br><br>
  ग्रेगोरियन कैलेंडर में अतिरिक्त दिन जोड़कर वर्ष की गणना समायोजित की जाती है, 
  जबकि हिन्दू कैलेंडर में लगभग हर 32–33 महीने में एक अतिरिक्त मास 
  (अधिक मास) जोड़ा जाता है, ताकि त्योहार हमेशा उपयुक्त ऋतु में ही आएँ।
  <br><br>
  <img src="../Images/kv_3.jpeg" alt="Image not found" height="200" width="200">
  <br>
  प्राचीन काल से ही हिन्दू समाज में पूजा-पाठ, व्रत, त्यौहार, और खेती-बाड़ी के 
  लिए इसी प्रकार के पंचांग का उपयोग किया जाता रहा है। आज भी दुनिया भर के 
  हिन्दू लोग त्योहारों की तिथि तय करने के लिए पंचांग / विक्रम संवत देखते हैं।
  <br><br>
  <br>
  हिन्दू कैलेंडर ज्योतिष और राशियों के लिए भी बहुत महत्वपूर्ण है। 
  शुभ मुहूर्त, व्रत जैसे एकादशी इत्यादि, सब कुछ इन्हीं तिथियों के आधार पर 
  देखा जाता है।
  <br>
  जय श्री राम!
  `,
  title2: "उद्गम (Origin)",
  desc2: `
  वैदिक काल से ही भारतीय ऋषि-मुनियों ने सूर्य और चन्द्र की गति के आधार पर 
  समय मापन की एक उन्नत पद्धति विकसित की। वैदिक ग्रंथों और ब्राह्मण 
  ग्रंथों में सूर्य के उत्तरायण–दक्षिणायन, ऋतुएँ और वर्ष की गणना का वर्णन मिलता है।
  <br><br>
  वेदांग ज्योतिष के माध्यम से तिथि, नक्षत्र, मास और वर्ष की सही गणना की जाती थी, 
  ताकि यज्ञ और अन्य वैदिक अनुष्ठान सही समय पर हो सकें। आगे चलकर इन्हीं 
  सिद्धांतों के आधार पर विभिन्न क्षेत्रीय पंचांग बने।
  <br><br>
  <br>
  विक्रम संवत का नाम राजा विक्रमादित्य के नाम पर पड़ा और इसकी प्रारंभिक 
  तिथि 57 ईसा पूर्व मानी जाती है। उत्तर भारत में यह संवत आज भी व्यापक रूप से 
  प्रचलित है और अनेक हिन्दू त्योहार इसी के अनुसार मनाए जाते हैं।
  <br><br>
  <img src="../Images/kv_1.jpeg" alt="Image not found" height="200" width="180">
  `
};

// Label bold/normal helper
function setLabel(isHindi) {
  if (isHindi) {
    langRight.style.fontWeight = "700";
    langLeft.style.fontWeight  = "400";
    desc1.style.fontSize = '17px';
    desc2.style.fontSize = '17px';
  } else {
    langLeft.style.fontWeight  = "700";
    langRight.style.fontWeight = "400";
    // desc1.style.fontSize = '17px';
    // desc2.style.fontSize = '17px';
  }
}

// Initial – English
setLabel(false);

// Toggle behaviour
langToggle.addEventListener("change", function () {
  if (this.checked) {
    // Hindi
    title1.textContent = HI.title1;
    title2.textContent = HI.title2;
    desc1.innerHTML    = HI.desc1;
    desc2.innerHTML    = HI.desc2;
    setLabel(true);
  } else {
    // Back to English (original HTML)
    title1.textContent = EN.title1;
    title2.textContent = EN.title2;
    desc1.innerHTML    = EN.desc1;
    desc2.innerHTML    = EN.desc2;
    setLabel(false);
  }
});
