document.addEventListener("DOMContentLoaded", function(e){
  var wb = new WaveBox(75,0.01);
  document.querySelector("#wavebox").append(wb.render());

  document.addEventListener("mousemove",
    function(e) {wb.cursorX=e.x-10-wb.div.offsetLeft;wb.cursorY=e.y-130+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

 

  
  setInterval( function() {
    for(var i=0; i<100; i++) {
      wb.stepForward();
      wb.c += 0.1;
    }
  }, 1);

  setInterval( function() {
    wb.update();
  },50);
});
