import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="logo">
        📊 Client Reporting System
      </div>

      <div className="nav-links">
        <Link to="/">Dashboard</Link>
<Link to="/compose-email">
  Compose Email
</Link>
        <Link to="/clients">
          Clients
        </Link>

        <Link to="/upload">
          Upload Excel
        </Link>

      

        <Link to="/create-template">
          Create Template
        </Link>
        <Link to="/preview-template">
         Preview
        </Link>
        <Link to="/reports">
  Reports
</Link>
      </div>

      <button
        onClick={logout}
        className="logout-btn"
      >
        Logout
      </button>

    </nav>
  );
}

export default Navbar;