
// Toggle element
const langToggle = document.getElementById("langToggle");

// Text elements
const title1 = document.querySelector(".title-1");
const desc1  = document.querySelector(".child-1 .desc");
const title2 = document.querySelector(".title-2");
const desc2  = document.querySelector(".child-2 .desc");

const langLeft  = document.getElementById("lang-left");
const langRight = document.getElementById("lang-right");

// English text (original)
const EN = {
title1: "Why we need to build this calendar ?",
desc1: `As i was a citizen of india, i feel like it is very important to provide an easy access 
to all hindus or sanatanis for their calendar, which they follows, this website should provide 
an easy and simple way to get an overview of hindu canlendar in accordance with current popular
known greorgian calendar which every typical indian follows. 
<br><br>
I wish, i can provide a little help to all my people, who wants to know and follow our traditional
hindu calendar (Vikram Samvat), as it was created in accordance with indian solar system.
<br><br>
If you feel great, you can mail us to send feedback, either positive or negetive,
we will accept and review it.
<br>
Jai shree Ram!`,
title2: "About me :",
desc2: `Developed by : Ayush Nitin Sakhi<br>
Email : ayushsakhi67@gmail.com`
};

// Hindi text
const HI = {
title1: "हमने यह कैलेंडर क्यों बनाया है?",
desc1: `एक भारतीय नागरिक होने के नाते मुझे लगा कि सभी हिन्दुओं और सनातनियों के लिए 
उनके पारंपरिक कैलेंडर तक आसानी से पहुँच होना बहुत ज़रूरी है। यह वेबसाइट एक आसान और 
सरल तरीका देती है, ताकि लोग वर्तमान में प्रचलित ग्रेगोरियन कैलेंडर के साथ-साथ 
हिन्दू कैलेंडर का भी स्पष्ट और सरल रूप देख सकें।
<br><br>
मेरा उद्देश्य बस इतना है कि जो भी लोग हमारे पारंपरिक हिन्दू पंचांग (विक्रम संवत) को जानना 
और पालन करना चाहते हैं, उन्हें थोड़ी-सी मदद मिल सके। यह कैलेंडर भारतीय सौर प्रणाली के 
अनुसार बनाया गया है।
<br><br>
अगर आपको यह कार्य अच्छा लगे तो आप हमें अपना सुझाव या प्रतिक्रिया 
(चाहे सकारात्मक हो या नकारात्मक) ई-मेल के माध्यम से भेज सकते हैं। 
हम उसे पूरी श्रद्धा से स्वीकार करके पढ़ेंगे।
<br>
जय श्री राम!`,
title2: "मेरे बारे में :",
desc2: `डेवलप किया गया : आयुष नितिन साखी<br>
ई-मेल : ayushsakhi67@gmail.com`
};

// Set label style helper
function setLabel(isHindi) {
if (isHindi) {
  langRight.style.fontWeight = "700";
  langLeft.style.fontWeight  = "400";
} else {
  langLeft.style.fontWeight  = "700";
  langRight.style.fontWeight = "400";
}
}

// Initial state (English)
setLabel(false);

// When toggle changes
langToggle.addEventListener("change", function () {
if (this.checked) {
  // Hindi
  title1.textContent = HI.title1;
  desc1.innerHTML    = HI.desc1;
  title2.textContent = HI.title2;
  desc2.innerHTML    = HI.desc2;
  setLabel(true);
} else {
  // English
  title1.textContent = EN.title1;
  desc1.innerHTML    = EN.desc1;
  title2.textContent = EN.title2;
  desc2.innerHTML    = EN.desc2;
  setLabel(false);
}
});
