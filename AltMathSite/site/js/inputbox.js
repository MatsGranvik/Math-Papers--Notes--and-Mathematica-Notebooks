var  histList = [""],  histPos = 0,  _scope = {}, _win, question,_in,_out,tooManyMatches = null,lastError = null;

function refocus(){
  _in.blur(); // Needed for Mozilla to scroll correctly.
  _in.focus();}
function init(){
	_in = document.getElementById("input");
	_out = document.getElementById("output");
	_win = window;
	initTarget();
	recalculateInputHeight();
	refocus();}
function initTarget(){ _win.Shell = window; _win.print = shellCommands.print;}
function keepFocusInTextbox(e) {
  var g = e.srcElement ? e.srcElement : e.target; // IE vs. standard
  
  while (!g.tagName)g = g.parentNode;
  var t = g.tagName.toUpperCase();
  if (t=="A" || t=="INPUT")return;
    
  if (window.getSelection) {
    // Mozilla
    if (String(window.getSelection()))return;}
  else if (document.getSelection) {
    // Opera? Netscape 4?
    if (document.getSelection())return;}
  else {
    // IE
    if ( document.selection.createRange().text )return;}
  refocus();}
function resetcode(){ fillbox(); }

function runcode(){
    // execute the input on enter
    //document.getElementById("thegraph").scrollIntoView();
    //jump('thegraph');
    baseShow( 'outputframe' );
    try { clear(); go(); } catch(er) { alert(er); };
    setTimeout(function() { _in.value = ""; }, 0); // can't preventDefault on input, so clear it later
}
function inputKeydown(e) {
  // Use onkeydown because IE doesn't support onkeypress for arrow keys

  //alert(e.keyCode + " ^ " + e.keycode);

  //if (e.shiftKey && e.keyCode == 13) { // shift-enter
  if (!e.shiftKey && e.keyCode == 13) { // shift-enter
    // don't do anything; allow the shift-enter to insert a line break as normal
  //} else if (e.keyCode == 13) { // enter
  } else if (e.keyCode == 13) { // enter
    // execute the input on enter
    try { clear(); go(); } catch(er) { alert(er); };
    setTimeout(function() { _in.value = ""; }, 0); // can't preventDefault on input, so clear it later
  } else if (e.keyCode == 38) { // up
    // go up in history if at top or ctrl-up
    if (e.ctrlKey || caretInFirstLine(_in))
      hist(true);
  } else if (e.keyCode == 40) { // down
    // go down in history if at end or ctrl-down
    if (e.ctrlKey || caretInLastLine(_in))
      hist(false);
  } else if (e.keyCode == 9) { // tab
    tabcomplete();
    setTimeout(function() { refocus(); }, 0); // refocus because tab was hit
  } else { }
  setTimeout(recalculateInputHeight, 0);
  //return true;
};
function caretInFirstLine(textbox){
	// IE doesn't support selectionStart/selectionEnd
	if (textbox.selectionStart == undefined)return true;
	var firstLineBreak = textbox.value.indexOf("\n");
	return ((firstLineBreak == -1) || (textbox.selectionStart <= firstLineBreak));}
function caretInLastLine(textbox){
	// IE doesn't support selectionStart/selectionEnd
	if (textbox.selectionEnd == undefined)return true;
	var lastLineBreak = textbox.value.lastIndexOf("\n");
	return (textbox.selectionEnd > lastLineBreak);}
function recalculateInputHeight(){
  var rows = _in.value.split(/\n/).length
    + 1 // prevent scrollbar flickering in Mozilla
    + (window.opera ? 1 : 0); // leave room for scrollbar in Opera

  if (_in.rows != rows) // without this check, it is impossible to select text in Opera 7.60 or Opera 8.0.
    _in.rows = rows;
}



function println(s, type){
	if((s=String(s))){
		var newdiv = document.createElement("div");
		newdiv.appendChild(document.createTextNode(s));
		newdiv.className = type;
		_out.appendChild(newdiv);
		return newdiv;}}
function printWithRunin(h, s, type){
	var div = println(s, type);
	var head = document.createElement("strong");
	head.appendChild(document.createTextNode(h + ": "));
	div.insertBefore(head, div.firstChild);}
function clear(){ var CHILDREN_TO_PRESERVE = 0; while (_out.childNodes[CHILDREN_TO_PRESERVE]) _out.removeChild(_out.childNodes[CHILDREN_TO_PRESERVE]);};


