import "./style.css";
import { BACKGROUND_IMAGE, COMPASS_DIRECTIONS, MAP_EXTERNAL_URL } from "./config.js";
import { initRouter, onRouteChange, navigate, getInitialRoute, getCurrentRoute } from "./router.js";
import { renderCompassHome } from "./views/compassHome.js";
import { renderItemsView } from "./views/itemsView.js";
import { renderSkillsView } from "./views/skillsView.js";
import { renderMagicView } from "./views/magicView.js";
import { renderMapView } from "./views/mapView.js";

// Background is set once and never touched again — it's meant to stay
// the same static image behind every screen.
document.getElementById("bg-layer").style.setProperty("--bg-image", `url(${BACKGROUND_IMAGE})`);

const routes = {
  home: renderCompassHome,
  items: renderItemsView,
  skills: renderSkillsView,
  magic: renderMagicView,
  map: renderMapView,
};

const app = document.getElementById("app");
let cleanup = () => {};

function render(route) {
  cleanup();
  app.innerHTML = "";
  const renderFn = routes[route] || routes.home;
  cleanup = renderFn(app) || (() => {});
}

initRouter();
onRouteChange(render);
render(getInitialRoute());

// ---------------------------------------------------------------------
// Global arrow-key navigation — the whole site is "direction oriented":
// from the compass, an arrow steps you out to that direction's section;
// from inside a section, the opposite arrow steps you back to the
// compass, same as walking out and back. This listener lives for the
// whole page (not per-view) so it works no matter where you are.
// ---------------------------------------------------------------------

const KEY_TO_DIR = {
  ArrowUp: "top",
  ArrowRight: "right",
  ArrowDown: "bottom",
  ArrowLeft: "left",
};
const OPPOSITE_DIR = { top: "bottom", bottom: "top", left: "right", right: "left" };

// route -> the compass direction that leads to it (e.g. "items" -> "right")
const ROUTE_TO_DIR = {};
Object.entries(COMPASS_DIRECTIONS).forEach(([dir, { key }]) => {
  ROUTE_TO_DIR[key] = dir;
});

document.addEventListener("keydown", (e) => {
  const dir = KEY_TO_DIR[e.key];
  if (!dir) return;

  const current = getCurrentRoute();
  if (current === "home") {
    const targetKey = COMPASS_DIRECTIONS[dir].key;
    // Map isn't an internal section — it sends visitors out to the real
    // shop site instead of routing to mapView (see compassHome.js's click
    // handler for the same behavior on click).
    if (targetKey === COMPASS_DIRECTIONS.bottom.key) {
      window.open(MAP_EXTERNAL_URL, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(targetKey);
    return;
  }

  // Items and Magic each have their own internal panes (categories ->
  // list) and own their full arrow-key handling, including their own way
  // back to the compass — don't double-handle it here.
  if (current === "items" || current === "magic") return;

  const currentDir = ROUTE_TO_DIR[current];
  if (currentDir && OPPOSITE_DIR[currentDir] === dir) {
    navigate("home");
  }
});
