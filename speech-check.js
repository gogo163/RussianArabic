/* ===== تعلم الروسية بالعربي — تدريب النطق (تسجيل صوت + تقييم ذاتي) =====
   نسخة تعتمد على MediaRecorder: بتسجل صوت المستخدم بمايك الجهاز،
   بتشغّله له تاني، وهو اللي بيقيّم نطقه بنفسه بالمقارنة مع النطق الصحيح.
   السبب: خاصية "تحويل الكلام لنص" (SpeechRecognition) متعطّلة عمدًا
   داخل أي WebView جوه تطبيقات الموبايل (قيد من جوجل نفسها)، فبتشتغل
   بس جوه متصفح مستقل زي Chrome. التسجيل والتشغيل (MediaRecorder) لأ،
   بيشتغل عادي جوه التطبيق.

   ملاحظة: بعض محركات الـ WebView بتدعم تسجيل audio/webm لكن مش بتدعم
   تشغيله بعدين. عشان كده الكود ده بيجرب أكتر من صيغة (mp4/ogg/webm)
   ويختار أول صيغة الجهاز بيدعمها فعليًا للتسجيل والتشغيل مع بعض.
*/

function ruMicSupported(){
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
}

// يحدد أفضل صيغة تسجيل مدعومة من الجهاز (تسجيل + تشغيل)
function ruPickRecordingMimeType(){
  const candidates = [
    "audio/mp4",
    "audio/aac",
    "audio/ogg;codecs=opus",
    "audio/webm;codecs=opus",
    "audio/webm",
    ""
  ];
  for (const type of candidates) {
    if (type === "" || (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(type))) {
      return type;
    }
  }
  return "";
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
      const mimeType = ruPickRecordingMimeType();
      try {
        recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      const chunks = [];
      const usedType = recorder.mimeType || mimeType || "audio/webm";

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: usedType });
        const url = URL.createObjectURL(blob);
        if (callbacks.onStop) callbacks.onStop(url);
      };

      recorder.onerror = () => {
        if (callbacks.onError) callbacks.onError("حصلت مشكلة أثناء التسجيل");
      };

      recorder.start();
      if (callbacks.onStart) callbacks.onStart();

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
