import { COMPASS_DIRECTIONS } from "../config.js";
import { navigate } from "../router.js";

// Slim persistent nav shown on every section screen so you can jump
// directly between Skills / Items / Map / Magic without going back
// through the compass every time.
export function renderTopNav(activeKey) {
  const nav = document.createElement("nav");
  nav.className = "top-nav";

  const home = document.createElement("button");
  home.className = "home-glyph";
  home.innerHTML = "&#10022;"; // small compass-ish glyph
  home.title = "Back to compass";
  home.addEventListener("click", () => navigate("home"));
  nav.appendChild(home);

  Object.values(COMPASS_DIRECTIONS).forEach((dir) => {
    const btn = document.createElement("button");
    btn.className = "rune" + (dir.key === activeKey ? " active" : "");
    btn.textContent = dir.label;
    btn.addEventListener("click", () => navigate(dir.key));
    nav.appendChild(btn);
  });

  return nav;
}
