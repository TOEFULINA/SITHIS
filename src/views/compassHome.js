import { COMPASS_DIRECTIONS } from "../config.js";
import { navigate } from "../router.js";

// Full compass artwork (crosshair + woven center knot) as one image —
// public/compass-rose.png. Swap that file for a different piece of art
// any time; as long as the new image's star-tips touch its canvas edges
// the same way, the label positions below still line up.
const COMPASS_ART = "/compass-rose.png";

export function renderCompassHome(container) {
  const el = document.createElement("div");
  el.className = "compass-screen";
  el.innerHTML = `
    <div class="compass">
      <img class="compass-art" src="${COMPASS_ART}" alt="" />
      <button class="compass-point top rune" data-route="${COMPASS_DIRECTIONS.top.key}">
        ${COMPASS_DIRECTIONS.top.label}
      </button>
      <button class="compass-point right rune" data-route="${COMPASS_DIRECTIONS.right.key}">
        ${COMPASS_DIRECTIONS.right.label}
      </button>
      <button class="compass-point bottom rune" data-route="${COMPASS_DIRECTIONS.bottom.key}">
        ${COMPASS_DIRECTIONS.bottom.label}
      </button>
      <button class="compass-point left rune" data-route="${COMPASS_DIRECTIONS.left.key}">
        ${COMPASS_DIRECTIONS.left.label}
      </button>
    </div>
    <div class="hint">Use Arrow Keys or Click a Direction</div>
  `;

  el.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.dataset.route));
  });

  container.appendChild(el);

  // Arrow-key navigation (both into a direction and back out of one) is
  // handled globally in main.js so it works from every screen, not just
  // this one.
  return () => {};
}
