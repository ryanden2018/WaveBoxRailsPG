function WaveBox(width,dt) {
  
  this.width = width;
  this.image = [];
  this.Dimage = [];
  this.barriers = [];
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
    for(var l = 0; l < this.barriers.length; l++) {
      var barrier = this.barriers[l];
      var dist = Math.sqrt(Math.pow(j-barrier[0],2)+Math.pow(i-barrier[1],2));
      if(dist < barrier[2]) {
        return true;
      }
    }
    
    return false;
  }

  this.nearCursor = function(i,j) {
    return  Math.pow(this.pxSz()*i-this.cursorY,2)+Math.pow(this.pxSz()*j-this.cursorX,2) < 20;
    
  }
  

  this.pxSz = function() { return 2; }

  this.idx = function(i,j) { 
    return this.width*i+j;
  }

  this.sgn = function(x) {
    if(x<0) {
      return -1;
    } else {
      return 1;
    }
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
          this.image[this.idx(i,j)] = 0.5;
        } else if ( this.nearCursor(i,j) ) {
          var value = 0.5 - 0.005*Math.sin(2*Math.PI*this.c/50);
          Mat.push(value);
          Mat2.push(0.0);
          BMat.push(value);
          BMat2.push(0.0);
          this.image[this.idx(i,j)] = value;
        } else {
          var idx = this.idx(i,j);
          Mat.push(this.image[idx]);
          Mat2.push(
            this.Dimage[idx]-0.1*this.dt*this.Dimage[idx]
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
          if((!this.inBarrier(i,j)) && (!this.nearCursor(i,j))){
            var idx = this.idx(i,j);
            var idxU = this.idx(i-1,j);
            var idxD = this.idx(i+1,j);
            var idxL = this.idx(i,j-1);
            var idxR = this.idx(i,j+1);
            BMat[idx] = Mat2[idx]*this.dt;
            BMat2[idx] = this.dt*4*(this.width)*(this.width)*(Mat[idxU]+Mat[idxD]+Mat[idxL]+Mat[idxR]-4*Mat[idx]);
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
            if(this.inBarrier(i,j) || this.nearCursor(i,j)){
              Mat[this.idx(i,j)] = 0;
              BMat[this.idx(i,j)] = 0;
            }
          }
        }
        
      }

      for(var i=1; i<this.width-1; i++) {
        for(var j=1; j<this.width-1; j++) {
          if(!this.inBarrier(i,j) && !this.nearCursor(i,j)){
            var idx = this.idx(i,j);
            var idxU = this.idx(i-1,j);
            var idxD = this.idx(i+1,j);
            var idxL = this.idx(i,j-1);
            var idxR = this.idx(i,j+1);
            Mat[idx] = BMat2[idx]*this.dt;
            Mat2[idx] = this.dt*4*(this.width)*(this.width)*(BMat[idxU]+BMat[idxD]+BMat[idxL]+BMat[idxR]-4*BMat[idx]);
            this.image[idx] += Mat[idx];
            this.Dimage[idx] += Mat2[idx];
          }
        }
      }
    }


  }
}
