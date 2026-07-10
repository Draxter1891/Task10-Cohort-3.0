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
  city: document.querySelector("#city"),
  featureView: document.querySelector("#feature-view"),
  themeBtn: document.querySelector("#dark"),
  themeIcon: document.querySelector("#theme-ico"),
  menu: document.querySelector(".right"),
  backBtn: document.querySelector("#back-btn"),
  ecsBackLine: document.querySelector(".gen-instruct"),

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
  //GOALS
  goalsForm: document.querySelector("#goals-form"),
  goalsInp: document.querySelector("#goal-inp"),
  goalsContainer: document.querySelector(".goals-container"),
  circle: document.querySelector(".progress-ring-circle"),
  completedGoals: document.querySelector("#completed-goals"),
  totalGoals: document.querySelector("#total-goals"),
  dltAllGoals: document.querySelector("#clear-all-goals"),
  //Quotes
  quote: document.querySelector("#quote"),
  quoteAuthor: document.querySelector("#quote-author"),
  genQuote: document.querySelector("#gen-new-quote"),
  //Pomodoro
  pomotimer: document.querySelector("#pomodoro-time"),
  pomoStart: document.querySelector("#pomodoro-start"),
  pomoReset: document.querySelector("#pomodoro-reset"),
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.theme === "dark") {
    ui.themeBtn.checked = true;
  }
  getCurrentLocation();
  checkDevice();
  getCity();
});

let checkDevice = () => {
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  if (isMobile) {
    ui.ecsBackLine.classList.add("hidden");
  } else {
    ui.ecsBackLine.classList.remove("hidden");
  }
};
let currentLatitude = null;
let currentLongitude = null;

let getCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition((e) => {
    currentLatitude = e.coords.latitude;
    currentLongitude = e.coords.longitude;
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
let getCity = async () => {
  let response =
    await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${currentLatitude}&longitude=${currentLongitude}&localityLanguage=en
`);

  let data = await response.json();
  console.log(data);
  ui.city.textContent = data.city;
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

//GOALS
let saveGoals = (goals) => {
  localStorage.setItem("goals", JSON.stringify(goals));
};

let getGoals = () => {
  return JSON.parse(localStorage.getItem("goals")) || [];
};

let deleteGoal = (id) => {
  let allGoals = getGoals();
  let goalIndx = allGoals.findIndex((elem) => elem.id === id);
  allGoals.splice(goalIndx, 1);
  saveGoals(allGoals);
  renderers["goals-feature"]();
};

let completedGoalsCounter = (arr) => {
  let counter = 0;
  arr.forEach((elem) => {
    if (elem.isDone === true) {
      counter++;
    }
  });
  return counter;
};
let totalGoalsCounter = (arr) => {
  return arr.length;
};

let updateProgressCircle = (completed, total) => {
  ui.completedGoals.textContent = completed;
  ui.totalGoals.textContent = total;

  let radius = ui.circle.r.baseVal.value;
  let circum = (2 * Math.PI * radius).toFixed(2);

  let percentage = total > 0 ? (completed / total) * 100 : 0;

  let cappedPercentage = Math.min(Math.max(percentage, 0), 100);

  let offset = circum - (cappedPercentage / 100) * circum;
  console.log(`${offset.toFixed(2)}/${circum}`);

  ui.circle.style.strokeDashoffset = offset.toFixed(2);
};

ui.goalsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let goal = ui.goalsInp.value;
  if (goal.trim() === "") return alert("Please enter some value!");

  let allGoals = getGoals();

  allGoals.push({
    id: Date.now(),
    goal,
    isDone: false,
  });
  saveGoals(allGoals);
  renderers["goals-feature"]();
  e.target.reset();
});

ui.dltAllGoals.addEventListener("click", () => {
  let allGoals = getGoals();
  if (allGoals.length === 0) return alert("No Goals to delete.");
  allGoals = [];
  saveGoals(allGoals);
  renderers["goals-feature"]();
});

ui.goalsContainer.addEventListener("click", (e) => {
  let clickedElem = e.target.closest(".close");
  let goalTxt = e.target.closest(".container-goal>p");
  let targetId = Number(e.target.closest(".container-goal").dataset.id);
  if (clickedElem) {
    deleteGoal(targetId);
  }
  if (goalTxt) {
    let allGoals = getGoals();
    let matchFound = allGoals.find((elem) => elem.id === targetId);
    if (matchFound) {
      matchFound.isDone = !matchFound.isDone;
    }
    saveGoals(allGoals);
    renderers["goals-feature"]();
  }
});

//Quotes
let saveQuote = (quote) => {
  localStorage.setItem("quote", JSON.stringify(quote));
};

let getQuote = () => {
  return JSON.parse(localStorage.getItem("quote")) || [];
};
let isLoading = false;

let fetchQuote = async () => {
  isLoading = true;
  const url = "https://dummyjson.com/quotes/random";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed Fetching: ${response.status}`);
    }

    const data = await response.json();
    let lsQuote = getQuote();
    lsQuote = [];
    lsQuote.push(data);
    saveQuote(lsQuote);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading = false;
    renderers["quote-feature"]();
  }
};
fetchQuote();
ui.genQuote.addEventListener("click", () => {
  fetchQuote();
  renderers["quote-feature"]();
});

