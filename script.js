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
  //TODO
  taskComposer: document.querySelector("#composer"),
  taskInput: document.querySelector("#taskInput"),
  taskList: document.querySelector("#taskList"),
  //PLANNER
  plannerContainer: document.querySelector(".planner-container"),
  clearAllPlans: document.querySelector("#clear-all-planner"),
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
  renderers[`${featureId}`]();
};

let closeFeature = () => {
  document
    .querySelectorAll(".feature")
    .forEach((elem) => elem.classList.add("hidden"));
  ui.featureView.classList.add("hidden");
  ui.dashboard.classList.remove("hidden");
};

let dynamicWallpaper = (hr) => {
  if (hr >= 5 && hr < 19) {
    dashboard.style.background =
      "url('https://images.template.net/78292/Free-Bright-Good-Morning-Vector-1.png') center/cover no-repeat";
  } else {
    dashboard.style.background =
      "url('/assets/media/moonblue.jpg') left/cover no-repeat";
  }
};

//TODO-feture
let saveTasks = (tasks) => {
  localStorage.setItem("todo", JSON.stringify(tasks));
};
let getTasks = () => {
  return JSON.parse(localStorage.getItem("todo")) || [];
};

let tasks = getTasks();
ui.taskComposer.addEventListener("submit", (e) => {
  e.preventDefault();
  let task = ui.taskInput.value;
  if (!task.trim()) {
    alert("Please enter the task!");
    return;
  }
  tasks.push({
    id: Date.now(),
    task,
    isImp: false,
    isCompleted: false,
  });

  ui.taskComposer.reset();
  saveTasks(tasks);
  renderers["todo-feature"]();
});

let taskDelete = (id) => {
  let deletionIndex = tasks.findIndex((elem) => elem.id === id);
  tasks.splice(deletionIndex, 1);
  saveTasks(tasks);
  renderers["todo-feature"]();
};

let taskMarkImp = (id) => {
  let clickedElem = tasks.find((elem) => elem.id === id);
  clickedElem.isImp = !clickedElem.isImp;
  saveTasks(tasks);
  renderers["todo-feature"]();
};

let taskMarkDone = (id) => {
  let clickedElem = tasks.find((elem) => elem.id === id);
  clickedElem.isCompleted = !clickedElem.isCompleted;
  console.log(tasks);
  saveTasks(tasks);
  renderers["todo-feature"]();
};

ui.taskList.addEventListener("click", (e) => {
  let dltBtn = e.target.closest(".task-icon--delete");
  let impBtn = e.target.closest(".task-icon--star");
  let completedBtn = e.target.closest(".task-check");
  let taskID = Number(e.target.closest("li").dataset.id);
  if (dltBtn) {
    taskDelete(taskID);
  }
  if (impBtn) {
    taskMarkImp(taskID);
  }
  if (completedBtn) {
    taskMarkDone(taskID);
  }
});

//Planner
let savePlanner = (planner) => {
  localStorage.setItem("planner", JSON.stringify(planner));
};

let getPlanner = () => {
  return JSON.parse(localStorage.getItem("planner")) || {};
};

ui.clearAllPlans.addEventListener("click", (e) => {
  let allPlans = getPlanner();

  if (Object.keys(allPlans).length === 0) {
    alert("Input fields are already empty.");
    return;
  }

  let clearPermission = confirm(
    "Attention: All fields will be wiped, this action can't be reverted!",
  );

  if (clearPermission) {
    for (let key in allPlans) {
      delete allPlans[key];
    }
    savePlanner(allPlans);
    renderers["planner-feature"]();
  }
});

ui.plannerContainer.addEventListener("input", (e) => {
  let allPlans = getPlanner();
  allPlans[e.target.dataset.hour] = e.target.value;
  savePlanner(allPlans);
});

let renderers = {
  "todo-feature": () => {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
      taskList.innerHTML += `<h1 class="todo-empty-state">No Tasks yet<h1/>`;
    }
    tasks.forEach((elem) => {
      taskList.innerHTML += `
    <li class="task" data-id = "${elem.id}">
                <button
                  class="task-check ${elem.isCompleted === true ? "task--done" : ""}"
                  aria-label="Mark complete"
                  title="Complete"
                >
                </button>

                <span class="task-label ${elem.isCompleted === true ? "task-label-done" : ""}">${elem.task}</span>

                <div class="task-actions">
                  <button
                    class="task-icon task-icon--star ${elem.isImp === true ? "task--important" : ""}"
                    aria-label="Mark important"
                    title="Important"
                    class = "task-important"
                    
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path
                        d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L6 21l1.6-7L2.2 9.2l7.1-.6L12 2z"
                        stroke="currentColor"
                        stroke-width="1.6"
                        fill="none"
                      />
                    </svg>
                  </button>

                  <button
                    class="task-icon task-icon--delete"
                    aria-label="Delete task"
                    title="Delete"
                    class = "task-delete"
                    
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path
                        d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v13a1 1 0 01-1 1H8a1 1 0 01-1-1V7h10z"
                        stroke="currentColor"
                        stroke-width="1.6"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
      </li>
    `;
    });
  },
  "planner-feature": () => {
    let allPlans = getPlanner();

    ui.plannerContainer.innerHTML = "";
    
    let currentHr = new Date();
    for (let i = 6; i < 24; i++) {
      let li = document.createElement("li");
      let p = document.createElement("p");
      let inp = document.createElement("textArea");
      inp.dataset.hour = i;
      if(i=== currentHr.getHours()){
        li.classList.add("hightlight-task")
      }
      p.textContent = `${String(i).padStart(2, 0)}:00 - ${String(i + 1).padStart(2, 0)}:00`;
      inp.type = "text";
      inp.placeholder = "what's your task for this hour..?";
      inp.value = allPlans[i] || "";
      li.append(p, inp);
      ui.plannerContainer.append(li);
    }
  },
  "goals-feature": () => {
    console.log("Goals feature called...");
  },
  "pomodoro-feature": () => {
    console.log("pomodoro feature called...");
  },
  "quote-feature": () => {
    console.log("quote feature called...");
  },
};
