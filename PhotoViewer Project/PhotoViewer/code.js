// Stores the currently loaded images
let imageArray = [];
let startRange = 0;
let stopRange = 0;
let commonName = "";
let folderName = "";
let currentIndex = 0;
let animation;

function loadImagesFolder() {
  startRange = document.querySelector("#start").value;
  stopRange = document.querySelector("#stop").value;
  commonName = document.querySelector("#commonName").value;
  folderName = document.querySelector("#folderName").value;
  imageArray = [];
  let newImage = "";

  // check range input
  if (startRange > stopRange) {
    document.querySelector("#system").innerHTML = "Error: Invalid Range";
    return;
  }

  // push image srcs in range to array
  for (let i = startRange; i <= stopRange; i++) {
    newImage = String(folderName) + String(commonName) + String(i) + ".jpg";
    imageArray.push(newImage);
  }

  // Status
  document.querySelector("#photoDisplayed").value = imageArray[0];
  document.querySelector("#system").innerHTML = "Photo Viewer System";
  document.querySelector("#pic").setAttribute("src", imageArray[0]);
  // start photo list at beginning
  currentIndex = 0;
}

async function loadJSON() {
  startRange = document.querySelector("#start").value;
  stopRange = document.querySelector("#stop").value;
  imageArray = [];
  let newImage = "";
  

  // check range input
  if (startRange > stopRange) {
    document.querySelector("#system").innerHTML = "Error: Invalid Range";
    return;
  }

  // make array of all json images
  const jsonArray = await loadJSONHelper();
  startRange = 0;
  stopRange = jsonArray.length - 1;

  //console.log(jsonArray);

  // load all images? into array
  for (let i = startRange; i <= stopRange; i++) {
    imageArray.push(jsonArray[i]);
  }
  console.log(imageArray);

  // Status
  document.querySelector("#photoDisplayed").value = imageArray[0];
  document.querySelector("#system").innerHTML = "Photo Viewer System";
  document.querySelector("#pic").setAttribute("src", imageArray[0]);
  // start photo list at beginning
  currentIndex = 0;
}

async function loadJSONHelper(){
	let url = document.querySelector("#jsonUrl").value;
	let array = []
	
	/* LAMBDA */
	await fetch(url)
	.then(response => response.json())
	.then(json => {
		json.images.forEach(element => array.push(element.imageURL));//array.push(element));
		
	});
	return array;
	//console.log(array)
}

async function getJson(url) {
	const result = await fetch(url);
	return await result.json();
}

function loadPhotoData() {
  document.querySelector("#photoDisplayed").value = imageArray[currentIndex];
  document.querySelector("#system").innerHTML = "Photo Viewer System";
  document.querySelector("#pic").setAttribute("src", imageArray[currentIndex]);
}

function prevPhoto() {
  if (imageArray.length < 1) {
    document.querySelector("#system").innerHTML =
      "Error: you must load data first";
    return;
  }

  if (currentIndex == 0) {
    currentIndex = imageArray.length;
  }
  currentIndex -= 1;
  loadPhotoData();
}
function nextPhoto() {
  if (imageArray.length < 1) {
    document.querySelector("#system").innerHTML =
      "Error: you must load data first";
    return;
  }

  if (currentIndex == imageArray.length - 1) {
    currentIndex = -1;
  }
  currentIndex += 1;
  loadPhotoData();
}

function firstPhoto() {
  if (imageArray.length < 1) {
    document.querySelector("#system").innerHTML =
      "Error: you must load data first";
    return;
  }
  currentIndex = 0;
  loadPhotoData();
}

function lastPhoto() {
  if (imageArray.length < 1) {
    document.querySelector("#system").innerHTML =
      "Error: you must load data first";
    return;
  }
  currentIndex = imageArray.length - 1;
  loadPhotoData();
}

function slideShow() {
  if (imageArray.length < 1) {
    document.querySelector("#system").innerHTML =
      "Error: you must load data first";
    return;
  }
  firstPhoto();
  animation = setInterval(nextPhoto, 2000);
}

function loadRando() {
  currentIndex = Math.floor(Math.random() * imageArray.length);
  loadPhotoData();
}

function randomSlideShow() {
  if (imageArray.length < 1) {
    document.querySelector("#system").innerHTML =
      "Error: you must load data first";
    return;
  }
  animation = setInterval(loadRando, 2000);
}

function stopSlideShow() {
  clearInterval(animation);
}

function resetData() {
  imageArray = [];
  startRange = 0;
  stopRange = 0;
  commonName = "";
  folderName = "";
  currentIndex = 0;

  document.querySelector("#pic").setAttribute("src", "InitialImage.jpg");
  document.querySelector("#photoDisplayed").value = "InitialImage.jpg";
  document.querySelector("#folderName").value = "umcp/";
  document.querySelector("#commonName").value = "college";
  document.querySelector("#start").value = 2;
  document.querySelector("#stop").value = 4;
  document.querySelector("#jsonUrl").value =
    "http://www.cs.umd.edu/~nelson/classes/resources/cmsc335/images/imagesSet1.json";
}
