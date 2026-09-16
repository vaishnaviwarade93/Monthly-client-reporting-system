import React from "react";
import "./Profile.css";

function Profile() {

  const name =
    localStorage.getItem("name");

  const email =
    localStorage.getItem("email");

  return (

    <div className="profile-page">

      <div className="profile-container">

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="profile"
        />

        <h1>
          {name || "Admin"}
        </h1>

        <h3>
          {email || "admin@gmail.com"}
        </h3>

        <div className="profile-box">

          <p>
            <strong>Role:</strong>
            {" "}
            System Administrator
          </p>

          <p>
            <strong>Access:</strong>
            {" "}
            Full Dashboard Control
          </p>

        </div>

      </div>

    </div>
  );
}

export default Profile;