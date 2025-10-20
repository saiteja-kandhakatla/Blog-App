import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import { useNavigate } from "react-router-dom";
function PostArticle() {
  const { currentUser } = useContext(userAuthorContextObj);
  // console.log("Current User:", currentUser);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  async function postArticle(articleObj) {
    // console.log(currentUser);
    //creaet a article object as per schema
    const authorData = {
      nameOfAuthor: currentUser.firstName,
      email: currentUser.email,
      profileImageUrl: currentUser.profileImageUrl,
    };
    // id Schema
    articleObj.authorData = authorData;
    // add id
    articleObj.articleId = Date.now();
    // currentdate
    let currentDate = new Date();
    articleObj.dateOfCreation =
      currentDate.getDate() +
      "-" +
      currentDate.getMonth() +
      "-" +
      currentDate.getFullYear() +
      "-" +
      currentDate.toLocaleTimeString("en-US", { hour12: true });
    // modified Date
    let modifiedDate = new Date();
    articleObj.dateOfModification =
      modifiedDate.getDate() +
      "-" +
      modifiedDate.getMonth() +
      "-" +
      modifiedDate.getFullYear() +
      "-" +
      modifiedDate.toLocaleTimeString("en-US", { hour12: true });
    //comments array
    articleObj.comments = [];
    articleObj.isArticleActive = true;

    // console.log(articleObj);

    //make http post request

    let res = await axios.post(
      "http://localhost:3000/author-api/article",
      articleObj
    );
    if (res.status === 201) {
      // navigate ot articles
      navigate(`/author-profile/${currentUser.email}/articles`);
    } else {
    }
  }
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-8 col-md-8 col-sm-10">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3" style={{ color: "goldenrod" }}>
                Write an Article
              </h2>
            </div>
            <div className="card-body bg-light">
              {/* Error message placeholder */}
              {/* {err.length !== 0 && <p className='text-danger fs-5'>{err}</p>} */}
              <form onSubmit={handleSubmit(postArticle)}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("title")}
                    id="title"
                  />
                  {/* Title validation error message */}
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="form-label">
                    Select a category
                  </label>
                  <select
                    id="category"
                    className="form-select"
                    {...register("category")}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      --categories--
                    </option>
                    <option value="programming">Programming</option>
                    <option value="AI&ML">AI & ML</option>
                    <option value="database">Database</option>
                  </select>
                  {/* Category validation error message */}
                </div>

                <div className="mb-4">
                  <label htmlFor="content" className="form-label">
                    Content
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    rows="10"
                    {...register("content")}
                  ></textarea>
                  {/* Content validation error message */}
                </div>

                <div className="text-end">
                  <button type="submit" className="add-article-btn">
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostArticle;
