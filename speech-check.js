/* ===== تعلم الروسية بالعربي — تدريب النطق (تسجيل صوت + تقييم ذاتي) =====
   نسخة تعتمد على MediaRecorder: بتسجل صوت المستخدم بمايك الجهاز،
   بتشغّله له تاني، وهو اللي بيقيّم نطقه بنفسه بالمقارنة مع النطق الصحيح.
   السبب: خاصية "تحويل الكلام لنص" (SpeechRecognition) متعطّلة عمدًا
   داخل أي WebView جوه تطبيقات الموبايل (قيد من جوجل نفسها)، فبتشتغل
   بس جوه متصفح مستقل زي Chrome. التسجيل والتشغيل (MediaRecorder) لأ،
   بيشتغل عادي جوه التطبيق.
*/

function ruMicSupported(){
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
}

/**
 * يبدأ تسجيل صوت من المايك.
 * callbacks: { onStart, onStop(audioUrl), onError(msg) }
 * بيرجع دالة stop() تقدر تناديها تدوي التسجيل يدويًا.
 */
function ruStartRecording(callbacks){
  callbacks = callbacks || {};

  if (!ruMicSupported()){
    if (callbacks.onError) callbacks.onError("الجهاز ده مش بيدعم تسجيل الصوت");
    return null;
  }

  let recorder = null;
  let stopped = false;

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        if (callbacks.onStop) callbacks.onStop(url);
      };

      recorder.onerror = () => {
        if (callbacks.onError) callbacks.onError("حصلت مشكلة أثناء التسجيل");
      };

      recorder.start();
      if (callbacks.onStart) callbacks.onStart();

      // لو المستخدم دوس على stop() قبل ما الـ recorder يجهز
      if (stopped) recorder.stop();
    })
    .catch(() => {
      if (callbacks.onError) callbacks.onError("محتاجين إذن استخدام الميكروفون");
    });

  return function stop(){
    stopped = true;
    if (recorder && recorder.state === "recording") recorder.stop();
  };
}
