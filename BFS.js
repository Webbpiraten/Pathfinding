
//new p5();
var main1;
var mywidth;
var myheight;
var startpos;
var result;
var startup;
var startItem;
var stop;
var framerate;
var running;
//var lastNode = [];

// p5.js code starts LAST. [<Head>, <Body>, p5.js]
function setup(){ // Runs once
	mywidth = 2000;
	myheight = 2000;
	createCanvas(mywidth, myheight);
	background(255,255,255);
	framerate = 10;
	frameRate(framerate);
	noLoop(); // draw() runs once. Loop() restarts it.
	startup = false;
	
	running = false;
	stop = false;
	main1 = new main();
	main1.drawGrid(main1.w, main1.h, main1.step);
	main1.initArrayOfNodes(main1.ArrayOfNodes, main1.w, main1.h, main1.step);
	main1.generateMaze();
	startpos = main1.init();
	startItem = [main1.getGrid(startpos[0],startpos[1], main1.w, main1.h)];
	main1.BFS(startItem, main1.adjList);
}

function draw(){ // Called after setup is done. Loops until NoLoop is called.
	if(stop === false){
		//result = main1.BFS(main1.getGrid(startpos[0],startpos[1], main1.w, main1.h), main1.adjList);
		main1.BFS(startItem, main1.adjList);
		//console.log("Distance to sink: " + result.toString());
	}
}

function keyPressed() {
	if (keyCode === LEFT_ARROW) {
		redraw();
	}
	if (keyCode === UP_ARROW) {
		framerate = framerate + 10;
		frameRate(framerate);
		console.log(framerate);
	}
	if (keyCode === RIGHT_ARROW) {
		if(running === false){
			running = true;
			loop();
			redraw();
		} else {
			running = false;
			noLoop();
		}
	}
	if (keyCode === DOWN_ARROW) {
		if(framerate > 0){
			framerate = framerate - 10;
			frameRate(framerate);
			console.log(framerate);
		}
	}
}

var main = function(){
	this.ArrayOfNodes = [];
	this.adjList = [];
	this.w = mywidth;
	this.h = myheight;
	this.step = 20;
	this.lastNode = [];
	this.diagonally = false;
};

var node = function(x, y, c, id, xi, yi){ // 0,0,white = Array[0][0]
	this.cordX = x;
	this.cordY = y;
	this.color = c;
	this.id = id;
	this.indexY = yi; // index in ArrayOfNodes...
	this.indexX = xi;
	this.predec = 0;
	this.distance = 0; // From the source node
	
	this.show = function(colr){
		rect(this.cordX, this.cordY, 19, 19);
	};
};

main.prototype.init = function(){
	var start = main1.getNonGreen();
	var end = main1.getNonGreen();
	while(start[0] === end[0] || start[1] === end[1]){
		start = main1.getNonGreen();
		end = main1.getNonGreen();
	}
	main1.fillGrid(start[1], start[0], 'red'); // Source , (y, x), c = red
	main1.fillGrid(end[1], end[0], 'blue'); // Sink, c = blue
	return start;
};

main.prototype.initArrayOfNodes = function(ArrayOfNodes, wi, he, step){
	id = 0;
	for(y=0; y<(he/step); y++){ // [x][y](cordX,cordY,color)
		ArrayOfNodes[y] = [];
		for(x=0; x<(wi/step); x++){
			n = new node(x*20,y*20,'white', id, y, x);
			ArrayOfNodes[y][x] = n;
			main1.fillGrid(n.indexX, n.indexY, 'green');
			id++;
		};
	};
};

main.prototype.drawGrid = function(w, h, step) {
	//console.log(w + " " + h);
	rect(0,0, width-1, height-1);
	for(x = 0; x <= w; x += step){
		line(x, 0, x, height);
	}
	for(y = 0; y <= h; y += step){
		line(0, y, width, y);
	}
};

main.prototype.fillGrid = function(cordx, cordy, color){
	fill(color);
	rect(main1.ArrayOfNodes[cordx][cordy].cordX, main1.ArrayOfNodes[cordx][cordy].cordY, 19, 19);
	main1.ArrayOfNodes[cordx][cordy].color = color;
};

// Old
main.prototype.showCurrent = function(ctx, cordx, cordy){
	ctx.fillStyle = "black";
	ctx.fillRect(main1.ArrayOfNodes[cordx][cordy].cordX+10,
				 main1.ArrayOfNodes[cordx][cordy].cordY+10,
				 2,2); // Draw a dot
	ctx.fillStyle = "black"
};

main.prototype.getGrid = function(cordx, cordy, w, h){
	// w = 800 -> w = 39
	if( ((cordx < 0) || (cordy < 0) || (cordx > main1.ArrayOfNodes.length-1) || (cordy > main1.ArrayOfNodes.length-1)) ){ // 39, w, h,
		return false;
	} else {
	//if(typeof ArrayOfNodes[cordy][cordx] !== 'undefined'){
		return main1.ArrayOfNodes[cordy][cordx];
	}
};

