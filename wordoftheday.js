/* ===== تعلم الروسية بالعربي — كلمة اليوم =====
   كلمة تتغير كل يوم (نفس الكلمة طول اليوم لكل المستخدمين)، محسوبة من تاريخ اليوم.
*/

const RU_WORD_OF_DAY_LIST = [
  { ru:"привет",     tr:"privét",     ar:"أهلاً / سلام (غير رسمي)" },
  { ru:"спасибо",    tr:"spasíbo",    ar:"شكراً" },
  { ru:"пожалуйста", tr:"pozháluysta",ar:"من فضلك / عفواً" },
  { ru:"друг",       tr:"drug",       ar:"صديق" },
  { ru:"дом",        tr:"dom",        ar:"بيت" },
  { ru:"вода",       tr:"vodá",       ar:"مياه" },
  { ru:"хлеб",       tr:"khleb",      ar:"عيش" },
  { ru:"солнце",     tr:"sóntse",     ar:"شمس" },
  { ru:"любовь",     tr:"lyubóv'",    ar:"حب" },
  { ru:"работа",     tr:"rabóta",     ar:"شغل" },
  { ru:"город",      tr:"górod",      ar:"مدينة" },
  { ru:"книга",      tr:"kníga",      ar:"كتاب" },
  { ru:"время",      tr:"vrémya",     ar:"وقت" },
  { ru:"деньги",     tr:"dén'gi",     ar:"فلوس" },
  { ru:"семья",      tr:"sem'yá",     ar:"عيلة" },
  { ru:"школа",      tr:"shkóla",     ar:"مدرسة" },
  { ru:"учитель",    tr:"uchítel'",   ar:"مُدرِّس" },
  { ru:"студент",    tr:"studént",    ar:"طالب جامعي" },
  { ru:"машина",     tr:"mashína",    ar:"عربية/سيارة" },
  { ru:"погода",     tr:"pogóda",     ar:"جو / طقس" },
  { ru:"зима",       tr:"zimá",       ar:"شتاء" },
  { ru:"лето",       tr:"léto",       ar:"صيف" },
  { ru:"еда",        tr:"yedá",       ar:"أكل" },
  { ru:"чай",        tr:"chay",       ar:"شاي" },
  { ru:"кот",        tr:"kot",        ar:"قطة" },
  { ru:"собака",     tr:"sobáka",     ar:"كلب" },
  { ru:"море",       tr:"móre",       ar:"بحر" },
  { ru:"звезда",     tr:"zvezdá",     ar:"نجمة" },
  { ru:"счастье",    tr:"schást'ye",  ar:"سعادة" },
  { ru:"мир",        tr:"mir",        ar:"سلام / عالم" }
];

function ruDayOfYear(){
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
}

function ruWordOfTheDay(){
  const idx = ruDayOfYear() % RU_WORD_OF_DAY_LIST.length;
  return RU_WORD_OF_DAY_LIST[idx];
}

function ruRenderWordOfDay(containerId){
  const el = document.getElementById(containerId);
  if (!el) return;
  const w = ruWordOfTheDay();
  el.innerHTML = `
    <div class="wod-main">
      <div class="wod-label">📅 كلمة اليوم</div>
      <div class="wod-ru">${w.ru}</div>
      <div class="wod-tr">${w.tr}</div>
      <div class="wod-ar">${w.ar}</div>
    </div>
    <button class="wod-play" onclick="ruSpeakWord('${w.ru}')">🔊</button>
  `;
}

function ruSpeakWord(text){ ruPlayAudio(text); }
