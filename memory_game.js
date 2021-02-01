// Configure Puzzle -----------------------------------------------------------

// audio
var flip_sound = document.getElementById("flip_sound");
var match_sound = document.getElementById("match_sound");
var win_sound = document.getElementById("win_sound");

// dynamic elements
var board_cover = document.getElementById('cover');
var turns_text = document.getElementById("turns");

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


function config_puzzle() {
  /*
    Function to shuffle all images
    and add their names as class name identifiers for the buttons.
    Called on page load.
  */

  // Shuffle Images
  var shuffled = [];  // shuffled images
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

      // get this element
      var curr_id = "b" + String(i) + String(j);
      var curr_elem = document.getElementById(curr_id);

      // reset anything set in previous game
      curr_elem.classList = '';
      curr_elem.style.backgroundImage = "";

      // add image names as class name to each button
      curr_elem.classList.add(shuffled[s_idx]);

      // add click event handler
      curr_elem.setAttribute('onclick', 'flipCard(this)');

      // for debugging - display all button images
      // curr_elem.style.backgroundImage = "url(img/" + shuffled[s_idx] + ".png)";

      // add to shuffled array index
      s_idx++;
    }
  }
}

// initial call on page load
config_puzzle();

// call on header click
document.querySelector('header div').setAttribute('onclick', 'config_puzzle()');


// Puzzle Functionality -------------------------------------------------------
var chosen = [];  // array to store class names of chosen buttons
var first;
var turns = 0;  // number of tries
var matches = 0;  // track number of matches
var has_match = false;  // store if player has match
var lock_board = false;


function flipCard(card) {

  if (lock_board) return;  // return if two cards already flipped

  if (chosen.length < 2) {

    // check if card already clicked
    if (card == first) return;
    first = card;

    flip_sound.play();

    // add to turns count
    turns++;
    turns_text.innerHTML = turns;

    // add class name to chosen array
    var c_class = card.className;
    chosen.push(c_class);
    if (chosen.length == 2) {
      lock_board = true;
      board_cover.style.display = 'block';
    }

    // check for pair
    if ((chosen.length == 2) && (chosen[0] === chosen[1])) {
      has_match = true;
    } else {
      has_match = false;
    }
    // store if this button is part of a pair
    if (has_match) { var is_pair = true; }
    else { var is_pair = false; }

    // Reveal Background Image
    $(card).fadeTo('fast', 0, function() {
      $(card).css("background-image", "url(img/" + c_class + ".png)");
    }).fadeTo('fast', 1);

    // Delay then reset
    $(card).delay(1000).fadeTo("fast", 0, function() {

      // if match exists
      if (is_pair || has_match) {
        match_sound.play();
        card.setAttribute('onclick', '');  // remove click event
        has_match = true;  // reset has match
        card.classList.add('matched');  // restyle as matched card
        check_win();  // check if won game

      // if no match
      } else {
        flip_sound.play();
        $(this).css("background-image", "");
      }

      // remove from chosen array
      const index = chosen.indexOf(c_class);
      chosen.splice(index, 1);
      first = null;

      // uncover board
      if (chosen.length == 0) {
        lock_board = false;
        document.getElementById('cover').style.display = 'none';
      }

    }).fadeTo('fast', 1);
  }
}

function check_win() {
  matches++;
  console.log(matches);
  if (matches == 16) {
    win_sound.play();
    console.log('won game');
  }
}
