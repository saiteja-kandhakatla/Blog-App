import React, { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { userAuthorContextObj } from "/src/contexts/UserAuthorContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaUserTie, FaShieldAlt, FaKey } from "react-icons/fa";

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const [error, setError] = useState("");
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState("");
  const [adminStatus, setAdminStatus] = useState(false);

  // Handle admin key submission
  async function handleAdminSubmit() {
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/admin-api/authentication",
        { key: adminKey }
      );

      if (res.status === 200) {
        navigateToRole("admin");
      }
    } catch (error) {
      setError("Invalid admin key! Please try again.");
    }
  }

  // Handle navigation
  async function navigateToRole(role) {
    const updatedUser = { ...currentUser, role };
    setCurrentUser(updatedUser);

    try {
      const res = await axios.post(
        "http://localhost:3000/user-api/user",
        updatedUser
      );
      const { message, payload } = res.data;

      if (message === "Your account is blocked. Please contact admin.") {
        setError(message);
      } else if (message === role) {
        setCurrentUser(payload);
        navigate(`/${role}-profile/${payload.email}`);
      } else {
        setError(message);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  }

  // Set user details when Clerk user loads
  useEffect(() => {
    if (isLoaded) {
      setCurrentUser((prev) => ({
        ...prev,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.primaryEmailAddress?.emailAddress,
        profileImageUrl: user?.imageUrl,
      }));
    }
  }, [isLoaded, user]);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      {!isSignedIn ? (
        <div className="text-center">
          <h1 className="display-5">Welcome to the Blog Platform</h1>
          <p className="lead">Sign in to continue and explore amazing blogs.</p>
        </div>
      ) : (
        <div className="text-center w-100">
          <div className="card shadow-lg p-4 mb-4 border-0">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <img
                src={user.imageUrl}
                className="rounded-circle border"
                width="90px"
                alt="Profile"
              />
              <h2 className="ms-3">{user.firstName}</h2>
            </div>

            <h5 className="mb-3">Select Your Role</h5>

            {error && <p className="alert alert-danger">{error}</p>}

            <div className="row justify-content-center">
              <div className="col-md-3 mb-3">
                <button
                  className="btn btn-outline-primary w-100 py-2 d-flex align-items-center justify-content-center"
                  onClick={() => navigateToRole("author")}
                >
                  <FaUserTie className="me-2" /> Author
                </button>
              </div>

              <div className="col-md-3 mb-3">
                <button
                  className="btn btn-outline-success w-100 py-2 d-flex align-items-center justify-content-center"
                  onClick={() => navigateToRole("user")}
                >
                  <FaUser className="me-2" /> User
                </button>
              </div>

              <div className="col-md-3 mb-3">
                <button
                  className="btn btn-outline-danger w-100 py-2 d-flex align-items-center justify-content-center"
                  onClick={() => setAdminStatus(true)}
                >
                  <FaShieldAlt className="me-2" /> Admin
                </button>
              </div>
            </div>

            {adminStatus && (
              <div className="mt-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaKey />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter Admin Key"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-danger mt-2 w-100"
                  onClick={handleAdminSubmit}
                >
                  Submit Key
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