function tablehead( nm, val ){document.getElementById("output").innerHTML += "\n"+"<h3><b>Table for "+nm+"="+val+"</b></h3>";}
function tablehead2( nm, val, nm2, val2 ){document.getElementById("output").innerHTML += "\n"+"<h3><b>Table for "+nm+"="+val+", " + nm2+"="+val2+"</b></h3>";}
function tablehead3( nm, val, nm2, val2, nm3, val3 ){document.getElementById("output").innerHTML += "\n"+"<h3><b>Table for "+nm+"="+val+", " + nm2+"="+val2+", " + nm3+"="+val3+"</b></h3>";}

function comparer( a, b, st, en, add ){
	rangeInit();
	do{
		currand = 0;
		rangeLoopStart();
		print( " " );
		var difs  = 0;
		var rows = [];
		rows.push( ["n", "F1(n)", "F2(n)", "F1(n) - F2(n)"] );
		rows.push( ["", "", "", ""] );
		var str = "<table border=\"1\">";
		for( var j = st; j <= en; j = add( j ) ){
			var aval = a(j); var bval = b(j); var ddif = (aval - bval ); if( Math.abs( ddif ) < .000000001 )ddif = 0;
			if( Math.abs( Math.floor( aval + .00000001 ) - aval ) < .00000001 ) aval = Math.floor( aval + .00000001 );
			if( Math.abs( Math.floor( bval + .00000001 ) - bval ) < .00000001 ) bval = Math.floor( bval + .00000001 );
			rows.push( [ j, aval, bval, ddif ] );
			difs += Math.abs( ddif );}
		for( var j = 0; j < rows.length; j++ ){
			str += "<tr>";
			for( var k = 0; k < 4; k++ ){
				str += "<td>";
				if( rows[j][k] == 0 )str += "<i><h6>";
				str += rows[j][k];
				if( rows[j][k] == 0 )str += "</h6></i>";
				str += "</td>";}
			str += "</tr>";}
		str += "</table>";
		document.getElementById("output").innerHTML += str;
		print( " " );
		print( "Total difference between these functions = " + difs );
		print(" " );
		rangeUpdate();}
	while( rangeTest() );}
function shower( a, nm, st, en, add ){
	if( nm == undefined || nm == "" || nm == "undefined" ) nm = "f";
	rangeInit();
	do{
		currand = 0;
		rangeLoopStart();
		print( " " );
		var difs  = 0;
			var rows = [];
			rows.push( ["n", nm+"(n,1)", nm+"(n,2)", nm+"(n,3)", nm+"(n,4)", nm+"(n,5)", nm+"(n,6)", nm+"(n,7)", nm+"(n,8)", nm+"(n,9)", nm+"(n,10)", nm+"(n,11)", nm+"(n,12)"] );
			rows.push( ["", "", "", "", "", "", "", "", "", "", "", "", ""] );
			var str = "<table border=\"1\">";
		for( var j = st; j <= en; j = add( j ) ){
			var thisrow = [ j ];
			for( var k = 1; k <= 12; k++ ){
				var aval = a(j,k);
				thisrow.push( aval );}
			rows.push( thisrow );}
		for( var j = 0; j < rows.length; j++ ){
			str += "<tr>";
			for( var k = 0; k < 13; k++ ){
				str += "<td>";
				if( rows[j][k] == 0 )str += "<i><h6>";
				str += rows[j][k];
				if( rows[j][k] == 0 )str += "</h6></i>";
				str += "</td>";}
			str += "</tr>";}
		str += "</table>";
		document.getElementById("output").innerHTML += str;
		print( " " );
		rangeUpdate();}
	while( rangeTest() );}
function viewer( a, st, en, add ){ 
	print( a );
	rangeInit();
	do{
		currand = 0;
		rangeLoopStart();
		print( " " );
		var difs  = 0;
		var rows = [];
		rows.push( ["n", "F1(n)", "F1(n) - F1(n-1)", "Difference"] );
		rows.push( ["", "", "", ""] );
		var str = "<table border=\"1\">";
		for( var j = st; j <= en; j = add(j) ){
			var aval = a(j); 
			if( Math.abs( Math.floor( aval + .00000001 ) - aval ) < .00000001 ) aval = Math.floor( aval + .00000001 );
			var ddif = a(j) - a( j-1 );
			if( Math.abs( Math.floor( ddif + .00000001 ) - ddif ) < .00000001 ) ddif = Math.floor( ddif + .00000001 );
			rows.push( [ j, aval, ddif ] );}
		for( var j = 0; j < rows.length; j++ ){
			str += "<tr>";
			for( var k = 0; k < 3; k++ ){
			str += "<td>";
				if( rows[j][k] == 0 )str += "<i><h6>";
				str += rows[j][k];
				if( rows[j][k] == 0 )str += "</h6></i>";
				str += "</td>";}
			str += "</tr>";}
		str += "</table>";
		document.getElementById("output").innerHTML += str;
		print( " " );
		rangeUpdate();}
	while( rangeTest() );}
