import { useContext, useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { userAuthorContextObj } from "/src/contexts/UserAuthorContext";
import { useForm } from "react-hook-form";
function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { register, handleSubmit } = useForm();

  async function getArticles() {
    const token = await getToken();
    let res = await axios.get("http://localhost:3000/author-api/articles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data.message === "articles") {
      setArticles(res.data.payload);
    } else {
      setError(res.data.message);
    }
  }
  function goToArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }
  useEffect(() => {
    getArticles();
  }, []);

  async function onArticleFilter(obj) {
    if (obj.dropdown !== "Select an option") {
      const token = await getToken();
      let res = await axios.get(
        `http://localhost:3000/author-api/category/${obj.dropdown}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.message === "articles found") {
        setArticles(res.data.payload);
      } else {
        setError(res.data.message);
      }
    }
  }
  // console.log("currentUser in Articles ", currentUser);
  return (
    <div className="container">
      <form
        onChange={handleSubmit(onArticleFilter)}
        className="mb-3 w-50 d-flex justify-content-center align-items-center mx-auto"
      >
        <div className="dropdown">
          <select className="form-select" {...register("dropdown")}>
            <option value="Select an option">Select an option</option>
            <option value="programming">Programming</option>
            <option value="AI&ML">AI & ML</option>
            <option value="database">Database</option>
          </select>
        </div>
      </form>

      <div>
        {error.length !== 0 ? (
          <p className="display-4 text-center mt-5 text-danger">{error}</p>
        ) : (
          <div className="row row-cols-1 row-cols-sm2 row-cols-md-3 ">
            {articles.map((articleObj) => (
              <div className="col" key={articleObj._id}>
                <div className="card h-100 py-3 px-3">
                  <div className="card-body">
                    <div className="author-details text-end">
                      <img
                        src={articleObj.authorData.profileImageUrl}
                        alt="profile image"
                        width="40px"
                        className="rounded-circle"
                      />
                      <p>
                        <small className="text-secondary">
                          {articleObj.authorData.nameOfAuthor}
                        </small>
                      </p>
                    </div>
                    <h5 className="card-title">{articleObj.title}</h5>
                    <p className="card-text">
                      {articleObj.content.substring(0, 80) + "....."}
                    </p>
                    <button
                      onClick={() => goToArticleById(articleObj)}
                      className="custom-btn btn-4"
                    >
                      Read more
                    </button>
                  </div>
                  <div className="card-foot">
                    <small className="text-body-secondary">
                      Last updated on {articleObj.dateOfModification}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Articles;
