function changeTextureSize() {

	//change css and phyical grid canvas
	let newWidth = userInputTextureWidth.value;
	let newHeight = userInputTextureHeight.value;
	TEXTURE_WIDTH = newWidth;
	TEXTURE_HEIGHT = newHeight;
	canvas.changeCanvasSize(newWidth, newHeight);
	grid.changeCanvasSize(newWidth, newHeight);
	backgroundImage.changeCanvasSize(newWidth, newHeight);

}


function zoom(direction) {
	console.log("zooming" + direction);
	let maxZoom = 400;
	let minZoom = 25;
	let step = 25;

	if (direction === "IN") {
		if (ZOOMLEVEL < maxZoom) {
			ZOOMLEVEL += step;
		}
		else { console.log("max zoom reached"); }

	}

	else if (direction === "OUT") {
		if (ZOOMLEVEL > minZoom) {
			ZOOMLEVEL -= step;
		}
		else { console.log("min zoom reached"); }
	}


	document.getElementById("zoomPercent").innerHTML = ZOOMLEVEL + "%";
	canvas.setZoom(ZOOMLEVEL);
	grid.setZoom(ZOOMLEVEL);
	backgroundImage.setZoom(ZOOMLEVEL);


}


function changeGridSize() {
	grid.spacingX = userInputGridX.value;
	grid.spacingY = userInputGridY.value;
	grid.drawGrid();
	console.log("changed grid size");
}


function changeGridColor() {
	grid.color = userInputGridColor.value;
	grid.drawGrid();
}


function changeTileDimensionConfig(radioButton) {
	if (radioButton.value === "auto") { console.log("selecting get dimensions from tile image"); FORCE_TILE_RESIZE = false; userTileSelect.style.opacity = 0.3; }

	if (radioButton.value === "fixed") {
		//console.log("user defined tile dimensions"); 
		userTileSelect.style.opacity = 1;
		FORCE_TILE_RESIZE = true;
		USER_TILE_HEIGHT = userInputTileHeight.value;
		USER_TILE_WIDTH = userInputTileWidth.value;
		//update grid
		grid.spacingX = USER_TILE_WIDTH;
		grid.spacingY = USER_TILE_HEIGHT;
		grid.drawGrid();
		userInputGridX.value = USER_TILE_WIDTH;
		userInputGridY.value = USER_TILE_HEIGHT;
	}
}


function changeUserSelectedTileDimensions() {
	console.log("changing tile draw dimensions");
	USER_TILE_HEIGHT = userInputTileHeight.value;
	USER_TILE_WIDTH = userInputTileWidth.value;
	//update grid
	grid.spacingX = USER_TILE_WIDTH;
	grid.spacingY = USER_TILE_HEIGHT;
	grid.drawGrid();
	userInputGridX.value = USER_TILE_WIDTH;
	userInputGridY.value = USER_TILE_HEIGHT;
}


function changeTrimSettings() { }


function toggleOverwrite(checkBoxValue) {

	OVERWRITE_POSITIONED_TILES = checkBoxValue;
}


//RECALL ALL TILES


function recallAllTiles() {
	console.log("recalling placed tiles");
	let clear = false;
	if (canvas.tilesOncanvas.length >= 5) {
		if (window.confirm("回收瓷砖将永久清除当前网格上的瓷砖。您确定要继续吗？")) {
			clear = true;
		} else {
			clear = false;
			return false;
		}
	} else { clear = true; }

	if (clear) {
		for (let i = canvas.tilesOncanvas.length; i > 0; i--) {
			index = i - 1;
			tileId = canvas.tilesOncanvas[index].tileId;
			let preview = document.getElementById("holder" + tileId);
			preview.style.display = "inline-block";
			preview.style.opacity = 1;
			canvas.removeTileByIndex(index);
		}
	}
}


//HOT KEY CAPTURE


function keyDownControl(event) {
	ISKEYDOWN = true;
	let key = event.key;
	let keyCode = event.keyCode;
	//console.log("USER INPUT - keydownControl() key=" + key + "keyCode=" +keyCode);
	if (key === "c") {
		ISCLONING = true;

	}
	else if (key === "e" || key === "d") {
		ISDELETING = true;
	}
	else if (key === "h" || keyCode === 37) {
		ISINVERTINGX = true;
	}
	else if (key === "v" || keyCode === 340) {
		ISINVERTINGY = true;
	}
	else if (key === "+" || keyCode === 107) { zoom("IN"); }

	else if (key === "-" || keyCode === 108) { zoom("OUT"); }


}


function keyUpControl(event) {
	ISKEYDOWN = false;
	let key = event.key;
	let keyCode = event.keyCode;
	//console.log(key);
	if (key === "c") {

		ISCLONING = false;
	}
	else if (key === "e" || key === "d") {
		ISDELETING = false;
	}
	else if (key === "h" || keyCode === 37) {
		ISINVERTINGX = false;
	}

	else if (key === "v" || keyCode === 40) {
		ISINVERTINGY = false;
	}

}


function autoPlaceRemainingTiles() {
	//loop through all tiles 
	for (let i = 0; tiles.length; i++) {
		//determine whic tile are rmaining
		let isOnCanvas = false;
		let id = tiles[index].id;
		//check if this tile is on canvas
		for (let j = 0; j < canvas.tilesOncanvas.length; j++) {
			if (canvas.tilesOncanvas[j].tileId === id) {
				console.log("tile is already on tilesheet");
				isOnCanvas = true;
				break;
			}
		}
		//let's place the tile
		if (isOnCanvas === false) {




		}
	}
}


