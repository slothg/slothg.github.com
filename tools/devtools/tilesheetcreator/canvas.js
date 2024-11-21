function Canvas(htmlObject, ctx) {

	this.htmlCanvas = htmlObject;
	this.backgroundImage = null;
	this.ctx = ctx;
	this.pageOffsetX = 0;
	this.pageOffsetY = 0;
	this.width = 1024;
	this.height = 1024;
	this.tilePositioned = 0;
	this.boxCollider = { l: 0, r: 0, t: 0, b: 0 }; //get coordinates relative to the page - l=left, r= right , t=top, b=bottom
	this.clickCoords = { x: 0, y: 0 };
	this.tilesOncanvas = new Array();
	this.trimEdges = { l: 0, r: 0, t: 0, b: 0 };
	this.zoomLevel = 100;
	this.drawWidth = this.width;
	this.drawHeight = this.height;

	this.createTileObject = function (tileType, drawX, drawY) {

		let newTile = {
			tileId: tileType.id,
			onCanvasId: makeid(8),
			isClone: false,
			parentId: "none",
			visibilty: true,
			drawX: drawX, //relative to canvas real dimensions
			drawY: drawY, //relative to canvas real dimensions
			drawWidth: USER_TILE_WIDTH,
			drawHeight: USER_TILE_HEIGHT,
			invertX: false,
			invertY: false,
			opacity: 1,
			tileName: tileType.name,
			naturalWidth: tileType.width,
			naturalHeight: tileType.height
		};

		if (FORCE_TILE_RESIZE) {
			newTile.drawWidth = USER_TILE_WIDTH;
			newTile.drawHeight = USER_TILE_HEIGHT;
		}
		else {
			newTile.drawWidth = tileType.width;
			newTile.drawHeight = tileType.height;
		}

		return newTile;

	}


	this.cloneTile = function (parentTileIndex, drawX, drawY) {
		console.log("CANVAS.js - clone tile called");
		let parentTile = this.tilesOncanvas[parentTileIndex];
		//console.log(clone);
		let clone = {
			tileId: parentTile.tileId,
			onCanvasId: makeid(8),
			visibilty: true,
			isClone: true,
			parentId: parentTile.onCanvasId,
			drawX: drawX,
			drawY: drawY,
			drawWidth: parentTile.drawWidth,
			drawHeight: parentTile.drawHeight,
			invertX: parentTile.invertX,
			invertY: parentTile.invertY,
			opacity: parentTile.opacity,
			tileName: parentTile.invertY.name,
			naturalWidth: parentTile.naturalWidth,
			naturalHeight: parentTile.naturalHeight
		};
		this.tilesOncanvas.push(clone);
	}

	this.autoDropTile = function (tileId) {
		//loops through grid does collision detect for every tile it drops
		let PointX = 0;
		let PointY = 0;
		let incrementX = grid.spacingX;
		let incrementY = grid.spacingY;
		//if we run out of squares to add the tile add another row

	}


	//-------------------------------------------------|  TILE DRAWING METHODS |---------------
	//will draw tile on canvas accordin to zoom level
	this.drawTile = function (index) {
		//console.log("CANVAS.JS drawtile()");
		let img = getTileById(this.tilesOncanvas[index].tileId);

		//console.log(this.tilesOncanvas[index]);
		let invertX = this.tilesOncanvas[index].invertX;
		let invertY = this.tilesOncanvas[index].invertY;
		let drawInverted = false;
		let scaleX = 1;
		let scaleY = 1;
		this.ctx.globalAlpha = this.tilesOncanvas[index].opacity; //set the opacity every draw call


		let x = Math.round((this.tilesOncanvas[index].drawX / 100) * this.zoomLevel);
		let y = Math.round((this.tilesOncanvas[index].drawY / 100) * this.zoomLevel);
		let width = Math.round((this.tilesOncanvas[index].drawWidth / 100) * this.zoomLevel);
		let height = Math.round((this.tilesOncanvas[index].drawHeight / 100) * this.zoomLevel);


		//console.log("image" + index);
		if (invertX === true) {
			drawInverted = true;
			scaleX = -1;
			x = 0 - width;
			y = 0;

		}

		if (invertY === true) {
			drawInverted = true;
			scaleY = -1;
			y = 0 - height;
			if (invertX) { x = 0 - width; } else { x = 0; }

		}

		if (drawInverted) {

			let tX = Math.round((this.tilesOncanvas[index].drawX / 100) * this.zoomLevel);
			let tY = Math.round((this.tilesOncanvas[index].drawY / 100) * this.zoomLevel);

			//console.log(this.tilesOncanvas);
			//console.log("xscale=" + scaleX + "y scale" + scaleY + "x="+ x +"y=" + y );
			this.ctx.save();
			this.ctx.translate(tX, tY);
			this.ctx.scale(scaleX, scaleY);
			this.ctx.drawImage(img, x, y, width, height)
			this.ctx.restore();
		}
		else { this.ctx.drawImage(img, x, y, width, height); }
		if (grid.showingTrimArea) {
			grid.clearCanvas();
			grid.drawGrid();
			grid.drawTrimArea();
		}
	}

	// DRAW ALL TILES FROM ONTILE ARRAY
	this.drawTiles = function () {
		//console.log("CANVAS.JS - drawTiles()");
		for (let i = 0; i < this.tilesOncanvas.length; i++) {
			//console.log("tile " + i);
			this.drawTile(i);
		}
	}


	//clears an area where tile is looks up tile by it's index
	this.clearTileArea = function (index) {
		//console.log("clearing tile area");
		let x = Math.round((this.tilesOncanvas[index].drawX / 100) * this.zoomLevel);
		let y = Math.round((this.tilesOncanvas[index].drawY / 100) * this.zoomLevel);
		let width = Math.round((this.tilesOncanvas[index].drawWidth / 100) * this.zoomLevel);
		let height = Math.round((this.tilesOncanvas[index].drawHeight / 100) * this.zoomLevel);
		this.ctx.clearRect(x, y, width, height);
	}


	this.clearCanvas = function () {
		this.ctx.clearRect(0, 0, this.drawWidth, this.drawHeight);
	}

	// DETECT TILE
	// detetcs if a tile is placed on the canvas at given coordinates
	//returns false if not - returns tilesOncanvas index number if true


	//determine if something  was droped over canvas
	//runs simple collision detection over canvas box collider coords
	this.actionDetect = function (event) {
		this.getCanvasBoxCollider();
		dropX = event.pageX;
		dropY = event.pageY;
		if (dropX > this.boxCollider.l && dropX < this.boxCollider.r && dropY > this.boxCollider.t && dropY < this.boxCollider.b) {

			return true;
		}
		else {
			return false;
		}
	}


	//expects x and y to be relative to canvas aindependent of zoom rate
	this.isTileHere = function (x, y) {
		//console.log("checking for tile");
		let value = false;
		for (let i = 0; i < this.tilesOncanvas.length; i++) {
			//console.log("checking box collider info");
			//console.log("click area=" + x + "- " + y);
			let coords = {
				x: parseInt(this.tilesOncanvas[i].drawX),
				width: parseInt(this.tilesOncanvas[i].drawWidth),
				y: parseInt(this.tilesOncanvas[i].drawY),
				height: parseInt(this.tilesOncanvas[i].drawHeight)
			}
			//console.log(coords);
			if (x >= coords.x && x < coords.x + coords.width && y >= coords.y && y < coords.y + coords.width) {
				//console.log("collides with" + i);
				value = i;
				break;
			}
		}
		return value;
	}


	// ------------------------------------------------------------------ COORDINATES METHODS

	//call the details for canvas box collider.  
	//sets boxcollider coordinates relative to position on page
	//sets coordinates of the canvas on the page, does not get coordings of clicks relative to canvas
	this.getCanvasBoxCollider = function () {
		let canvasMargin = { x: 20, y: 20 };//get margins these margins are hard coded
		let canvasViewport = masterCanvasHolder.getBoundingClientRect(); // masterCanvasHolder reference html object outside of class
		let colliderWidth = canvasViewport.width;   //masterCanvasHolder.scrollLeft;
		let colliderHeight = canvasViewport.height; //+masterCanvasHolder.scrollTop;

		//determine canvas click width/height
		//if the user selected canvas is larger than the view port(it scrolls in viewport) thenset the collider with to just the view port
		if (this.drawWidth < canvasViewport.width) {
			colliderWidth = this.drawWidth;
		}


		if (this.drawHeight < canvasViewport.height) {
			colliderHeight = this.drawHeight;
		}

		colliderHeight -= 0;
		colliderWidth -= 5;

		if (masterCanvasHolder.scrollWidth > masterCanvasHolder.clientWidth) {
			colliderHeight -= 45;//console.log("horizontal  scroll bar detected");
		}
		if (masterCanvasHolder.scrollHeight > masterCanvasHolder.clientHeight) {
			colliderWidth -= 15;//console.log("vertical  scroll bar detected");
		}

		//console.log( " - width" + this.width + "height " + this.height + " -" + canvasViewport.top );
		//console.log( "collider width= "+colliderWidth + " colliderHeight= " + colliderHeight + "scrollx= " + window.scrollX);
		//console.log( "offset left= "+ canvasViewport.left + " colliderWidth= " + colliderWidth + "scrollx= " + window.scrollX);
		this.boxCollider.l = parseInt(canvasViewport.left) + parseInt(window.scrollX) + parseInt(canvasMargin.x);
		this.boxCollider.r = parseInt(canvasViewport.left) + parseInt(colliderWidth) + parseInt(window.scrollX) + parseInt(canvasMargin.x);
		this.boxCollider.t = parseInt(canvasViewport.top) + parseInt(window.scrollY) + parseInt(canvasMargin.y);
		this.boxCollider.b = parseInt(canvasViewport.top) + parseInt(colliderHeight) + parseInt(window.scrollY) + parseInt(canvasMargin.y);

		//check for scroll bar x at the base of master canvas as onclick bubbles through
		//we could do this above but it's getting messy



		//console.log("box collider left=" + this.boxCollider.l + " box collider right=" + this.boxCollider.r + " box collider top=" + this.boxCollider.t + " box collider bottom=" + this.boxCollider.b );
	}


	//-set these coords everytime you want to get a postion
	//call set canvas box collider before calling this method if viewport display has changed, 
	//click x and click y are page coordinates 

	this.getCanvasCoords = function (clickX, clickY) {

		let canvasCoords = { x: 0, y: 0 };

		this.clickCoords.x = (clickX - this.boxCollider.l) + masterCanvasHolder.scrollLeft;
		this.clickCoords.y = (clickY - this.boxCollider.t) + masterCanvasHolder.scrollTop;


		//console.log("DROP COORDS before zoom adjust: canvas x=  " + this.clickCoords.x + "canvas y= " +  this.clickCoords.y);

		this.clickCoords.x = Math.round((this.clickCoords.x / this.zoomLevel) * 100);
		this.clickCoords.y = Math.round((this.clickCoords.y / this.zoomLevel) * 100);


		//console.log("DROP COORDS: after zoom adjust canvas x=  " + this.clickCoords.x + "canvas y= " +  this.clickCoords.y);


		canvasCoords.x = this.clickCoords.x;
		canvasCoords.y = this.clickCoords.y;

		return canvasCoords;

	}


	//generates and returns grid number object independent of canvas zoom level
	//grid data returned is data at tru canvas size(100%)
	//args= canvas x an y point. x and y must be true x y relative to canvas x y  canvas points
	//use this.getCanvasCoords for translating mouse clicks page coords to canvas coords
	this.getGridPointData = function (x, y) {


		let colNumber = Math.floor(x / grid.spacingX) + 1;
		let rowNumber = Math.floor(y / grid.spacingY) + 1;
		let cellNumber = (rowNumber * grid.cols) - (grid.cols - colNumber);
		let drawPointX = (colNumber - 1) * grid.spacingX;
		let drawPointY = (rowNumber - 1) * grid.spacingY;

		let gridData = {
			boxesAcross: colNumber,
			boxesdown: rowNumber,
			boxNumber: cellNumber,
			drawX: drawPointX,
			drawY: drawPointY
		}

		//console.log(gridData);
		return gridData;

	}


	//--REMOVE TILE
	// can take an id or an index number
	this.removeTileByIndex = function (index) {
		this.clearTileArea(index);
		//remove the tile from the array
		//console.log("removing tile on canvas");
		this.tilesOncanvas.splice(index, 1);
	}


	//removes mulitple tiles of certain id from the canvas and from the tilesoncanvas array
	this.removeTilesById = function (id) {
		for (let i = this.tilesOncanvas.length; i > 0; i--) {
			let index = i - 1;
			if (this.tilesOncanvas[index].tileId === id) {
				this.removeTileByIndex(index);

			}

		}

	}

	this.removeTileById = function (id) {
		//console.log("removing tile by id");
		for (let i = this.tilesOncanvas.length; i > 0; i--) {
			let index = i - 1;
			if (this.tilesOncanvas[index].onCanvasId === id) {
				this.removeTileByIndex(index);

			}
		}

	}


	//- GET TILE INDEX BY ID  get a tile index number by it's id
	this.getTileOnCanvasIndexById = function (id) {
		let tileIndex = false;
		for (var i = 0; i < this.tilesOncanvas.length; i++) {
			if (this.tilesOncanvas[i].tileId === id) {
				tileIndex = i;
				break;
			}
		}
		return tileIndex;

	}


	//--USER OPERATIONS	


	this.toggleXInversion = function (index) {
		if (this.tilesOncanvas[index].invertX === true) {
			this.tilesOncanvas[index].invertX = false;
		}
		else if (this.tilesOncanvas[index].invertX === false) {
			this.tilesOncanvas[index].invertX = true;
		}
	}

	this.toggleYInversion = function (index) {

		if (this.tilesOncanvas[index].invertY === true) {
			this.tilesOncanvas[index].invertY = false;
		}
		else if (this.tilesOncanvas[index].invertY === false) {
			this.tilesOncanvas[index].invertY = true;
		}

	}


	this.changeCanvasSize = function (newWidth, newHeight) {
		//console.log("calling canvas resize");
		this.height = newHeight;
		this.width = newWidth;
		this.drawWidth = Math.round((this.width / 100) * this.zoomLevel);
		this.drawHeight = Math.round((this.height / 100) * this.zoomLevel);
		this.htmlCanvas.width = this.drawWidth;
		this.htmlCanvas.height = this.drawHeight;
		this.htmlCanvas.style.width = this.drawWidth + "px";
		this.htmlCanvas.style.height = this.drawHeight + "px";
		this.drawTiles();//redraw tiles changing canvas size clears canvas

	}

	this.setZoom = function (zoomLevel) {
		this.zoomLevel = zoomLevel;
		this.drawWidth = Math.round((this.width / 100) * this.zoomLevel);
		this.drawHeight = Math.round((this.height / 100) * this.zoomLevel);
		this.htmlCanvas.width = this.drawWidth;
		this.htmlCanvas.height = this.drawHeight;
		this.htmlCanvas.style.width = this.drawWidth + "px";
		this.htmlCanvas.style.height = this.drawHeight + "px";
		this.clearCanvas();
		this.drawTiles();//redraw tiles changing canvas size clears canvas

	}

	//-- EXPORTINGS----	

	this.exportCanvas = function () {

		let tempCanvasHeight = this.height;
		let tempCanvasWidth = this.width;
		let trimLeft = 0;
		let trimTop = 0;


		//console.log('drawing tem canvas');
		//if auto clipping unsed area from tilesheet
		if (AUTOTRIM) {
			//console.log("triming canvas");
			let trimData = this.calculateTrim();
			trimLeft = trimData.trimLeft;
			trimTop = trimData.trimTop;
			tempCanvasWidth = trimData.widthTotal;
			tempCanvasHeight = trimData.heightTotal;
		}


		//create a canvas 
		var tempCanvas = document.createElement("canvas");
		tempCanvas.setAttribute("id", "exportCanvas");
		tempCanvas.setAttribute("width", tempCanvasWidth);
		tempCanvas.setAttribute("height", tempCanvasHeight);
		tempCanvas.style.display = "none";
		var tempCtx = tempCanvas.getContext('2d');
		tempCtx.imageSmoothingEnabled = SMOOTHING;

		//lets draw the background to the canvas
		if (backgroundImage.img !== false) {
			//there was an image calculate it's trim factor. 
			if (backgroundImage.exportOnSheet) {
				let bgX = backgroundImage.imageDraw.x - trimLeft;
				let bgY = backgroundImage.imageDraw.y - trimTop;
				let bgWidth = backgroundImage.imageDimensions.width;
				let bgHeight = backgroundImage.imageDimensions.height;

				tempCtx.drawImage(backgroundImage.img, bgX, bgY, bgWidth, bgHeight);
			}

		}
		//star drawing tiles meat and potatoes of it
		for (let i = 0; i < this.tilesOncanvas.length; i++) {

			let img = getTileById(this.tilesOncanvas[i].tileId);
			let invertX = this.tilesOncanvas[i].invertX;
			let invertY = this.tilesOncanvas[i].invertY;
			let scaleX = 1;
			let scaleY = 1;
			let drawInverted = false;
			let x = this.tilesOncanvas[i].drawX - trimLeft;
			let y = this.tilesOncanvas[i].drawY - trimTop;
			let width = this.tilesOncanvas[i].drawWidth;
			let height = this.tilesOncanvas[i].drawHeight;




			if (invertX === true) {
				drawInverted = true;
				scaleX = -1;
				x = 0 - width;
				y = 0;
			}

			if (invertY === true) {
				drawInverted = true;
				scaleY = -1;
				y = 0 - height;
				if (invertX) { x = 0 - width; } else { x = 0; }
			}

			if (drawInverted) {
				//console.log(this.tilesOncanvas);
				//console.log("Xscale=" + scaleX + "  Yscale=" + scaleY + " | xPos="+ x +" yPos=" + y + "| width=" +width + "height=" +height );
				tempCtx.save();
				tempCtx.translate(this.tilesOncanvas[i].drawX - trimLeft, this.tilesOncanvas[i].drawY - trimTop);
				tempCtx.scale(scaleX, scaleY);
				tempCtx.drawImage(img, x, y, width, height)
				tempCtx.restore();
			}
			else {
				tempCtx.drawImage(img, x, y, width, height);

			}
		}

		//put canvas into dataURL
		let downloadLink = document.getElementById("downloadLink");
		downloadLink.href = tempCanvas.toDataURL();
		downloadLink.download = TILESHEETNAME + ".png";
		downloadLink.style.display = "block";


		//var outPutImage = new Image();
		//outPutImage.src = tempCanvas.toDataURL();
		//outPutImage.name= TILESHEETNAME;


		//console.log(target);
		//masterWrapper.appendChild(target);
		//destroy temp canvas
		tempCanvas = null;
	}



	this.calculateTrim = function () {

		//console.log("CANVAS.JS calculatingTrim()");
		let trimData = {
			minX: this.width, // set minimum amount the left can be is th emaximum canvas width for comparing later
			maxX: 0,
			minY: this.height,
			maxY: 0,
			trimTop: 0,
			trimBottom: 0,
			trimRight: 0,
			trimLeft: 0,
			widthTotal: this.width,
			heightTotal: this.height
		};
		// is there a background image
		if (backgroundImage.img !== false) {
			//there was an image calculate it's trim factor. 
			//remember backgrounds can be drawn off canvas
			if (backgroundImage.exportOnSheet === true) {
				//set up some shorthand variables
				let bgX = backgroundImage.imageDraw.x; let bgY = backgroundImage.imageDraw.y;
				let bgWidth = backgroundImage.imageDimensions.width; let bgHeight = backgroundImage.imageDimensions.height;

				//left
				if (bgX < trimData.minX) {
					trimData.minX = bgX;
					if (bgX < 0) { trimData.minX = 0; }
				}
				//right
				if (bgX + bgWidth > trimData.maxX) {
					trimData.maxX = bgX + bgWidth;
					if (trimData.maxX > this.width) { trimData.maxX = this.width; }
				}
				//top
				if (bgY < trimData.minY) {
					trimData.minY = bgY;
					if (bgY < 0) { trimData.minY = 0; }
				}
				//bottom
				if (bgY + bgHeight > trimData.maxY) {
					trimData.maxY = bgY + bgHeight;
					if (trimData.maxY > this.height) { trimData.maxY = this.height; }
				}
			}

		}

		//now loop through all images on the canvas and get the trim

		for (let i = 0; i < this.tilesOncanvas.length; i++) {
			// Get left trim is it closer to left edge than current.
			if (this.tilesOncanvas[i].drawX < trimData.minX) { trimData.minX = this.tilesOncanvas[i].drawX }
			if (this.tilesOncanvas[i].drawX + this.tilesOncanvas[i].drawWidth > trimData.maxX) {
				trimData.maxX = this.tilesOncanvas[i].drawX + this.tilesOncanvas[i].drawWidth
			} // Get right trim  is it closer to left edge than current.





			if (this.tilesOncanvas[i].drawY < trimData.minY) { trimData.minY = this.tilesOncanvas[i].drawY } // Get top trim is it closer to left edge than current.
			if (this.tilesOncanvas[i].drawY + this.tilesOncanvas[i].drawHeight > trimData.maxY) { trimData.maxY = this.tilesOncanvas[i].drawY + this.tilesOncanvas[i].drawHeight } // Get right trim  is it closer to left edge than current.
		}

		trimData.trimTop = trimData.minY;
		trimData.trimBottom = this.height - trimData.maxY;
		trimData.trimLeft = trimData.minX;
		trimData.trimRight = this.width - trimData.maxX;
		trimData.widthTotal = trimData.maxX - trimData.minX;
		trimData.heightTotal = trimData.maxY - trimData.minY
		console.log(trimData);
		return trimData;

	}


}