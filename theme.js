/* ===== تعلم الروسية بالعربي — تبديل الوضع الليلي/الفاتح =====
   Default = light. data-theme="dark" on <html> = night mode.
   Preference persisted in localStorage under ru_arabi_theme.
*/
const RU_THEME_KEY = "ru_arabi_theme";

function ruIsDark(){
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function ruApplyTheme(theme){
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  localStorage.setItem(RU_THEME_KEY, theme);
  ruUpdateThemeIcon();
}

function ruToggleTheme(){
  ruApplyTheme(ruIsDark() ? "light" : "dark");
}

function ruUpdateThemeIcon(){
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  btn.textContent = ruIsDark() ? "☀️" : "🌙";
}

document.addEventListener("DOMContentLoaded", ruUpdateThemeIcon);
