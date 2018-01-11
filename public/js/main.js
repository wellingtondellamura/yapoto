var btnStart = document.getElementById("start");
var btnReset = document.getElementById("reset");
var btnContinue = document.getElementById("continue");
var btnStop = document.getElementById("stop");
var audioBell = document.getElementById("audioBell");
var btnPomodoro = document.getElementById("pomodoro");
var btnShortBreak = document.getElementById("shortBreak");
var btnLongBreak = document.getElementById("longBreak");


var DEFAULT_TICK = 20;
var POMODORO = 0;
var SHORT_BREAK = 1;
var LONG_BREAK = 2;

var timer = {
   value : new Date(),
   started : false,
   pomodoro : 25,
   shortBreak : 5,
   longBreak : 15,
   mode: POMODORO,
   max: function(){
      switch (this.mode) {
         case POMODORO: return this.pomodoro;
         case SHORT_BREAK: return this.shortBreak;
         case LONG_BREAK: return this.longBreak;
      }
   },
   maxMilliseconds: function(){return this.max()*60*1000;},
   getMilliseconds: function(){return this.getDiffMilliseconds() + this.maxMilliseconds(); },
   getDiffMilliseconds : function(){
      return this.value.getTime() - new Date().getTime()}
}

btnStart.addEventListener("click", function(){
   showContinue(false);
   startTimer();
   btnEnable(btnStop, true);
   btnEnable(btnReset, true);
   btnEnable(btnStart, false);
});

btnStop.addEventListener("click", function(){
   showContinue(true);
   stopTimer();
});

btnContinue.addEventListener("click", function(){
   showContinue(false);
   resumeTimer();
});

btnReset.addEventListener("click", function(){
   showContinue(false);
   resetTimer();
   btnEnable(btnStop, false);
   btnEnable(btnReset, false);
   btnEnable(btnStart, true);
});

btnPomodoro.addEventListener("click", function(){
   btnActivate(this);
   timer.mode = POMODORO;
   resetTimer();
});

btnShortBreak.addEventListener("click", function(){
   btnActivate(this);
   timer.mode = SHORT_BREAK;
   resetTimer();
});

btnLongBreak.addEventListener("click", function(){
   btnActivate(this);
   timer.mode = LONG_BREAK;
   resetTimer();
});

function btnActivate(btn) {
   btnPomodoro.classList.remove("is-active");
   btnShortBreak.classList.remove("is-active");
   btnLongBreak.classList.remove("is-active");
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

function showContinue(b){
   if (b){
         btnContinue.style.visibility = "visible";
         btnContinue.style.display = "inline";
         btnStop.style.visibility = "hidden";
         btnStop.style.display = "none";
   }else{
         btnContinue.style.visibility = "hidden";
         btnContinue.style.display = "none";
         btnStop.style.visibility = "visible";
         btnStop.style.display = "inline";
   }
}

function startTimer(){
   timer.value = new Date();
   timer.started = true;
   tick();
}

function stopTimer(){
   timer.started = false;
}

function resumeTimer(){
   timer.started = true;
   tick();
}

function resetTimer(){
   timer.started = false;
   timer.value = new Date();
   setTimeout(function(){updateTimer(timer.maxMilliseconds());}, DEFAULT_TICK*2);
}

function tick(){
   if (!timer.started) {
      return;
   }
   setTimeout(tick, DEFAULT_TICK);
   updateTimer(timer.getMilliseconds());
   if (timer.getMilliseconds() <= DEFAULT_TICK){
      audioBell.play();
      timer.started = false;
      updateTimer(0);
   }
}

function updateTimer(m){
   var mil = m % 1000;
   var s = Math.floor(m / 1000);
   var sec = s % 60;
   var min = Math.floor(s / 60);
   var displayT = document.getElementById("displayT");
   var displayM = document.getElementById("displayM");
   displayT.innerText = min.pad(2) + ":" + sec.pad(2);
   displayM.innerText = mil.pad(3);
}

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

resetTimer();
audioBell.load();
btnEnable(btnStop, false);
btnEnable(btnReset, false);
btnEnable(btnStart, true);
