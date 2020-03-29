var Game=function(){
	//dom元素
	var gameDiv;
	var nextDiv;
	var timeDiv;
	var resultDiv;
	var scoreDiv;
	var score=0;
	//游戏矩阵
	var gameData=[
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0]
	];
	//当前方块
	var cur;
	//下一个方块
	var next;
	
	//div
	var gameDivs=[];
	var nextDivs=[];
	//初始化div
	var initDiv=function(container,data,divs){
	
		for(var i =0;i<data.length;i++){
			var div=[];
			for(var j=0;j<data[0].length;j++){
				var newNode=document.createElement("div");
				newNode.className="none";
				newNode.style.top=(i*20)+"px";
				newNode.style.left=(j*20)+"px";
				container.appendChild(newNode);
				div.push(newNode);
			}
			divs.push(div);
		}
	}
	//刷新div
	var reflushDiv=function(data,divs){
		for(var i =0;i<data.length;i++){
			for(var j=0;j<data[0].length;j++){
				if(data[i][j]==0){
					divs[i][j].className="none";
				}else if(data[i][j]==1){
					divs[i][j].className="done";
				}else if(data[i][j]=2){
					divs[i][j].className="current";
				}
					
			}
		}
	}
	//检查点是否合法
	var check=function(pos,x,y){
		if(pos.x+x<0){
			return false;
		}else if(pos.x+x>=gameData.length){
			return false;
		}else if(pos.y+y<0){
			return false;
		}else if(pos.y+y>=gameData[0].length){
			return false;
		}else if(gameData[pos.x+x][pos.y+y]==1){
			return false;
		}
		return true;
	}
	//检查数据是否合法
	var isValid=function(pos,data){
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data[0].length;j++){
				if(data[i][j]!=0){
					if(!check(pos,i,j)){
						return false;
					}
				}
			}
		}
		return true;
	}
	//清除数据
	var clearData=function(){
		for(var i=0;i<cur.data.length;i++){
			for(var j=0;j<cur.data[0].length;j++){
				if(check(cur.origin,i,j)){
					gameData[cur.origin.x+i][cur.origin.y+j]=0;
				}
			}
		}
	}
	//设置数据
	var setData=function(){
		for(var i=0;i<cur.data.length;i++){
			for(var j=0;j<cur.data[0].length;j++){
				if(check(cur.origin,i,j)){
					gameData[cur.origin.x+i][cur.origin.y+j]=cur.data[i][j];
				}
			}
		}
	}
	//下移
	var down=function(){
		if(cur.canDown(isValid)){
			clearData();
			cur.down();
			setData();
			reflushDiv(gameData,gameDivs);
			return true;
		}else{
			return false;
		}
		
	}
	//左移
	var left=function(){
		if(cur.canLeft(isValid)){
			clearData();
			cur.left();
			setData();
			reflushDiv(gameData,gameDivs);
		};
		
	}
	//右移
	var right=function(){
		if(cur.canRight(isValid)){
			clearData();
			cur.right();
			setData();
			reflushDiv(gameData,gameDivs);
		};
		
	}
	//旋转
	var rotate=function(){
		if(cur.canRotate(isValid)){
			clearData();
			cur.rotates();
			setData();
			reflushDiv(gameData,gameDivs);
		};
		
	}
	//方块移动到底部固定
	var fixed=function(){
		for(var i=0;i<cur.data.length;i++){
			for(var j=0;j<cur.data[0].length;j++){
				if(check(cur.origin,i,j)){
					if(gameData[cur.origin.x+i][cur.origin.y+j]==2){
						gameData[cur.origin.x+i][cur.origin.y+j]=1;
					}
				}
			}
		}
		reflushDiv(gameData,gameDivs);
	}
	//使用下一个方块
	var preformNext=function(type,dir){
		cur=next;
		setData();
		next=SquareFactory.prototype.make(type,dir);
		reflushDiv(gameData,gameDivs);
		reflushDiv(next.data,nextDivs);
	
	}
	//加分
	var addScore=function(line){
		var s=0;
		switch(line){
			case 1:
				s=10;
				break;
			case 2:
				s=20;
				break;
			case 3:
				s=60;
				break;
			case 4:
				s=100;
				break;
			default:
			break;
		}
		score=score+s;
		scoreDiv.innerHTML=score;
	}
	//消行
	var checkClear=function(){
		var line=0;
		for(var i=gameData.length-1;i>=0;i--){
			var clear=true;
			for(var j=0;j<gameData[0].length;j++){
				if(gameData[i][j]!=1){
					clear=false;
					break;
				}
			}
			if(clear){
				line=line+1;
				for(var m=i;m>0;m--){
					for(var n=0;n<gameData[0].length;n++){
						gameData[m][n]=gameData[m-1][n];
					}
				}
				for(var n=0;n<gameData[0].length;n++){
					gameData[0][n]=0;
				}
				i++;
			}
		}
		return line;
	}
	//检查游戏结束
	var checkGameOver=function(){
		var gameOver=false;
		for(var i=0;i<gameData[0].length;i++){
			if(gameData[0][i]==1){
				gameOver=true;
			}
		}
		return gameOver;
	}
	//设置时间
	var setTime=function(time){
		timeDiv.innerHTML=time;
	}
	//显示结果
	var gameOver=function(win){
		if(win){
			resultDiv.innerHTML="你赢了";
		}else{
			resultDiv.innerHTML="你输了";
		}
	}
	//底部增加行
	var addLine=function(line){
		for(var i=0;i<gameData.length;i++){
			gameData[i]=gameData[i+line.length];
		}
		for(var i=0;i<line.length;i++){
			gameData[gameData.length-line.length+i]=line[i];
		}
		cur.origin.x=cur.origin.x-line.length;
		if(cur.origin.x<0){
			cur.origin.x=0;
		}
		reflushDiv(gameData,gameDivs);
	}
	//初始化
	var init=function(doms,type,dir){
		
		gameDiv=doms.gameDiv;
		nextDiv=doms.nextDiv;
		timeDiv=doms.timeDiv;
		scoreDiv=doms.scoreDiv;
		resultDiv=doms.resultDiv;
		next =new SquareFactory.prototype.make(type,dir);
		initDiv(gameDiv,gameData,gameDivs);
		initDiv(nextDiv,next.data,nextDivs);
		reflushDiv(next.data,nextDivs);
	}
	
	//导出api
	this.init=init;
	this.down=down;
	this.left=left;
	this.right=right;
	this.rotate=rotate;
	this.fixed=fixed;
	this.preformNext=preformNext;
	this.checkClear=checkClear;
	this.checkGameOver=checkGameOver;
	this.setTime=setTime;
	this.addScore=addScore;
	this.gameOver=gameOver;
	this.addLine=addLine;
	this.fall=function(){
		while(down());
	};
}