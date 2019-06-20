function initImage() {
  return 0.5;
}

function initDimage() {
  return 0.0;
}

function waveboxUpdateImage(width,image,Dimage,t) {
  if((this.thread.x===0)||(this.thread.x===width-1)||(this.thread.y===0)||(this.thread.y===width-1)) {
    return 0.5;
  }

  if(Math.pow(this.thread.x-50,2)+Math.pow(this.thread.y-50,2)<5) {
    return 0.5+0.002*Math.sin(t/0.01);
  }

  var val = image[this.thread.y][this.thread.x];
  var Dval = Dimage[this.thread.y][this.thread.x];
  var dx = 1.0 / width;
  var dt = 0.25*dx*dx;
  return val + dt*Dval;
}

function waveboxUpdateDimage(width,image,Dimage,t) {
  if((this.thread.x===0)||(this.thread.x===width-1)||(this.thread.y===0)||(this.thread.y===width-1)) {
    return 0.0;
  }

  if(Math.pow(this.thread.x-50,2)+Math.pow(this.thread.y-50,2)<5) {
    return 0.0;
  }

  var dx = 1.0 / width;
  var dt = 0.25*dx*dx;
  var Dval = Dimage[this.thread.y][this.thread.x];
  var val = image[this.thread.y][this.thread.x];
  var valL = image[this.thread.y][this.thread.x-1];
  var valR = image[this.thread.y][this.thread.x+1];
  var valU = image[this.thread.y+1][this.thread.x];
  var valD = image[this.thread.y-1][this.thread.x];

  return Dval + (dt/(dx*dx))*(valL+valR+valU+valD-4.0*val) /* - dt*(Math.sin(2*Math.PI*t/0.04))*Math.exp((-200)*(Math.pow(this.thread.x-width/2,2)/(300*300)+Math.pow(this.thread.y-width/2,2)/(300*300)))*/ - 0.1*dt*Dval;
}

