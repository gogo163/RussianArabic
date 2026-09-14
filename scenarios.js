/* ===== تعلم الروسية بالعربي — سيناريوهات تفاعلية ===== */

const SCENARIOS = [
  {
    id:"airport", title:"في المطار", icon:"🛂",
    intro:"وصلت مطار موسكو، وعامل الجوازات بيكلمك",
    start:"n1",
    nodes:{
      n1:{ speaker:"npc", ru:"Здравствуйте! Ваш паспорт, пожалуйста.", ar:"أهلاً! جواز سفرك من فضلك.",
        choices:[
          { text:"Вот, пожалуйста", ar:"اتفضل", next:"n2", good:true },
          { text:"Что?", ar:"إيه؟", next:"n1b", good:false }
        ]},
      n1b:{ speaker:"npc", ru:"Ваш паспорт, пожалуйста!", ar:"جواز سفرك، من فضلك! (بيعيد بصبر أقل)",
        choices:[ { text:"Вот, пожалуйста", ar:"اتفضل", next:"n2", good:true } ]},
      n2:{ speaker:"npc", ru:"Цель визита: туризм или работа?", ar:"هدف الزيارة: سياحة ولا شغل؟",
        choices:[
          { text:"Туризм", ar:"سياحة", next:"n3", good:true },
          { text:"Я не понимаю вопрос", ar:"مافهمتش السؤال", next:"n2b", good:false }
        ]},
      n2b:{ speaker:"npc", ru:"Туризм или работа? Отвечайте, пожалуйста.", ar:"سياحة ولا شغل؟ جاوب من فضلك.",
        choices:[ { text:"Туризм", ar:"سياحة", next:"n3", good:true } ]},
      n3:{ speaker:"npc", ru:"Сколько дней вы будете в России?", ar:"هتقعد في روسيا قد إيه؟",
        choices:[
          { text:"Семь дней", ar:"سبع أيام", next:"n4", good:true },
          { text:"Не знаю", ar:"مش عارف", next:"n4", good:false }
        ]},
      n4:{ speaker:"npc", ru:"Хорошо. Добро пожаловать в Россию!", ar:"تمام. أهلاً بيك في روسيا!",
        choices:[ { text:"Спасибо большое!", ar:"شكراً جزيلاً!", next:"end", good:true } ]},
      end:{ speaker:"end", ru:"", ar:"عدّيت الجوازات بنجاح! 🎉" }
    }
  },
  {
    id:"hotel", title:"في الفندق", icon:"🏨",
    intro:"وصلت الفندق وعايز تعمل تشيك إن",
    start:"n1",
    nodes:{
      n1:{ speaker:"npc", ru:"Добрый вечер! Чем могу помочь?", ar:"مساء الخير! أقدر أساعدك بإيه؟",
        choices:[
          { text:"У меня есть бронь", ar:"عندي حجز", next:"n2", good:true },
          { text:"Мне нужна комната", ar:"محتاج أوضة", next:"n2b", good:false }
        ]},
      n2:{ speaker:"npc", ru:"Ваше имя, пожалуйста?", ar:"اسمك، من فضلك؟",
        choices:[ { text:"Меня зовут...", ar:"اسمي...", next:"n3", good:true } ]},
      n2b:{ speaker:"npc", ru:"У вас есть бронь на сайте?", ar:"عندك حجز على الموقع؟",
        choices:[ { text:"Да, есть", ar:"أيوه عندي", next:"n3", good:true } ]},
      n3:{ speaker:"npc", ru:"Отлично. Вот ваш ключ. Номер на третьем этаже.", ar:"تمام. اتفضل مفتاحك. الأوضة في الدور التالت.",
        choices:[
          { text:"Спасибо за помощь", ar:"شكراً على المساعدة", next:"n4", good:true },
          { text:"Где лифт?", ar:"فين الأسانسير؟", next:"n4b", good:true }
        ]},
      n4:{ speaker:"npc", ru:"Пожалуйста! Приятного отдыха.", ar:"العفو! إقامة سعيدة.",
        choices:[ { text:"До завтра", ar:"أشوفك بكرة", next:"end", good:true } ]},
      n4b:{ speaker:"npc", ru:"Лифт слева от вас.", ar:"الأسانسير على شمالك.",
        choices:[ { text:"Спасибо!", ar:"شكراً!", next:"end", good:true } ]},
      end:{ speaker:"end", ru:"", ar:"خلصت التشيك إن! 🎉" }
    }
  },
  {
    id:"cafe", title:"في المقهى", icon:"☕",
    intro:"داخل مقهى في موسكو عايز تطلب حاجة",
    start:"n1",
    nodes:{
      n1:{ speaker:"npc", ru:"Здравствуйте! Что будете заказывать?", ar:"أهلاً! هتطلب إيه؟",
        choices:[
          { text:"Один кофе, пожалуйста", ar:"قهوة واحدة، من فضلك", next:"n2", good:true },
          { text:"Что у вас есть?", ar:"عندكوا إيه؟", next:"n1b", good:false }
        ]},
      n1b:{ speaker:"npc", ru:"У нас есть кофе, чай и вода.", ar:"عندنا قهوة وشاي ومياه.",
        choices:[ { text:"Один кофе, пожалуйста", ar:"قهوة واحدة، من فضلك", next:"n2", good:true } ]},
      n2:{ speaker:"npc", ru:"С молоком или без?", ar:"بلبن ولا من غيره؟",
        choices:[
          { text:"С молоком", ar:"بلبن", next:"n3", good:true },
          { text:"Без молока", ar:"من غير لبن", next:"n3", good:true }
        ]},
      n3:{ speaker:"npc", ru:"Хорошо. Это будет двести рублей.", ar:"تمام. ده هيبقى بميتين روبل.",
        choices:[
          { text:"Сколько это стоит?", ar:"(تسأل تاني للتأكيد) بكام ده؟", next:"n3b", good:false },
          { text:"Вот, пожалуйста", ar:"اتفضل", next:"n4", good:true }
        ]},
      n3b:{ speaker:"npc", ru:"Двести рублей.", ar:"ميتين روبل.",
        choices:[ { text:"Вот, пожалуйста", ar:"اتفضل", next:"n4", good:true } ]},
      n4:{ speaker:"npc", ru:"Спасибо! Приятного дня.", ar:"شكراً! يوم سعيد.",
        choices:[ { text:"Спасибо, взаимно!", ar:"شكراً، وانت كمان!", next:"end", good:true } ]},
      end:{ speaker:"end", ru:"", ar:"طلبت قهوتك بنجاح! 🎉" }
    }
  }
];
