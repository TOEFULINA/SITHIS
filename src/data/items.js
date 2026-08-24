// ---------------------------------------------------------------------------
// One entry per physical item (apparel, action figures, shoes, packaging,
// props, etc). This is the only file you need to touch to add a new piece.
//
// model:     path to a .glb in /public/models/  (leave "" for a placeholder
//            shape while you don't have a model ready yet)
// thumbnail: path to a small preview image in /public/items/ (not wired up
//            in the UI yet — reserved for a future list-row icon)
// stats:     any label/value pairs you want — mirrors a Skyrim item
//            tooltip (Armor / Weight / Value). Use whatever fits the
//            piece: Materials, Year, Edition, Runtime, etc.
// viewerFitMargin: optional — how tightly the 3D viewer frames this one
//            model (lower = bigger/tighter fill). Leave unset for a safe
//            default that never clips regardless of the mesh's shape; only
//            add this for a specific item once you've checked it doesn't
//            clip its own model on rotation (compact/round meshes can
//            usually go well below 1, elongated ones — a long box, a
//            slide — need to stay close to 1 or they'll swing a corner
//            out of frame). See src/three/modelViewer.js for the math.
// viewerStartOpposite: optional — starts the camera on the far side of
//            the model instead of the shared default corner. Per item,
//            same as viewerFitMargin above.
// viewerStartAngle: optional — { thetaDeg, phiDeg }, an exact starting
//            camera angle, overriding viewerStartOpposite. There's a
//            temporary on-screen θ/φ readout in the viewer (top-left
//            corner) for finding these — drag to the angle you like and
//            read the numbers off straight.
// viewerAnimationRange: optional — { startFrame, endFrame, fps } — plays
//            only this slice of a model's baked animation. Check the
//            .glb's own keyframe spacing for the real fps before setting
//            this (see src/three/modelViewer.js) — don't assume 24 or 30.
//
// Names/stats below are the real, final values — swap in real descriptions
// per piece whenever you're ready; the layout adapts automatically either
// way.
// ---------------------------------------------------------------------------

function placeholder(id, name, category) {
  return {
    id,
    name,
    category,
    model: "",
    thumbnail: "",
    // A single default stat so every card previews populated — swap in
    // real ones (Materials, Edition, whatever fits) per piece as you go.
    stats: [{ label: "Year", value: "2026" }],
    // Filler flavor-text line (mirrors the small italic blurb under a
    // Skyrim item's stats, e.g. "Increases Disease Resistance by 100%.")
    // — swap in the real line per item whenever you're ready.
    description: "Description coming soon.",
  };
}

