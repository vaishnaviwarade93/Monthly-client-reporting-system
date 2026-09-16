import React, { useState } from "react";
import API from "../services/api";
import "./Login.css";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const registerUser = async () => {

    if (!name || !email || !password) {

      alert("Please fill all fields");

      return;
    }

    try {

      const res = await API.post(
        "/register",
        {
          name,
          email,
          password,
        }
      );

      if (res.data.error) {

        alert(res.data.error);

      } else {

        alert(res.data.message);

        window.location.href =
          "/login";
      }

    } catch (err) {

      console.log(err);

      alert("Registration Failed");

    }
  };

  return (

    <div className="login-page">

      <div className="login-box">

        <h1>
          Register
        </h1>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={registerUser}>
          Register
        </button>

      </div>

    </div>
  );
}

export default Register;