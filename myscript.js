(function() {
    var canvas = document.getElementById('canvas'),
            context = canvas.getContext('2d');
			
    window.addEventListener('resize', resizeCanvas, false);
	window.requestAnimationFrame = window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || function(callback) { window.setTimeout(callback, 1000 / 60); };

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
	
    var looping = false;
    var totalSeconds = 0;
	var i = 0;
	var totalSecondsCopy = 0;
	var count = 0;
	var speed = 200;

    function resizeCanvas() {
		w = window.innerWidth;
		h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
			
		var img = new Image();
		img.onload = imageLoaded;
		img.src = 'images/background.jpg';
		
		var ground = new Image();
		ground.src = 'images/ground.png';
		
		var dog = new Image();
		var dogImages = ["images/dog1.png", "images/dog2.png", "images/dog3.png", "images/dog4.png", "images/dog5.png"];
		
		var plate = new Image();
		plate.src = 'images/plate.png';
		
		function imageLoaded() {
			drawStuff(0, img, w, h, 0, 150);
			
			ground.height = h/3.6;
			
			dog.width = w/6;
			dog.height = h/2.05;
			
			plate.width  = w/20;
			plate.height = h/10;
			
            startStop();
			
			canvas.addEventListener('click', function(event){
				 
				var xPos = w-((totalSecondsCopy * speed) % w);
				var yPos = h-((totalSecondsCopy * speed)%h);
				if(event.clientX >= xPos && event.clientX <= xPos+plate.width
						&& event.clientY >= yPos && event.clientY <= yPos+plate.height){
							totalSecondsCopy = Math.floor(Math.random() * (h+100 - h + 1) ) + h;
							count++;
							if(count > 1 && count%10 == 1)
								speed +=50;
				} 
			});
		}

		var lastFrameTime = 0;

		function startStop() {
			looping = !looping;

			if (looping) {
				lastFrameTime = Date.now();
				requestAnimationFrame(loop);
			}
		}

		function loop() {
			if (!looping) {
				return;
			}

			requestAnimationFrame(loop);

			var now = Date.now();
			var deltaSeconds = (now - lastFrameTime) / 1000;
			lastFrameTime = now;
			
			drawStuff(deltaSeconds, img, w, h, 0, 150);
			drawStuff(deltaSeconds, ground, w, ground.height, h - ground.height, 300);
			
			getDog(dog, dogImages, i, w, h, dog.width, dog.height);
			i += 0.05;
			if(Math.floor(i) == dogImages.length)
				i = 0;
			
			getPlate(deltaSeconds, speed, plate, w, h, plate.width, plate.height);
			
			context.font="30px Comic Sans MS";
			context.fillStyle = "red";
			context.fillText("SCORE: " + count, w-200, 100);
		}
    }
    resizeCanvas();

    function drawStuff(delta, img, w, h, hc, vx) {
        totalSeconds += delta;
		//var vx = 300; // the background scrolls with a speed of 100 pixels/sec
		var numImages = Math.ceil(w / img.width) + 1;
		var xpos = (totalSeconds * vx) % w;
		context.save();
		context.translate(-xpos, 0);
		for (var i = 0; i < numImages; i++) {
			context.drawImage(img, i * w, hc, w, h);
		}
		context.restore();
	}
	
	function getDog(dog, dogImg, i, w, h, dw, dh) {
		dog.src = dogImg[Math.floor(i)];
		context.drawImage(dog, w/4, dh, dw, dh);
	}
	
	function getPlate(delta, vx, img, w, h, pw, ph){
		totalSecondsCopy += delta;
		context.drawImage(img, w-((totalSecondsCopy * vx) % w), h-((totalSecondsCopy * vx)%h), pw, ph);
	}
})();