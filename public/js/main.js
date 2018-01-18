var btnStart = document.getElementById("start");
var btnReset = document.getElementById("reset");
var btnContinue = document.getElementById("continue");
var btnStop = document.getElementById("stop");
var audioBell = document.getElementById("audioBell");
var audioTick = document.getElementById("audioTick");
var btnPomodoro = document.getElementById("pomodoro");
var btnShortBreak = document.getElementById("shortBreak");
var btnLongBreak = document.getElementById("longBreak");

var btnConfig = document.getElementById("config");
var btnRestoreConfig = document.getElementById("restoreConfig");
var btnSaveConfig = document.getElementById("saveConfig");
var btnCloseConfig = document.getElementById("closeConfig");
var inputPomodoro = document.getElementById("inputPomodoro");
var inputShortBreak = document.getElementById("inputShortBreak");
var inputLongBreak = document.getElementById("inputLongBreak");

var chkTick = document.getElementById("chkTick");
var chkFinish = document.getElementById("chkFinish");


var lnDisclaimer = document.getElementById("lnDisclaimer");

var DEFAULT_TICK = 20;
var POMODORO = 0;
var SHORT_BREAK = 1;
var LONG_BREAK = 2;

var timer = {
   value : new Date(),
   timeStop : new Date(),
   sound : {
      tick : true,
      tickSound : 'tick-tock.mp3',
      finish : true,
      finishSound : 'shipbell.mp3'
   },
   state : 0,
   sequence: [POMODORO, SHORT_BREAK, POMODORO, SHORT_BREAK, POMODORO, SHORT_BREAK, POMODORO, LONG_BREAK],
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
   getDiffMilliseconds : function(){return this.value.getTime() - new Date().getTime()},
   nextState(){
      if (this.state < this.sequence.length-1) { this.state++;} else {this.state = 0;}
      this.mode = this.sequence[this.state];
   }
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
   timer.mode = POMODORO;
   btnActivate();
   btnReset.click();
   resetTimer();
});

btnShortBreak.addEventListener("click", function(){
   timer.mode = SHORT_BREAK;
   btnActivate();
   btnReset.click();
   resetTimer();
});

btnLongBreak.addEventListener("click", function(){
   timer.mode = LONG_BREAK;
   btnActivate();
   btnReset.click();
   resetTimer();
});

btnRestoreConfig.addEventListener("click", function(){
   inputPomodoro.value = 25;
   inputLongBreak.value = 15;
   inputShortBreak.value = 5;
   chkTick.checked = true;
   chkFinish.checked = true;
});


btnConfig.addEventListener("click", function(){
   inputPomodoro.value = timer.pomodoro;
   inputLongBreak.value = timer.longBreak;
   inputShortBreak.value = timer.shortBreak;
   chkTick.checked = timer.sound.tick;
   chkFinish.checked = timer.sound.finish;
   $('#modalConfig').modal('open');
});

btnCloseConfig.addEventListener("click", function(){
   $('#modalConfig').modal('close');
});

btnSaveConfig.addEventListener("click", function(){
   timer.pomodoro = inputPomodoro.value;
   timer.longBreak = inputLongBreak.value;
   timer.shortBreak = inputShortBreak.value;
   timer.sound.tick = chkTick.checked;
   timer.sound.finish = chkFinish.checked;
   savePreferences();
   $('#modalConfig').modal('close');
   btnReset.click();
   resetTimer();
});

lnDisclaimer.addEventListener("click", function() {
   $('#modalDisclaimer').modal('open');
});

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

function tickSound(s){
   if (s && timer.sound.tick) {
      audioTick.loop = true;
      audioTick.play();
   } else {
      audioTick.pause();
   }

}

function startTimer(){
   timer.started = true;
   timer.value = new Date();
   tick();
   tickSound(true);
}

function stopTimer(){
   tickSound(false);
   timer.started = false;
   timer.timeStop = new Date();
}

function resumeTimer(){
   timer.started = true;
   var resume = (new Date()).getTime() - timer.timeStop.getTime();
   timer.value = new Date(timer.value.getTime() + resume);
   tickSound(true);
   tick();
}

function resetTimer(){
   timer.started = false;
   timer.value = new Date();
   setTimeout(function(){updateTimer(timer.maxMilliseconds());}, DEFAULT_TICK*2);
   tickSound(false);
}

function tick(){
   if (!timer.started) {
      return;
   }
   setTimeout(tick, DEFAULT_TICK);
   updateTimer(timer.getMilliseconds());
   if (timer.getMilliseconds() <= DEFAULT_TICK){
      audioTick.pause();
      if (timer.sound.finish){
            audioBell.play();
      }
      timer.nextState();
      btnActivate();
      timer.started = false;
      updateTimer(0);
      btnEnable(btnStop, false);
      btnEnable(btnReset, false);
      btnEnable(btnStart, true);
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

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

$(document).ready(function(){
   loadPreferences();
   resetTimer();
   audioBell.load();
   btnEnable(btnStop, false);
   btnEnable(btnReset, false);
   btnEnable(btnStart, true);
   $('.modal').modal();
 });