var shellCommands = 
{
fact:fact,
binom:binom,

setRange:setRange,
tablehead:tablehead,
tablehead2:tablehead2,
tablehead3:tablehead3,
doplot:function( a ){ doplot( a ); baseShow( 'thegraph' ); refocus(); jump('thegraph');},
plotfn:function( fn ){  plotfn( fn ); baseShow( 'thegraph' ); refocus(); jump('thegraph');},

load : function load(url){
	var s = _win.document.createElement("script");
	s.type = "text/javascript";
	s.src = url;
	_win.document.getElementsByTagName("head")[0].appendChild(s);
	println("Loading " + url + "...", "message");},
clear : clear,
print : function print(s) { println(s, "print"); },
pr : function pr(s) { shellCommands.print(s); return s;},
props : function props(e, onePerLine){
	if (e === null) { println("props called with null argument", "error"); return;}
	if (e === undefined) { println("props called with undefined argument", "error"); return; }
	var ns = ["Methods", "Fields", "Unreachables"];
	var as = [[], [], []]; // array of (empty) arrays of arrays!
	var p, j, i; // loop variables, several used multiple times
	var protoLevels = 0;
	for (p = e; p; p = p.__proto__){ for (i=0; i<ns.length; ++i) as[i][protoLevels] = []; ++protoLevels;}
	for(var a in e){
	    // Shortcoming: doesn't check that VALUES are the same in object and prototype.
		var protoLevel = -1;
		try { for (p = e; p && (a in p); p = p.__proto__) ++protoLevel; }
		catch(er) { protoLevel = 0; } // "in" operator throws when param to props() is a string
		var type = 1;
		try { if ((typeof e[a]) == "function")type = 0; }
		catch (er) { type = 2; }
		as[type][protoLevel].push(a);}
	function times(s, n) { return n ? s + times(s, n-1) : ""; }
	for (j=0; j<protoLevels; ++j) for (i=0;i<ns.length;++i) if (as[i][j].length) printWithRunin(ns[i] + times(" of prototype", j),  (onePerLine ? "\n\n" : "") + as[i][j].sort().join(onePerLine ? "\n" : ", ") + (onePerLine ? "\n\n" : ""),  "propList" );},

blink : function blink(node)
{
  if (!node)                     throw("blink: argument is null or undefined.");
  if (node.nodeType == null)     throw("blink: argument must be a node.");
  if (node.nodeType == 3)        throw("blink: argument must not be a text node");
  if (node.documentElement)      throw("blink: argument must not be the document object");

  function setOutline(o) { 
    return function() {
      if (node.style.outline != node.style.bogusProperty) {
        // browser supports outline (Firefox 1.1 and newer, CSS3, Opera 8).
        node.style.outline = o;
      }
      else if (node.style.MozOutline != node.style.bogusProperty) {
        // browser supports MozOutline (Firefox 1.0.x and older)
        node.style.MozOutline = o;
      }
      else {
        // browser only supports border (IE). border is a fallback because it moves things around.
        node.style.border = o;
      }
    }
  } 
  
  function focusIt(a) {
    return function() {
      a.focus(); 
    }
  }

  if (node.ownerDocument) {
    var windowToFocusNow = (node.ownerDocument.defaultView || node.ownerDocument.parentWindow); // Moz vs. IE
    if (windowToFocusNow)
      setTimeout(focusIt(windowToFocusNow.top), 0);
  }

  for(var i=1;i<7;++i)
    setTimeout(setOutline((i%2)?'3px solid red':'none'), i*100);

  setTimeout(focusIt(window), 800);
  setTimeout(focusIt(_in), 810);
},
scope : function scope(sc){
	if (!sc) sc = {};
	_scope = sc;
	println("Scope is now " + sc + ".  If a variable is not found in this scope, window will also be searched.  New variables will still go on window.", "message");},
mathHelp : function mathHelp(){
	printWithRunin("Math constants", "E, LN2, LN10, LOG2E, LOG10E, PI, SQRT1_2, SQRT2", "propList");
	printWithRunin("Math methods", "abs, acos, asin, atan, atan2, ceil, cos, exp, floor, log, max, min, pow, random, round, sin, sqrt, tan", "propList");},
ans : undefined};

