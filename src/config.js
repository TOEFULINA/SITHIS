// ---------------------------------------------------------------------------
// Central config — edit this file to reskin/relabel the site without
// touching any of the view logic.
// ---------------------------------------------------------------------------

export const SITE_NAME = "YOUR NAME";

// Path to the single background image shown behind every screen.
// Drop your file in /public/background.jpg (or change this path).
// It gets blurred + darkened via CSS — use a fairly high-res image
// (1920px wide or more) so the blur looks smooth instead of blocky.
export const BACKGROUND_IMAGE = "/background.jpg";

// The four compass directions. `key` must match the route used in
// src/views + src/router.js. Position matches the reference art:
// SKILLS on top, ITEMS on the right, MAP on the bottom, MAGIC on the left.
export const COMPASS_DIRECTIONS = {
  top: { key: "skills", label: "Skills" },
  right: { key: "items", label: "Items" },
  bottom: { key: "map", label: "Map" },
  left: { key: "magic", label: "Magic" },
};
