var app = require('http').createServer()
var io = require('socket.io')(app);
//存储客户端socket
var socketArr={};
app.listen(3000);
//客户端计数
var clientcount=0;
io.on('connection', function (socket) {
	clientcount=clientcount+1;
	socket.clientNum=clientcount;
	socketArr[clientcount]=socket;
	if(clientcount%2==1){
		io.emit('waiting', " waiting for another person");
	}else{
		io.emit('start');
		if(socketArr[(clientcount-1)]){
			socketArr[(clientcount-1)].emit("start");
		}
	}
	
	bindlistener(socket,"init");
	bindlistener(socket,"next");
	bindlistener(socket,"rotate");
	bindlistener(socket,"right");
	bindlistener(socket,"left");
	bindlistener(socket,"down");
	bindlistener(socket,"fall");
	bindlistener(socket,"fixed");
	bindlistener(socket,"line");
	bindlistener(socket,"time");
	bindlistener(socket,"lose");
	bindlistener(socket,"bottomline");
	bindlistener(socket,"addLine");
	
	socket.on('disconnect', function (data) {
		if(socket.clientNum%2==0){
			if(socketArr[(socket.clientNum-1)]){
				socketArr[(socket.clientNum-1)].emit("leave");
			}
		}else{
			if(socketArr[(socket.clientNum+1)]){
				socketArr[(socket.clientNum+1)].emit("leave");
			}
		}
		delete (socketArr[socket.clientNum]);
	});
});
var bindlistener=function(socket,even){
	socket.on(even, function (data) {;
		if(socket.clientNum%2==0){
			if(socketArr[(socket.clientNum-1)]){
				socketArr[(socket.clientNum-1)].emit(even, data);
			}
		}else{
			if(socketArr[(socket.clientNum+1)]){
				socketArr[(socket.clientNum+1)].emit(even, data);
			}
		}
	});
}
console.log("websocket listen port 3000");