main.prototype.getGridById = function(id){
	var flat = [].concat.apply([], main1.ArrayOfNodes);
	/*
	var col = flat.indexOf(id);
	var row = -1;
	if (col != -1) // found, now need to extract the row
	  while (main1.ArrayOfNodes[++row].length >= col) // not this row
		col -= main1.ArrayOfNodes[row].length; // so adjust and try again
	*/
	var filtered = flat.filter(function(element){ // New array
		return element.id === id;
	})
	return filtered[0];
}

main.prototype.checkNeighbours = function(cordx, cordy) {
	if(main1.getGrid(cordx, cordy, main1.w, main1.h).color == "green"){ // Check for grey aswell, since they have already been visited?
		return false;
	}
	var neighbour = [];
	
	if(main1.diagonally === true){
		// Top-left
		if(main1.getGrid(cordx-1, cordy-1, main1.w, main1.h) != false){
			//return getGrid(cordx-1, cordy-1).color;
			neighbour.push(main1.getGrid(cordx-1, cordy-1)); // Comment out to check diagonally!
			//console.log(main1.getGrid(cordx-1, cordy-1))
			//console.log("TOP-LEFT");
		}
		// Top-right
		if(main1.getGrid(cordx+1, cordy-1, main1.w, main1.h) != false){
			//return getGrid(cordx+1, cordy-1).color;
			neighbour.push(main1.getGrid(cordx+1, cordy-1)); // Comment out to check diagonally!
			//console.log("TOP-RIGHT");
		}
		// Bottom-left
		if(main1.getGrid(cordx-1, cordy+1, main1.w, main1.h) != false){
			//return getGrid(cordx-1, cordy+1).color;
			neighbour.push(main1.getGrid(cordx-1, cordy+1)); // Comment out to check diagonally!
			//console.log("BOTTOM-LEFT");
		}
		// Bottom-right
		if(main1.getGrid(cordx+1, cordy+1, main1.w, main1.h) != false){
			//return getGrid(cordx+1, cordy+1).color;
			neighbour.push(main1.getGrid(cordx+1, cordy+1)); // Comment out to check diagonally!
			//console.log("BOTTOM-RIGHT");
		}
	}
	// Top
	if(main1.getGrid(cordx, cordy-1, main1.w, main1.h) != false){
		//return getGrid(cordx, cordy-1).color;
		neighbour.push(main1.getGrid(cordx, cordy-1, main1.w, main1.h));
		//console.log("TOP");
	}
	// Left
	if(main1.getGrid(cordx-1, cordy, main1.w, main1.h) != false){
		//return getGrid(cordx-1, cordy).color;
		neighbour.push(main1.getGrid(cordx-1, cordy, main1.w, main1.h));
		//console.log("LEFT");
	}
	// Right
	if(main1.getGrid(cordx+1, cordy, main1.w, main1.h) != false){
		//return getGrid(cordx+1, cordy).color;
		neighbour.push(main1.getGrid(cordx+1, cordy, main1.w, main1.h));
		//console.log("RIGHT");
	}
	// Bottom
	if(main1.getGrid(cordx, cordy+1, main1.w, main1.h) != false){
		//return getGrid(cordx, cordy+1).color;
		neighbour.push(main1.getGrid(cordx, cordy+1, main1.w, main1.h));
		//console.log("BOTTOM");
	}
	if(neighbour.length == 0){
		return false;
	} else {
		var filtered = neighbour.filter(function(element){ // New array
		return element.color !== "green"
		});
		return filtered;
	}
};

main.prototype.randomPos = function(){ // Wrong? Cant get 0?
	return [Math.floor(Math.random() * main1.ArrayOfNodes.length-1) + 1 , Math.floor(Math.random() * main1.ArrayOfNodes.length-1) + 1 ]; // 39
};

main.prototype.showPath = function(node){
	while(node.color !== "red"){
		main1.fillGrid(node.indexX, node.indexY, 'purple');
		node = main1.getGridById(node.predec);
	}
}

main.prototype.BFS = function(startPosi, adjlist){
	var sinkfound = 0;
	//var startItem = [startPosi]; // ENQUEUE(Q,s)
	var nodeInUse = startItem.shift(); // u = DEQUEUE(Q), remove from front
	//main1.showCurrent(main1.ctx, nodeInUse.indexX, nodeInUse.indexY);
	nodeNeighbour = main1.checkNeighbours(nodeInUse.indexY, nodeInUse.indexX);

	// for each v in G.Adj[u]
	for(i=0; i<nodeNeighbour.length;i++){
		var n = nodeNeighbour[i];
		if(n.color === "white"){
			main1.fillGrid(n.indexX, n.indexY, 'gray');
			n.predec = nodeInUse.id;
			n.distance = nodeInUse.distance + 1;
			startItem.push(n);
		} else {
			if(n.color === "blue"){
				console.log("Blue found!");
				main1.showPath(nodeInUse);
				sinkfound = 1;
				startup = false;
				noLoop();
				stop = true;
				return nodeInUse.distance+1;
			}
		}
	}
	if(nodeInUse.color !== "red"){
		main1.fillGrid(nodeInUse.indexX, nodeInUse.indexY, 'orange');
	} else {
		main1.fillGrid(nodeInUse.indexX, nodeInUse.indexY, 'red');
	}
};

