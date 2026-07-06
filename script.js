//Selectors

const ui = {
  body: document.body,
  dashboard: document.querySelector("#dashboard"),
  featureView: document.querySelector("#feature-view"),
  themeBtn: document.querySelector("#dark"),
  themeIcon: document.querySelector("#theme-ico"),
  menu: document.querySelector(".right"),
  backBtn: document.querySelector("#back-btn"),
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.theme === "dark") {
    ui.themeBtn.checked = true;
  }
});

ui.themeBtn.addEventListener("change", (e) => {
  e.target.checked
    ? (ui.themeIcon.classList = "ri-moon-clear-line")
    : (ui.themeIcon.classList = "ri-sun-line");
  if (e.target.checked) {
    ui.body.setAttribute("data-theme", "dark");
  } else {
    ui.body.removeAttribute("data-theme");
  }
});

ui.backBtn.addEventListener("click", () => {
  closeFeature();
});

ui.menu.addEventListener("click", (e) => {
  const card = e.target.closest(".feature-cta");
  if (!card) return;
  const featureId = card.dataset.feature;
  openFeature(featureId);
});

//Utility functions
let openFeature = (featureId) => {
  ui.dashboard.classList.add("hidden");
  ui.featureView.classList.remove("hidden");
  document
    .querySelectorAll(".feature")
    .forEach((elem) => elem.classList.add("hidden"));
  document.getElementById(featureId).classList.remove("hidden");
};

let closeFeature = () => {
  document
    .querySelectorAll(".feature")
    .forEach((elem) => elem.classList.add("hidden"));
  ui.featureView.classList.add("hidden");
  ui.dashboard.classList.remove("hidden");
};
