
function btnActivate() {
   btnPomodoro.classList.remove("is-active");
   btnShortBreak.classList.remove("is-active");
   btnLongBreak.classList.remove("is-active");
   switch (timer.mode) {
      case POMODORO: btn = btnPomodoro; break;
      case SHORT_BREAK: btn = btnShortBreak; break;
      case LONG_BREAK: btn = btnLongBreak; break;
   }
   btn.classList.add("is-active");
}

function btnEnable(btn, b) {
   if (b) {
      btn.classList.add("btn-enabled");
      btn.classList.remove("btn-disabled");
   } else {
      btn.classList.remove("btn-enabled");
      btn.classList.add("btn-disabled");
   }
   btn.disabled = !b;
}


function savePreferences() {
   localStorage.setItem("timer.pomodoro", timer.pomodoro);
   localStorage.setItem("timer.shortBreak", timer.shortBreak);
   localStorage.setItem("timer.longBreak", timer.longBreak);
   localStorage.setItem("timer.sound.tick", timer.sound.tick);
   localStorage.setItem("timer.sound.finish", timer.sound.finish);
}

function loadPreferences() {
   if (!localStorage.getItem("timer.pomodoro")) {
         savePreferences();
         return;
   }
   timer.pomodoro = localStorage.getItem("timer.pomodoro");
   timer.shortBreak = localStorage.getItem("timer.shortBreak");
   timer.longBreak = localStorage.getItem("timer.longBreak");
   timer.sound.tick = localStorage.getItem("timer.sound.tick");
   timer.sound.finish = localStorage.getItem("timer.sound.finish");
}

function loadPomodoroHistory(){
   pomodoroHistory.pomodoro = localStorage.getItem("pomodoroHistory.pomodoro");
   pomodoroHistory.shortBreak = localStorage.getItem("pomodoroHistory.shortBreak");
   pomodoroHistory.longBreak = localStorage.getItem("pomodoroHistory.longBreak");
}

function savePomodoroHistory(){
   localStorage.setItem("pomodoroHistory.pomodoro", pomodoroHistory.pomodoro);
   localStorage.setItem("pomodoroHistory.shortBreak", pomodoroHistory.shortBreak);
   localStorage.setItem("pomodoroHistory.longBreak", pomodoroHistory.longBreak);
}

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}
