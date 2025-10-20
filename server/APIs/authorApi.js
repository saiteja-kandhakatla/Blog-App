const exp = require("express");
const authorApp = exp.Router();
const Article = require("../Models/articleModel");
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require("./createUserOrAuthor");
const { requireAuth } = require("@clerk/express");
require("dotenv").config();
// authorApp.get("/author", (req, res) => {
//   res.send({ message: "FRom author Api" });
// });
authorApp.post("/author", expressAsyncHandler(createUserOrAuthor));
authorApp.get("/unauthorized", (req, res) => {
  // console.log("entered into unauthorized api");
  res.send({ message: "UnAuthorized User pls relogin" });
});

// get articles by filter
authorApp.get(
  `/category/:category`,
  expressAsyncHandler(async (req, res) => {
    const choosedCategory = req.params.category;
    const listOfArticles = await Article.find({ category: choosedCategory });
    res
      .status(201)
      .send({ message: "articles found", payload: listOfArticles });
  })
);

// getting all articles
authorApp.get(
  "/articles",
  requireAuth({ signInUrl: "unauthorized" }),
  expressAsyncHandler(async (req, res) => {
    const listOfArticles = await Article.find({ isArticleActive: true });
    // console.log(listOfArticles);
    res.status(201).send({ message: "articles", payload: listOfArticles });
  })
);
// posting articles
authorApp.post(
  "/article",
  expressAsyncHandler(async (req, res) => {
    const newArticleObj = req.body;
    const newArticle = new Article(newArticleObj);
    const articleObj = await newArticle.save();
    res.status(201).send({ message: "ArticlePublished", payload: articleObj });
  })
);

// updating article
authorApp.put(
  "/article/:articleId",
  requireAuth({ signInUrl: "unauthorized" }),
  expressAsyncHandler(async (req, res) => {
    //modified article
    let modifiedArticle = req.body;
    // console.log(modifiedArticle);
    const dbRes = await Article.findByIdAndUpdate(
      modifiedArticle._id,
      { ...modifiedArticle },
      { returnOriginal: false }
    );
    res.status(200).send({ message: "Article Modified", payload: dbRes });
  })
);
// Soft delete
authorApp.put(
  "/articles/:articleId",
  expressAsyncHandler(async (req, res) => {
    // console.log("Entered-->xyz");
    //modified article

    let modifiedArticle = req.body;
    const dbRes = await Article.findByIdAndUpdate(
      modifiedArticle._id,
      { ...modifiedArticle },
      { returnOriginal: false }
    );
    if (!dbRes) {
      res.send({ message: "Article Not FOund" });
    }
    res
      .status(200)
      .send({ message: "Article deleted or restored", payload: dbRes });
  })
);

module.exports = authorApp;