export const items = [
  // Tops
  {
    ...placeholder("item-01", "Memento Deluxe Tee", "Tops"),
    stats: [{ label: "Year", value: "2024" }],
  },
  {
    ...placeholder("item-02", "Shitumss Tee", "Tops"),
    stats: [{ label: "Year", value: "2023" }],
  },
  {
    ...placeholder("item-03", "Illustrated Mesh Tee", "Tops"),
    stats: [{ label: "Year", value: "2023" }],
  },
  {
    ...placeholder("item-04", "Illustrated Mesh Tee 2", "Tops"),
    stats: [{ label: "Year", value: "2024" }],
  },
  {
    ...placeholder("item-05", "CXR World Championship Tee", "Tops"),
    stats: [
      { label: "Year", value: "2025" },
      { label: "Value", value: "UNRELEASED" },
    ],
  },
  {
    ...placeholder("item-37", "Oversized Kid Cudi Tee", "Tops"),
    model: "/models/kid-cudi-tee.glb",
    stats: [
      { label: "Year", value: "2024" },
      { label: "value", value: "LIMITED" },
    ],
  },

  // Bottoms
  {
    ...placeholder("item-06", "Sticker Print Jorts", "Bottoms"),
    stats: [{ label: "Year", value: "2025" }],
  },
  {
    ...placeholder("item-07", "Black Illustrated Shorts", "Bottoms"),
    stats: [{ label: "Year", value: "2025" }],
  },
  {
    ...placeholder("item-08", "Glo Sweatshort", "Bottoms"),
    stats: [{ label: "Year", value: "2025" }],
  },
  {
    ...placeholder("item-09", "Glo SS Black", "Bottoms"),
    stats: [{ label: "Year", value: "2025" }],
  },

  // Accessories
  {
    ...placeholder("item-10", "Charm Belt", "Accessories"),
    stats: [
      { label: "Year", value: "2025" },
      { label: "Value", value: "ARCHIVED" },
    ],
  },
  {
    ...placeholder("item-11", "Button Covered Bag", "Accessories"),
    model: "/models/pins-bag.glb",
    viewerFitMargin: 0.8,
    viewerStartAngle: { thetaDeg: 180, phiDeg: 60 },
    stats: [
      { label: "Year", value: "2026" },
      { label: "Value", value: "PERSONAL" },
    ],
  },
  {
    ...placeholder("item-12", "Engraved Headphones", "Accessories"),
    stats: [
      { label: "Year", value: "2025" },
      { label: "Value", value: "PERSONAL" },
    ],
  },
  {
    ...placeholder("item-13", "Deco Majora's Mask Case", "Accessories"),
    stats: [
      { label: "Year", value: "2024" },
      { label: "Value", value: "PERSONAL" },
    ],
  },
  {
    ...placeholder("item-14", "Beef Ring / Spaghetti Rings, etc.", "Accessories"),
    stats: [{ label: "Year", value: "2025" }],
  },
  {
    ...placeholder("item-43", "Steakpods Case", "Accessories"),
    model: "/models/steakpods.glb",
    viewerFitMargin: 0.8,
    viewerStartAngle: { thetaDeg: 180, phiDeg: 90 },
    stats: [{ label: "Year", value: "2025" }],
  },

  // Footwear
  {
    ...placeholder("item-15", "Red Claymation Shoe", "Footwear"),
    model: "/models/red-claymation-shoe.glb",
    // Compact/rounded mesh — safe to fill the frame much more tightly
    // than the safe-for-anything default without clipping on rotation.
    viewerFitMargin: 0.5,
    viewerStartAngle: { thetaDeg: 267.5, phiDeg: 84.4 },
    stats: [{ label: "Year", value: "2025" }],
  },
  {
    ...placeholder("item-16", "Black Claymation Shoe", "Footwear"),
    model: "/models/black-claymation-shoe.glb",
    // Same mesh as Red Claymation Shoe (item-15), just a different UV/texture
    // — safe to reuse its exact framing and starting angle.
    viewerFitMargin: 0.5,
    viewerStartAngle: { thetaDeg: 267.5, phiDeg: 84.4 },
    stats: [
      { label: "Year", value: "2026" },
      { label: "Price", value: "120" },
    ],
  },
  {
    ...placeholder("item-17", "Glo Gang Slides", "Footwear"),
    model: "/models/glogang-clog.glb",
    viewerFitMargin: 0.7,
    viewerStartAngle: { thetaDeg: 210.0, phiDeg: 72.6 },
    stats: [
      { label: "Year", value: "2025" },
      { label: "VALUE", value: "110" },
    ],
  },
  {
    ...placeholder("item-18", "Steak Slides", "Footwear"),
    model: "/models/beef-clog.glb",
    viewerFitMargin: 0.7,
    viewerStartAngle: { thetaDeg: 12.6, phiDeg: 75.2 },
    stats: [
      { label: "Year", value: "2025" },
      { label: "Value", value: "110" },
    ],
  },
  {
    ...placeholder("item-19", "Sticker Print Boots", "Footwear"),
    model: "/models/sticker-docs.glb",
    viewerFitMargin: 0.7,
    viewerStartAngle: { thetaDeg: 250.8, phiDeg: 79.4 },
    stats: [
      { label: "Year", value: "2026" },
      { label: "VALUE", value: "200" },
    ],
  },
  {
    ...placeholder("item-42", "Brazil Runner", "Footwear"),
    model: "/models/brazil-runner.glb",
    viewerFitMargin: 0.7,
    viewerStartAngle: { thetaDeg: 210, phiDeg: 72 },
    stats: [
      { label: "Year", value: "2026" },
      { label: "VALUE", value: "125" },
    ],
  },

  // Packaging
  {
    ...placeholder("item-20", "Foot Clog Box", "Packaging"),
    model: "/models/hulk-packaging.glb",
    viewerFitMargin: 0.85,
    viewerStartAngle: { thetaDeg: 173.9, phiDeg: 89.5 },
    // Source animation is baked at 24fps (confirmed from keyframe spacing)
    // — only play the box-opening portion, not the whole clip. The clip's
    // true last keyframe is frame 179 (7.458333s @ 24fps) — stopping short
    // of that cuts the loop off before it settles on its final pose.
    viewerAnimationRange: { startFrame: 75, endFrame: 179, fps: 24 },
    stats: [{ label: "Year", value: "2024" }],
  },
  {
    ...placeholder("item-21", "Kid Cudi x Bravest Foot Clog Box", "Packaging"),
    stats: [{ label: "Year", value: "2024" }],
  },
  {
    ...placeholder("item-22", "Claymation Shoe Box", "Packaging"),
    model: "/models/clay-shoe.glb",
    viewerStartAngle: { thetaDeg: 301.8, phiDeg: 63.9 },
  },
  {
    ...placeholder("item-23", "Spike Sandal Box", "Packaging"),
    model: "/models/spike-sandal-box.glb",
    viewerFitMargin: 0.85,
    viewerStartAngle: { thetaDeg: 219.8, phiDeg: 71.2 },
  },
  placeholder("item-24", "Spike Shoe Box", "Packaging"),
  {
    ...placeholder("item-25", "Bag Clog Box", "Packaging"),
    model: "/models/bag-clog-box.glb",
    viewerStartAngle: { thetaDeg: 219.8, phiDeg: 71.2 },
    stats: [{ label: "Year", value: "2025" }],
  },

  // Action Figures
  {
    ...placeholder("item-26", "Kid Cudi", "Action Figures"),
    stats: [{ label: "Year", value: "2024" }],
  },
  {
    ...placeholder("item-27", "Joony", "Action Figures"),
    stats: [{ label: "Year", value: "2023" }],
  },
  placeholder("item-28", "Eris", "Action Figures"),
  placeholder("item-29", "Me", "Action Figures"),
  placeholder("item-30", "Kanii", "Action Figures"),
  placeholder("item-31", "Drezzdon", "Action Figures"),

  // Nail Sets
  {
    ...placeholder("item-32", "Raw Beef Set", "Nail Sets"),
    stats: [{ label: "Year", value: "2025" }],
  },
  {
    ...placeholder("item-33", "Raw Pork Set", "Nail Sets"),
    stats: [{ label: "Year", value: "2025" }],
  },
  {
    ...placeholder("item-34", "Halloween Animal Crossing Set", "Nail Sets"),
    stats: [{ label: "Year", value: "2025" }],
  },
  {
    ...placeholder("item-35", "Splatoon Sticker Collage Set", "Nail Sets"),
    model: "/models/splatoon-collage-nails.glb",
    viewerFitMargin: 0.75,
    viewerStartAngle: { thetaDeg: 234.4, phiDeg: 49.3 },
    stats: [{ label: "Year", value: "2024" }],
  },
  placeholder("item-36", "Deco Berserk Set", "Nail Sets"),
  {
    ...placeholder("item-38", "Deco Katamari Set", "Nail Sets"),
    model: "/models/katamari-nails.glb",
    viewerFitMargin: 0.75,
    viewerStartAngle: { thetaDeg: 234.4, phiDeg: 49.3 },
    stats: [{ label: "Year", value: "2025" }],
  },
  {
    ...placeholder("item-39", "Deco Tentacle Set", "Nail Sets"),
    model: "/models/tentacle-nails.glb",
    viewerFitMargin: 0.75,
    viewerStartAngle: { thetaDeg: 234.4, phiDeg: 49.3 },
    stats: [{ label: "Year", value: "2026" }],
  },

  // Misc
  {
    ...placeholder("item-40", "Memento Deluxe Cassette", "Misc"),
    model: "/models/memento-deluxe.glb",
    viewerFitMargin: 0.75,
    stats: [{ label: "Year", value: "2024" }],
  },
  {
    ...placeholder("item-41", "Zombie Zip Bag", "Misc"),
    model: "/models/zombie.glb",
    viewerStartAngle: { thetaDeg: 230, phiDeg: 90 },
    stats: [{ label: "Year", value: "2025" }],
  },
];
