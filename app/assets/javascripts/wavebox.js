function WaveBox(width,dt) {
  
  this.width = width;
  this.image = [];
  this.Dimage = [];
  this.dt = dt;
  this.cursorX = Math.round(width/2);
  this.cursorY = Math.round(width/2);
  this.div = document.createElement("div");
  this.c = 0;
  for(var i=0; i<this.width; i++) {
    for(var j=0; j<this.width; j++) {
      this.image.push(0.5);
      this.Dimage.push(0.0);
    }
  }
  

  this.pxSz = function() { return 6; }

  this.idx = function(i,j) { 
    return this.width*i+j;
  }

  this.pxDivStyle = function(i,j,color) {
    return "position:absolute;background:"+color+";top:"+(this.pxSz()*i)+"px;left:"+(this.pxSz()*j)+"px;width:"+(this.pxSz())+"px;height:"+(this.pxSz())+"px;";
  }

  this.color = function(val) {
    let normVal = ""+Math.max(0,Math.min(255,Math.round(val*255)));
    return "rgb("+normVal+","+normVal+","+normVal+")";
  }

  // only call render() once per instance, see update()
  this.render = function() {
    for(var i=0; i<this.width; i++) {
      for(var j=0; j<this.width; j++) {
        var idx = this.idx(i,j);
        var pxDiv = document.createElement("div");
        pxDiv.style = this.pxDivStyle(i,j,this.color(this.image[idx]));
        this.div.append(pxDiv);
      }
    }
    this.div.style="position:relative;margin:auto;width:"+(this.pxSz()*this.width)+"px;";
    return this.div;
  }

  // call update() as many times as desired after render() has been called
  this.update = function() {
    for(var i=0; i<this.width; i++) {
      for(var j=0; j<this.width; j++) {
        var idx = this.idx(i,j);
        this.div.children[idx].style.background = this.color(this.image[idx]);
      }
    }
  }

  // step forward the physical model
  this.stepForward = function() {
    for(var i=1; i<this.width-1; i++) {
      for(var j=1; j<this.width-1; j++) {
        var idx = this.idx(i,j);
        var idxU = this.idx(i-1,j);
        var idxD = this.idx(i+1,j);
        var idxL = this.idx(i,j-1);
        var idxR = this.idx(i,j+1);
        this.image[idx] += this.Dimage[idx]*this.dt;
        this.Dimage[idx] += (this.image[idxU]+this.image[idxD]+
          this.image[idxL]+this.image[idxR]-4*this.image[idx]) * this.dt +
           this.dt*(Math.sin(this.c/10))*Math.exp((-10)*((this.pxSz()*i-this.cursorY)**2/50**2+(this.pxSz()*j-this.cursorX)**2/50**2)) -
           this.dt*0.025*this.Dimage[idx];
      }
    }
  }
}
