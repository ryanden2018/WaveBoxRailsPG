function WaveBox(width,dt) {
  
  this.width = width;
  this.image = [];
  this.Dimage = [];
  this.hbarriers = [[[100,100],[100,200]]];
  this.vbarriers = [];
  this.dt = dt;
  this.cursorX = Math.round(width);
  this.cursorY = Math.round(width);
  this.c = 0;
  for(var i=0; i<this.width; i++) {
    for(var j=0; j<this.width; j++) {
      this.image.push(0.5);
      this.Dimage.push(0.0);
    }
  }

  this.inBarrier = function(i,j) {
    for(var l = 0; l < this.hbarriers.length; l++) {
      var barrier = this.hbarriers[l];
      if((i === barrier[0][0]) && (barrier[0][1] < j) && (j < barrier[1][1])) {
        return true;
      }
    }
    
    for(var l = 0; l < this.vbarriers.length; l++) {
      var barrier = this.vbarriers[l];
      if((j === barrier[0][1]) && (barrier[0][0] < i) && (i < barrier[1][0])) {
        return true;
      }
    }
    return false;
  }
  

  this.pxSz = function() { return 2; }

  this.idx = function(i,j) { 
    return this.width*i+j;
  }



  // step forward the physical model
  this.stepForward = function() {
    this.c += 1;
    var Mat = [];
    var Mat2 = [];
    var BMat = [];
    var BMat2 = [];

    for(var i=0; i<this.width; i++) {
      for(var j=0; j<this.width; j++) {
        if((i===0)||(j===0)||(i===this.width-1)||(j===this.width-1)||this.inBarrier(i,j)) {
          Mat.push(0.5);
          Mat2.push(0.0);
          BMat.push(0.5);
          BMat2.push(0.0);
        } else {
          var idx = this.idx(i,j);
          Mat.push(this.image[idx]);
          Mat2.push(
            this.Dimage[idx]
            +10*this.dt*(Math.sin(this.c/10))*Math.exp((-80)*(Math.pow(this.pxSz()*i-this.cursorY,2)/(50*50)+Math.pow(this.pxSz()*j-this.cursorX,2)/(50*50))) -
           this.dt*0.01*this.Dimage[idx]
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
          if(!this.inBarrier(i,j)){
            var idx = this.idx(i,j);
            var idxU = this.idx(i-1,j);
            var idxD = this.idx(i+1,j);
            var idxL = this.idx(i,j-1);
            var idxR = this.idx(i,j+1);
            BMat[idx] = Mat2[idx]*this.dt;
            BMat2[idx] = this.dt*2*(Mat[idxU]+Mat[idxD]+Mat[idxL]+Mat[idxR]-4*Mat[idx]);
            this.image[idx] += BMat[idx];
            this.Dimage[idx] += BMat2[idx];
          }
        }
      }

      if(k===0) {
        for(var i=0; i<this.width; i++) {
          var idx = this.idx(i,0);
          Mat[idx] = 0;
          BMat[idx]=0;
          var idx=this.idx(i,this.width-1);
          Mat[idx] = 0;
          BMat[idx] = 0;
        }

        for(var j=0; j<this.width; j++) {
          var idx = this.idx(0,j);
          Mat[idx] = 0;
          BMat[idx] = 0;
          var idx  = this.idx(this.width-1,j);
          Mat[idx] = 0;
          BMat[idx] = 0;
        }

        for(var i=0; i<this.width; i++) {
          for(var j=0; j<this.width; j++) {
            if(this.inBarrier(i,j)){
              Mat[this.idx(i,j)] = 0;
              BMat[this.idx(i,j)] = 0;
            }
          }
        }
        
      }

      for(var i=1; i<this.width-1; i++) {
        for(var j=1; j<this.width-1; j++) {
          if(!this.inBarrier(i,j)){
            var idx = this.idx(i,j);
            var idxU = this.idx(i-1,j);
            var idxD = this.idx(i+1,j);
            var idxL = this.idx(i,j-1);
            var idxR = this.idx(i,j+1);
            Mat[idx] = BMat2[idx]*this.dt;
            Mat2[idx] = this.dt*2*(BMat[idxU]+BMat[idxD]+BMat[idxL]+BMat[idxR]-4*BMat[idx]);
            this.image[idx] += Mat[idx];
            this.Dimage[idx] += Mat2[idx];
          }
        }
      }
    }


  }
}
