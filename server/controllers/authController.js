const bcrypt = require("bcryptjs");

module.exports = {
  register: async (req, res) => {
    // destructure username, password and isAdmin off of the request body
    const { username, password, isAdmin } = req.body;
    // get the database
    const db = req.app.get("db");
    // run the get_user sql file and assign the result to the result variable
    // we get the username because the sql file uses it
    const result = await db.get_user([username]);
    // assign the first result of the query to a variable
    const existingUser = result[0];
    //if the existing user value is truthy we will return a status that notifies that the
    // username is taken
    if (existingUser) {
      return res.status(409).send("username taken");
    }
    // assign salt and generate the salt
    const salt = bcrypt.genSaltSync(10);
    // declare the hash and pass the salt into it, season to taste 10 is good, 12 is better
    const hash = bcrypt.hashSync(password, salt);
    // run the register_user sql file and store the value equal to registeredUser
    const registeredUser = await db.register_user([isAdmin, username, hash]);
    // store the first result in the array to const user
    const user = registeredUser[0];
    // this is our new user object and we give it the values of the user object we just grabbed
    req.session.user = {
      isAdmin: user.is_admin,
      username: user.username,
      id: user.id
    };
    // return a res.status
    return res.status(201).send(req.session.user);
  },
  login: async (req, res) => {
    // grabs needed properties off of body
    const { username, password } = req.body;
    // assigns values of get request for get_user call that finds a username match
    const foundUser = await req.app.get("db").get_user([username]);
    // assigns first result of call to user
    const user = foundUser[0];
    //if username isnt in database we return a string to notify under status code 401 "user not found"
    if (!user) {
      return res.status(401).send("User not found.");
    }
    // compare password entered to user.hash (the hashed and salted version of the password in the database)
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    // if not authenticated, then we return error code 403 with an incorrect password notification
    if (!isAuthenticated) {
      return res.status(403).send("Incorrect password");
    }
    // if authenticated, we set req.session.user to be an object with the same properties as we recieved from the sql querry
    req.session.user = {
      isAdmin: user.is_admin, //(boolean)
      id: user.id, //(number)
      username: user.username // (string)
    };
    // send the object back
    return res.send(req.session.user);
  },
  logout: async (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
  }
};
