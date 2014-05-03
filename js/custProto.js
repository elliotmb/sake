HTMLDivElement.prototype.appendChildren=function(orphans){
	for (var i=0;i<orphans.length;i++){
		if(typeof orphans[i] ==='string'){
			var temp= document.createElement('span');
			temp.innerText=orphans[i];
			this.appendChild(temp);
		}else{
			this.appendChild(orphans[i]);
		}
	}
}
function rand(min,max){
	return Math.floor(Math.random()*(max-min)+min);
}
