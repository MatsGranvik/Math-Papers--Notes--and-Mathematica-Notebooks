function binom(n,k){
	var t = 1;
	for( var i = 1; i <= k; i++ ){ t *= ( n - ( k - i ) ) / i; } 
	return t;}

var limit = 10000;
var wid = Math.floor( Math.log( limit ) / Math.log( 2 ) ) + 1 + 1;
var MAX_CACHE_LAYER = Math.floor( Math.log( limit ) / Math.log( 2 ) ) + 1 + 1;
function fact(n){ var t = 1; for( var k = 2; k <= n; k++ )t*=k; return t; }
function pw( n, k ){ return Math.pow( n, k ); }

function f( fn ){ return function( n ){ var t = 0; for( var k = 1; k < wid; k++ ) t += fn( n, k ); return t; } }

var _C = [ -1,0.5,0.08333333333333331,0.041666666666666685,0.0263888888888889,0.01874999999999998,0.014269179894179898,0.01136739417989419,0.009356536596119918,0.007892554012345693,0.006785849984634702,0.00592405641233766,0.00523669325795029,0.004677498407042256,0.004214952239005476,0.0038268995532118833,0.0034973498453499227,0.003214496431323566,0.0029694477154582075,0.0027553902994367197,0.0025670225450072316,0.0024001623785907264,0.0022514701977588646,0.0021182495272954417,0.0019983012550434556,0.0018898154636787002,0.0017912900780718889,0.0017014689263700762,0.0016192940490963666,0.0015438685969283445 ];
var _Bn = [	1, -1, 1, -1, 1, -1, 5, -691, 7, -3617, 43867, -174611, 854513, -236364091, 8553103, -23749461029, 8615841276005, -7709321041217, 2577687858367, -26315271553053477373, 2929993913841559, -261082718496449122051 ];
var _Bd = [ 1, 2, 6, 30, 42, 30, 66, 2730, 6, 510, 798, 330, 138, 2730, 6, 870, 14322, 510, 6, 1919190, 6, 13530, 1806, 690, 282, 46410, 66, 1590, 798, 870, 354, 56786730, 6, 510, 64722, 30, 4686, 140100870, 6, 30, 3318, 230010 ];

var _B = [];
for( var k = 0; k < _Bn.length; k++ ){
	_B.push( _Bn[k] / _Bd[k] );
	if( k > 1 )_B.push( 0 );
}
function C( n ) { return _C[Math.floor( n )]; }
function B( n ) { return _B[n]; }

function bind( sets, build ){
	var j, k, m;
	var v = []; var V = [];
	for( j = 0; j < wid; j++ ){ v.push([]); V.push([]); }
	for (j = 0; j < limit; j++) { v[0][j] = 0; V[0][j] = 1; } v[0][1] = 1;
	for (j = 0; j < limit; j++) for (k = 1; k < wid; k++) { v[k][j] = V[k][j] = 0; }
	for (j = 2; j < limit; j++) v[1][j] = build(j);
	for (k = 2; k < wid; k++) for (j = 2; j < limit; j++) for (m = 2*j; m < limit; m += j) v[k][m] += v[1][j] * v[k - 1][m / j];
	for (j = 1; j < limit; j++) for (k = 1; k < wid; k++) V[k][j] = v[k][j] + V[k][j-1];
	sets( 
		function( n, k ){ 
			if( k >= wid ){print("k out of range");return 0;}
			if( n < 0 || n >= limit ){ print("Only values of n for 1 through 10000 have been cached, sorry!"); return 0; }
			return v[k][Math.floor( n )]; }, 
		function( n, k ){
			if( k >= wid )return 0;
			if( n < 0 || n >= limit ){ print("Only values of n for 1 through 10000 have been cached, sorry!"); return 0; }
			return V[k][Math.floor( n )];} );}
			
var d,D; var m,M; var p,P; var q,Q; 

bind( function(x, y){ d = x; D=y; }, function(n){ return 1; } );
bind( function(x, y){ m = x; M=y; }, f( function(n, k){ return d(n,k)*pw( -1, k ); } ) );
bind( function(x, y){ p = x; P=y; }, f( function(n, k){ return d(n,k)*pw( -1, k+1 ) / k;} ) );
bind( function(x, y){ q = x; Q=y; }, f( function(n, k){ return p(n,k)*pw( -1, k ); } ) );

var mm, MM; bind( function(x, y){ mm = x; MM=y; }, function(n){ return Math.abs( m(n,1) ); } );
var dd, DD; bind( function(x, y){ dd = x; DD=y; }, f( function(n, k){ return mm(n,k)*pw( -1, k ); } ) );
var pp, PP; bind( function(x, y){ pp = x; PP=y; }, f( function(n, k){ return dd(n,k)*pw( -1, k+1 )/k; } ) );
	
var ff = gup( "full" ); var full = false;
if( ff != undefined && ff != "undefined" && ff != null && ff != "null" && ff != "" )full = true;

var zz,ZZ; var ww,WW; var fd,fD; var fp,fP; var id,iD; var ip,iP;
var ss, SS; var tt, TT; var uu,UU;

if( full ){
	bind( function(x, y){ zz = x; ZZ=y; },f( function(n, k){ return d(n,k)/fact(k); } ) );
	bind( function(x, y){ ww = x; WW=y; }, f( function(n, k){ return p(n,k)*pw( -1, k+1 ) / k; } ) );
	
	bind( function(x, y){ ss = x; SS=y; },f( function(n, k){ return d(n,k)*Math.pow( -1, k+1 ) * C( k ); } ) );
	bind( function(x, y){ tt = x; TT=y; },f( function(n, k){ return ss(n,k)*Math.pow( -1, k+1 ) * C( k ); } ) );
	bind( function(x, y){ uu = x; UU=y; },f( function(n, k){ return p(n,k) * C( k ); } ) );
	
	bind( function(x, y){ fd = x; fD=y; }, function(n){ return n; } );
	bind( function(x, y){ fp = x; fP=y; }, f( function(n, k){ return fd(n,k)*pw( -1, k+1 ) / k;} ) );

	bind( function(x, y){ id = x; iD=y; }, function(n){ return 1.0/n; } );
	bind( function(x, y){ ip = x; iP=y; }, f( function(n, k){ return id(n,k)*pw( -1, k+1 ) / k;} ) );
}

var sanity;
function rangeInit(){ sanity = 0; }; 
function rangeTest(){ if( sanity > 100 ) return false; return rangeTestCore(); }; 
function rangeUpdate(){ sanity++; rangeUpdateCore(); };
var rangeLoopStart = function(){}; var rangeTestCore = function(){ return false; }; var rangeUpdateCore = function(){};
function setRange( loopstart, test, update ){ rangeLoopStart = loopstart; rangeTestCore = test; rangeUpdateCore = update; }


var therands = [];
var currand;
function buildrands( st, en, add ){
	currand = 0;
	var v = st();
	do{
		therands.push( v );
		v = add( v );
	}while( en(v) );
}
function randsbase(){
	buildrands( function(){ return Math.floor( Math.random() * 450 ) }, function(v){ return v < 5000; }, function( j ) { return j + Math.floor( Math.random() * 450 ); } );
}

var doPlot = false;
var plotData = [];