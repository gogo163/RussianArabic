/* ===== تعلم الروسية بالعربي — ماسكوت الماتريوشكا =====
   دمية بـ٦ مراحل، بتتفتح وتتزخرف كل ما تتقدم في تعلم الحروف.
   المرحلة 0 = دمية مقفولة نايمة (مفيش تقدم)
   المرحلة 5 = دمية مفتوحة بالكامل ومذهّبة (كل الحروف اتعلمت)
*/

const RU_MATRYOSHKA_STAGES = [
  { min:0,  label:"لسه ما بدأتش",        band:"#8a8f9c", body:"#c9cdd6", accent:"#8a8f9c", eyes:"closed", sparkle:false, ring:0 },
  { min:1,  label:"استيقظت! خطواتك الأولى", band:"#7FA3C4", body:"#dfe8ef", accent:"#7FA3C4", eyes:"open",   sparkle:false, ring:1 },
  { min:7,  label:"طبقة اتفتحت",         band:"#A6453F", body:"#f0dcd8", accent:"#A6453F", eyes:"open",   sparkle:false, ring:2 },
  { min:14, label:"في نص الطريق",        band:"#3F7A57", body:"#dbe9de", accent:"#3F7A57", eyes:"open",   sparkle:false, ring:3 },
  { min:21, label:"قربت تخلص الحروف",     band:"#D4A94F", body:"#f4e6c9", accent:"#D4A94F", eyes:"happy",  sparkle:false, ring:4 },
  { min:28, label:"دميتك اتفتحت بالكامل! ✨", band:"#D4A94F", body:"#fff3d6", accent:"#E8C97A", eyes:"happy", sparkle:true, ring:5 }
];

function ruMatryoshkaStageIndex(learnedCount, total){
  total = total || 33;
  const ratio = learnedCount;
  let idx = 0;
  const thresholds = [0, 1, Math.ceil(total*0.21), Math.ceil(total*0.42), Math.ceil(total*0.63), Math.ceil(total*0.85)];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (ratio >= thresholds[i]) { idx = i; break; }
  }
  return idx;
}

function ruMatryoshkaSVG(stageIdx){
  const s = RU_MATRYOSHKA_STAGES[stageIdx];
  const eyes = s.eyes === "closed"
    ? `<path d="M74 96 q6 4 12 0" stroke="#4a4a4a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
       <path d="M104 96 q6 4 12 0" stroke="#4a4a4a" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    : `<circle cx="80" cy="97" r="3.4" fill="#3a2a1a"/>
       <circle cx="110" cy="97" r="3.4" fill="#3a2a1a"/>`;
  const mouth = s.eyes === "happy"
    ? `<path d="M84 110 q11 9 22 0" stroke="#a6453f" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    : `<path d="M87 111 q8 5 16 0" stroke="#a6453f" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const sparkle = s.sparkle
    ? `<text x="140" y="55" font-size="16">✨</text><text x="30" y="70" font-size="12">✨</text><text x="150" y="120" font-size="12">✨</text>`
    : ``;
  // حلقات الزخرفة بتتزود مع كل مرحلة (تمثل "الطبقات" اللي اتفتحت)
  let rings = "";
  for (let r = 0; r < s.ring; r++) {
    const y = 150 - r * 14;
    rings += `<ellipse cx="97" cy="${y}" rx="${48 - r*3}" ry="6" fill="none" stroke="${s.accent}" stroke-width="2" opacity="${0.85 - r*0.12}"/>`;
  }

  return `
  <svg viewBox="0 0 194 210" xmlns="http://www.w3.org/2000/svg" style="width:120px;height:auto;">
    ${sparkle}
    <path d="M97 8 C130 8 148 34 148 62 C148 82 138 92 138 92
             L138 178 C138 196 120 204 97 204 C74 204 56 196 56 178
             L56 92 C56 92 46 82 46 62 C46 34 64 8 97 8 Z"
          fill="${s.body}" stroke="${s.band}" stroke-width="3"/>
    <path d="M97 8 C130 8 148 34 148 62 C148 78 141 88 138 92
             L56 92 C53 88 46 78 46 62 C46 34 64 8 97 8 Z"
          fill="${s.band}"/>
    <path d="M60 92 C60 78 60 66 66 56 C74 44 120 44 128 56 C134 66 134 78 134 92 Z"
          fill="${s.body}" opacity=".9"/>
    ${eyes}
    ${mouth}
    <circle cx="75" cy="106" r="5" fill="${s.accent}" opacity=".35"/>
    <circle cx="119" cy="106" r="5" fill="${s.accent}" opacity=".35"/>
    ${rings}
  </svg>`;
}

function ruRenderMatryoshka(elId, captionElId){
  const el = document.getElementById(elId);
  if (!el) return;
  const state = RuProgress.getState();
  const learnedCount = Object.values(state.letters || {}).filter(l => l.learned).length;
  const stageIdx = ruMatryoshkaStageIndex(learnedCount, 33);
  el.innerHTML = ruMatryoshkaSVG(stageIdx);
  if (captionElId) {
    const cap = document.getElementById(captionElId);
    if (cap) cap.textContent = RU_MATRYOSHKA_STAGES[stageIdx].label;
  }
  return stageIdx;
}
