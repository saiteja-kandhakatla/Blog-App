import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import RootLayout from "./components/RootLayout.jsx";
import Home from "./components/common/Home.jsx";
import SignIn from "./components/common/SIgnIn.jsx";
import UserProfile from "./components/user/UserProfile.jsx";
import Articles from "./components/common/Articles.jsx";
import ArticleByID from "./components/common/ArticleByID.jsx";
import AuthorProfile from "./components/author/AuthorProfile.jsx";
import PostArticle from "./components/author/PostArticle.jsx";
import SignUp from "./components/common/SIgnUp.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import UserAuthorContext from "/src/contexts/UserAuthorContext";
import AdminProfile from "./components/admin/AdminProfile.jsx";

const browserRouterObject = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "admin-profile/:email",
        element: <AdminProfile />,
      },
      {
        path: "user-profile/:email",
        element: <UserProfile />,
        children: [
          {
            path: "articles",
            element: <Articles />,
          },
          {
            path: ":articleId",
            element: <ArticleByID />,
          },
          {
            path: "",
            element: <Navigate to="articles" />,
          },
        ],
      },
      {
        path: "author-profile/:email",
        element: <AuthorProfile />,
        children: [
          {
            path: "articles",
            element: <Articles />,
          },
          {
            path: ":articleId",
            element: <ArticleByID />,
          },
          {
            path: "article",
            element: <PostArticle />,
          },
          {
            path: "",
            element: <Navigate to="articles" />,
          },
        ],
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <>
    <UserAuthorContext>
      <RouterProvider router={browserRouterObject}></RouterProvider>
    </UserAuthorContext>
    <App />
  </>
);