function hist(up){
  // histList[0] = first command entered, [1] = second, etc.
  // type something, press up --> thing typed is now in "limbo"
  // (last item in histList) and should be reachable by pressing 
  // down again.

  var L = histList.length;

  if (L == 1)
    return;

  if (up)
  {
    if (histPos == L-1)
    {
      // Save this entry in case the user hits the down key.
      histList[histPos] = _in.value;
    }

    if (histPos > 0)
    {
      histPos--;
      // Use a timeout to prevent up from moving cursor within new text
      // Set to nothing first for the same reason
      setTimeout(
        function() {
          _in.value = ''; 
          _in.value = histList[histPos];
          var caretPos = _in.value.length;
          if (_in.setSelectionRange) 
            _in.setSelectionRange(caretPos, caretPos);
        },
        0
      );
    }
  } 
  else // down
  {
    if (histPos < L-1)
    {
      histPos++;
      _in.value = histList[histPos];
    }
    else if (histPos == L-1)
    {
      // Already on the current entry: clear but save
      if (_in.value)
      {
        histList[histPos] = _in.value;
        ++histPos;
        _in.value = "";
      }
    }
  }
}

function tabcomplete()
{
  /*
   * Working backwards from s[from], find the spot
   * where this expression starts.  It will scan
   * until it hits a mismatched ( or a space,
   * but it skips over quoted strings.
   * If stopAtDot is true, stop at a '.'
   */
  function findbeginning(s, from, stopAtDot)
  {
    /*
     *  Complicated function.
     *
     *  Return true if s[i] == q BUT ONLY IF
     *  s[i-1] is not a backslash.
     */
    function equalButNotEscaped(s,i,q)
    {
      if(s.charAt(i) != q) // not equal go no further
        return false;

      if(i==0) // beginning of string
        return true;

      if(s.charAt(i-1) == '\\') // escaped?
        return false;

      return true;
    }

    var nparens = 0;
    var i;
    for(i=from; i>=0; i--)
    {
      if(s.charAt(i) == ' ')
        break;

      if(stopAtDot && s.charAt(i) == '.')
        break;
        
      if(s.charAt(i) == ')')
        nparens++;
      else if(s.charAt(i) == '(')
        nparens--;

      if(nparens < 0)
        break;

      // skip quoted strings
      if(s.charAt(i) == '\'' || s.charAt(i) == '\"')
      {
        //dump("skipping quoted chars: ");
        var quot = s.charAt(i);
        i--;
        while(i >= 0 && !equalButNotEscaped(s,i,quot)) {
          //dump(s.charAt(i));
          i--;
        }
        //dump("\n");
      }
    }
    return i;
  }

  // XXX should be used more consistently (instead of using selectionStart/selectionEnd throughout code)
  // XXX doesn't work in IE, even though it contains IE-specific code
  function getcaretpos(inp)
  {
    if(inp.selectionEnd != null)
      return inp.selectionEnd;
      
    if(inp.createTextRange)
    {
      var docrange = _win.Shell.document.selection.createRange();
      var inprange = inp.createTextRange();
      if (inprange.setEndPoint)
      {
        inprange.setEndPoint('EndToStart', docrange);
        return inprange.text.length;
      }
    }

    return inp.value.length; // sucks, punt
  }

  function setselectionto(inp,pos)
  {
    if(inp.selectionStart) {
      inp.selectionStart = inp.selectionEnd = pos;
    }
    else if(inp.createTextRange) {
      var docrange = _win.Shell.document.selection.createRange();
      var inprange = inp.createTextRange();
      inprange.move('character',pos);
      inprange.select();
    }
    else { // err...
    /*
      inp.select();
      if(_win.Shell.document.getSelection())
        _win.Shell.document.getSelection() = "";
        */
    }
  }
    // get position of cursor within the input box
    var caret = getcaretpos(_in);

    if(caret) {
      //dump("----\n");
      var dotpos, spacepos, complete, obj;
      //dump("caret pos: " + caret + "\n");
      // see if there's a dot before here
      dotpos = findbeginning(_in.value, caret-1, true);
      //dump("dot pos: " + dotpos + "\n");
      if(dotpos == -1 || _in.value.charAt(dotpos) != '.') {
        dotpos = caret;
//dump("changed dot pos: " + dotpos + "\n");
      }

      // look backwards for a non-variable-name character
      spacepos = findbeginning(_in.value, dotpos-1, false);
      //dump("space pos: " + spacepos + "\n");
      // get the object we're trying to complete on
      if(spacepos == dotpos || spacepos+1 == dotpos || dotpos == caret)
      {
        // try completing function args
        if(_in.value.charAt(dotpos) == '(' ||
 (_in.value.charAt(spacepos) == '(' && (spacepos+1) == dotpos))
        {
          var fn,fname;
  var from = (_in.value.charAt(dotpos) == '(') ? dotpos : spacepos;
          spacepos = findbeginning(_in.value, from-1, false);

          fname = _in.value.substr(spacepos+1,from-(spacepos+1));
  //dump("fname: " + fname + "\n");
          try {
            with(_win.Shell._scope)
              with(_win)
                with(Shell.shellCommands)
                  fn = eval(fname);
          }
          catch(er) {
            //dump('fn is not a valid object\n');
            return;
          }
          if(fn == undefined) {
             //dump('fn is undefined');
             return;
          }
          if(fn instanceof Function)
          {
            // Print function definition, including argument names, but not function body
            if(!fn.toString().match(/function .+?\(\) +\{\n +\[native code\]\n\}/))
              println(fn.toString().match(/function .+?\(.*?\)/), "tabcomplete");
          }

          return;
        }
        else
          obj = _win;
      }
      else
      {
        var objname = _in.value.substr(spacepos+1,dotpos-(spacepos+1));
        //dump("objname: |" + objname + "|\n");
        try {
          with(_win.Shell._scope)
            with(_win)
                obj = eval(objname);
        }
        catch(er) {
          printError(er); 
          return;
        }
        if(obj == undefined) {
          // sometimes this is tabcomplete's fault, so don't print it :(
          // e.g. completing from "print(document.getElements"
          // println("Can't complete from null or undefined expression " + objname, "error");
          return;
        }
      }
      //dump("obj: " + obj + "\n");
      // get the thing we're trying to complete
      if(dotpos == caret)
      {
        if(spacepos+1 == dotpos || spacepos == dotpos)
        {
          // nothing to complete
          //dump("nothing to complete\n");
          return;
        }

        complete = _in.value.substr(spacepos+1,dotpos-(spacepos+1));
      }
      else {
        complete = _in.value.substr(dotpos+1,caret-(dotpos+1));
      }
      //dump("complete: " + complete + "\n");
      // ok, now look at all the props/methods of this obj
      // and find ones starting with 'complete'
      var matches = [];
      var bestmatch = null;
      for(var a in obj)
      {
        //a = a.toString();
        //XXX: making it lowercase could help some cases,
        // but screws up my general logic.
        if(a.substr(0,complete.length) == complete) {
          matches.push(a);
          ////dump("match: " + a + "\n");
          // if no best match, this is the best match
          if(bestmatch == null)
          {
            bestmatch = a;
          }
          else {
            // the best match is the longest common string
            function min(a,b){ return ((a<b)?a:b); }
            var i;
            for(i=0; i< min(bestmatch.length, a.length); i++)
            {
              if(bestmatch.charAt(i) != a.charAt(i))
                break;
            }
            bestmatch = bestmatch.substr(0,i);
            ////dump("bestmatch len: " + i + "\n");
          }
          ////dump("bestmatch: " + bestmatch + "\n");
        }
      }
      bestmatch = (bestmatch || "");
      ////dump("matches: " + matches + "\n");
      var objAndComplete = (objname || obj) + "." + bestmatch;
      //dump("matches.length: " + matches.length + ", tooManyMatches: " + tooManyMatches + ", objAndComplete: " + objAndComplete + "\n");
      if(matches.length > 1 && (tooManyMatches == objAndComplete || matches.length <= 10)) {

        printWithRunin("Matches: ", matches.join(', '), "tabcomplete");
        tooManyMatches = null;
      }
      else if(matches.length > 10)
      {
        println(matches.length + " matches.  Press tab again to see them all", "tabcomplete");
        tooManyMatches = objAndComplete;
      }
      else {
        tooManyMatches = null;
      }
      if(bestmatch != "")
      {
        var sstart;
        if(dotpos == caret) {
          sstart = spacepos+1;
        }
        else {
          sstart = dotpos+1;
        }
        _in.value = _in.value.substr(0, sstart)
                  + bestmatch
                  + _in.value.substr(caret);
        setselectionto(_in,caret + (bestmatch.length - complete.length));
      }
    }
}

