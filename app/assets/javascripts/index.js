document.addEventListener("DOMContentLoaded", function(e){
  var wb = new WaveBox(75,.2);
  document.querySelector("#wavebox").append(wb.render());

  document.addEventListener("mousemove",
    function(e) {wb.cursorX=e.x-10-wb.div.offsetLeft;wb.cursorY=e.y-160+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

   document.addEventListener("touchmove",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-wb.div.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-160+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

    document.addEventListener("touchstart",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-wb.div.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-160+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

    document.addEventListener("touchend",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-wb.div.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-160+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});



  
  setInterval( function() {
      wb.stepForward();
      wb.c += 1;
  }, 60);

  setInterval( function() {
    wb.update();
  },50);
});
