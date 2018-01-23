var DEFAULT_TICK = 20;
var POMODORO = 0;
var SHORT_BREAK = 1;
var LONG_BREAK = 2;


var pomodoroHistory = {
   items : new Array(),
   pomodoro : 0,
   shortBreak : 0,
   longBreak : 0
};

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
      addHistory();
      updateHistoryDisplay();
      timer.nextState();
      btnActivate();
      timer.started = false;
      updateTimer(0);
      btnEnable(btnStop, false);
      btnEnable(btnReset, false);
      btnEnable(btnStart, true);
   }
}


function addHistory(){
   var entry = {
      startTime : timer.value,
      endTime : new Date(),
      mode : timer.mode,
      size : timer.max()
   };

   pomodoroHistory.items.push(entry);
   if (timer.mode == POMODORO) pomodoroHistory.pomodoro++;
   if (timer.mode == SHORT_BREAK) pomodoroHistory.shortBreak++;
   if (timer.mode == LONG_BREAK) pomodoroHistory.longBreak++;
}


function getName(mode) {
   switch (mode) {
      case POMODORO: return "pomodoro";
      case SHORT_BREAK: return "short break";
      case LONG_BREAK: return "long break";
   }
   return "";
}
