document.addEventListener("DOMContentLoaded", function(e){
  var wb = new WaveBox(75,0.1);
  document.querySelector("#wavebox").append(wb.render());

  document.addEventListener("mousemove",
    function(e) {wb.cursorX=e.x-10-wb.div.offsetLeft;wb.cursorY=e.y-130+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

   document.addEventListener("touchmove",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-wb.div.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-130+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

    document.addEventListener("touchstart",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-wb.div.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-130+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

    document.addEventListener("touchend",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-wb.div.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-130+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});



  
  setInterval( function() {
    for(var i=0; i<10; i++) {
      wb.stepForward();
      wb.c += 0.1;
    }
  }, 1);

  setInterval( function() {
    wb.update();
  },50);
});