function removeTileFromPreview(id) {

	console.log("remove preview index " + id);
	let htmlObject = document.getElementById("holder" + id);
	paletteTileContainer.removeChild(htmlObject);
	//remove from canvas
	canvas.removeTilesById(id);
	//remove tile by id
	for (var i = 0; i < tiles.length; i++) {
		if (tiles[i].idString === id) {
			tiles.splice(i, 1);
		}
	}
}

function exportTilesheet() {
	console.log('exporting canvas');
	canvas.exportCanvas();
}

//------------------- user interface controls------------

function togglePanel(panel) {
	// let panelList = new Array("setup", "palette", "hotkeys", "export", "tilesets", "background", "about");
	let panelList = new Array("setup", "palette", "hotkeys", "export", "background");
	for (let i = 0; i < panelList.length; i++) {
		let menuButton = document.getElementById(panelList[i]);
		let htmlPanel = document.getElementById(panelList[i] + "Panel");


		//open this panel
		if (panelList[i] === panel) {
			menuButton.style.backgroundColor = "#2FAA96";
			htmlPanel.style.display = "block";

			if (panel === "export") {
				if (AUTOTRIM) {
					if (grid.showingTrimArea === false) { grid.drawTrimArea(); }
				}

			}
			else {
				if (grid.showingTrimArea) { grid.clearTrimArea(); }
			}
		}
		//close these panels
		else {
			menuButton.style.backgroundColor = "#152129";
			htmlPanel.style.display = "none";
		}

	}

}

function toggleHidePaletteTiles(value) {
	// hide - fade  - nothing// hide - fade  - nothing
	//will need to loop through all tiles and fix them
	if (value) { PLACED_TILES_PREVIEW_STATUS = "HIDE"; }
	else { PLACED_TILES_PREVIEW_STATUS = "NOTHIG"; }

	console.log("updating tile hide settings- hide placed tiles from palette=" + value);
}


function toogleSmoothing(checkbox) {
	console.log("USER INPUT.js toggleSmoothing(). smoothing =" + checkbox);
	SMOOTHING = checkbox;
}


function updateTileSheetName(name) {
	console.log("USER INLUT.js updateTileSheetName() new name= " + name);
	TILESHEETNAME = name;

}


function togglePaletteView(view) {
	console.log("changing palatte view to " + view + "view");
	let newClass = "blockViewHolder";
	if (view === "BLOCK") { PALETTEVIEW = "BLOCK"; newClass = "blockViewHolder" }
	else if (view === "LIST") { PALETTEVIEW = "LIST"; newClass = "listViewHolder"; }

	//now loop through palette children and add the new class
	var holders = paletteTileContainer.childNodes;
	for (let i = 0; i < holders.length; i++) {
		let currentDisplay = holders[i].style.display;
		holders[i].className = newClass;
		holders[i].style.display = currentDisplay;


	}

}


function changeExportTrimConfig(value) {
	console.log("USER INPUT.JS changeExportTrimConfig() value=" + value);
	if (value === "AUTO") {
		AUTOTRIM = true;
		grid.drawTrimArea();
	}
	else { AUTOTRIM = false; grid.clearTrimArea(); }
}


function changeBackgroundPosition() {

	let newX = document.getElementById("userInputBackgroundPositionX").value;
	let newY = document.getElementById("userInputBackgroundPositionY").value;
	backgroundImage.changeBackgroundPosition(parseInt(newX), parseInt(newY));

}

function deleteBackground() {
	document.getElementById("importBox").style.opacity = 0.4;
	document.getElementById("backgroundRemoveButton").style.backgroundColor = "#cccccc";
	document.getElementById("backgroundImportButton").style.backgroundColor = "#cccccc";

	backgroundImage.removeBackground();
	backgroundLabelElement.innerText = "add background tilsheet";

}


function toggleExportBackground(value) {
	backgroundImage.exportOnSheet = value;
}


function toggleBackgroundCutType(value) {
	if (value) {
		backgroundImage.cutToGrid = true;
		document.getElementById("setCutDimentions").style.opacity = 0.3;
	}
	else {
		backgroundImage.cutToGrid = false;
		document.getElementById("setCutDimentions").style.opacity = 1;
	}
}


function changeBackgroundCutSize() {
	let x = document.getElementById("userInputBackgroundCutSizeX").value;
	let y = document.getElementById("userInputBackgroundCutSizeY").value;
	backgroundImage.cutX = x;
	backgroundImage.cutY = y;
}


function toggleImportSmoothing(value) {
	if (value) {
		backgroundImage.importSmoothing = true;
	}
	else {
		backgroundImage.importSmoothing = false;
	}
}


function togglePlaceExportedTiles(value) {
	if (value) {
		backgroundImage.placeAfterCut = true;
	}
	else {
		backgroundImage.placeAfterCut = false;
	}

}


function toggleAutoRemoveBlankTiles(value) {
	if (value) {
		backgroundImage.removeBlankTiles = true;
	}
	else {
		backgroundImage.removeBlankTiles = false;
	}
}


function importBackgroundAsTiles() {

	if (backgroundImage.img !== false) {
		message("importing tiles");
		backgroundImage.importBackgroundImage();
		document.getElementById("importBox").style.opacity = 0.4;
		document.getElementById("backgroundRemoveButton").style.backgroundColor = "#cccccc";
		document.getElementById("backgroundImportButton").style.backgroundColor = "#cccccc";
		togglePanel('palette');

	}
	else { message("Please select a tile sheet to import"); }

}
