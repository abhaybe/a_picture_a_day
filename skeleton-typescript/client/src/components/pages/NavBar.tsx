import React from "react";
import { Link } from "@reach/router";
import { FaCalendarAlt } from "react-icons/fa"; // Importing the calendar icon

import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import "./NavBar.css";

const GOOGLE_CLIENT_ID =
  "1058809634774-q5fa4vukq4cll8kc5pu6lv9emvui3bg2.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
const NavBar = ({ userId, handleLogin, handleLogout }) => {
  return (
    <nav className="NavBar-container">
      <div className="NavBar-title u-inlineBlock">
        <Link to="/" className="NavBar-title">
          <span className="gradient1-text">A Pic A Day</span>
        </Link>
      </div>
      <div className="NavBar-linkContainer u-inlineBlock">
        <Link to="/calendar" className="NavBar-link, NavBar-calendar">
          <FaCalendarAlt size={24} /> {/* Calendar icon */}
        </Link>
        <span className="NavBar-link NavBar-loginbutton">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {userId ? (
              // <button
              //   className="button-54"
              //   onClick={() => {
              //     googleLogout();
              //     handleLogout();
              //   }}
              // >
              //   Logout
              // </button>
              <Link to="/about" className="NavBar-link">
                Profile
              </Link>
            ) : (
              <GoogleLogin onSuccess={handleLogin} />
            )}
          </GoogleOAuthProvider>
        </span>
      </div>
    </nav>
  );
};

export default NavBar;
