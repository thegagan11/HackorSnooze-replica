"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

// Defines a func, navAllStories and attaches it as a click event handler to an element with the ID "nav-all"


//evt parameter, represents the event object.
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  // Responsible for hiding various page components, such as story lists, forms, and user profiles. It likely hides any currently visible components to prepare the page for displaying all stories. 
  hidePageComponents();
  
  // reterives the list of stories and renders them on the page.
  putStoriesOnPage();
}

// listens for the click events on the element and executes the navALLStories function when the event occurs.
$body.on("click", "#nav-all", navAllStories);

/** Show story submit form on clicking story "submit" */

// func is executed when the associated event(click) occurs. It takes an 'evt' parameter, which represents the event object.
function navSubmitStoryClick(evt) {
 
 //debug msg is printed to the console. THE 'evt' parameter can be used to access info about the event if needed.
  console.debug("navSubmitStoryClick", evt);
  
  // Func is responsible for hiding various page components, such as story lists, forms and user profiles.
  hidePageComponents();
  
  //.show() method is displaying the $allStoriesList and it ensures that the list is visible when submitting a new story.
  $allStoriesList.show();
  //element is being showed using the .show() method. this element represents the form for submitting a new story. It is being displayed to allow the user to input the details of the new story..
  $submitForm.show();
}

//event listener is being attaced to navSubmitStory using .on() method. this function listens for click events on the element and executes the navSubmitStoryClick function when the event occurs. 
$navSubmitStory.on("click", navSubmitStoryClick);

/** Show favorite stories on click on "favorites" */



// defines the func navFavoritesClick and sets it as a click event handler for an element with the ID "nav-favorites"

// This func will execute when the associated event(click) occurs. It takes an "evt" parameter, which represents the event object
function navFavoritesClick(evt) {
  
//debug message is printed to the console using console.debug. the evt parameter can be used to access information about the event if needed.
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesListOnPage();
}

$body.on("click", "#nav-favorites", navFavoritesClick);

/** Show My Stories on clicking "my stories" */

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $storiesContainer.hide()
}

$navLogin.on("click", navLoginClick);

/** Hide everything but profile on click on "profile" */

function navProfileClick(evt) {
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navProfileClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").css('display', 'flex');;
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
