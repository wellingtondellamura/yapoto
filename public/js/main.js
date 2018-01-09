var btnStart = document.getElementById("start");
var btnReset = document.getElementById("reset");
var btnStop = document.getElementById("stop");
var timer = {
   value : new Date(),
   started : false,
   pomodoro : 25,
   shortBreak : 5,
   longBreak : 15,
   getMilliseconds : function(){return this.value.getTime() - new Date().getTime()}
}

btnStart.addEventListener("click", function(){
   startTimer();
});

btnStop.addEventListener("click", function(){
   stopTimer();
});

btnReset.addEventListener("click", function(){
   resetTimer();
});

function startTimer(){
   timer.value = new Date();
   timer.started = true;
   t = setTimeout(tick, 1);
}

function stopTimer(){
   timer.started = false;
}

function resetTimer(){
   timer.started = false;
   timer.value = new Date();
   setTimeout(function(){updateTimer(0);}, 10);
}

function tick(){
   if (timer.started) {
      setTimeout(tick, 1);
   }
   updateTimer(timer.getMilliseconds());
}

function updateTimer(m){
   m = m + 25*60*1000;
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