function printQuestion(q)
{
  println(q, "input");
  println("___________________________________________", "input");
  println(" ", "input");
}

function printAnswer(a)
{
  if (a !== undefined) {
    println(a, "normalOutput");
    shellCommands.ans = a;
  }
}

function printError(er)
{ 
  var lineNumberString;

  lastError = er; // for debugging the shell
  if (er.name)
  {
    // lineNumberString should not be "", to avoid a very wacky bug in IE 6.
    lineNumberString = (er.lineNumber != undefined) ? (" on line " + er.lineNumber + ": ") : ": ";
    println(er.name + lineNumberString + er.message, "error"); // Because IE doesn't have error.toString.
  }
  else
    println(er, "error"); // Because security errors in Moz /only/ have toString.
}

function go(s)
{
  _in.value = question = s ? s : _in.value;

  if (question == "")
    return;

  histList[histList.length-1] = question;
  histList[histList.length] = "";
  histPos = histList.length - 1;
  
  // Unfortunately, this has to happen *before* the JavaScript is run, so that 
  // print() output will go in the right place.
  _in.value='';
  recalculateInputHeight();
  printQuestion(question);

  if (_win.closed) {
    printError("Target window has been closed.");
    return;
  }
  
  try { ("Shell" in _win) }
  catch(er) {
    printError("The JavaScript Shell cannot access variables in the target window.  The most likely reason is that the target window now has a different page loaded and that page has a different hostname than the original page.");
    return;
  }

  if (!("Shell" in _win))
    initTarget(); // silent

  // Evaluate Shell.question using _win's eval (this is why eval isn't in the |with|, IIRC).
  _win.location.href = "javascript:try{ Shell.printAnswer(eval('with(Shell._scope) with(Shell.shellCommands) {' + Shell.question + String.fromCharCode(10) + '}')); } catch(er) { Shell.printError(er); }; setTimeout(Shell.refocus, 0); void 0";
}

