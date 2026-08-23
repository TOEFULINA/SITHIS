import { skills } from "../data/skills.js";
import { renderTopNav } from "./topNav.js";

export function renderSkillsView(container) {
  const el = document.createElement("div");
  el.className = "section-screen";
  el.appendChild(renderTopNav("skills"));

  el.insertAdjacentHTML(
    "beforeend",
    `
    <div class="section-content">
      <h1 class="section-title rune">Skills</h1>
      <p class="section-sub">Capabilities — illustration, 3D, animation, design, propmaking.</p>
      <div class="skills-grid"></div>
    </div>
  `
  );

  const grid = el.querySelector(".skills-grid");
  skills.forEach((skill) => {
    const card = document.createElement("div");
    card.className = "skill-card panel";
    const dots =
      skill.level != null
        ? `<div class="skill-dots">${Array.from({ length: 5 })
            .map((_, i) => `<span class="${i < skill.level ? "filled" : ""}"></span>`)
            .join("")}</div>`
        : "";
    card.innerHTML = `
      <h3>${skill.title}</h3>
      ${dots}
      <p>${skill.description}</p>
    `;
    grid.appendChild(card);
  });

  container.appendChild(el);
  return () => {};
}
