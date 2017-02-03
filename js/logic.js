  console.log("logic linked");


  function MovingMen (x, y, width, direction){
    this.direction = direction;
    this.status = 'flying';
    this.body = createArray(x, y, width);
  }

  function StillMen(x, y, width){
    this.body = createArray(x, y, width);
  }

  function createArray (x, y, width){
    var array = [];
    for (var i = 0; i < width; i++) {
      array.push(new Position((x+i), y));
    }
    return array;
  }

  function Position (xCoord, yCoord) {
    this.x = xCoord;
    this.y = yCoord;
  }

  MovingMen.prototype.turnLeft = function(){
    if (this.direction === 'right') {
      this.direction = 'left';
    }
  };

  MovingMen.prototype.turnRight = function(){
    if (this.direction === 'left') {
      this.direction = 'right';
    }
  };

  MovingMen.prototype.drop = function(){
    this.status = 'drop';
  };

  MovingMen.prototype.move = function(maxRows){
    var head = this.direction === 'left' ? this.body[0] : this.body[this.body.length-1];
    var tail = this.direction === 'left' ? this.body[this.body.length-1] : this.body[0];
    switch (this.direction) {
      case 'right':
          head = this.body[this.body.length-1];
          this.body.push( {x:(head.x+1), y:head.y} );
          this.body.shift();
        break;
      case 'left':
          head = this.body[0];
          this.body.unshift( {x:(head.x-1), y:head.y} );
          this.body.pop();
        break;
    }
    head = this.direction === 'left' ? this.body[0] : this.body[this.body.length-1];
    tail = this.direction === 'left' ? this.body[this.body.length-1] : this.body[0];
    if (head.x === 0){
      this.direction = 'right';
    }else if(head.x === maxRows-1) {
      this.direction = 'left';
    }
  };
