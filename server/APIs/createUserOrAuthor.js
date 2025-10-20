const UserAuthor = require("../Models/userAuthorModel");

async function createUserOrAuthor(req, res) {
  try {
    const newUserAuthor = req.body;
    // Check if the user already exists
    const userInDb = await UserAuthor.findOne({ email: newUserAuthor.email });

    if (userInDb) {
      // Check if the user is blocked
      if (userInDb.isBlocked) {
        return res
          .status(403)
          .send({ message: "Your account is blocked. Please contact admin." });
      }
      // Check if the role matches
      if (newUserAuthor.role === userInDb.role) {
        return res
          .status(200)
          .send({ message: newUserAuthor.role, payload: newUserAuthor });
      } else {
        return res.status(400).send({ message: "Invalid role" });
      }
    } else {
      // Create a new user or author
      let newUser = new UserAuthor(newUserAuthor);
      let newUserDoc = await newUser.save();
      return res
        .status(201)
        .send({ message: newUserAuthor.role, payload: newUserDoc });
    }
  } catch (error) {
    console.error("Error creating user or author:", error);
    res.status(500).send({ message: "Internal server error" });
  }
}

module.exports = createUserOrAuthor;
