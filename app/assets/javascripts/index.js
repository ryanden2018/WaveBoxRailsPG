
window.onload = function() {

var useGPUJS = true;


if(useGPUJS) {
  var gpu = new GPU();
  var canvas = document.querySelector("#wb");
  var innerbox = document.querySelector("#innerbox");
  var context = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  var dx = 1/(width/2);
  var dt = 0.5*dx*dx;
  var t = 0;
  var imgdata = context.createImageData(width,height);
  function absroot(x) {
    if(x<0) {
      return (-1)*Math.sqrt(Math.abs(x));
    } else {
      return Math.sqrt(x);
    }
  }


  var initImageKernel = gpu.createKernel(initImage)
    .setPipeline(true)
    .setOutput([width/2,width/2]);
  
  var initDimageKernel = gpu.createKernel(initDimage)
    .setPipeline(true)
    .setOutput([width/2,width/2]);
  
  var waveboxUpdateImageKernel = gpu.createKernel(waveboxUpdateImage)
    .setPipeline(true)
    .setImmutable(true)
    .setOutput([width/2,width/2])
  
  var waveboxUpdateDimageKernel = gpu.createKernel(waveboxUpdateDimage)
    .setPipeline(true)
    .setImmutable(true)
    .setOutput([width/2,width/2]);
  
  var image = initImageKernel();
  var Dimage = initDimageKernel();


  function buildImg() {
    for(var m = 0; m < 80; m++) {
      t += dt;
      var newImage = waveboxUpdateImageKernel(width/2,image,Dimage,t);
      var newDimage = waveboxUpdateDimageKernel(width/2,image,Dimage,t);
      image = newImage;
      Dimage = newDimage;
    }

    imageArray = image.toArray();

    for(var i=0; i<width; i++) {
      for(var j=0; j<width; j++) {
        var idx0 = (i*width+j)*4;
        //var val = Math.floor(Math.max(0.0,Math.min(1.0,0.5+7.5*absroot(imageArray[Math.floor(i/2)][Math.floor(j/2)]-0.5)))*255);
        var val = Math.floor(Math.max(0.0,Math.min(1.0,0.5+(imageArray[Math.floor(i/2)][Math.floor(j/2)]-0.5)))*255);
        imgdata.data[idx0] = Math.floor(val*53/255);
        imgdata.data[idx0+1] = Math.floor(val*224/255);
        imgdata.data[idx0+2] = Math.floor(val*255/255);
        imgdata.data[idx0+3] = 255;
      }
    }
  }


  function main(tf) {
    window.requestAnimationFrame(main);
    buildImg();
    context.putImageData(imgdata,0,0);

    // for(var l = 0; l < wb.barriers.length; l++) {
    //   var barrier = wb.barriers[l];
    //   context.beginPath();
    //   context.arc(2*barrier[0],2*barrier[1],2*barrier[2],0,2*Math.PI,false);
    //   context.fillStyle="orange";
    //   context.fill();
    // }
  }

  main(0);

}





if(!useGPUJS) {
  var canvas = document.querySelector("#wb");
  var innerbox = document.querySelector("#innerbox");
  var context = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  var wb = new WaveBox(width/2,1.0/1800);


  var imgdata = context.createImageData(width,height);

  function absroot(x) {
    if(x<0) {
      return (-1)*Math.sqrt(Math.abs(x));
    } else {
      return Math.sqrt(x);
    }
  }

  function buildImg() {
    wb.stepForward();
    for(var i=0; i<width; i++) {
      for(var j=0; j<width; j++) {
        var idx0 = (i*width+j)*4;
        var val = Math.floor(Math.max(0.0,Math.min(1.0,0.5+7.5*absroot(wb.image[ Math.floor(i/2)*wb.width+Math.floor(j/2) ]-0.5)))*255);
        imgdata.data[idx0] = Math.floor(val*53/255);
        imgdata.data[idx0+1] = Math.floor(val*224/255);
        imgdata.data[idx0+2] = Math.floor(val*255/255);
        imgdata.data[idx0+3] = 255;
      }
    }
  }

  document.addEventListener("mouseup",
  function(e) {
    wb.barriers.push([(e.x-innerbox.offsetLeft)/2,(e.y-200+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0))/2,20]);
  });

  document.addEventListener("mousemove",
    function(e) {
      wb.cursorX=e.x-10-innerbox.offsetLeft;
      wb.cursorY=e.y-200+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
     });

   document.addEventListener("touchmove",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-innerbox.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-200+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

    document.addEventListener("touchstart",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-innerbox.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-200+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

    document.addEventListener("touchend",
    function(e) {wb.cursorX=e.changedTouches[0].screenX-10-innerbox.offsetLeft;wb.cursorY=e.changedTouches[0].screenY-200+(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);});

  function main(tf) {
    window.requestAnimationFrame(main);
    buildImg();


    context.putImageData(imgdata,0,0);

    for(var l = 0; l < wb.barriers.length; l++) {
      var barrier = wb.barriers[l];
      context.beginPath();
      context.arc(2*barrier[0],2*barrier[1],2*barrier[2],0,2*Math.PI,false);
      context.fillStyle="orange";
      context.fill();
    }
  }

  main(0);
}
};
