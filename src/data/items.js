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
// Every entry below is a real title from your catalog with no model,
// stats, or description yet — swap in the real details piece by piece
// whenever you're ready; the layout adapts automatically either way.
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
    description: "",
  };
}

export const items = [
  // Tops
  placeholder("item-01", "Joony Memento", "Tops"),
  placeholder("item-02", "Shitumss", "Tops"),
  placeholder("item-03", "Lonelystar 1", "Tops"),
  placeholder("item-04", "Lonelystar 2", "Tops"),
  placeholder("item-05", "CXR Shirt", "Tops"),

  // Bottoms
  placeholder("item-06", "Sticker Print Jorts", "Bottoms"),
  placeholder("item-07", "Black Illustrated Shorts", "Bottoms"),
  placeholder("item-08", "Glo Sweatshort", "Bottoms"),
  placeholder("item-09", "Glo SS Black", "Bottoms"),

  // Accessories
  placeholder("item-10", "Croc Belt", "Accessories"),
  placeholder("item-11", "Pins Bag", "Accessories"),
  placeholder("item-12", "Engraved Headphones", "Accessories"),
  placeholder("item-13", "Deco Cases", "Accessories"),
  placeholder("item-14", "Beef Ring / Spaghetti Rings, etc.", "Accessories"),

  // Footwear
  {
    ...placeholder("item-15", "Red Claymation Shoe", "Footwear"),
    model: "/models/red-claymation-shoe.glb",
    // Compact/rounded mesh — safe to fill the frame much more tightly
    // than the safe-for-anything default without clipping on rotation.
    viewerFitMargin: 0.5,
    viewerStartAngle: { thetaDeg: 267.5, phiDeg: 84.4 },
  },
  {
    ...placeholder("item-16", "Black Claymation Shoe", "Footwear"),
    model: "/models/black-claymation-shoe.glb",
    // Same mesh as Red Claymation Shoe (item-15), just a different UV/texture
    // — safe to reuse its exact framing and starting angle.
    viewerFitMargin: 0.5,
    viewerStartAngle: { thetaDeg: 267.5, phiDeg: 84.4 },
  },
  {
    ...placeholder("item-17", "Glo Clog", "Footwear"),
    model: "/models/glogang-clog.glb",
    viewerFitMargin: 0.7,
    viewerStartAngle: { thetaDeg: 210.0, phiDeg: 72.6 },
  },
  {
    ...placeholder("item-18", "Beef Clog", "Footwear"),
    model: "/models/beef-clog.glb",
    viewerFitMargin: 0.7,
    viewerStartAngle: { thetaDeg: 12.6, phiDeg: 75.2 },
  },
  {
    ...placeholder("item-19", "Sticker Docs", "Footwear"),
    model: "/models/sticker-docs.glb",
    viewerFitMargin: 0.7,
    viewerStartAngle: { thetaDeg: 250.8, phiDeg: 79.4 },
  },

  // Packaging
  {
    ...placeholder("item-20", "Foot Clog Packaging", "Packaging"),
    model: "/models/hulk-packaging.glb",
    viewerFitMargin: 0.65,
    viewerStartAngle: { thetaDeg: 173.9, phiDeg: 89.5 },
    // Source animation is baked at 24fps (confirmed from keyframe spacing)
    // — only play the box-opening portion, not the whole clip.
    viewerAnimationRange: { startFrame: 75, endFrame: 170, fps: 24 },
  },
  placeholder("item-21", "KC Foot", "Packaging"),
  { ...placeholder("item-22", "Clay Shoe", "Packaging"), model: "/models/clay-shoe.glb" },
  placeholder("item-23", "Spike Sandal", "Packaging"),
  placeholder("item-24", "Spike Shoe", "Packaging"),
  placeholder("item-25", "Bag Clog", "Packaging"),

  // Action Figures
  placeholder("item-26", "Kid Cudi", "Action Figures"),
  placeholder("item-27", "Joony", "Action Figures"),
  placeholder("item-28", "Eris", "Action Figures"),
  placeholder("item-29", "Me", "Action Figures"),
  placeholder("item-30", "Kanii", "Action Figures"),
  placeholder("item-31", "Drezzdon", "Action Figures"),

  // Nail Sets
  placeholder("item-32", "Beef", "Nail Sets"),
  placeholder("item-33", "Pork", "Nail Sets"),
  placeholder("item-34", "Halloween Animal Crossing", "Nail Sets"),
  placeholder("item-35", "Misc Platoon", "Nail Sets"),
  placeholder("item-36", "Berserk Beheld", "Nail Sets"),
];
