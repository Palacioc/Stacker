  function Game(options) {
    this.rows    = options.rows;
    this.columns = options.columns;
    this.activeMen = options.men;
    this.latestStillMen = options.still;
    this.scores = [];
    this.currentScore = 0;
    this.highScore = 0;
    this.interval = 0;
  }

  Game.prototype.drawBoard = function (){
    for (var rowIndex = 0; rowIndex < this.rows; rowIndex++){
      for (var columnIndex = 0; columnIndex < this.columns; columnIndex++){
        $('.container').append($('<div>')
        .addClass('cell board')
        .attr('data-row', this.rows-rowIndex-1)
        .attr('data-col', columnIndex)
        );
      }
    }
  };

  Game.prototype.clearBoard = function (){
    $(".cell").removeClass("moving-men").removeClass("still-men");
  };

  Game.prototype.drawMoving = function(){
    var that = this;
    if ($(".moving-men [data-row=" + this.activeMen.body[0].y + "]").length!==this.activeMen.body.length) {
      $(".moving-men").removeClass("moving-men");
      this.activeMen.body.forEach(function(elem, index, array){
        var selector = '[data-col=' + elem.x + '][data-row=' + elem.y + ']';
        $(selector).addClass('moving-men');
      });
    }else{
      if (this.activeMen.direction === 'right') {//te mueves para la derecha
        $(".moving-men:first").removeClass("moving-men");
        $(".moving-men:last").next().addClass('moving-men');
      }else{
        $(".moving-men:last").removeClass("moving-men");
        $(".moving-men:first").prev().addClass("moving-men");
      }
    }
  };

  Game.prototype.drawStill = function(){
    this.latestStillMen.body.forEach(function(elem, index, array){
      var selector = '[data-col=' + elem.x + '][data-row=' + elem.y + ']';
      $(selector).addClass('still-men');
    });
  };

  Game.prototype.start = function(){
    game.togglePrompt();
    game.drawMoving();
    game.drawStill();
    game.interval = setInterval(game.update.bind(game), 1);
  };

  Game.prototype.togglePrompt = function(){
    $(".fade-background").toggleClass("hidden");

  };

  Game.prototype.update = function(){
    this.activeMen.move(this.columns);
    this.drawMoving();
  };

  Game.prototype.endGame = function () {
    this.scores.push(this.currentScore);
    clearInterval(game.interval);
    console.log("end of game");
    this.clearBoard();
    this.activeMen = new MovingMen(1,1,20,'right');
    this.latestStillMen = new StillMen(0,0,50);
    this.togglePrompt();
  };

  Game.prototype.drop = function () {
    var that = this;
    var oldY = this.activeMen.body[0].y;
    var newY = this.activeMen.body[0].y+1;
    var movingArrayDeX = this.activeMen.body.map(function(elem){return elem.x;});
    var stillArrayDeX = this.latestStillMen.body.map(function(elem){return elem.x;});
    var intersection = _.intersection(movingArrayDeX, stillArrayDeX);
    if (intersection.length === 0) {
      console.log("endingGame");
      that.endGame();
      return 0;
    }
    this.activeMen = new MovingMen(intersection[0], newY, intersection.length, this.activeMen.direction);
    this.latestStillMen = new StillMen(intersection[0], oldY, intersection.length);
    // debugger
    this.drawStill();
    // debugger
    this.drawMoving();
    // debugger
  };

  Game.prototype.assignSpaceBar = function (){
    var that = this;
    $('body').on('keydown', function(e) {
      if (e.keyCode === 32) {
        that.drop();
      }
    });
  };

  var game = new Game({
    rows: 30,
    columns: 50,
    men: new MovingMen(1,1,20,'right'),
    still: new StillMen(0,0,50)
  });


  game.assignSpaceBar();
  game.drawBoard();
  $("#start").on("click", game.start);
