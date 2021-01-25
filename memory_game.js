// Configure Puzzle -----------------------------------------------------------

// store 2 copies of each image (made by me in Windows Paint3D)
var images = [
  "check",
  "check",
  "diamond",
  "diamond",
  "explosion",
  "explosion",
  "heart",
  "heart",
  "lightning",
  "lightning",
  "moon",
  "moon",
  "star",
  "star",
  "x",
  "x"
];
var shuffled = [];  // shuffled images

function config_puzzle() {
  /*
    Function to shuffle all images
    and add their names as class name identifiers for the buttons.
    Called on page load.
  */

  // Shuffle Images
  var copy = images.slice(0);

  for (i=0; i<images.length; i++) {
    var index = Math.floor(Math.random() * copy.length);
    var this_img = copy[index];
    copy.splice(index, 1);
    shuffled[i] = this_img;
  }

  // Populate Images
  var s_idx = 0;  // shuffled array index

  for (i=0; i<4; i++) {  // rows
    for (j=0; j<4; j++) {  // columns

      // add image names as class name to each button
      $("#b" + String(i) + String(j)).addClass(shuffled[s_idx]);

      // for debugging - display all button images
      // $("#b" + String(i) + String(j)).css("background-image", "url(img/" + shuffled[s_idx] + ".png)");

      // add to shuffled array index
      s_idx++;
    }
  }
}


// Puzzle Functionality -------------------------------------------------------
var chosen = [];  // array to store class names of chosen buttons
var first;
var turns = 0;  // number of tries
var has_match = false;  // store if player has match
var lock_board = false;  // prevent more clicks during match check


// Button Click Event
$("#board").find("button").bind('click', function(e) {

  // don't allow clicks if pair is flipped
  if (lock_board) return;

  // check if chosen array is full
  if (chosen.length < 2) {

    // get this button's class (image name)
    var this_class = $(this).attr('class').split(/\s+/)[0];
    if (this == first) return;  // return if already clicked

    // add to turns count
    turns++;
    $("#turns").text(String(turns));

    // add class name to chosen array
    chosen.push(this_class);
    first = this;
    if (chosen.length == 2) lock_board = true;

    // check for pair
    check_pair();

    // store if this button is part of a pair
    if (has_match) { var is_pair = true; }
    else { var is_pair = false; }

    // Reveal Background Image
    $(this).fadeTo('fast', 0, function() {
      $(this).css("background-image", "url(img/" + this_class + ".png)");
    }).fadeTo('fast', 1);

    // Delay then reset
    $(this).delay(1500).fadeTo("fast", 0, function() {

      // if match exists
      if (is_pair || has_match) {
        $(this).unbind();  // remove click event
        has_match = true;  // reset has match

        $(this).addClass('matched');

      // if no match
      } else {
        $(this).css("background-image", "");
      }

      // remove from chosen array
      const index = chosen.indexOf(this_class);
      chosen.splice(index, 1);
      first = null;

      // unlock board
      if (chosen.length == 0) lock_board = false;

    }).fadeTo('fast', 1);
  }
});


function check_pair() {
  /*
  function to check for a match. called after button click.
  */
  if ((chosen.length == 2) && (chosen[0] === chosen[1])) {
    has_match = true;
  } else {
    has_match = false;
  }
}


config_puzzle();
