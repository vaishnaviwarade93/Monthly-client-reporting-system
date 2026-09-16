import React, { useState } from "react";

import API from "../services/api";

import { useNavigate } from "react-router-dom";

import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/login",
        {
          email,
          password,
        }
      );

      console.log(res.data);

      /* SUCCESS LOGIN */

      if (res.data.token) {

        /* STORE TOKEN */

        localStorage.setItem(
          "token",
          res.data.token
        );

        /* REDIRECT */

        navigate("/");

      } else {

        setMessage(
          res.data.error
        );

      }

    } catch (err) {

      console.log(err);

      setMessage("Server Error");

    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* LEFT SIDE */}

        <div className="left-side">

          <h1>
            Monthly Client Reporting System
          </h1>

          <p>
            Manage clients, reports,
            Excel uploads and analytics
            in one professional platform.
          </p>

        </div>

        {/* RIGHT SIDE */}

        <div className="right-side">

          <form
            className="login-card"
            onSubmit={handleLogin}
          >

            <h2>Welcome Back</h2>

            <p className="subtitle">
              Login to continue
            </p>

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              Login
            </button>

            {message && (
              <p className="error">
                {message}
              </p>
            )}

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;