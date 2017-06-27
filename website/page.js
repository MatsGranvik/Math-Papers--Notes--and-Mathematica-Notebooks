var pow=Math.pow, cos=Math.cos, sin=Math.sin, log=Math.log, fl=Math.floor, sqrt=Math.sqrt;

var theSrc='', theDivBase='', theA = 0, theF = 0, zetaReal = 0, zetaImag = 0;
function setSrc( s, divBase, _A, _F, _zetaReal, _zetaImag ){ theSrc = s; theDivBase = divBase; theA = _A; theF = _F; zetaReal = _zetaReal; zetaImag = _zetaImag; }
function setFullSource( s, _A, _F, _zetaReal, _zetaImag ){ theSrc = s; theDivBase = "graphs_"+_A+"_"+_F; theA = _A; theF = _F; zetaReal = _zetaReal; zetaImag = _zetaImag; }

function integralReal(x,A,f){ return pow(x,(1+A)) / (pow((1+A),2)+pow(f,2)) *((1+A)*cos(f*log(x))+f*sin(f*log(x))); }
function integralImag(x,A,f){ return pow(x,(1+A)) / (pow((1+A),2)+pow(f,2)) *((1+A)*sin(f*log(x))-f*cos(f*log(x))); }
function sumReal(x,A,f,sm){ if( x < 1 )return 0; x = fl(x); if( sm[x] != undefined )return sm[x]; sm[x]=pow(x,A)*cos(f*log(x))+sumReal(x-1,A,f,sm);}
function sumImag(x, A, f, sm ){ if( x < 1 )return 0;  x = fl(x); if( sm[x] != undefined )return sm[x]; sm[x]=pow(x,A)*sin(f*log(x))+sumImag(x-1, A, f, sm);}

var factorials = [1,1,2,6,24,120,720,5040,40320,362880,3628800,39916800,479001600,6227020800,87178291200,1307674368000,20922789888000,355687428096000,6402373705728000,121645100408832000,2432902008176640000];
var facts = [];
function factor(n){ if( facts[n] != undefined )return facts[n]; let o=[],k=2;while(k*k<=n){let t=0;while(n%k<1)t++,n/=k;t>0?o.push(t):{};k++}n>1?o.push(1):{}; facts[n] = o; return o}
var ezs=[];
function ez(n){ if(ezs[n] != undefined ) return ezs[n]; var t  = 1; var o = factor(n); for( var k = 0; k < o.length; k++ )t *= 1/factorials[o[k]]; ezs[n] = t; return t;}

function sumRealP(x,A,f,sm){ 
	if( x < 1 )
	return 0; 
	x = fl(x); 
	if( sm[x] != undefined )
		return sm[x]; 
	
	var v = ez(x);
	sm[x]=v*pow(x,A)*cos(f*log(x))+sumRealP(x-1,A,f,sm);
	
	}
function sumImagP(x, A, f, sm ){ if( x < 1 )return 0;  x = fl(x); if( sm[x] != undefined )return sm[x]; sm[x]=ez(x)*pow(x,A)*sin(f*log(x))+sumImagP(x-1, A, f, sm);}

function integralRealX(x,A,f){ return pow(x,(1+A))*cos(f*log(x)); }
function integralImagX(x,A,f){ return pow(x,(1+A))*sin(f*log(x)); }
function sumRealX(x,A,f,sm){ if( x < 1 )return 0; x = fl(x); if( sm[x] != undefined )return sm[x]; sm[x]=pow(x,A)*((A+1)*cos(f*log(x))-f*sin(f*log(x)))+sumRealX(x-1,A,f,sm);}
function sumImagX(x, A, f, sm ){ if( x < 1 )return 0;  x = fl(x); if( sm[x] != undefined )return sm[x]; sm[x]=pow(x,A)*((A+1)*sin(f*log(x))+f*cos(f*log(x)))+sumImagX(x-1, A, f, sm);}

function integralRealExt(x,A,f){ return pow(x,(1+A)) / (pow((1+A),2)+pow(f,2)) *((1+A)*cos(f*log(x))+f*sin(f*log(x))) + pow(x,A)/2*cos(f*log(x)) - pow(x,(A-1)) / 12 *(-A*cos(f*log(x))+f*sin(f*log(x))); }
function integralImagExt(x,A,f){ return pow(x,(1+A)) / (pow((1+A),2)+pow(f,2)) *((1+A)*sin(f*log(x))-f*cos(f*log(x))) + pow(x,A)/2*sin(f*log(x)) - pow(x,(A-1)) / 12 *(-f*sin(f*log(x))-A*cos(f*log(x))); }


function integralRealDerivative(x,A,f){ return pow(x,A)*cos(f*log(x)); }

function line( fn, isClosed=false ){return { closed:isClosed, graphType: 'polyline', fn: fn };}

function xvalForSamplingFrequency(ff,s){return 1/(pow( Math.E, (2 * Math.PI * s)/Math.abs( ff ))-1)+1;}

function addFrequencyMarkers( f, baseAnnotations = {} ){
	var ans=[ baseAnnotations ];
	var anLimit = -1;
	// whole number frequencies
	for( var k = 1; k < pow(f,1/3); k++ ){var cur = xvalForSamplingFrequency(f,k); anLimit = cur; if( cur == xvalForSamplingFrequency(f,k-.5) )break; ans.push( {x:cur, text:''+k+' Hz'} ); }
	// whole number + 1/2 frequencies
	for( var k = 0; k < pow(f,1/3); k++ ){var cur = xvalForSamplingFrequency(f,k+.5); if( cur == xvalForSamplingFrequency(f,k) )break; ans.push( {x:cur, text:''+(k+.5)+' Hz'} ); }
	// early frequencies
	for( var k = 5; k < anLimit-1; k+=5 ){ans.push( {x:k, text:''+Math.floor((f/(2*Math.PI)*(log(k+1)-log(k)))*100)/100+' Hz'} );}

	return ans;
}

