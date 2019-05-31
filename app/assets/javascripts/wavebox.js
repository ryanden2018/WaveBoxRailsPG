function WaveBox(width,dt) {
  
  this.width = width;
  this.image = [];
  this.Dimage = [];
  this.dt = dt;
  this.cursorX = Math.round(8*width/2);
  this.cursorY = Math.round(8*width/2);
  this.div = document.createElement("div");
  this.divchildren = [];
  this.c = 0;
  for(var i=0; i<this.width; i++) {
    for(var j=0; j<this.width; j++) {
      this.image.push(0.5);
      this.Dimage.push(0.0);
    }
  }
  

  this.pxSz = function() { return 8; }

  this.idx = function(i,j) { 
    return this.width*i+j;
  }

  this.pxDivStyle = function(i,j,color) {
    return "position:absolute;background:"+color+";top:"+(this.pxSz()*i)+"px;left:"+(this.pxSz()*j)+"px;width:"+(this.pxSz())+"px;height:"+(this.pxSz())+"px;";
  }

  this.color = function(val) {
    var normVal = ""+Math.max(0,Math.min(255,Math.round(val*255)));
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
        this.divchildren.push(pxDiv);
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
        this.divchildren[idx].style.background = this.color(this.image[idx]);
      }
    }
  }

  // step forward the physical model
 /* this.stepForward = function() {
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
           this.dt*(Math.sin(this.c/10))*Math.exp((-10)*(Math.pow(this.pxSz()*i-this.cursorY,2)/(50*50)+Math.pow(this.pxSz()*j-this.cursorX,2)/(50*50))) -
           this.dt*0.025*this.Dimage[idx];
      }
    }
  } */



  // step forward the physical model
  this.stepForward = function() {

    var Mat = [];
    var Mat2 = [];
    var BMat = [];
    var BMat2 = [];

    for(var i=0; i<this.width; i++) {
      for(var j=0; j<this.width; j++) {
        if((i===0)||(j===0)||(i===this.width-1)||(j===this.width-1)) {
          Mat.push(0.5);
          Mat2.push(0.0);
          BMat.push(0.5);
          BMat2.push(0.0);
        } else {
          var idx = this.idx(i,j);
          Mat.push(this.image[idx]);
          Mat2.push(
            this.Dimage[idx]
            +this.dt*(Math.sin(this.c/10))*Math.exp((-10)*(Math.pow(this.pxSz()*i-this.cursorY,2)/(50*50)+Math.pow(this.pxSz()*j-this.cursorX,2)/(50*50))) -
           this.dt*0.025*this.Dimage[idx]
          );
          BMat.push(Mat[idx]);
          BMat2.push(Mat2[idx]);
          this.Dimage[idx] = Mat2[idx];
        }
      }
    }

    for(var k=0; k<5; k++) {
      for(var i=1; i<this.width-1; i++) {
        for(var j=1; j<this.width-1; j++) {
          var idx = this.idx(i,j);
          var idxU = this.idx(i-1,j);
          var idxD = this.idx(i+1,j);
          var idxL = this.idx(i,j-1);
          var idxR = this.idx(i,j+1);
          BMat[idx] = Mat2[idx]*this.dt;
          BMat2[idx] = this.dt*(Mat[idxU]+Mat[idxD]+Mat[idxL]+Mat[idxR]-4*Mat[idx]);
          this.image[idx] += BMat[idx];
          this.Dimage[idx] += BMat2[idx];
        }
      }

      for(var i=1; i<this.width-1; i++) {
        for(var j=1; j<this.width-1; j++) {
          var idx = this.idx(i,j);
          var idxU = this.idx(i-1,j);
          var idxD = this.idx(i+1,j);
          var idxL = this.idx(i,j-1);
          var idxR = this.idx(i,j+1);
          Mat[idx] = BMat2[idx]*this.dt;
          Mat2[idx] = this.dt*(BMat[idxU]+BMat[idxD]+BMat[idxL]+BMat[idxR]-4*BMat[idx]);
          this.image[idx] += Mat[idx];
          this.Dimage[idx] += Mat2[idx];
        }
      }
    }


  }
}
