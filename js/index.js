// this is just a static solution which can be extended based on the data coming froma single file or api
// then on the basis of the json objects the playable images will be generated dynamically
//Currently it runs based on the static objects placed in 'draggable' div

const draggableElements = document.querySelectorAll(".draggable");
const droppableElements = document.querySelectorAll(".droppable");

var totalScore = 0; // global variable for score keeping
var playAgainBtn = document.getElementsByClassName('playagain');

// Refresh the windows and play again
function playAgain() {
  window.location.reload();
}

// Event binding for dragaable elements
draggableElements.forEach(elem => {
  elem.addEventListener("dragstart", dragStart); // Fires as soon as the user starts dragging an item - This is where we can define the drag data
});
// Event binding for all droppable  elements
droppableElements.forEach(elem => {
  elem.addEventListener("dragenter", dragEnter); // Fires when a dragged item enters a valid drop target
  elem.addEventListener("dragover", dragOver); // Fires when a dragged item is being dragged over a valid drop target, repeatedly while the draggable item is within the drop zone
  elem.addEventListener("dragleave", dragLeave); // Fires when a dragged item leaves a valid drop target
  elem.addEventListener("drop", drop); // Fires when an item is dropped on a valid drop target
});

//  Functions for Drag and Drop

//Events fired on the drag target
function dragStart(event) {
  event.dataTransfer.setData("text", event.target.id); // or "text/plain" but just "text" would also be fine since we are not setting any other type/format for data value
}

//Events fired on the drop target
function dragEnter(event) {
  if (!event.target.classList.contains("dropped")) {
    event.target.classList.add("droppable-hover");
  }
}

function dragOver(event) {
  if (!event.target.classList.contains("dropped")) {
    event.preventDefault(); // Prevent default to allow drop
  }
}

function dragLeave(event) {
  if (!event.target.classList.contains("dropped")) {
    event.target.classList.remove("droppable-hover");
  }
}

function drop(event) {
  var scoreElement = document.getElementById('totalScore');

  event.preventDefault(); // This is in order to prevent the browser default handling of the data
  event.target.classList.remove("droppable-hover");
  const draggableElementData = event.dataTransfer.getData("text"); // Get the dragged data. This method will return any data that was set to the same type in the setData() method
  const droppableElementData = event.target.getAttribute("data-draggable-id");
  const isCorrectMatching = draggableElementData === droppableElementData;
  if (isCorrectMatching) {
    const draggableElement = document.getElementById(draggableElementData);
    // Caling Correct option dragged animaiton 
    correctAnimate(event.target);
    event.target.style.backgroundColor = draggableElement.style.color; // This approach works only for inline styles. A more general approach would be the following: 
    draggableElement.classList.add("dragged");
    totalScore = totalScore + 20;
    scoreElement.innerText = totalScore;
  } else {
    const draggableElement = document.getElementById(draggableElementData);
    // Calling Incorrect option dragged animaiton
    inCorrectAnimate(event.target);
    draggableElement.classList.add("dragged");
    totalScore = totalScore - 5;
    scoreElement.innerText = totalScore;
  }
}
//Method for Correct option dragged animaiton 
function correctAnimate(element) {
  element.classList.add("correct");
  setTimeout(() => {
    element.classList.remove('correct');
  }, 500);
}
// Method for Incorrect option dragged animaiton
function inCorrectAnimate(element) {
  element.classList.add("incorrect");

  setTimeout(() => {
    element.classList.remove('incorrect');
  }, 500);
}
// Animation start method for all the eleents
function StartAnimations(allElements) {
  var duration = 0;
  var counter = 1;
  allElements.forEach(elem => {
    // duration offset for queuing the turns and animations
    duration = duration + 3000;
    // animaiton method
    counter++;
    Animate(elem, duration, counter, allElements);
    elem.style.display = 'none';

  });

}

// Method to animate one element
function Animate(element, timeoutDuration, counter, totalElements) {
  setTimeout(function () {
    // making the image/ element visible
    element.style.display = 'flex';
    element.animate([
      // keyframes
      { transform: 'translateY(0px)' },
      { transform: 'translateY(' + (screen.height - 300) + 'px)' } // 300 for safe screen overflow offset
    ], {
      // timing options
      duration: 3000,
      iterations: 1
    });
    if (counter > totalElements.length) { // check to show the final score modal
      ShowModal();
    }
  }, timeoutDuration);
}

// Show the final score modal
function ShowModal() {
  var modalDom = document.getElementsByClassName('modal')[0];
  var finalScore = document.getElementById("finalScore");
  finalScore.innerText = totalScore;
  modalDom.style.display = 'block';

}
// Hide the final score modal
function HideModal() {
  var modalDom = document.getElementsByClassName('modal')[0];
  modalDom.style.display = 'none';

}
// Window onload method when the gamestarts
window.onload = (event) => {
  console.log('page is fully loaded');
  StartAnimations(draggableElements);
};