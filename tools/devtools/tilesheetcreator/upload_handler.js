//----------------------------UPLOADING-----------------------------//


// turns user uploads into image objects then calls create screen info
function addFiles(upfiles) {
	//change text on label
	uploadLableElement.innerText = "add more tiles";
	for (var i = 0; i < upfiles.length; i++) {
		//prepare a list element and add the loading gif to it

		//validate if file is an image
		var fileName = upfiles[i].name;
		var mimeType = fileName.replace(/^.*\./, '');
		var mimeType = mimeType.toLowerCase();


		//console.log(mimeType);
		if (mimeType === "jpeg" || mimeType === "jpg" || mimeType === "png" || mimeType === "bmp") {
			let image = new Image()
			image.src = window.URL.createObjectURL(upfiles[i]);
			image.fileExtension = upfiles[i].name.replace(/^.*\./, '');
			image.title = fileName;
			image.alt = fileName;
			image.name = fileName;
			image.drawX = 0;
			image.drawY = 0;
			image.drawHeight = 0;
			image.drawWidth = 0;
			image.previewVisible = true;
			image.outputName = fileName;
			image.bytes = upfiles[i].size;
			byteTotal += upfiles[i].size;
			//console.log(byteTotal);
			var id = makeid(8);
			image.id = id;
			image.idString = id;

			image.onload = function () {
				image.height = image.naturalHeight;
				image.width = image.naturalWidth;
				image.drawWidth = image.width;
				image.drawHeight = image.height;
				tiles.push(image);
				addTilePreview(tiles.length - 1);
			}

		}
		else { alert("this file upload - " + fileName + "- is not a valid image file this file has been disregarded."); }

	}
	//now do something else now all files have been uploaded
	//check for differing heights

}






function addTilePreview(index) {
	let holderClass = "listViewHolder";
	if (PALETTEVIEW === "LIST") { holderClass = "listViewHolder"; }
	else { holderClass = "blockViewHolder"; }


	var id = tiles[index].id;
	// appends file info to the list

	//create Tile holder
	var tilePreviewHolder = document.createElement("div");
	tilePreviewHolder.setAttribute("id", "holder" + id);
	tilePreviewHolder.setAttribute("class", holderClass);
	tilePreviewHolder.setAttribute("style", "display:inline-block");

	//create tile preview
	var tilePreview = document.createElement("img");
	tilePreview.setAttribute("class", "tilePreview");
	tilePreview.setAttribute("id", "tilePreview" + id);
	tilePreview.setAttribute("title", tiles[index].title + "-" + tiles[index].width + "px by " + tiles[index].height + "px");
	tilePreview.setAttribute("src", tiles[index].src);
	tilePreview.setAttribute("draggable", tiles[index].src);

	tilePreview.addEventListener('mousedown', function (evnt) { startDrag(id, evnt) })


	//create title
	var tileTitle = document.createElement("p");
	tileTitle.setAttribute("class", "paletteTileTitle");
	tileTitle.setAttribute("id", "tileTitle" + id);
	tileTitle.innerHTML = tiles[index].title + "-" + tiles[index].width + "px by " + tiles[index].height + "px";



	//create remove icon
	var removeIcon = document.createElement("img");
	removeIcon.setAttribute("class", "binIcon");
	removeIcon.setAttribute("id", "remove" + id);
	removeIcon.setAttribute("alt", "remove tile");
	removeIcon.setAttribute("title", "remove tile - *(removes placed tile from tile sheet)");
	removeIcon.setAttribute("src", "../img/bin.png");
	removeIcon.addEventListener('click', function (evnt) { removeTileFromPreview(id); })

	//add preview to list
	tilePreviewHolder.appendChild(tilePreview);
	tilePreviewHolder.appendChild(tileTitle);
	tilePreviewHolder.appendChild(removeIcon);
	paletteTileContainer.appendChild(tilePreviewHolder);

}




function addBackgroundFile(evnt) {
	//change text on label
	backgroundLabelElement.innerText = "Replace background Image";
	//console.log(addBackgroundInputField.files[0].name);
	//prepare a list element and add the loading gif to it

	//validate if file is an image
	var fileName = addBackgroundInputField.files[0].name;
	var mimeType = fileName.replace(/^.*\./, '');
	var mimeType = mimeType.toLowerCase();

	if (mimeType === "jpeg" || mimeType === "jpg" || mimeType === "png" || mimeType === "bmp") {
		let image = new Image()
		image.src = window.URL.createObjectURL(addBackgroundInputField.files[0]);
		image.fileExtension = addBackgroundInputField.files[0].name.replace(/^.*\./, '');
		image.title = fileName;
		image.alt = fileName;
		image.name = fileName;
		image.drawX = 0;
		image.drawY = 0;
		image.drawHeight = 0;
		image.drawWidth = 0;
		image.previewVisible = true;
		image.outputName = fileName;
		image.bytes = addBackgroundInputField.files[0].size;
		byteTotal += addBackgroundInputField.files[0].size;
		console.log(byteTotal);
		var id = makeid(8);
		image.id = id;
		image.idString = id;

		image.onload = function () {
			image.height = image.naturalHeight;
			image.width = image.naturalWidth;
			image.drawWidth = image.width;
			image.drawHeight = image.height;
			backgroundImage.img = null;
			backgroundImage.img = image;
			backgroundImage.imageDimensions.width = image.naturalWidth;
			backgroundImage.imageDimensions.height = image.naturalHeight;
			backgroundImage.isUsed = true;

			document.getElementById("importBox").style.opacity = 1;
			document.getElementById("backgroundRemoveButton").style.backgroundColor = "#00c19a";
			document.getElementById("backgroundImportButton").style.backgroundColor = "#00c19a";
			backgroundImage.clearCanvas();
			backgroundImage.drawBackground();

		}

	}
	else { alert("this file upload - " + fileName + "- is not a valid image file this file has been disregarded."); }

}
//now do something else now all files have been uploaded
//check for differing heights



function addBackground() {
	//console.log("adding background");
}





















//assign an id to each image
function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}






