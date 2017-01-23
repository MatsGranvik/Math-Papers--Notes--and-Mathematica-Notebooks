var graphOn = false, dotSpot = [], delay = [];
function plotsetup(){
	for( var k = 0; k < 700; k++ ){dotSpot.push( 0 ); delay.push(0);}
	var tick = 0;
	var bkg = new Image(); bkg.src = '../art/backgroundwhite2.jpg', img = new Image(); img.src = '../art/blueorb.png', imgred = new Image(); imgred.src = '../art/redorb.png';
	var canvas = document.getElementById('Canvas2D'); var c = canvas.getContext('2d');
	function render() {
		if( !graphOn )return;
		//c.globalCompositeOperation = 'source-over';
		c.fillStyle="rgba(255, 255, 255, 1)"; c.fillRect(0,0, 700, 700);
		c.drawImage(bkg, 0, 0);
		//c.globalCompositeOperation = 'multiply';
		var dif = 0;
		for (i=1; i<600; i++){
			var x = 50+i, y;
			delay[i]--;
			dif += Math.abs( dotSpot[i] - plotData[i] );
			if( delay[i] <= 0 )dotSpot[i] = dotSpot[i] * (.8) + (.2) * plotData[i];
			if( doPlot && plotData.length > i )y = 350-dotSpot[i];
			c.drawImage(img, x-2, y-2, 4, 4);}
			if( dif < 1 )graphOn = false;}
	var loop = setInterval(function(){render();}, 1000/30);}
function doplot( a ){doPlot = true; plotData = a; graphOn = true; }
function plotfn( fn ){var aa = []; for( var k = 0; k < 700; k++ ){aa.push( fn(k) ); dotSpot[k] = 0;delay[k] = Math.floor(k/20);} doPlot = true; plotData = aa; graphOn = true; }