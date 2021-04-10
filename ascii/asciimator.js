// version 2.001 wizard master copyright 2003 i hope this is fine :p
//----------------------------------------------- globals
var 
  NS = 0,
  NS6 = 0,
  timer,
  currentFrame,
  frameDataLen,
  frameArray,
  centered = true,
  frameDivider = "*s|p*",
  //screenW = 400,
  //screenH = 250,
  NUMPARAMS = 5,

  // negative from frameNumber
  DELAYOFFSET = 5,
  FGOFFSET = 4,
  BGOFFSET = 3,
  SZOFFSET = 2,
  ASCIIOFFSET = 1,
  // negative from array.length
  GLOBALOFFSET = 3,
  WIDTHOFFSET = 3,
  HEIGHTOFFSET = 2;

var frameArray = new Array( "400", "250", "end");
/* should be in this format:
  "100", "#111111", "#000000", "3", "frame 1 ascii",
  "100", "#111111", "#000000", "3", "frame 2 ascii",
  "400", "250", "end"
*/

//----------------------------------------------- init_anim
function init_anim(){
  NS = (document.layers)?1:0;
	NS6 = (document.getElementById && !document.all)?1:0;
  currentFrame = 1;
  setNumFrames();
  setScreenSize();
}
window.onload = init_anim;

//----------------------------------------------- loadFromText
function loadFromText(str,unesc){
  if(str){
    if(unesc) frameArray = unescape(str).split(frameDivider);
    else frameArray = str.split(frameDivider);
  }
}

//----------------------------------------------- getString
function getString(esc){
  var str = "";
  for(var i=0;i<frameArray.length-1;i++){ // -1 because of the "end"
    str += frameArray[i] + frameDivider;
  }
  str += "end";
  if(esc) str = escape(str);
  return str;
}

//----------------------------------------------- setNumFrames
function setNumFrames(){
  frameDataLen = frameArray.length - GLOBALOFFSET; // -GLOBALOFFSET because of the end frames
  numberOfFrames = frameDataLen/NUMPARAMS;
}


//----------------------------------------------- nextFrame
function nextFrame(){
  stepNext();
  var delay = parseInt(getDelay(currentFrame));
  clearTimeout(timer);
  timer = setTimeout("nextFrame()", delay);
}

//----------------------------------------------- stepNext
function stepNext(){
  currentFrame++;
  if(currentFrame>numberOfFrames) currentFrame = 1;
  drawFrame();
}

//----------------------------------------------- stepPrev
function stepPrev(){
  currentFrame--;
  if(currentFrame<1) currentFrame = numberOfFrames;
  drawFrame();
}

//----------------------------------------------- drawFrame
function drawFrame(){
  MM_setTextOfLayer('screen','',setText(currentFrame));
  var c = getBG(currentFrame) + "";
  var obj = MM_findObj('screen');
  if(NS){
    obj.resizeTo(getWidth(), getHeight());
    obj.bgColor = c;
    centerLayer('screen');
  }
  else{
    obj.style.width = getWidth();
    obj.style.height = getHeight();
    //obj.style.clip = 'rect(0px,0px,'+obj.style.width+'px,'+obj.style.height+'px)';
    obj.style.backgroundColor = c;
  }
}

//----------------------------------------------- setText
function setText(frameNumber){
  var newCell = getAscii(currentFrame);
  //r = /</g;
  newCell = newCell.replace(/</g, "&lt;");

  var content;
  if(centered) content = '<table width="' + getWidth() + 
    '" height="' + getHeight() + 
    '" border="0" cellspacing="0" cellpadding="0"><tr valign="top"><td>' +

    '<font size="'+ getSize(currentFrame) +'" color="'+ getFG(currentFrame) +'">' +

    '<pre>' + newCell + '</pre>' +
    '</td></tr></table>';
  else content = '<br><pre>' + newCell + '</pre>';
  return content;
}

//----------------------------------------------- setScreenSize
function setScreenSize(){
  var obj = MM_findObj('screen');
  if(NS) obj.resizeTo(getWidth(), getHeight());
  else{
    obj.style.clip.width = getWidth();
    obj.style.clip.height = getHeight();
  }
}

