var Local=function(socket){
	//游戏类
	var game;
	//时间间隔
	var INTVAL=200;
	var timer=null;
	//时间计数器
	var timeCount=0;
	//时间
	var time=0;
	var isstart=false;
	//绑定键盘事件
	var bindKeyEvent=function(){
		document.onkeydown=function(e){
			if(e.keyCode==38){//up
				game.rotate();
				socket.emit("rotate");
			}else if(e.keyCode==39){//right
				game.right();
				socket.emit("right");
			}else if(e.keyCode==40){//down
				game.down();
				socket.emit("down");
			}else if(e.keyCode==37){//left
				game.left();
				socket.emit("left");
			}else if(e.keyCode==32){//space
				game.fall();
				socket.emit("fall");
			}
		}
	}
	//计时函数
	var timeFunc=function(){
		timeCount=timeCount+1;
		if(timeCount==5){
			timeCount=0;
			time=time+1;
			game.setTime(time);
			socket.emit("time",time);
		}
	}
	//下落
	var move=function(){
		timeFunc();
		if(!game.down()){
			game.fixed();
			socket.emit("fixed");
			var line=game.checkClear();
			if(line>0){
				game.addScore(line);
				socket.emit("line",line);
				if(line>1){
					var bottomline=generateBottomLin(line);
					socket.emit("bottomline",bottomline);
				}
			}
			var gameover=game.checkGameOver();
			if(gameover){
				game.gameOver(false);
				stop();
				socket.emit("lose");
			}else{
				var t=generateType();
				var d=generateDir();
				game.preformNext(t,d);
				socket.emit("next",{type:t,dir:d});
			}
		}else{
			socket.emit("down");
		}			
	}
	//随机生成干扰行
	var generateBottomLin=function(lineNum){
		var lines=[];
		for(var i=0;i<lineNum;i++){
			var line=[];
			for(var j=0;j<10;j++){
				line.push(Math.ceil(Math.random()*2)-1);
			}
			lines.push(line);
		}
		return lines;
	}
	//随机生成方块类
	var generateType=function(){
		return Math.ceil((Math.random()*7)-1);
	}
	//随机生成旋转次数
	var generateDir=function(){
		return Math.ceil((Math.random()*4)-1);
	}
	//结束
	var stop=function(){
		if(timer){
			clearInterval(timer);
			timer=null;
		}
		document.onkeydown=null;
	}
	//开始方法
	var start=function(){
		if(isstart){
			return;
		}else{
			isstart=true;
			var doms={
				gameDiv:document.getElementById("local_game"),
				nextDiv:document.getElementById("local_next"),
				timeDiv:document.getElementById("local_time"),
				scoreDiv:document.getElementById("local_score"),
				resultDiv:document.getElementById("local_result")
			};
			game=new Game();
			var type=generateType();
			var dir=generateDir();
			game.init(doms,type,dir);
			socket.emit("init",{type:type,dir:dir});
			bindKeyEvent();
			var t=generateType();
			var d=generateDir();
			game.preformNext(t,d);
			socket.emit("next",{type:t,dir:d});
			timer=setInterval(move,INTVAL);
		}
	}
	socket.on("start",function(){
		document.getElementById("wait").innerHTML="";
		start();
	});
	socket.on("lose",function(data){
		game.gameOver(true);
		stop();
	});
	socket.on("leave",function(data){
		document.getElementById("local_result").innerHTML="对方已掉线";
		document.getElementById("remote_result").innerHTML="已掉线";
		stop();
	});
	socket.on("bottomline",function(data){
		game.addLine(data);
		socket.emit("addLine",data);
	});
}