//document.addEventListener("DOMContentLoaded", function(e){
window.onload = function() {
  //document.querySelector("#wavebox").append(wb.render());


  var canvas = document.querySelector("#wb");
  var context = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  var wb = new WaveBox(width,.2);

  var imgdata = context.createImageData(width,height);

  function buildImg() {
    wb.stepForward();
    for(var i=0; i<width; i++) {
      for(var j=0; j<width; j++) {
        var idx0 = (i*width+j)*4;
        var val = Math.floor(Math.max(0.0,Math.min(1.0,wb.image[i*width+j]))*255);
        imgdata.data[idx0] = val;
        imgdata.data[idx0+1] = val;
        imgdata.data[idx0+2] = val;
        imgdata.data[idx0+3] = 255;
      }
    }
  }

  document.addEventListener("mousemove",
    function(e) {wb.cursorX=e.x-10-canvas.offsetLeft;wb.cursorY=e.y-160+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

   document.addEventListener("touchmove",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-canvas.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-160+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

    document.addEventListener("touchstart",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-canvas.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-160+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

    document.addEventListener("touchend",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-canvas.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-160+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});



  
  /*setInterval( function() {
      wb.stepForward();
      wb.c += 1;
  }, 60);

  setInterval( function() {
    wb.update();
  },50);*/

  function main(tf) {
    window.requestAnimationFrame(main);
    buildImg();
    context.putImageData(imgdata,0,0);
  }

  main(0);
};
