const mongoose = require("mongoose");

//schema
const userAuthorSchema = mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false, // Users are active by default
    },
  },
  { strict: "throw" }
);

//model
const UserAuthor = mongoose.model("userauthor", userAuthorSchema);
module.exports = UserAuthor;
