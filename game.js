// Anime High-School Battle Royale Simulator

let students = [];
let round = 0;
let step = -1; // -1 = intro, 0 = show students, 1 = show events, 2 = show deaths

let currentEvents = [];
let currentDeaths = [];
let mainImage = "";

// --- EVENT DATA ---

// Romantic / School Slice-of-life Events
const schoolEvents = [
  { text: "{name} accidentally falls on top of Georgina in the hallway! ♡" },
  { text: "{name} feeds Georgina their bento lunch on the rooftop!" },
  { text: "{name} runs to school with toast in mouth and crashes into Georgina!" },
  { text: "{name} shares an umbrella with Georgina in the rain, shoulders touching..." },
  { text: "{name} gives Georgina a love letter hidden in her shoe locker!" },
  { text: "{name} watches the cherry blossoms with Georgina under the moonlight..." },
  { text: "{name} trips and Georgina catches them in a princess carry!" },
  { text: "{name} wipes sweat off Georgina's forehead during PE class!" },
  { text: "{name} accidentally kisses Georgina while reaching for the same book!" },
  { text: "{name} walks Georgina home under the stars..." },
  { text: "{name} gives Georgina their jacket when it gets cold!" },
  { text: "{name} accidentally holds hands with Georgina on the train!" },
  { text: "{name} and Georgina share headphones listening to the same song!" }
];

// Tragic (Non-killer) Eliminations
const tragicEvents = [
  { text: "{name} gets humiliated when their embarrassing otaku shrine is exposed! They drop out in shame!" },
  { text: "{name} eats cursed chocolate meant for Georgina and collapses dramatically!" },
  { text: "{name} falls into the school pool fully clothed and gets expelled!" },
  { text: "{name} is locked in the gym storage room forever... tragic!" },
  { text: "{name} passes out after blushing too hard in front of Georgina!" },
  { text: "{name} slips on spilled boba in the hallway and is taken away by nurses!" },
  { text: "{name} gets lost during the school festival and mysteriously vanishes!" }
];

// Killer Yandere Eliminations
const yandereKillEvents = [
  { text: "{killer} pushes {name} off the school rooftop! SAYONARA!" },
  { text: "{killer} poisons {name}'s drink at the cultural festival!" },
  { text: "{killer} runs over {name} with their motorcycle! VROOM!" },
  { text: "{killer} stabs {name} with scissors in the art room!" },
  { text: "{killer} drowns {name} in the school swimming pool!" },
  { text: "{killer} pushes {name} in front of an oncoming train!" },
  { text: "{killer} hits {name} over the head with a baseball bat!" },
  { text: "{killer} electrocutes {name} with faulty lab equipment!" }
];

// --- BUTTON SETUP ---
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn").addEventListener("click", startGame);
  document.getElementById("nextBtn").addEventListener("click", nextStep);
  document.getElementById("resetBtn").addEventListener("click", reset);

  document.getElementById("nextBtn").disabled = true;
});

// --- START GAME ---
function startGame() {
  const input = document.getElementById("nameInput").value.trim();

  students = input.split(/\r?\n/)
    .map(s => s.trim())
    .filter(s => s !== "");

  if (students.length < 2) {
    alert("You need at least 2 students.");
    return;
  }

  round = 0;
  step = -1;

  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";

  document.getElementById("nextBtn").textContent = "Continue";
  document.getElementById("nextBtn").disabled = false;

  nextStep();
}

// --- MAIN GAME LOOP ---
function nextStep() {
  const screen = document.getElementById("currentScreen");

  // Winner check
  if (students.length === 1) {
    screen.innerHTML = `<h2>${escapeHtml(students[0])} WINS the School Battle Royale!</h2>`;
    document.getElementById("nextBtn").disabled = true;
    return;
  } else if (students.length === 0) {
    screen.innerHTML = `<h2>No students remain.</h2>`;
    document.getElementById("nextBtn").disabled = true;
    return;
  }

  // Intro
  if (step === -1) {
    screen.innerHTML = `<h2>School Intro</h2><p>The semester begins... drama is in the air.</p>`;
    document.getElementById("nextBtn").textContent = "Next";
    step = 0;
    return;
  }

  // Show students
  if (step === 0) {
    round++;
    screen.innerHTML = `
      <h2>Day ${round}</h2>
      <p><strong>${students.length} students remain:</strong></p>
      <p>${students.map(escapeHtml).join(", ")}</p>
    `;

    generateEvents();
    document.getElementById("nextBtn").textContent = "Show Events";
    step = 1;
    return;
  }

  // Show events
  if (step === 1) {
    screen.innerHTML = `<h2>Day ${round}</h2>`;

    currentEvents.forEach(e => {
      screen.innerHTML += `<p>${escapeHtml(e.text)}</p>`;
    });

    generateDeaths();
    document.getElementById("nextBtn").textContent = "Show Eliminations";
    step = 2;
    return;
  }

  // Show deaths
  if (step === 2) {
    screen.innerHTML = `<h2>Day ${round}</h2>`;

    currentDeaths.forEach(d => {
      screen.innerHTML += `<p><strong>${escapeHtml(d.text)}</strong></p>`;
    });

    document.getElementById("nextBtn").textContent = "Next Day";
    step = 0;

    if (students.length <= 1) {
      if (students.length === 1) {
        screen.innerHTML += `<h2>${escapeHtml(students[0])} WINS the School Battle Royale!</h2>`;
      } else {
        screen.innerHTML += `<h2>No students remain.</h2>`;
      }
      document.getElementById("nextBtn").disabled = true;
    }
  }
}

// --- EVENT GENERATION ---
function generateEvents() {
  currentEvents = [];
  let n = students.length;
  let numEvents = n <= 3 ? 1 : n <= 6 ? 2 : n <= 10 ? 3 : n <= 15 ? 4 : 5;
  if (n > 20) numEvents = 6;
  if (n > 30) numEvents = 7;

  for (let i = 0; i < numEvents; i++) {
    const person = students[Math.floor(Math.random() * students.length)];
    const event = schoolEvents[Math.floor(Math.random() * schoolEvents.length)];
    currentEvents.push({
      text: event.text.replace("{name}", person),
      img: ""
    });
  }
}

// --- DEATH GENERATION ---
function generateDeaths() {
  currentDeaths = [];
  let maxDeaths = Math.min(3, students.length - 1);
  let numDeaths = Math.floor(Math.random() * (maxDeaths + 1));

  for (let i = 0; i < numDeaths; i++) {
    if (students.length <= 1) break;

    const deadIndex = Math.floor(Math.random() * students.length);
    const dead = students.splice(deadIndex, 1)[0];

    let event, text;

    if (Math.random() < 0.5 && students.length > 0) {
      event = yandereKillEvents[Math.floor(Math.random() * yandereKillEvents.length)];
      const killer = students[Math.floor(Math.random() * students.length)];
      text = event.text.replace("{name}", dead).replace("{killer}", killer);
    } else {
      event = tragicEvents[Math.floor(Math.random() * tragicEvents.length)];
      text = event.text.replace("{name}", dead);
    }

    currentDeaths.push({ text, img: "" });
  }
}

// --- RESET ---
function reset() {
  students = [];
  round = 0;
  step = 0;

  document.getElementById("setup").style.display = "block";
  document.getElementById("game").style.display = "none";
  document.getElementById("currentScreen").innerHTML = "";
  document.getElementById("nextBtn").textContent = "Start";
  document.getElementById("nextBtn").disabled = true;
  document.getElementById("nameInput").value = "";
}

// --- ESCAPE HTML ---
function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
