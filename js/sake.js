var mainCanvas;
var scale;
var imageData;
var mainCtx;
var writeCanvas;
var img;
var pallet={'background':'#000022','foreground':'#ffffaa'};

function node(nodeid,ntitle,type,ncontentType,ncontent,nx,ny){
	this.nodeId=nodeid;
	this.title=ntitle;
	this.type=ntype;
	this.contentType=ncontentType;
	this.content=ncontent;
	this.children= new Array();
	this.parent=nparent;
	this.x=nx;
	this.y=ny;


}
function drawNode(node){
	
}




function wipe(){
	mainCtx.fillStyle=pallet['background'];
	mainCtx.fillRect(0,0,mainCanvas.width,mainCanvas.height);
}
function stars(){
	mainCtx.globalAlpha=0.2;
	mainCtx.fillStyle=pallet['backgroud'];
	mainCtx.fillRect(0,0,mainCanvas.width,mainCanvas.height);
	mainCtx.globalAlpha=1;
	mainCtx.fillStyle=pallet['foreground'];
	mainCtx.font="2px Verdana";
	for(var i=0;i<70;i++){
		mainCtx.fillText(".",rand(0,mainCanvas.width),(rand(0,mainCanvas.height)));
	}
}

function promptLogin(){
	var box = document.createElement('div');
	box.className="centerprompt";
	var t = document.createElement('input');
	t.type='text';
	t.name='email';
	var p = document.createElement('input');
	p.type='password';
	p.name='password';
	var s = document.createElement('button');
	s.innerText="LogIn";
	s.name='login';
	box.appendChildren(['Email Address',t,'Password',p,s]);
	document.getElementById('nav').appendChild(box);
}
function drawNode(node){
	

}


/*window.onload=function(){
	mainCanvas = document.getElementById('mainCanvas');
	mainCtx = mainCanvas.getContext("2d");
	wipe();
	stars();
	stars();
	console.log(mainCanvas.width);
	promptLogin();
	
}*/