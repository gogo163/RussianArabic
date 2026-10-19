/* ===== تعلم الروسية بالعربي — نظام الصوت الهجين =====
   بيحاول يشغّل ملف WAV مسجل مسبقاً من مجلد /audio أولاً.
   لو الملف مش موجود (لسه ما اتسجلش)، بيرجع تلقائي لـ Web Speech API.
   الاسم بتاع كل ملف WAV لازم يكون نفس ناتج ruAudioSlug(text) — الفانكشن دي
   بتحول أي نص روسي لاسم ملف إنجليزي متطابق مع سكريبت التوليد generate-audio.ps1.
*/

const RU_AUDIO_FOLDER = "audio/";

const RU_CYR_MAP = {
  "а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"zh","з":"z",
  "и":"i","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r",
  "с":"s","т":"t","у":"u","ф":"f","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch",
  "ъ":"","ы":"y","ь":"","э":"e","ю":"yu","я":"ya"
};

function ruAudioSlug(text){
  const lower = text.toLowerCase();
  let out = "";
  for (const ch of lower) {
    out += (ch in RU_CYR_MAP) ? RU_CYR_MAP[ch] : ch;
  }
  return out.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function ruSpeakFallback(text, rate){
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ru-RU";
    u.rate = rate || 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) { console.warn("speechSynthesis unavailable", e); }
}

/* الفانكشن الرئيسية — دي اللي كل صفحات التطبيق بتناديها.
   onDiag (اختياري) بيتنادى بتفاصيل تشخيصية: {stage, detail} — مفيدة وقت تصحيح الأخطاء. */
function ruPlayAudio(text, rate, onDiag){
  if (!text) return;
  const diag = (stage, detail) => { if (onDiag) onDiag({ stage, detail }); };

  const slug = ruAudioSlug(text);
  if (!slug) { diag("no-slug", ""); ruSpeakFallback(text, rate); return; }

  const path = RU_AUDIO_FOLDER + slug + ".wav";
  const audio = new Audio(path);
  let fellBack = false;
  const fallback = (reason) => {
    if (fellBack) return;
    fellBack = true;
    diag("fallback", reason + " (" + path + ")");
    ruSpeakFallback(text, rate);
  };

  audio.addEventListener("error", () => {
    const codeMap = {1:"ABORTED",2:"NETWORK",3:"DECODE",4:"SRC_NOT_SUPPORTED"};
    const code = audio.error ? audio.error.code : 0;
    fallback("audio-error:" + (codeMap[code] || code));
  });
  audio.addEventListener("canplaythrough", () => diag("loaded-ok", path));

  let playPromise;
  try { playPromise = audio.play(); }
  catch(e){ fallback("play-threw:" + e.message); return; }

  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch((e) => fallback("play-rejected:" + e.message));
  } else if (!playPromise) {
    diag("play-no-promise", path);
  }
}
