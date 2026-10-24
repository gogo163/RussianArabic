/* ===== تعلم الروسية بالعربي — تتبع النطق (Web Speech Recognition) =====
   نسخة مبسطة: بتسجل كلام المستخدم بمايك الجهاز، وتقارنه بالنص المطلوب
   باستخدام خوارزمية Levenshtein للتشابه. مش تقييم نطق احترافي (زي ELSA)،
   بس بيدي إحساس تفاعلي حقيقي ومجاني بالكامل.
*/

function ruSpeechSupported(){
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function ruLevenshtein(a, b){
  a = a.toLowerCase().trim();
  b = b.toLowerCase().trim();
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i=0;i<=m;i++) dp[i][0]=i;
  for (let j=0;j<=n;j++) dp[0][j]=j;
  for (let i=1;i<=m;i++){
    for (let j=1;j<=n;j++){
      if (a[i-1]===b[j-1]) dp[i][j]=dp[i-1][j-1];
      else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

function ruSimilarity(target, said){
  const dist = ruLevenshtein(target, said);
  const maxLen = Math.max(target.length, said.length) || 1;
  return Math.max(0, Math.round((1 - dist/maxLen) * 100));
}

/**
 * يبدأ تسجيل صوت ويقارنه بالنص المطلوب.
 * callbacks: { onStart, onResult({transcript, score, verdict}), onError(msg), onEnd }
 */
function ruCheckPronunciation(targetText, callbacks){
  callbacks = callbacks || {};
  if (!ruSpeechSupported()) {
    if (callbacks.onError) callbacks.onError("المتصفح ده مش بيدعم التعرف على الصوت");
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.lang = "ru-RU";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.continuous = false;

  rec.onstart = () => { if (callbacks.onStart) callbacks.onStart(); };

  rec.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    const score = ruSimilarity(targetText, transcript);
    let verdict;
    if (score >= 80) verdict = "excellent";
    else if (score >= 55) verdict = "close";
    else verdict = "retry";
    if (callbacks.onResult) callbacks.onResult({ transcript, score, verdict });
  };

  rec.onerror = (e) => {
    let msg = "حصلت مشكلة في التسجيل";
    if (e.error === "not-allowed" || e.error === "permission-denied") msg = "محتاجين إذن استخدام الميكروفون";
    else if (e.error === "no-speech") msg = "معلش، مسمعتش صوت. جرب تاني";
    if (callbacks.onError) callbacks.onError(msg);
  };

  rec.onend = () => { if (callbacks.onEnd) callbacks.onEnd(); };

  try { rec.start(); }
  catch(e) { if (callbacks.onError) callbacks.onError("مش قادر أبدأ التسجيل"); }
}
