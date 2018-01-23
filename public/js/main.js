

$(document).ready(function(){
   loadPreferences();
   resetTimer();
   audioBell.load();
   btnEnable(btnStop, false);
   btnEnable(btnReset, false);
   btnEnable(btnStart, true);
   $('.modal').modal();
   $('.collapsible').collapsible();
   updateHistoryDisplay();
 });

 //** REGISTRO DO SW ************************************************************
 if ('serviceWorker' in navigator) {
   navigator.serviceWorker
     .register('/service-worker.js')
     .then(function () {
       //console.log('Service worker registered!');
     })
     .catch(function(err) {
       console.log(err);
     });
 }
 //******************************************************************************