function gup( name ){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )return ""; else return results[1];}

function test2to100(){ clear(); fillbox( "test2to100" ); runcode(); }
function testrandom(){ fillbox( "testrandom" ); runcode(); }
function testby50(){ fillbox( "testby50" ); runcode(); }
function test500(){ clear(); fillbox( "test500" ); runcode(); }
function test2200(){ clear(); fillbox( "test2200" ); runcode(); }
function test8700(){ clear(); fillbox( "test8700" ); runcode(); }
function testall(){ clear(); fillbox( "testall" ); runcode(); }

function show2to100(){ clear(); fillbox( "show2to100" ); runcode(); }
function showrandom(){ clear(); fillbox( "showrandom" ); runcode(); }
function showby50(){ clear(); fillbox( "showby50" ); runcode(); }
function show500(){ clear(); fillbox( "show500" ); runcode(); }
function show2200(){ clear(); fillbox( "show2200" ); runcode(); }
function show8700(){ clear(); fillbox( "show8700" ); runcode(); }
function showall(){ clear(); fillbox( "showall" ); runcode(); }

function view2to100(){ clear(); fillbox( "view2to100" ); runcode(); }
function viewrandom(){ clear(); fillbox( "viewrandom" ); runcode(); }
function viewby50(){ clear(); fillbox( "viewby50" ); runcode(); }
function view500(){ clear(); fillbox( "view500" ); runcode(); }
function view2200(){ clear(); fillbox( "view2200" ); runcode(); }
function view8700(){ clear(); fillbox( "view8700" ); runcode(); }
function viewall(){ clear(); fillbox( "viewall" ); runcode(); }


