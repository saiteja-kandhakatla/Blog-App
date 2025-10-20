const exp = require("express");
const app = exp();
require("dotenv").config();
const port = process.env.PORT;
const mongoose = require("mongoose");
const userApi = require("./APIs/userApi");
const authorApi = require("./APIs/authorApi");
const adminApi = require("./APIs/adminApi");
const cors = require("cors");

app.use(cors());
app.use(exp.json());

mongoose
  .connect(process.env.DBURL)
  .then(() => {
    app.listen(port, () => {
      console.log("Server Started");
    });
    console.log("DB CONNECTION SUCCESFULL");
  })
  .catch((err) => {
    console.log("ERROR:", err);
  });

app.use("/user-api", userApi);
app.use("/author-api", authorApi);
app.use("/admin-api", adminApi);

app.use((err, req, res, next) => {
  console.log("Error in  express handler: ", err);
  res.send({ message: err.message });
});