//Pomodoro
const POMODORO_TIME = 25 * 60;

let remainingSeconds = POMODORO_TIME;
let timerId = null;

const BUTTON_TEXT = {
  idle: "Start",
  running: "Pause",
  paused: "Resume",
};

const TIMER_STATE = {
  IDLE: "idle",
  RUNNING: "running",
  PAUSED: "paused",
};

let timerState = TIMER_STATE.IDLE;

let startTimer = () => {
  if (timerId) return;

  timerState = TIMER_STATE.RUNNING;
  renderers["pomodoro-feature"]();

  timerId = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds <= 0) {
      clearInterval(timerId);
      timerId = null;
      timerState = TIMER_STATE.IDLE;
      remainingSeconds = POMODORO_TIME;
      renderers["pomodoro-feature"]();
      alert("Let's take a break!");
      return;
    }
    renderers["pomodoro-feature"]();
  }, 1000);
};

let pauseTimer = () => {
  clearInterval(timerId);
  timerId = null;
  timerState = TIMER_STATE.PAUSED;
  renderers["pomodoro-feature"]();
};

let resumeTimer = () => {
  startTimer();
};

let resetTimer = () => {
  clearInterval(timerId);
  timerId = null;
  remainingSeconds = POMODORO_TIME;
  timerState = TIMER_STATE.IDLE;
  renderers["pomodoro-feature"]();
};

ui.pomoStart.addEventListener("click", () => {
  if (timerState === "idle") {
    startTimer();
  } else if (timerState === "running") {
    pauseTimer();
  } else if (timerState === "paused") {
    resumeTimer();
  }
});

ui.pomoReset.addEventListener("click", resetTimer);

let renderers = {
  "todo-feature": () => {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
      taskList.innerHTML += `<h1 class="empty-state">No Tasks yet<h1/>`;
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
      if (i === currentHr.getHours()) {
        li.classList.add("hightlight-task");
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
    let allGoals = getGoals();
    ui.goalsContainer.innerHTML = "";
    allGoals.length > 0
      ? allGoals.forEach((elem) => {
          ui.goalsContainer.innerHTML += `
      <div class="container-goal" data-id = "${elem.id}">
                  <p class="${elem.isDone === true ? "line-through" : ""}">${elem.goal}</p>
                  <div class="close">
                    <i class="ri-close-line"></i>
                  </div>
      </div>
      `;
        })
      : (ui.goalsContainer.innerHTML = `<h2 class = "empty-state">Create your first goal<h2/>`);

    updateProgressCircle(
      completedGoalsCounter(allGoals),
      totalGoalsCounter(allGoals),
    );
  },
  "pomodoro-feature": () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.floor(remainingSeconds % 60);

    console.log(`${minutes} : ${seconds}`);
    ui.pomotimer.textContent = `${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
    ui.pomoStart.textContent = BUTTON_TEXT[timerState];
  },

  "quote-feature": () => {
    let lsQuote = getQuote();
    if (isLoading || lsQuote.length === 0) {
      ui.quote.innerHTML = `<h2 class="empty-state">Quote is on the way<h2/>`;
      ui.quoteAuthor.textContent = "";
    } else {
      ui.quote.textContent = lsQuote[0].quote;
      ui.quoteAuthor.textContent = `-- ${lsQuote[0].author}`;
    }
  },
};