function fillbox( testnameoverride, fullString ){
	var g = gup("baseline");
	if( g != undefined && g != "undefined" && g != null && g != "null" && g != "" ){
		g = decodeURIComponent(g.replace(/\+/g,  " "));
		document.getElementById('input').value = g;}
	
	var r = gup("shows");
	if( r != undefined && r != "undefined" && r != null && r != "null" && r != "" ){
		r = decodeURIComponent(r.replace(/\+/g,  " "));
		//var r2 = gup("shows2");
		//if( r2 != undefined )r2 = decodeURIComponent(r2.replace(/\+/g,  " "));
		//if( testnameoverride != undefined )document.getElementById('input').value = testnameoverride + "("+r+",\""+r+"\", "+r2+","\""+r2+\");";
		if( fullString != undefined )document.getElementById('input').value = fullString;
		else if( testnameoverride != undefined )document.getElementById('input').value = testnameoverride + "("+r+",\""+r+"\");";
		else document.getElementById('input').value = "show2to100("+r+",\""+r+"\");";}
	
	var s2 = gup("testcodeonly");
	if( s2 != undefined && s2 != "undefined" && s2 != null && s2 != "null" && s2 != "" ){
		var s = gup("testcodeonly");
		s = decodeURIComponent(s.replace(/\+/g,  " "));
		var s3 = gup("inits");
		s3 = decodeURIComponent(s3.replace(/\+/g,  " "));
		var s4 = gup("testname");
		s4 = decodeURIComponent(s4.replace(/\+/g,  " "));
		if( testnameoverride != undefined )s4 = testnameoverride;
		var vv = ( s3 != "" ? s3 + "\n":"") + "function F1(n){ " + s + "}" + "\n" + s4 + "( F1 );" ;
		document.getElementById('input').value = vv;}
	
	var s2 = gup("testcode2");
	if( s2 != undefined && s2 != "undefined" && s2 != null && s2 != "null" && s2 != "" ){
		var s = gup("testcode1");
		s = decodeURIComponent(s.replace(/\+/g,  " "));
		
		s2 = decodeURIComponent(s2.replace(/\+/g,  " "));
		var s3 = gup("inits");
		s3 = decodeURIComponent(s3.replace(/\+/g,  " "));
		var s4 = gup("testname");
		s4 = decodeURIComponent(s4.replace(/\+/g,  " "));
		if( testnameoverride != undefined )s4 = testnameoverride;
		var vv = ( s3 != "" ? s3 + "\n":"") + "function F1(n){ " + s + "}" + "\n" + "function F2(n){ " + s2 + "}\n" + s4 + "( F1, F2 );" ;
		document.getElementById('input').value = vv;}}

function setInput( fullString, str2 ){
	document.getElementById('input').value = fullString;
	recalculateInputHeight();}
function jump(h){
    var top = document.getElementById(h).offsetTop;
    window.scrollTo(0, top);}

function baseHide( id ){document.getElementById(id).style.display = "none";}
function baseShow( id ){document.getElementById(id).style.display = "block";}
function hideDiv( id, buttonid ){
	document.getElementById(id).style.display = "none";
	document.getElementById(buttonid).textContent = "Explore in Javascript";}
function toggleDiv( id, buttonid, codeToRun ){
	if( document.getElementById(id).style.display != "block" ){
		document.getElementById(id).style.display = "block";
		document.getElementById(buttonid).textContent = "Hide";
		moveCodeRunner( id );
		if( codeToRun != undefined )setInput( codeToRun );
		refocus();}
	else{
		document.getElementById(id).style.display = "none";
		document.getElementById(buttonid).textContent = "Explore in Javascript";
		clear();
		graphOn = false;
		baseHide( 'thegraph' ); 
		baseHide( 'outputframe' ); }}
		
function hideFold( id, buttonid ){
	document.getElementById(id).style.display = "none";
	document.getElementById(buttonid).textContent = "Show";}
function toggleFold( id, buttonid ){
	if( document.getElementById(id).style.display != "block" ){
		document.getElementById(id).style.display = "block";
		document.getElementById(buttonid).textContent = "Hide";
		refocus();}
	else{
		document.getElementById(id).style.display = "none";
		document.getElementById(buttonid).textContent = "Show";}}		
		
function moveCodeRunner( targ ){
	var cr = document.getElementById("coderunner");
	cr.parentNode.removeChild(cr);
	var tg = document.getElementById(targ);
	tg.appendChild( cr );
	baseShow("coderunner");}

function setup(){
	plotsetup();
	init();
}
//var interval = setInterval(function(){if(typeof Stats=='function'){clearInterval(interval);}},100);