//Selectors
const themeBtn = document.querySelector("#dark");
const themeIco = document.querySelector("#theme-ico");

themeBtn.addEventListener("change", (e) => {
  if (e.target.checked) {
    themeIco.classList.remove("ri-sun-line");
    themeIco.classList.add("ri-moon-clear-line");
    themeIco.style.color = "white";
    document.body.setAttribute("data-theme", "dark");
  } else {
    themeIco.classList.remove("ri-moon-clear-line");
    themeIco.classList.add("ri-sun-line");
    themeIco.style.color = "black";
    document.body.removeAttribute("data-theme");
  }
});
