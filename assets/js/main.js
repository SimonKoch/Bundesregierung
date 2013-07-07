$(function(){

	var degrees = ['0','0.5','1','0'];

  console.log("lets get ready to play");

  // $('#navPrimary *').addClass('spielen')

  var positions = new Array();

  $('.spielen').each(function() {
  	var left = {
  		el: $(this),
  		pos: $(this).offset()
  	};
  	positions.push(left);
  });

  // discard all less than 0
  positions = positions.filter(function(element) {
  	var inBreite  = element.pos.left > 0 && element.pos.left < window.innerWidth;
  	var inHöhe    = element.pos.top  > 0 && element.pos.top  < window.innerHeight;
  	var hochGenug = element.el.height() > 10;

  	return inBreite && inHöhe;
  });



  // get left side elements
  var leftPositions = positions.filter(function(element) {
  	var jep = element.pos.left < 450;
  	// if (jep) {
  	// 	console.log(element.pos.left)
  	// }
  	return jep;
  });
  var randPos = Math.floor(Math.random()*leftPositions.length);

  var PlayerLeft = leftPositions[randPos].el;
  PlayerLeft.addClass('player');
  PlayerLeft.ClassyWiggle('start',{degrees:degrees}).css("border", "2px solid red");



  // get right side elements

  var rightPositions = positions.filter(function(element) {
  	var jup = element.pos.left > 750;

  	//	if (jup) {
  	//	console.log(element.pos.right)
  	//	}
  		return jup;
 	});
  var randPos = Math.floor(Math.random()*leftPositions.length);

  var PlayerRight = rightPositions[randPos].el;
  PlayerRight.addClass('player');
  PlayerRight.ClassyWiggle('start',{degrees:degrees}).css("border", "2px solid black");



  // get middle elemets

  var middlePositions = positions.filter(function(element) {
  	var jup = element.pos.left > 450 && element.pos.left < 750;
	if (jup) {
		console.log(element.pos.left)
	}
	return jup;
  });

  var Ball;
  do {
	  var randPos = Math.floor(Math.random()*leftPositions.length);

	  var Ball = middlePositions[randPos].el;
	  Ball.addClass('ball');
	  Ball.ClassyWiggle('start',{degrees:[9,0,8,0,3,7,1]}).css("border", "2px solid yellow");
	} while ( middlePositions.length > 0 && (PlayerLeft.is(Ball) || PlayerRight.is(Ball)) )

  console.log("found ball", Ball);



  // ------------ Position Players

 PlayerLeft
 	.css({
 		position: 'absolute',
 		left: PlayerLeft.offset().left,
 		top:  PlayerLeft.offset().top,
 		width: PlayerLeft.width(),
 		height: PlayerLeft.height(),
 	})
 	.delay(500).animate({
	    left: 0+"px",
	  }, 1500 );

 PlayerRight
 	.css({
 		position: 'absolute',
 		left: PlayerRight.offset().left,
 		top:  PlayerRight.offset().top,
 		width: PlayerRight.width(),
 		height: PlayerRight.height(),
 	})
 	.delay(1500).animate({
	    left: window.innerWidth-PlayerRight.width()+"px",
	  }, 1500 );


  // Integrate the Pong from pong.coffee:
  pong = new PongApp();
  //pong.main(PlayerLeft,PlayerRight,Ball);

});
