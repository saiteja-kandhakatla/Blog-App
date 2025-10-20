
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          BlogApp
        </Link>

        {/* Navbar Toggler for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {!isSignedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item d-flex align-items-center">
                {currentUser && (
                  <>
                    <img
                      src={currentUser.profileImageUrl}
                      width="40"
                      height="40"
                      className="rounded-circle me-2"
                      alt="User Profile"
                    />
                    <span className="text-light me-3">
                      {currentUser.firstName}
                    </span>
                  </>
                )}
                <button className="btn btn-danger" onClick={handleSignOut}>
                  Sign Out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
