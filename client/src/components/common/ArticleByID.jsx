import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdRestore } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

function ArticleByID() {
  const { state } = useLocation();
  const [editArticleStatus, setArticleStatus] = useState(false);
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle, setCurrentArticle] = useState(state);
  const [commentStatus, setCommentStatus] = useState("");

  // function tp change edit status of article
  function enableEdit() {
    setArticleStatus(true);
  }
  // console.log("in article id", currentUser);

  // when click on save modified articel
  async function onSave(modifiedArticle) {
    // getting token
    const token = await getToken();
    const articleAfterChanges = { ...state, ...modifiedArticle };
    // add date of modification
    const currDate = new Date();
    articleAfterChanges.dateOfModification =
      currDate.getDate() +
      "-" +
      currDate.getMonth() +
      "-" +
      currDate.getFullYear() +
      "-" +
      currDate.toLocaleTimeString("en-US", { hour12: true });
    // make http post request
    // console.log(articleAfterChanges);
    let res = await axios.put(
      `http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
      articleAfterChanges,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.message == "Article Modified") {
      setArticleStatus(false);
      navigate(`/author-profile/articles/${state.articleId}`, {
        state: res.data.payload,
      });
    }
    // change edi article status
    // setArticleStatus(false);
  }

  // add comment by user
  async function addComment(commentObj) {
    // add name of the user
    commentObj.nameOfUser = currentUser.firstName;
    let res = await axios.put(
      `http://localhost:3000/user-api/comment/${currentArticle.articleId}`,
      commentObj
    );
    if (res.data.message == "comments added by user") {
      setCommentStatus(res.data.message);
    }
  }

  // delete
  async function deleteArticle() {
    state.isArticleActive = false;
    let res = await axios.put(
      `http://localhost:3000/author-api/articles/${state.articleId}`,
      state
    );
    if (res.data.message === "Article deleted or restored") {
      setCurrentArticle(res.data.payload);
    }
  }

  // restore
  async function restoreArticle() {
    state.isArticleActive = true;
    let res = await axios.put(
      `http://localhost:3000/author-api/articles/${state.articleId}`,
      state
    );
    if (res.data.message === "Article deleted or restored") {
      setCurrentArticle(res.data.payload);
    }
  }
  // console.log(state);
  // console.log(currentUser);
  return (
    <div className="container">
      {editArticleStatus === false ? (
        <>
          {/* print full article */}
          <div className="d-flex justify-content-between">
            <div className="mb-5 author-block w-100 px-4 py-2 rounded-2 d-flex justify-content-between align-items-center">
              <div>
                <p className="display-3 me-4">{state.title}</p>
                <span className="py-3">
                  <small className="text-secondary me-4">
                    Created On: {state.dateOfCreation}
                  </small>
                  <small className="text-secondary me-4">
                    Modified On: {state.dateOfModification}
                  </small>
                </span>
              </div>

              {/* Author details */}
              <div className="author-details text-center">
                <img
                  src={state.authorData.profileImageUrl}
                  className="rounded-circle"
                  width="60px"
                  alt=""
                />
                <p>{state.authorData.nameOfAuthor}</p>
              </div>
            </div>
            {/* edit and delete article */}
            {currentUser?.role === "author" && (
              <div className="d-flex me-3">
                {/* edit article */}

                <button
                  className="me-2 btn btn-light"
                  onClick={() => enableEdit()}
                >
                  <FaEdit className="text-warning" />
                </button>
                {/* if article is active display or nto */}
                {state.isArticleActive ? (
                  <button
                    className="me-2 btn btn-light"
                    onClick={() => deleteArticle()}
                  >
                    <MdDelete
                      className="text-danger fs-4"
                      onClick={deleteArticle}
                    />
                  </button>
                ) : (
                  <button
                    className="me-2 btn btn-light"
                    onClick={() => restoreArticle()}
                  >
                    <MdRestore className="text-danger fs-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* content */}
          <p
            className="lead mt-3 article-content"
            style={{ whiteSpace: "pre-line" }}
          >
            {state.content}
          </p>
          {/* user comments */}
          <div>
            <div className="comments my-4">
              {state.comments.length === 0 ? (
                <p className="display-3">no comments yet</p>
              ) : (
                state.comments.map((commentObj) => {
                  return (
                    <div key={commentObj._id}>
                      <p className="user-name">{commentObj?.nameOfUser}</p>
                      <p className="comment">{commentObj?.comment}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {/* comment status form */}
          <p className="lead display-4">{commentStatus}</p>
          {/* Comment FOrm */}
          {currentUser.role === "user" && (
            <form onSubmit={handleSubmit(addComment)}>
              <input
                type="text"
                {...register("comment")}
                className="form-control mb-4"
              />
              <button type="submit" className="btn btn-success mb-3 w-5">
                Add Comment
              </button>
            </form>
          )}
        </>
      ) : (
        <div className="container w-75">
          <form onSubmit={handleSubmit(onSave)}>
            <div className="mb-4">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                defaultValue={state.title}
                id="title"
                {...register("title")}
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
                defaultValue={state.category}
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
                defaultValue={state.content}
              ></textarea>
              {/* Content validation error message */}
            </div>

            <div className="text-end">
              <button type="submit" className="add-article-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ArticleByID;