main.prototype.getNonGreen = function(){
	var randNode = main1.randomPos();
	while(main1.getGrid(randNode[0], randNode[1], main1.w, main1.h).color === "green"){
		randNode = main1.randomPos();
	}
	return randNode;
};

main.prototype.generateMaze = function(){
// Depth-first, make all node white (all begin as green?)
// Move Up, Down, Left or Right (no diagonally yet)
// Must move 2 steps!
	pos = main1.randomPos();
	start = main1.getGrid(pos[0], pos[1], main1.w, main1.h);
	main1.fillGrid(start.indexX, start.indexY, 'white'); // mycolor = white
	var stack = [];
	
	while(true){
		var possiblemoves = main1.searchDeadEnd(start);
		if(possiblemoves != false){
			stack.push(start);
			start = main1.randMove(possiblemoves, start);
		} else {
			if(stack.length != 0){
				start = stack.pop();
			} else {
				console.log("Maze done!");
				return;
			}
		}
	}
};

main.prototype.searchDeadEnd = function(node){
	var neighbour = []; //console.log("searchDeadEnd");
	if((main1.getGrid(node.indexY, node.indexX-2, main1.w, main1.h) != false) && (main1.getGrid(node.indexY, node.indexX-2, main1.w, main1.h).color != "white") && (main1.getGrid(node.indexY, node.indexX-1, main1.w, main1.h).color != "white")){ // Top
		//neighbour.push(main1.getGrid(node.indexY, node.indexX-2));
		neighbour.push("top");
	}
	if((main1.getGrid(node.indexY-2, node.indexX, main1.w, main1.h) != false) && (main1.getGrid(node.indexY-2, node.indexX, main1.w, main1.h).color != "white") && (main1.getGrid(node.indexY-1, node.indexX, main1.w, main1.h).color != "white")){ // Left
		//neighbour.push(main1.getGrid(node.indexY-2, node.indexX));
		neighbour.push("left");
	}
	if((main1.getGrid(node.indexY+2, node.indexX, main1.w, main1.h) != false) && (main1.getGrid(node.indexY+2, node.indexX, main1.w, main1.h).color != "white") && (main1.getGrid(node.indexY+1, node.indexX, main1.w, main1.h).color != "white")){ // Right
		//neighbour.push(main1.getGrid(node.indexY+2, node.indexX));
		neighbour.push("right");
	}
	if((main1.getGrid(node.indexY, node.indexX+2, main1.w, main1.h) != false) && (main1.getGrid(node.indexY, node.indexX+2, main1.w, main1.h).color != "white") && (main1.getGrid(node.indexY, node.indexX+1, main1.w, main1.h).color != "white")){ // Bottom
		//neighbour.push(main1.getGrid(node.indexY, node.indexX+2));
		neighbour.push("bottom");
	}
	if(neighbour.length == 0){
		return false;
	} else {
		return neighbour; // true
	}
}

main.prototype.randMove = function(nodes, node){
	// Check array (possible moves), select one randomly, (choose dep. on array size)
	// Nodes is an array of possible moves
	direction = nodes[(Math.floor(Math.random() * nodes.length) + 0)];
	switch (direction) { // Math.floor(Math.random() * 4) + 0
		case "top": // Top
				main1.fillGrid(node.indexX-1, node.indexY, "white");
				main1.fillGrid(node.indexX-2, node.indexY, "white");
				return main1.getGrid(node.indexY, node.indexX-2, main1.w, main1.h);
				
		case "left": // Left
				main1.fillGrid(node.indexX, node.indexY-1, "white");
				main1.fillGrid(node.indexX, node.indexY-2, "white");
				return main1.getGrid(node.indexY-2, node.indexX, main1.w, main1.h);
				
		case "right": // Right
				main1.fillGrid(node.indexX, node.indexY+1, "white");
				main1.fillGrid(node.indexX, node.indexY+2, "white");
				return main1.getGrid(node.indexY+2, node.indexX, main1.w, main1.h);
				
		case "bottom": // Bottom
				main1.fillGrid(node.indexX+1, node.indexY, "white");
				main1.fillGrid(node.indexX+2, node.indexY, "white");
				return main1.getGrid(node.indexY, node.indexX+2, main1.w, main1.h);
	}
};