//----------------------------------------------- centerLayer
function centerLayer(l){
  var obj = MM_findObj(l);
  var w = obj.clip.width;
  obj.left = (window.innerWidth/2) - (w/2);
}

//----------------------------------------------- playAnim
function playAnim(){
  init_anim();
  timer = setTimeout("nextFrame()", 0);
}

//----------------------------------------------- stopAnim
function stopAnim(){ clearTimeout(timer); }

//----------------------------------------------- get/set Delay
function getDelay(n){
  var index = (n*NUMPARAMS)-DELAYOFFSET;
  return frameArray[index];
}

function setDelay(n,v){
  var index = (n*NUMPARAMS)-DELAYOFFSET;
  frameArray[index] = v;
}

//----------------------------------------------- get/set Ascii
function getAscii(n){
  var index = (n*NUMPARAMS)-ASCIIOFFSET;
  return frameArray[index];
}

function setAscii(n,v){
  var index = (n*NUMPARAMS)-ASCIIOFFSET;
  frameArray[index] = v;
}

//----------------------------------------------- get/set FG
function getFG(n){
  var index = (n*NUMPARAMS)-FGOFFSET;
  return frameArray[index];
}

function setFG(n,v){
  var index = (n*NUMPARAMS)-FGOFFSET;
  frameArray[index] = v;
}

//----------------------------------------------- get/set BG
function getBG(n){
  var index = (n*NUMPARAMS)-BGOFFSET;
  return frameArray[index];
}

function setBG(n,v){
  var index = (n*NUMPARAMS)-BGOFFSET;
  frameArray[index] = v;
}

//----------------------------------------------- get/set Size
function getSize(n){
  var index = (n*NUMPARAMS)-SZOFFSET;
  return frameArray[index];
}

function setSize(n,v){
  var index = (n*NUMPARAMS)-SZOFFSET;
  frameArray[index] = v;
}

//----------------------------------------------- get/set ScreenSize
function getWidth(){
  var index = (frameArray.length)-WIDTHOFFSET;
  return frameArray[index];
}

function setWidth(v){
  var index = (frameArray.length)-WIDTHOFFSET;
  frameArray[index] = v;
}

function getHeight(){
  var index = (frameArray.length)-HEIGHTOFFSET;
  return frameArray[index];
}

function setHeight(v){
  var index = (frameArray.length)-HEIGHTOFFSET;
  frameArray[index] = v;
}

//------------------------------------- encrypt
// need to accomodate \n \r
function encrypt(str)
{
  var newstr = str + "";
  var r;
  
  r = /\\/g;
  newstr = newstr.replace(r, "\\\\");
  r = /[\n\x0a]/g;
  newstr = newstr.replace(r, "\\n");
  r = /[\r\x0d]/g;
  newstr = newstr.replace(r, "\\r");
  r = /\,/g;
  newstr = newstr.replace(r, "\\,");
  r = /\"/g;
  newstr = newstr.replace(r, '\\"');
  r = /\'/g;
  newstr = newstr.replace(r, "\\'");

  return newstr;
}

//------------------------------------- decrypt
function decrypt(str)
{
  var newstr = str + "";
  var r;

  r = /\\'/g;
  newstr = newstr.replace(r, "'");
  r = /\\"/g;
  newstr = newstr.replace(r, '"');
  r = /\\,/g;
  newstr = newstr.replace(r, ",");
  r = /\\r/g;
  newstr = newstr.replace(r, "\r");
  r = /\\n/g;
  newstr = newstr.replace(r, "\n");
  r = /\\\\/g;
  newstr = newstr.replace(r, "\\");
  
  return newstr;
}

//------------------------------------- makeScreenDiv
function makeScreenDiv(){
  name = "screen";
  content = "";
  var out = "";
	if(document.layers) out = '<table width="100%" height="250" border="0" cellspacing="0" cellpadding="0"><tr><td><layer id="'+name+'">'+content+'</layer></tr></td></table>';
	else out = '<div id="'+name+'">'+content+'</div>';
	document.write(out);
}

//-----------------------------------------------MM functions
function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_setTextOfLayer(objName,x,newText) { //v4.01
  if ((obj=MM_findObj(objName))!=null) with (obj)
    if (document.layers) {document.write(unescape(newText)); document.close();}
    else innerHTML = unescape(newText);
}
