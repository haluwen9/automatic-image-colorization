const dropzone = document.querySelector("#upload .dropzone");
const inputFile = document.getElementById("upload-file");

const modal = document.getElementById("result");
const close = document.querySelector("#result .result-close");

const origin = document.querySelector("#result .result-origin img");
const grayscale = document.querySelector("#result .result-grayscale img");
const colorized = document.querySelector("#result .result-colorized img");

const statusProcessing = document.querySelector(".result-status .processing")
const statusSuccess = document.querySelector(".result-status .success")

/* Drag & Drop Implements */

dropzone.ondragenter = function(event) {
  event.preventDefault();
  console.log("DRAGENTER")
  dropzone.classList.add("dragover");
}
dropzone.ondragover = function(event) {
  event.preventDefault();
}
dropzone.ondragleave = function(event) {
  event.preventDefault();
  console.log("DRAGLEAVE")
  dropzone.classList.remove("dragover");
}
dropzone.ondrop = function(event) {
  event.preventDefault();
  console.log("DROP")
  
  let filesList = event.dataTransfer.files;
  let file = null;
  
  if (dropzone.classList.contains("dragover")) {
    dropzone.classList.remove("dragover");
  }
  
  if (filesList.length > 0 && filesList[0].type.includes("image")) {
    file = filesList[0];
    submit(file);
  }
}

dropzone.onclick = function(event) {
  inputFile.click();
}

inputFile.onchange = function(event) {
  let filesList = event.target.files;
  let file = null;

  if (filesList.length > 0 && filesList[0].type.includes("image")) {
    file = filesList[0];
    submit(file);
  }
}

/* ====================== */

/* Upload File */
// const reader = new FileReader();
// reader.onload = function(event) {
//   origin.src = colorized.src = event.target.result;
//   console.log(event.target.result);
// }

function submit(file) {
  console.log(file);
  // console.log(URL.createObjectURL(file));

  origin.src = grayscale.src = colorized.src = URL.createObjectURL(file);
  // reader.readAsDataURL(file);
  modal.style.display = "flex";

  let formData = new FormData();
  formData.set("image", file);
  
  fetch('/colorizer', {
    method: 'POST',
    body: formData
  }).then(response => {
    console.log(response);
    // console.log(response.body)
    return response.blob();
  }).then(image => {
    let imgURL = URL.createObjectURL(image);
    console.log(imgURL);
    colorized.src = imgURL;

    if (!statusProcessing.classList.contains("hidden")) {
      statusProcessing.classList.add("hidden");
    }
    if (statusSuccess.classList.contains("hidden")) {
      statusSuccess.classList.remove("hidden");
    }
  });
}

/* ====================== */

/* Result Modal */


function showResult() {
  modal.style.display = "flex";
}

modal.onclick = function(event) {
  console.log(event.target)
  if (event.target == modal || event.target == close) {
    modal.style.display = "none";
    
    if (statusProcessing.classList.contains("hidden")) {
      statusProcessing.classList.remove("hidden");
    }
    if (!statusSuccess.classList.contains("hidden")) {
      statusSuccess.classList.add("hidden");
    }
  }
}

/* ====================== */

/* Window Event */
window.addEventListener("dragover",function(event){
  event = event || event;
  event.preventDefault();
},false);
window.addEventListener("drop",function(event){
  event = event || event;
  event.preventDefault();
},false);