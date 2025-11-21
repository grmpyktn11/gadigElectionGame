let survivors = [];
let round = 0;
let step = -1; // -1 = show intro, 0 = show survivors, 1 = show events, 2 = show deaths

let currentEvents = [];
let currentDeaths = [];
let mainImage = "";

// Event data
const events = [
  { text: "{name} finds a water source.", img: "img/event_water.jpg" },
  { text: "{name} builds a shelter.", img: "img/event_shelter.jpg" },
  { text: "{name} makes a fire.", img: "img/event_fire.jpg" },
  { text: "{name} finds supplies.", img: "img/event_supplies.jpg" },
  { text: "{name} climbs a tree.", img: "img/event_tree.jpg" },
  { text: "{name} hears a noise.", img: "img/event_noise.jpg" },
  { text: "{name} sets up traps.", img: "img/event_trap.jpg" }
];

const deathEvents = [
  { text: "{name} steps on a landmine.", img: "img/death_landmine.jpg" },
  { text: "{name} eats poisonous berries.", img: "img/death_pois.jpg" },
  { text: "{name} falls off a cliff.", img: "img/death_cliff.jpg" },
  { text: "{name} freezes to death.", img: "img/death_cold.jpg" },
  { text: "{name} dies from dehydration.", img: "img/death_thirst.jpg" }
];

const killerDeathEvents = [
  { text: "{killer} kills {name} with a rock.", img: "img/death_rock.jpg" },
  { text: "{killer} shoves {name} off a cliff.", img: "img/death_cliffpush.jpg" },
  { text: "{killer} stabs {name}.", img: "img/death_stab.jpg" },
  { text: "{killer} shoots {name} with an arrow.", img: "img/death_arrow.jpg" },
  { text: "{killer} strangles {name}.", img: "img/death_strangle.jpg" }
];

// Set up buttons
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn").addEventListener("click", startGame);
  document.getElementById("nextBtn").addEventListener("click", nextStep);
  document.getElementById("resetBtn").addEventListener("click", reset);
  document.getElementById("nextBtn").disabled = true; // disable until start
});

// Start game
function startGame() {
  const input = document.getElementById("nameInput").value.trim();
  survivors = input.split(/\r?\n/).map(s => s.trim()).filter(s => s !== "");

  if (survivors.length < 2) {
    alert("You need at least 2 tributes.");
    return;
  }

  round = 0;
  step = -1;
  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("nextBtn").textContent = "Continue";
  document.getElementById("nextBtn").disabled = false;

  nextStep(); // show intro
}

// Main game loop
function nextStep() {
  const screen = document.getElementById("currentScreen");

  if (survivors.length === 1) {
    screen.innerHTML = `<h2>${escapeHtml(survivors[0])} WINS THE HUNGER GAMES!</h2>`;
    document.getElementById("nextBtn").disabled = true;
    return;
  } else if (survivors.length === 0) {
    screen.innerHTML = `<h2>No tributes remain.</h2>`;
    document.getElementById("nextBtn").disabled = true;
    return;
  }

  if (step === -1) {
    screen.innerHTML = `<h2>Intro</h2><p>This is the story...</p>`;
    document.getElementById("nextBtn").textContent = "Next";
    step = 0;
    return;
  }

  if (step === 0) { // show survivors
    round++;
    screen.innerHTML = `<h2>Round ${round}</h2><p><strong>${survivors.length} tributes remain:</strong></p><p>${survivors.map(escapeHtml).join(", ")}</p>`;
    generateEvents();
    document.getElementById("nextBtn").textContent = "Show Events";
    step = 1;
    return;
  }

  if (step === 1) { // show events
    mainImage = currentEvents[0]?.img || "";
    screen.innerHTML = `<h2>Round ${round}</h2>`;
    if (mainImage) screen.innerHTML += `<img src="${mainImage}" class="eventImg"><br>`;
    currentEvents.forEach(e => screen.innerHTML += `<p>${escapeHtml(e.text)}</p>`);
    generateDeaths();
    document.getElementById("nextBtn").textContent = "Show Deaths";
    step = 2;
    return;
  }

  if (step === 2) { // show deaths
    screen.innerHTML = `<h2>Round ${round}</h2>`;
    if (currentDeaths.length > 0) {
      mainImage = currentDeaths[0].img;
      if (mainImage) screen.innerHTML += `<img src="${mainImage}" class="eventImg"><br>`;
    }
    currentDeaths.forEach(d => screen.innerHTML += `<p><strong>${escapeHtml(d.text)}</strong></p>`);
    document.getElementById("nextBtn").textContent = "Next Round";
    step = 0;

    if (survivors.length <= 1) {
      if (survivors.length === 1) screen.innerHTML += `<h2>${escapeHtml(survivors[0])} WINS THE HUNGER GAMES!</h2>`;
      else screen.innerHTML += `<h2>No tributes remain.</h2>`;
      document.getElementById("nextBtn").disabled = true;
    }
  }
}

// generate random events
function generateEvents() {
  currentEvents = [];
  let n = survivors.length;
  let numEvents = n <= 3 ? 1 : n <= 6 ? 2 : n <= 10 ? 3 : n <= 15 ? 4 : 5;
  if (n > 20) numEvents = 6;
  if (n > 30) numEvents = 7;

  for (let i = 0; i < numEvents; i++) {
    const person = survivors[Math.floor(Math.random() * survivors.length)];
    const event = events[Math.floor(Math.random() * events.length)];
    currentEvents.push({ text: event.text.replace("{name}", person), img: event.img });
  }
}

// generate random deaths
function generateDeaths() {
  currentDeaths = [];
  let maxDeaths = Math.min(3, survivors.length - 1);
  let numDeaths = Math.floor(Math.random() * (maxDeaths + 1));

  for (let i = 0; i < numDeaths; i++) {
    if (survivors.length <= 1) break;
    const deadIndex = Math.floor(Math.random() * survivors.length);
    const dead = survivors.splice(deadIndex, 1)[0];

    let event, text;
    if (Math.random() < 0.5 && survivors.length > 0) { // killer death
      event = killerDeathEvents[Math.floor(Math.random() * killerDeathEvents.length)];
      const killer = survivors[Math.floor(Math.random() * survivors.length)];
      text = event.text.replace("{name}", dead).replace("{killer}", killer);
    } else {
      event = deathEvents[Math.floor(Math.random() * deathEvents.length)];
      text = event.text.replace("{name}", dead);
    }

    currentDeaths.push({ text, img: event.img });
  }
}

// reset game
function reset() {
  survivors = [];
  round = 0;
  step = 0;
  document.getElementById("setup").style.display = "block";
  document.getElementById("game").style.display = "none";
  document.getElementById("currentScreen").innerHTML = "";
  document.getElementById("nextBtn").textContent = "Start Round";
  document.getElementById("nextBtn").disabled = true;
  document.getElementById("nameInput").value = "";
}

// escape HTML
function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") return unsafe;
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
