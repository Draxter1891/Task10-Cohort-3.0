//Constants

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEATHER_CODES = {
  0: "☀️ Clear Sky",

  1: "🌤️ Partly Cloudy",
  2: "🌤️ Partly Cloudy",
  3: "☁️ Cloudy",

  45: "🌫️ Fog",
  48: "🌫️ Fog",

  51: "🌦️ Drizzle",
  53: "🌦️ Drizzle",
  55: "🌦️ Drizzle",

  61: "🌧️ Rain",
  63: "🌧️ Rain",
  65: "🌧️ Rain",

  71: "❄️ Snow",
  73: "❄️ Snow",
  75: "❄️ Snow",

  95: "⛈️ Thunderstorm",
};
//Selectors

const ui = {
  body: document.body,
  dashboard: document.querySelector("#dashboard"),
  featureView: document.querySelector("#feature-view"),
  themeBtn: document.querySelector("#dark"),
  themeIcon: document.querySelector("#theme-ico"),
  menu: document.querySelector(".right"),
  backBtn: document.querySelector("#back-btn"),

  //date and time
  date: document.querySelector("#date"),
  month: document.querySelector("#month"),
  year: document.querySelector("#year"),
  day: document.querySelector("#day"),
  time: document.querySelector("time"),

  //weather
  temp: document.querySelector("#temp"),
  tempUnit: document.querySelector("#temp-unit"),
  weatherType: document.querySelector("#weather-type"),
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.theme === "dark") {
    ui.themeBtn.checked = true;
  }
});

let getCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition((e) => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${e.coords.latitude}&longitude=${e.coords.longitude}&current=temperature_2m,weather_code`,
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        ui.temp.textContent = data.current.temperature_2m;
        ui.tempUnit.textContent = data.current_units.temperature_2m;
        ui.weatherType.textContent = WEATHER_CODES[data.current.weather_code];
      });
  });
};

getCurrentLocation();

let getCurrentDateTime = () => {
  const now = new Date();
  let date = now.getDate();
  let day = DAYS[now.getDay()];
  let month = MONTHS[now.getMonth()];
  let year = now.getFullYear();
  let hr = now.getHours();
  let min = now.getMinutes();
  let sec = now.getSeconds();
  return { date, day, month, year, hr, min, sec };
};

let updateClock = () => {
  let timestamp = getCurrentDateTime();
  date.textContent = timestamp.date;
  month.textContent = timestamp.month;
  year.textContent = timestamp.year;
  day.textContent = timestamp.day;
  time.textContent = `${String(timestamp.hr).padStart(2, "0")} : ${String(timestamp.min).padStart(2, "0")} : ${String(timestamp.sec).padStart(2, "0")}`;
  dynamicWallpaper(timestamp.hr);
};

setInterval(updateClock, 1000);

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
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeFeature();
  }
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

let dynamicWallpaper = (hr = 12) => {
  if (hr >= 5 && hr <= 19) {
    dashboard.style.background =
      "url('https://images.template.net/78292/Free-Bright-Good-Morning-Vector-1.png')";
  } else {
    dashboard.style.background =
      "url('/assets/media/moonblue.jpg') left/cover no-repeat";
  }
};
