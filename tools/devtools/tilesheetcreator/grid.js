function Grid(htmlObject, ctx) {
	this.htmlCanvas = htmlObject;
	this.ctx = ctx;
	this.spacingX = 128;
	this.spacingY = 128;
	this.color = "#333333";
	this.cols = 8;
	this.rows = 8;
	this.zoomLevel = 100;
	this.height = 1024; //canvas height and width
	this.width = 1024;
	this.drawWidth = 1024;// haight and width according to zoom level
	this.drawHeight = 1024;
	this.drawCellNumbers = true;
	this.showingTrimArea = false;


	this.drawGrid = function () {
		this.cols = this.width / this.spacingX;
		this.rows = this.height / this.spacingY;
		gridCtx.lineWidth = "1";
		gridCtx.clearRect(0, 0, this.drawWidth, this.drawHeight);

		//draw cols
		for (let i = 0; i < this.cols; i++) {
			gridCtx.beginPath();
			gridCtx.setLineDash([5, 1]);/*dashes are 5px and spaces are 3px*/


			gridCtx.moveTo(i * Math.round((this.spacingX / 100) * this.zoomLevel), 0);
			gridCtx.lineTo(i * Math.round((this.spacingX / 100) * this.zoomLevel), this.drawHeight);
			gridCtx.strokeStyle = this.color;
			gridCtx.stroke();
		}

		for (let i = 0; i < this.rows; i++) {
			gridCtx.beginPath();
			gridCtx.setLineDash([3, 3]);/*dashes are 5px and spaces are 3px*/

			gridCtx.moveTo(0, i * Math.round((this.spacingY / 100) * this.zoomLevel));
			gridCtx.lineTo(this.drawWidth, i * Math.round((this.spacingY / 100) * this.zoomLevel));
			gridCtx.strokeStyle = this.color;
			gridCtx.stroke();
		}

	}



	this.drawCellNumber = function (x, y, text) {

	}


	this.clearCanvas = function () {
		gridCtx.clearRect(0, 0, this.drawWidth, this.drawHeight);
	}

	this.drawTrimArea = function () {
		this.showingTrimArea = true;
		let trimData = canvas.calculateTrim();
		//console.log("showing trim area");
		let trimTop = Math.round((trimData.trimTop / 100) * this.zoomLevel);
		let trimBottom = Math.round((trimData.trimBottom / 100) * this.zoomLevel);
		let trimLeft = Math.round((trimData.trimLeft / 100) * this.zoomLevel);
		let trimRight = Math.round((trimData.trimRight / 100) * this.zoomLevel);

		//draw top trim area
		this.ctx.globalAlpha = 0.3;
		this.ctx.fillStyle = "#000000";
		this.ctx.fillRect(0, 0, this.drawWidth, trimTop); //top
		this.ctx.fillRect(0, trimTop, trimLeft, this.drawHeight - trimTop); //left
		this.ctx.fillRect(this.drawWidth - trimRight, trimTop, trimRight, this.drawHeight - trimTop); //right
		this.ctx.fillRect(trimLeft, this.drawHeight - trimBottom, this.drawWidth - (trimLeft + trimRight), trimBottom); //bottom
		this.ctx.globalAlpha = 1;

		this.ctx.lineWidth = "3";
		this.ctx.strokeStyle = "green";
		this.ctx.setLineDash([])
		this.ctx.strokeRect(trimLeft, trimTop, this.drawWidth - (trimLeft + trimRight), this.drawHeight - (trimTop + trimBottom));

	}


	this.clearTrimArea = function () {
		if (this.showingTrimArea === false) { return false; }
		this.showingTrimArea = false;
		this.clearCanvas();
		this.drawGrid();
	}



	// CHANGE CANVAS SIZE	
	this.changeCanvasSize = function (newWidth, newHeight) {

		this.height = newHeight;
		this.width = newWidth;
		this.drawWidth = (this.width / 100) * this.zoomLevel;
		this.drawHeight = (this.height / 100) * this.zoomLevel;


		this.htmlCanvas.width = this.drawWidth;
		this.htmlCanvas.height = this.drawHeight;
		this.htmlCanvas.style.width = this.drawWidth + "px";
		this.htmlCanvas.style.height = this.drawHeight + "px";
		this.drawGrid();
		if (this.showingTrimArea) {
			this.drawTrimArea();
		}
	}


	//change zoom level	
	this.setZoom = function (zoomLevel) {
		this.zoomLevel = zoomLevel;
		this.drawWidth = Math.round((this.width / 100) * this.zoomLevel);
		this.drawHeight = Math.round((this.height / 100) * this.zoomLevel);
		this.htmlCanvas.width = this.drawWidth;
		this.htmlCanvas.height = this.drawHeight;
		this.htmlCanvas.style.width = this.drawWidth + "px";
		this.htmlCanvas.style.height = this.drawHeight + "px";
		this.drawGrid();
		if (this.showingTrimArea) {
			this.drawTrimArea();
		}

	}


}
