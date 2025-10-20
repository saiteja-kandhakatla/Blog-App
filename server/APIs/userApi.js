const exp = require("express");
const userApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const UserAuthor = require("../Models/userAuthorModel");
const createUserOrAuthor = require("./createUserOrAuthor");
const Article=require('../Models/articleModel')
userApp.get("/users", async (req, res) => {
  try {
    const userList = await UserAuthor.find();
    res.send({ message: "FRom User Api", payload: userList });
  } catch (err) {
    res.send({ message: "ERROR", payload: err });
  }
});

//create new user
userApp.post("/user", expressAsyncHandler(createUserOrAuthor));
//adding coment by user
userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
  //coment object
  const commentObj=req.body;
  const articleWithComments=await Article.findOneAndUpdate({articleId:req.params.articleId},{$push:{comments:commentObj}},{returnOriginal:false})
  res.send({message:"comments added by user",payload:articleWithComments})
}))
module.exports = userApp;
