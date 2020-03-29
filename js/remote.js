var Remote=function(socket){
	//游戏对象
	var game;
	//绑定事件
	var bindEvent=function(){
		socket.on("init",function(data){
			start(data.type,data.dir);
		});
		socket.on("next",function(data){
			game.preformNext(data.type,data.dir);
		});
		socket.on("rotate",function(data){
			game.rotate();
		});
		socket.on("right",function(data){
			game.right();
		});
		socket.on("left",function(data){
			game.left();
		});
		socket.on("down",function(data){
			game.down();
		});
		socket.on("fall",function(data){
			game.fall();
		});
		socket.on("fixed",function(data){
			game.fixed();
		});
		socket.on("line",function(data){
			game.checkClear();
			game.addScore(data);
		});
		socket.on("time",function(data){
			game.setTime(data);
		});
		socket.on("lose",function(data){
			game.gameOver(false);
		});
		socket.on("addLine",function(data){
			game.addLine(data);
		});
	}
	var start=function(type,dir){
		var doms={
			gameDiv:document.getElementById("remote_game"),
			nextDiv:document.getElementById("remote_next"),
			timeDiv:document.getElementById("remote_time"),
			scoreDiv:document.getElementById("remote_score"),
			resultDiv:document.getElementById("remote_result")
		};
		game=new Game();
		game.init(doms,type,dir);
	}
	bindEvent();
}