function makeTitle(){
	makeBasicTitle('$$\\sum_{t = 1}^x t^{'+theF+' i}$$');
}

function makeBasicTitle( title, pageSrc = undefined ){
	if( pageSrc === undefined )pageSrc = theSrc;
	var div = document.createElement("div");
	div.id="title";
	document.getElementById(pageSrc).appendChild(div);
    
	var div3 = document.createElement("div");
	div3.innerHTML = '<h2><center>'+title+'</center></h2>';
	div.appendChild(div3);
	
	div = document.createElement("div");
	div.id="underouter";
	document.getElementById(pageSrc).appendChild(div);
	
	var div2 = document.createElement("div");
	div2.id="under";
	div.appendChild(div2);
}


function zetaBox(){
    var div = document.createElement("div");
    div.id="eqboxouter";
    document.getElementById(theSrc).appendChild(div);

    var div2 = document.createElement("div");
    div2.id="eqbox";
    div.appendChild(div2);

    var A = theA;
    var f = theF;
    var val1 = zetaReal;
    var val2 = zetaImag;
    
    var div3 = document.createElement("div");
    if( A != 0 )div3.innerHTML = '$$\\zeta('+A+' + -' + f + ' i) = '+val1+'... + '+val2+'... i$$';
    else div3.innerHTML = '$$\\zeta( -' + f + ' i) = '+val1+'... + '+val2+'... i$$';
    div2.appendChild(div3);
}

function makeMathBox( src, graphName, titleString ){
    var div = document.createElement("div");
    div.id="mathouter";
    document.getElementById(src).appendChild(div);

    var div2 = document.createElement("div");
    div2.id="mathbox2";
    div.appendChild(div2);

    var div3 = document.createElement("div");
    div3.innerHTML = titleString;
    div2.appendChild(div3);

    var div3 = document.createElement("div");
    div3.id = graphName;
    div2.appendChild(div3);

    div3 = document.createElement("div");
    div3.innerHTML = "<h6>RECENTER GRAPH: Click and drag.  ZOOM IN / OUT: mousewheel, double tap / shift+double tap, or pinch on mobile. Graph code from <a href='http://maurizzzio.github.io/function-plot/'>here</a>.</h6>";
    div2.appendChild(div3);
}
function makeVersus( src, graphName, title1, title2 ){
    makeMathBox( src, graphName, "$$y_{\\textrm{red}}="+title1 + " \\,\\,\\,\\,\\,\\,\\,\\,\\textrm{vs}\\,\\,\\,\\,\\,\\,\\,\\, y_{\\textrm{blue}}=" + title2+"$$" );
}
function makeVersusStack( src, graphName, title1, title2 ){
    makeMathBox( src, graphName, "$$y_{\\textrm{red}}="+title1 + "$$ $$y_{\\textrm{blue}}=" + title2+"$$" );
}
function example3partWithRealAndComplex( src, graphBase, freq ){
    makeVersus( src, graphBase, "\\sum_{t=1}^{\\lfloor x \\rfloor} t^{-\\frac{1}{2}} \\cos( "+freq+"... \\cdot \\log t )","\\int_0^x t^{-\\frac{1}{2}} \\cos( "+freq+"... \\cdot \\log t ) \\,dt" );
    makeVersus( src, graphBase+"2", "\\sum_{t=1}^{\\lfloor x \\rfloor} t^{-\\frac{1}{2}} \\sin( "+freq+"... \\cdot \\log t )","\\int_0^x t^{-\\frac{1}{2}} \\sin( "+freq+"... \\cdot \\log t ) \\,dt" );
    makeVersusStack( src, graphBase+"3", "\\sum_{t=1}^{\\lfloor x \\rfloor} t^{-\\frac{1}{2}} \\cos( "+freq+"... \\cdot \\log t ) - \\int_0^x t^{-\\frac{1}{2}} \\cos( "+freq+"... \\cdot \\log t ) \\,dt","\\sum_{t=1}^{\\lfloor x \\rfloor} t^{-\\frac{1}{2}} \\sin( "+freq+"... \\cdot \\log t ) - \\int_0^x t^{-\\frac{1}{2}} \\sin( "+freq+"... \\cdot \\log t ) \\,dt" );
}

function animationLinks( src, isAbs, freq, extraParms, ampText ){
	if( extraParms === undefined )extraParms = '';
	if( ampText === undefined )ampText = '';
	var div;
	for( var k = 0; k < freq.length; k++ ){
	    div = document.createElement("div");
	    if( isAbs )div.innerHTML = '<center><a href="waveAnimate0.htm?'+extraParms+'isAbs=1&freqStart='+freq[k]+'">Animate $\\displaystyle | \\sum_{t=1}^{\\lfloor x \\rfloor} t^{'+ampText+'('+freq[k]+'+time) i} | $</a></center>';
	    else div.innerHTML = '<center><a href="waveAnimate0.htm?'+extraParms+'freqStart='+freq[k]+'">Animate $\\displaystyle\\sum_{t=1}^{\\lfloor x \\rfloor} t^{'+ampText+'('+freq[k]+'+time) i}$</a></center>';
	    document.getElementById(src).appendChild(div);
	}
}