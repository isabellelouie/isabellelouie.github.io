'use strict'

/* Reference: https://www.w3schools.com/howto/howto_css_modal_images.asp */

var modal = document.getElementsByClassName("modal")[0];

// Creates a variable called images and gets all images with the class name 'static-img'  
var images = document.getElementsByClassName("static-img");
var popUpImg = document.getElementsByClassName("pop-up")[0];

//  Image alt text is used as the image caption in the pop up
var captionText = document.getElementsByClassName("caption")[0];

// When JS is enabled, links with the class 'pop-up-link' will be prevented from opening
let newTabImg = document.querySelectorAll('.pop-up-link')
console.log('Javascript is running!');

// Reference: Andrew's Office Hours and https://stackoverflow.com/questions/50643302/addeventlistener-on-a-queryselectorall-with-classlist 
// Go through each instance of .pop-up-link and apply preventDefault()
for (let i = 0; i < newTabImg.length; i++) {
  newTabImg[i].addEventListener('click', function (captured_link_click_event) {
    captured_link_click_event.preventDefault()

    // Goes through the list of images and attaches a click listener for each img. When clicked, each image will pop up with the alt text displayed as a caption underneath.
    for (var j = 0; j < images.length; j++) {
      var img = images[j];
      img.onclick = function () {
        modal.style.display = "block";
        popUpImg.src = this.src;
        captionText.innerHTML = this.alt;
      }
    }
  }
  )
}

// When anywhere outside the image is clicked, the modal closes 
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Create a variable called closeButton and assign it the element with the class 'close' (the X button)
var closeButton = document.getElementsByClassName("close")[0];

// When the 'X' button is clicked, the modal closes 
closeButton.onclick = function () {
  modal.style.display = "none";
}