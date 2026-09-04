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

/* الفانكشن الرئيسية — دي اللي كل صفحات التطبيق بتناديها */
function ruPlayAudio(text, rate){
  if (!text) return;
  const slug = ruAudioSlug(text);
  if (!slug) { ruSpeakFallback(text, rate); return; }

  const audio = new Audio(RU_AUDIO_FOLDER + slug + ".wav");
  let fellBack = false;
  const fallback = () => {
    if (fellBack) return;
    fellBack = true;
    ruSpeakFallback(text, rate);
  };

  audio.addEventListener("error", fallback);
  const playPromise = audio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(fallback);
  }
}
