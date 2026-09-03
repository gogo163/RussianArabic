/* ===== تعلم الروسية بالعربي — نظام التقدم المشترك =====
   XP / Streak / Badges — localStorage based
   يُحمَّل في كل صفحة عن طريق: <script src="progress.js"></script>
*/

const RU_PROGRESS_KEY = "ru_arabi_progress_v1";

const RuProgress = (function () {

  function today() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  }

  function load() {
    const raw = localStorage.getItem(RU_PROGRESS_KEY);
    if (!raw) {
      return {
        xp: 0,
        level: 1,
        streak: 0,
        lastActiveDate: null,
        badges: [],
        letters: {},   // { "А": { learned: true, written: true } }
        vocab: {},     // reserved for future SM-2 vocabulary section
        sections: {}   // { pronunciation: true, ... } generic section-complete flags
      };
    }
    try { return JSON.parse(raw); }
    catch (e) { return load.__default__ || {}; }
  }

  function save(state) {
    localStorage.setItem(RU_PROGRESS_KEY, JSON.stringify(state));
  }

  function levelForXp(xp) {
    // 100 XP per level, simple linear curve to start
    return Math.floor(xp / 100) + 1;
  }

  function bumpStreak(state) {
    const t = today();
    if (state.lastActiveDate === t) return state; // already counted today
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (state.lastActiveDate === yesterday) {
      state.streak += 1;
    } else {
      state.streak = 1; // broken streak, restart
    }
    state.lastActiveDate = t;
    return state;
  }

  function addXp(amount, reason) {
    const state = load();
    bumpStreak(state);
    state.xp += amount;
    const newLevel = levelForXp(state.xp);
    const leveledUp = newLevel > state.level;
    state.level = newLevel;
    save(state);
    if (leveledUp && typeof window.onRuLevelUp === "function") {
      window.onRuLevelUp(newLevel);
    }
    return state;
  }

  function markLetterLearned(letter) {
    const state = load();
    if (!state.letters[letter]) state.letters[letter] = {};
    state.letters[letter].learned = true;
    save(state);
    return state;
  }

  function markLetterWritten(letter) {
    const state = load();
    if (!state.letters[letter]) state.letters[letter] = {};
    state.letters[letter].written = true;
    save(state);
    return state;
  }

  function awardBadge(badgeId) {
    const state = load();
    if (!state.badges.includes(badgeId)) {
      state.badges.push(badgeId);
      save(state);
      if (typeof window.onRuBadgeAwarded === "function") {
        window.onRuBadgeAwarded(badgeId);
      }
    }
    return state;
  }

  function markSectionComplete(sectionId) {
    const state = load();
    if (!state.sections) state.sections = {};
    state.sections[sectionId] = true;
    save(state);
    return state;
  }

  function saveVocabCard(wordId, cardData) {
    const state = load();
    if (!state.vocab) state.vocab = {};
    state.vocab[wordId] = cardData;
    save(state);
    return state;
  }

  function getState() {
    const s = load();
    if (!s.sections) s.sections = {};
    if (!s.vocab) s.vocab = {};
    return s;
  }

  return {
    addXp,
    markLetterLearned,
    markLetterWritten,
    awardBadge,
    markSectionComplete,
    saveVocabCard,
    getState,
    levelForXp
  };
})();

/* ---- helper: render the small XP/streak stats used in the top bar ---- */
function ruRenderStatsBar(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const s = RuProgress.getState();
  el.innerHTML = `
    <span>⭐ ${s.xp}</span>
    <span>🔥 ${s.streak}</span>
    <span>🏆 ${s.level}</span>
  `;
}
