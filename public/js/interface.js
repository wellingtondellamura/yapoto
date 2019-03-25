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
var btnSoundOn = document.getElementById("soundOn");
var btnSoundOff = document.getElementById("soundOff");
// var btnShowHistory = document.getElementById("showHistory");
var btnRestoreConfig = document.getElementById("restoreConfig");
var btnSaveConfig = document.getElementById("saveConfig");
var btnCloseConfig = document.getElementById("closeConfig");
var inputPomodoro = document.getElementById("inputPomodoro");
var inputShortBreak = document.getElementById("inputShortBreak");
var inputLongBreak = document.getElementById("inputLongBreak");

var chkTick = document.getElementById("chkTick");
var chkFinish = document.getElementById("chkFinish");


var lnDisclaimer = document.getElementById("lnDisclaimer");


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

// btnShowHistory.addEventListener("click", function(){
//    var historyPanel = document.getElementById("historyPanel");
//    if (historyPanel.style.visibility != "hidden"){
//       historyPanel.style.visibility = "hidden";
//       historyPanel.style.display = "none";
//    } else {
//       historyPanel.style.visibility = "visible";
//       historyPanel.style.display = "block";
//    }
// });

btnSoundOn.addEventListener("click", function(){
   btnSoundOn.style.visibility = "hidden";
   btnSoundOn.style.display = "none";
   btnSoundOff.style.visibility = "visible";
   btnSoundOff.style.display = "inline";
   audioTick.volume = 1;
   audioBell.volume = 1;
});

btnSoundOff.addEventListener("click", function(){
      btnSoundOff.style.visibility = "hidden";
      btnSoundOff.style.display = "none";
      btnSoundOn.style.visibility = "visible";
      btnSoundOn.style.display = "inline";
      audioTick.volume = 0;
      audioBell.volume = 0;
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


function updateHistoryDisplay(){
   var displayPomodoros = document.getElementById("displayPomodoros");
   var displayShortBreaks = document.getElementById("displayShortBreaks");
   var displayLongBreaks = document.getElementById("displayLongBreaks");
   var displayHistory = document.getElementById("displayHistory");
   displayPomodoros.innerText = pomodoroHistory.pomodoro;
   displayShortBreaks.innerText = pomodoroHistory.shortBreak;
   displayLongBreaks.innerText = pomodoroHistory.longBreak;

   if (displayHistory.tBodies[0]) displayHistory.tBodies[0].remove();
   var b = displayHistory.createTBody();
   for (i = 0; i<pomodoroHistory.items.length; i++){
       var row = b.insertRow();
       var cell1 = row.insertCell(0);
       var cell2 = row.insertCell(1);
       var cell3 = row.insertCell(2);
       var r = pomodoroHistory.items[i];
       cell1.innerHTML = r.startTime.toString();
       cell2.innerHTML = getName(r.mode);
       cell3.innerHTML = r.size;
   }

}
