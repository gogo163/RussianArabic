/* ===== تعلم الروسية بالعربي — المفردات + نظام SM-2 =====
   نفس نظام المراجعة الذكية المستخدم في KoreanArabic (SM-2)
*/

const VOCAB_CATEGORIES = [
  {
    id:"daily", title:"يومي", icon:"🗓️",
    words:[
      { id:"privet",  ru:"привет",   tr:"privét",    ar:"أهلاً (غير رسمي)" },
      { id:"poka",    ru:"пока",     tr:"poká",      ar:"باي / مع السلامة" },
      { id:"da",      ru:"да",       tr:"da",        ar:"أيوه" },
      { id:"net",     ru:"нет",      tr:"net",       ar:"لأ" },
      { id:"spasibo", ru:"спасибо",  tr:"spasíbo",   ar:"شكراً" },
      { id:"izvinite",ru:"извините", tr:"izviníte",  ar:"آسف / لو سمحت" },
      { id:"kak_dela",ru:"как дела", tr:"kak delá",  ar:"إزيك؟ / عامل إيه؟" },
      { id:"horosho", ru:"хорошо",   tr:"khorosho",  ar:"كويس / تمام" }
    ]
  },
  {
    id:"travel", title:"سفر", icon:"✈️",
    words:[
      { id:"aeroport",  ru:"аэропорт", tr:"aeropórt",  ar:"مطار" },
      { id:"bilet",     ru:"билет",    tr:"bilét",     ar:"تذكرة" },
      { id:"otel",      ru:"отель",    tr:"otél'",     ar:"فندق" },
      { id:"poezd",     ru:"поезд",    tr:"póyezd",    ar:"قطر" },
      { id:"taksi",     ru:"такси",    tr:"taksí",     ar:"تاكسي" },
      { id:"gde",       ru:"где",      tr:"gde",       ar:"فين" },
      { id:"skolko",    ru:"сколько",  tr:"skól'ko",   ar:"بكام / قد إيه" },
      { id:"pasport",   ru:"паспорт",  tr:"pásport",   ar:"باسبور" }
    ]
  },
  {
    id:"food", title:"أكل", icon:"🍽️",
    words:[
      { id:"eda",    ru:"еда",    tr:"yedá",    ar:"أكل" },
      { id:"voda",   ru:"вода",   tr:"vodá",    ar:"مياه" },
      { id:"chay",   ru:"чай",    tr:"chay",    ar:"شاي" },
      { id:"kofe",   ru:"кофе",   tr:"kófe",    ar:"قهوة" },
      { id:"khleb",  ru:"хлеб",   tr:"khleb",   ar:"عيش" },
      { id:"myaso",  ru:"мясо",   tr:"myáso",   ar:"لحمة" },
      { id:"frukty", ru:"фрукты", tr:"frúkty",  ar:"فاكهة" },
      { id:"vkusno", ru:"вкусно", tr:"vkúsno",  ar:"لذيذ" }
    ]
  },
  {
    id:"family", title:"عيلة", icon:"👨‍👩‍👧",
    words:[
      { id:"semya",  ru:"семья", tr:"sem'yá", ar:"عيلة" },
      { id:"mama",   ru:"мама",  tr:"máma",   ar:"ماما" },
      { id:"papa",   ru:"папа",  tr:"pápa",   ar:"بابا" },
      { id:"brat",   ru:"брат",  tr:"brat",   ar:"أخ" },
      { id:"sestra", ru:"сестра",tr:"sestrá", ar:"أخت" },
      { id:"drug",   ru:"друг",  tr:"drug",   ar:"صديق" }
    ]
  }
];

function ruAllVocabWords(){
  return VOCAB_CATEGORIES.flatMap(c => c.words.map(w => ({...w, categoryId:c.id})));
}

/* ---- SM-2 ---- */
function ruSm2Schedule(card, quality){
  // card: { repetition, interval, ef, due } — quality: 0..5
  card = card || { repetition:0, interval:0, ef:2.5, due:null };
  let { repetition, interval, ef } = card;

  if (quality < 3) {
    repetition = 0;
    interval = 1;
  } else {
    if (repetition === 0) interval = 1;
    else if (repetition === 1) interval = 6;
    else interval = Math.round(interval * ef);
    repetition += 1;
  }

  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  const due = new Date();
  due.setDate(due.getDate() + interval);

  return { repetition, interval, ef, due: due.toISOString().slice(0,10) };
}

function ruDueVocabWords(limit){
  const state = RuProgress.getState();
  const todayStr = new Date().toISOString().slice(0,10);
  const all = ruAllVocabWords();

  const due = all.filter(w => {
    const card = state.vocab[w.id];
    return !card || !card.due || card.due <= todayStr;
  });

  return due.slice(0, limit || 10);
}
