const exp = require("express");
const adminApi = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const User = require("../Models/userAuthorModel");

const apiKey = "admin@99";

// Admin authentication
adminApi.post(
  "/authentication",
  expressAsyncHandler((req, res) => {
    const { key } = req.body;

    if (key === apiKey) {
      res.status(200).send({ message: "Successful login" });
    } else {
      res.status(401).send({ message: "Unsuccessful login" });
    }
  })
);

// Get all users
adminApi.get(
  "/users",
  expressAsyncHandler(async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch users" });
    }
  })
);

// Toggle account status
adminApi.put(
  "/toggle-status/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isBlocked } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { isBlocked },
        { new: true }
      );

      if (updatedUser) {
        res.send({ message: "Status updated", payload: updatedUser });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).send({ message: "Failed to update status" });
    }
  })
);

module.exports = adminApi;
