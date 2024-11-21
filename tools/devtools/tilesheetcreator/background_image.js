function BackgroundImage(htmlObject,ctx){
	
	this.htmlCanvas=htmlObject;
	this.backgroundImage=null;
	this.ctx=ctx;
	this.width=1024;
	this.height=1024;
	this.zoomLevel=100;
	this.drawWidth=this.width;
	this.drawHeight=this.height;
	this.isUsed=false;
	this.img=false;//this item contains the image data
	this.imageDimensions={width:0,height:0};
	this.imageDraw={x:0,y:0};
	this.exportOnSheet=true;
	this.cutToGrid=true;
	this.cutX=128;
	this.cutY=128;
	this.placeAfterCut=true;
	this.removeBlankTiles=true;
	this.slicedTiles=new Array();
	this.importSmoothing=true;
	



	this.drawBackground=function(){
		//no image to draw
		if(this.img===false){
			//console.log("no image o draw");
			return false;
		}
		
		let x=Math.round((this.imageDraw.x/100)*this.zoomLevel);
		let y=Math.round((this.imageDraw.y/100)*this.zoomLevel);
		let width=Math.round((this.imageDimensions.width/100)*this.zoomLevel);
		let height=Math.round((this.imageDimensions.height/100)*this.zoomLevel);
		
		
		
		this.ctx.drawImage(this.img,x,y,width,height);
	}
	
	
	
	
	
	
	
	
	
	


this.importBackgroundImage=function(){
	
	//set up tile size
	if(this.cutToGrid){
		this.cutX=grid.spacingX;
		this.cutY=grid.spacingY;}
	//create a temp canvas the same size as the tile we want to export
			var tempCanvas=document.createElement("canvas");
				tempCanvas.setAttribute("id", "importCanvas");
				tempCanvas.setAttribute("width", this.cutX);
				tempCanvas.setAttribute("height",this.cutY);
				tempCanvas.style.display="none";
				tempCanvas.style.width=this.cutX+"px";
				tempCanvas.style.height=this.cutY+"px";
			var tempCtx=tempCanvas.getContext('2d');
				tempCtx.imageSmoothingEnabled = this.importSmoothing;
				
	let cols=Math.ceil(this.img.width/this.cutX);
	let rows=Math.ceil(this.img.height/this.cutY);
	let tiles=rows*cols;
	let col=1;
	let row=1;
	
	//console.log("cols="+ cols +" rows=" + rows + "tiles=" + tiles);
	
	for (let i=0; i < tiles; i++){
				
				//draw tile on canvas
				//console.log("col="+ col +" row=" + row + "tile=" + i);
				let sX=(col-1)*this.cutX;
				let sY=(row-1)*this.cutY;
				let sWidth=this.cutX;
				let sHeight=this.cutY;
				let dX=0;
				let dY=0;
				let dWidth=this.cutX;
				let dHeight=this.cutY;
				tempCtx.drawImage(this.img, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
				
				//is this tile blank. 
				if(this.removeBlankTiles){
					let empty=this.isEmpty(tempCtx);
					//if empty break out of this iteration
					if(empty){
						if(col >= cols){col=1; row+=1;}
						else{col+=1}
						tempCtx.clearRect(0,0, this.cutX, this.cutY);
						continue; // skip this whole iteration
					}
				}
				
				//calculate position on canvas
				let newTile=new Image();
				newTile.src=tempCanvas.toDataURL("image/png");
				newTile.drawX=((col-1)*this.cutX)+this.imageDraw.x;
				newTile.drawY=((row-1)*this.cutY)+this.imageDraw.y;
				newTile.width=this.cutX;
				newTile.height=this.cutY;
				newTile.naturalWidth=this.cutX; newTile.naturalHeight=this.cutY;
				newTile.name= "tile"+"_"+padNumber(i+1)+"_from_"+this.img.name;
				newTile.title="tile"+"_"+padNumber(i+1)+"_from_"+this.img.name;
				newTile.alt=  "tile"+"_"+padNumber(i+1)+"_from_"+this.img.name;
				let id=makeid(8);
				newTile.id=id;
				newTile.idString=id;
				
				newTile.onload = function() { 
					backgroundImage.slicedTiles.push(newTile);
					backgroundImage.addImportedTileToPalette(backgroundImage.slicedTiles.length-1);
					if(backgroundImage.placeAfterCut){
						backgroundImage.addImportedTileToCanvas(backgroundImage.slicedTiles.length-1);}
					}
						
				tempCtx.clearRect(0,0, this.cutX, this.cutY);
				//set up col and row for next cut
				if(col >= cols){col=1; row+=1;}
				else{col+=1}
		}
		
		this.img=false;
		this.isUsed=false;
		this.clearCanvas();
		console.log(this.slicedTiles);
		this.slicedTiles.length=0;
	}

	
	
	
	
	
	
	
	
	this.addImportedTileToCanvas=function(index){
		message("adding to canvas");
		
		
		let gridData=canvas.getGridPointData(this.slicedTiles[index].drawX, this.slicedTiles[index].drawY); //translate those coords to canvas grid data
		console.log(gridData);
		//let draggedTile=getTileById(DRAG_ID); // get the info
		let newTile=canvas.createTileObject(getTileById(this.slicedTiles[index].id),gridData.drawX,gridData.drawY)//create a new tile object
		//check if there is a tile there
		let occupantTileIndex=canvas.isTileHere(this.slicedTiles[index].drawX, this.slicedTiles[index].drawY);
		//if tile position is off canvas
		
		
		if(newTile.drawX+newTile.drawWidth > canvas.width){
			message("Warning some of the tiles from the import could not fit on the sheet- find these tiles in your tile palette or resize your tile sheet and try again.");
			return(false);
		}
		if(newTile.drawY+newTile.drawHeight > canvas.height){
			message("Warning some of the tiles from the import could not fit on the sheet- find these tiles in your tile palette or resize your tile sheet and try again.");
			return(false);
		}	
			
		//was there an already placed tile?	
		if(occupantTileIndex !== false){ // !==false because the occupant tile index could be 0
			let occupantTileId=canvas.tilesOncanvas[occupantTileIndex].tileId;
			let occupantTileCanvasId=canvas.tilesOncanvas[occupantTileIndex].onCanvasId;
			//if we can't over write tiles
			if(OVERWRITE_POSITIONED_TILES===false){
				message("Could not position tile "+ newTile.tileName +" on the tile sheet. A tile was already in in this position. Tile has been moved to your palette.");
				return false;
			}
			// if we can override this tile
			else{
						
				canvas.clearTileArea(occupantTileIndex);
				canvas.tilesOncanvas.push(newTile);
				canvas.drawTile(canvas.tilesOncanvas.length-1);
				hidePaletteTile(newTile.tileId);
				canvas.tilesOncanvas.splice(occupantTileIndex,1);//remove first or replace palette will find it
				replacePaletteTile(occupantTileId);
				message("Tile "+canvas.tilesOncanvas[occupantTileIndex].tileName+" was overwritten and returned to your palette");
				}
			}
		//if there was no tile in the place
		else{
			canvas.tilesOncanvas.push(newTile);
			canvas.drawTile(canvas.tilesOncanvas.length-1);
			hidePaletteTile(newTile.tileId);
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	this.addImportedTileToPalette=function(index){
		
		tiles.push(this.slicedTiles[index]);
		
		let holderClass="listViewHolder";
		let display="inline-block";
		if(PALETTEVIEW==="LIST"){holderClass="listViewHolder";}
		else{holderClass="blockViewHolder";}
		if(this.placeAfterCut){display="inline-block";}
		
	
		var id=this.slicedTiles[index].id;
		//message("id when adding to palette" + id);
		// appends file info to the list
		
		//create Tile holder
		var tilePreviewHolder=document.createElement("div");
		tilePreviewHolder.setAttribute("id", "holder"+id);
		tilePreviewHolder.setAttribute("class", holderClass);
		tilePreviewHolder.setAttribute("style", "display:inline-block");
		
		//create tile preview
		var tilePreview=document.createElement("img");
		tilePreview.setAttribute("class", "tilePreview");
		tilePreview.setAttribute("id", "tilePreview"+id);
		tilePreview.setAttribute("title", this.slicedTiles[index].title + "-" + this.slicedTiles[index].width + "px by "+this.slicedTiles[index].height +"px");
		tilePreview.setAttribute("src", this.slicedTiles[index].src);
		tilePreview.setAttribute("draggable", this.slicedTiles[index].src);
		
		tilePreview.addEventListener('mousedown' , function(evnt){startDrag(id ,evnt )})
		
		
		//create title
		var tileTitle=document.createElement("p");
			tileTitle.setAttribute("class", "paletteTileTitle" );
			tileTitle.setAttribute("id", "tileTitle"+id);
			tileTitle.innerHTML=this.slicedTiles[index].name+ "-" + this.slicedTiles[index].width + "px by "+this.slicedTiles[index].height +"px";
			
		
		
		//create remove icon
		var removeIcon=document.createElement("img");
		removeIcon.setAttribute("class", "binIcon");
		removeIcon.setAttribute("id", "remove"+id);
		removeIcon.setAttribute("alt", "remove tile");
		removeIcon.setAttribute("title", "remove tile - *(removes placed tile from tile sheet)");
		removeIcon.setAttribute("src", "../img/bin.png");
		removeIcon.addEventListener('click' , function(evnt){removeTileFromPreview(id);})
		
		//add preview to list
		tilePreviewHolder.appendChild(tilePreview);
		tilePreviewHolder.appendChild(tileTitle);
		tilePreviewHolder.appendChild(removeIcon);
		paletteTileContainer.appendChild(tilePreviewHolder);
		
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	this.isEmpty=function(ctx){
		
		let isEmpty=true;
		let x,y=0;
		let imageData=ctx.getImageData(0,0,this.cutX, this.cutY);
		let data=imageData.data;
			for(let i=4; i< data.length; i+=4){
				//if(i===8){console.log(data[i]);}
				if(data[i]!==0){ isEmpty=false; break;}
					
			}
			//console.log("isEmpty=" + isEmpty);
		return isEmpty;
	}
	
	
	
	
	
	





	this.changeBackgroundPosition=function(newX,newY){
		this.imageDraw.x=newX;
		this.imageDraw.y=newY;
		this.clearCanvas();
		this.drawBackground();
	}
	


	
	this.removeBackground=function(){
		this.img=null;
		this.img=false;
		this.clearCanvas();
	}
	
	
	
	



this.clearCanvas=function(){
	this.ctx.clearRect(0,0,this.drawWidth,this.drawHeight);
}
		
		
		
	







	this.changeCanvasSize=function(newWidth,newHeight){
		
		this.height=newHeight;
		this.width=newWidth;
		this.drawWidth=Math.round( (this.width/100)*this.zoomLevel);
		this.drawHeight=Math.round( (this.height/100)*this.zoomLevel);
		
		
		this.htmlCanvas.width=this.drawWidth;
		this.htmlCanvas.height=this.drawHeight;
		this.htmlCanvas.style.width=this.drawWidth+"px";
		this.htmlCanvas.style.height=this.drawHeight+"px";
		this.clearCanvas();
		this.drawBackground();
	}
	
	
	
	
	
	
	
	
	
//change zoom level	
	this.setZoom=function(zoomLevel){
		this.zoomLevel=zoomLevel;
		this.drawWidth=Math.round((this.width/100)*this.zoomLevel);
		this.drawHeight=Math.round((this.height/100)*this.zoomLevel);
		
		this.htmlCanvas.width=this.drawWidth;
		this.htmlCanvas.height=this.drawHeight;
		this.htmlCanvas.style.width=this.drawWidth+"px";
		this.htmlCanvas.style.height=this.drawHeight+"px";
		this.clearCanvas();
		this.drawBackground();
		
	}
	







}