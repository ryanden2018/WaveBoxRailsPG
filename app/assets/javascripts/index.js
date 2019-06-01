
window.onload = function() {


  var canvas = document.querySelector("#wb");
  var innerbox = document.querySelector("#innerbox");
  var context = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  var wb = new WaveBox(width/2,.2);

  var imgdata = context.createImageData(width,height);

  function buildImg() {
    wb.stepForward();
    for(var i=0; i<width; i++) {
      for(var j=0; j<width; j++) {
        var idx0 = (i*width+j)*4;
        var val = Math.floor(Math.max(0.0,Math.min(1.0,0.5+0.05*(wb.image[ Math.floor(i/2)*wb.width+Math.floor(j/2) ]-0.5)))*255);
        imgdata.data[idx0] = val;
        imgdata.data[idx0+1] = val;
        imgdata.data[idx0+2] = val;
        imgdata.data[idx0+3] = 255;
      }
    }
  }

  document.addEventListener("mousemove",
    function(e) {wb.cursorX=e.x-10-innerbox.offsetLeft;wb.cursorY=e.y-160+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

   document.addEventListener("touchmove",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-innerbox.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-160+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

    document.addEventListener("touchstart",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-innerbox.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-160+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

    document.addEventListener("touchend",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-innerbox.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-160+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

  function main(tf) {
    window.requestAnimationFrame(main);
    buildImg();
    context.putImageData(imgdata,0,0);
  }

  main(0);
};
