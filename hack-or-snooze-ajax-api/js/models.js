"use strict";


// declares a constant var named BASE_URL and assigns it the value of the base URL for API endpoint.
const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */


// defines the class name story, which represents a single story in the system. the class has a constructor that accepts an object containing properties.
// Properties are assigned to the instances using "this" keyword.
// this class also has getHostName() method that parses the hostname from the 'url' property and returns it.
class Story {

  /** Make instance of Story from data object about story:
   *   - {storyId, title, author, url, username, createdAt}
   */
// this line declares the constructor method for the Story class. the constructor is responsible for initializing the properties of a newly created Story instance It uses obj destructring to extract the properties from the argument object and assigns them to corresponding instance variable.
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  // declares the 'getHostName' method of the Story Class. The method does not take any arguments.
  getHostName() {
    // creates a new URL object using the "URL" constructor, passing the 'url' property of the current instance ('this.url'). The 'host' property of the URL obj represents the hostname of the URL. the hostname is then returned by the 'getHostName' method.
    return new URL(this.url).host;
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */


// represents a list of stories in the system. and constructor accepts an array of story objects and assigns it to the stories property. 


class StoryList {
  
  // declares the constructor method for the StoryList class. The constructor takes a parameter called 'stories', which represents an array of story objects. Inside the constructor, the 'stories' parameter is assigned to the "stories" instance variable of the class.
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  // static method that makes a GET request to the API's /stories endpoint, retrieves story data, creates instance of the story class for each story and returns a new instance of the StoryList class containing those stories. THe StoryList class also has methods for adding and removing stories from the list.
  
  // declares a static mthod called 'getStories' of the StoryList class. the 'static' keyword indicates that this method can be called on the class itself, rather than on an instance of the class. This method is asynchronous (indicated by the 'async' keyword), meaning it can use the 'await' keyword to pause execuution and wait for promises to resolve.
  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)

    // uses axios library to send a GET request to the /stories endpoint of an API. the 'await' keyword is used to pause the execution of the method until the request is complete and response is received. the response is stored in the 'response' variable
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

    // defines an asynchronous func called addStory, that adds a new story to the system.

    // func takes two parameter user and an obj containing 'title', 'author', and 'url' properties representing the details of the new story.
    // the 'user' parameter represents the current user who will be posting the story, It is expected to have a 'loginToken' property that contains the authentication token of the user.
  async addStory(user, { title, author, url }) {
    
    // this token will be used for authentication when making the API request.
    const token = user.loginToken;
   
    // axios func is called with obj as parameter, specifying the HTTP method, URL, and data for the request. It sends a POST request to the ${BASE_URL}/stories' endpoint, including the authenticaiton token and the story details in the request payload.
    //await keyword is used to pause the execution of the function until the POST request is complete and the response is received. The response object is stored in the 'response' variable. 
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/stories`,
      data: { token, story: { title, author, url } },
    });
    //the response data is being accessed using 'response.data'. in this case, it is expected that the response contains a 'story' property representing the newly created story.
    // the story class class creates a new story obj by passing response.data.story as the argument. this creates an instance of the story class with properites corresponidn to the story details.
    const story = new Story(response.data.story);
    this.stories.unshift(story);
    user.ownStories.unshift(story);

    return story;
  }

  /** Delete story from API and remove from the story lists.
   *
   * - user: the current User instance
   * - storyId: the ID of the story you want to remove
   */

  // definess a async func withing a class. 

  // declares the 'removeStory' method, which is an asynchronous func that takes two parameters: 'user' and 'storyId'. It is assumed that 'user' represents a user object and 'storyId' represents the ID of the story to be removed.
  async removeStory(user, storyId) {
   
   // assings the loginToken property of the 'user' object to a variable called 'token'. This line is likely used for authentication purposes when making the API request to delete the story.
    const token = user.loginToken;
    
    // uses the axios library to make a DELETE request to the API's /stories/{stodyID} endpoint. the 'await' keyword is used to pause the execution of the function until the request is complete. the request is complete. the request includes the URL of the specific story to be deleted, the HTTP method as "delete", and the 'token' property as part of the request's data payload.
    await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "DELETE",
      data: { token: user.loginToken }
    });

    // filter out the story whose ID we are removing

    // filters out the story from the this.stories array of the current instance of the class. It removes the story whose 'storyID' matches the provided 'storyId'. the filtered array is then assigned back to the this.stories property.
    this.stories = this.stories.filter(story => story.storyId !== storyId);

    // do the same thing for the user's list of stories & their favorites
    user.ownStories = user.ownStories.filter(s => s.storyId !== storyId);
    user.favorites = user.favorites.filter(s => s.storyId !== storyId);
  }
}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */




//starts the defination of a new class called "User". The class represents a user object.
class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  // constructor method for the User class. the construcotr takes two parameters; an object containing user data and a token.


  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    // assigns the value of the 'token' parameter to the 'loginToken' property of the class instance. the 'loginToken' property is used to store the login token for the user, making it easily accessible for the API calls..
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  
  // defines a static asynchronous method called 'signUp' within a class

  // declares the 'signup' method, which is a static asynchronous function. it takes three parameters: 'username', 'password', and 'name' which are the user's signup credentials.
  static async signup(username, password, name) {
   
   // uses axios library to send POST request to the API's /signup endpoint. the 'await' keyword is used to pause the execution of the function until the request is complete. The request inclues the URL of the signup endpoint, the HTTP method as "post", and the user data(username, password, and name) as part of the request's data payload.
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

      // uses object destructuring to extract the 'user' property from the 'response.data' object. It assigns the extracted 'user' property to a variable called 'user'.
    let { user } = response.data;

    // this code creates a new instance of the 'User' class. It passes an object containing user data properties ('username, 'name', createAt, favorites and ownStories) extracted from teh user variable, along with the 'token' property from the response.data object, as arguments to the User constructor. the "user" constructor is responsible for initializing variable of the 'User' object.
    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */


  // code defines a static asyn method called 'login' within a class.

  // declares the 'login' method, which is a static asynchronous function. it takes two parameters: 'username' and 'password', which are the user's login credentials.

  static async login(username, password) {
  
  // uses the axios library to send a POST request to the API's '/login' endpoint. the 'await' keyword is used to pause the execution of the function until the request is complete. the request includes the URL of the login endpoint, the HTTP method as "post", and the user data (username and password) as part of the request's data payload.
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

   // line uses object destructuring to extract the 'user' property from the 'response.data' object. it assigns the extracted 'user' property to a variable called 'user./
    let { user } = response.data;
// creates a new instance of the user class. it passes an object containing user data properties extracted from the 'user' variable, along with the 'token' property from the response.data object, as argument to the 'User' constructor. The 'User' constructor is responsible for initializing the instance variables of the 'User' object.
    
// returns the newly created 'User' instance from the 'login' method.


return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */


  // async func takes two parameters: token and username. 'token' is the login token for authentication, and 'username' is the username of the user.
  static async loginViaStoredCredentials(token, username) {
    // tries to retrieve user data from the API by sending a GET request to the /users/{username} endpoint. the request includes the URL of the user's endpoint, the HTTP method as "get", and the 'token' as a query parameter. the 'await' keyword is used to pause the execution of the funciton until the request is complete. the response is stored in the 'response' variable.
    try {
     
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      // uses object destructuring to extract the 'user' property from the response.data object. It assigns the extracted 'user' property to a variable called 'user'
      let { user } = response.data;

        // creates a new instances of the "user" class. It passes an object containing user data properties ('username', name, createdAT, favorites and ownStories) extracted ffrom the 'user'variable, along with the 'token' parameter, as arguments to the 'User' constructor. The 'user' constructor is responsible for initializing the instance variables of the 'user' object.
      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  /** Add a story to the list of user favorites and update the API
   * - story: a Story instance to add to favorites
   */

  async addFavorite(story) {
    this.favorites.push(story);
    await this._addOrRemoveFavorite("add", story)
  }

  /** Remove a story to the list of user favorites and update the API
   * - story: the Story instance to remove from favorites
   */

  async removeFavorite(story) {
    this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
    await this._addOrRemoveFavorite("remove", story);
  }

  /** Update API with favorite/not-favorite.
   *   - newState: "add" or "remove"
   *   - story: Story instance to make favorite / not favorite
   * */

  async _addOrRemoveFavorite(newState, story) {
    const method = newState === "add" ? "POST" : "DELETE";
    const token = this.loginToken;
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
      method: method,
      data: { token },
    });
  }

  /** Return true/false if given Story instance is a favorite of this user. */

  isFavorite(story) {
    return this.favorites.some(s => (s.storyId === story.storyId));
  }
}