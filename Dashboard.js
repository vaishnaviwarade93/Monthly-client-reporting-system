import React, { useEffect, useState } from "react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");

  const [report, setReport] = useState({
    total: 0,
    active: 0,
    pending: 0,
    paid: 0,
    unpaid: 0,
  });

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await API.get("/report");
      setReport(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard">

      {/* TOP SECTION */}
      <div className="dashboard-top">

        <div>
          <h1>Dashboard</h1>
          <p>Welcome to Monthly Client Reporting System</p>
        </div>

        {/* PROFILE */}
        <div
          className="profile-card"
          onClick={() => navigate("/profile")}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="profile"
          />

          <div className="profile-info">
            <h3>{userName || "Admin"}</h3>
            <p>{userEmail || "admin@gmail.com"}</p>
            <span>System Administrator</span>
          </div>
        </div>

      </div>

      {/* REPORT CARDS */}
      <div className="cards">
        <div className="card"><h2>{report.total}</h2><p>Total Clients</p></div>
        <div className="card"><h2>{report.active}</h2><p>Active Projects</p></div>
        <div className="card"><h2>{report.pending}</h2><p>Pending Projects</p></div>
        <div className="card"><h2>{report.paid}</h2><p>Paid Clients</p></div>
        <div className="card"><h2>{report.unpaid}</h2><p>Unpaid Clients</p></div>
      </div>

      {/* ANALYTICS SECTION */}
      <div className="analytics">

        {/* SYSTEM OVERVIEW */}
        <div className="analytics-card">
          <h2>System Overview</h2>

          <p>
            This dashboard helps manage client reports, Excel uploads,
            templates and monthly business operations efficiently.
          </p>

          <div className="progress-item">
            <span>Project Completion</span>

            <div className="progress-bar small">
              <div className="progress-fill" style={{ width: "85%" }}></div>
            </div>

            <div className="progress-text">85%</div>
          </div>

          <div className="progress-item">
            <span>Database Efficiency</span>

            <div className="progress-bar small">
              <div className="progress-fill" style={{ width: "92%" }}></div>
            </div>

            <div className="progress-text">92%</div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="analytics-card">

          <h2>Quick Actions</h2>

          <div className="action-grid small">

            <div className="action-card small" onClick={() => navigate("/clients")}>
              👥 <h3>Clients</h3>
            </div>

            <div className="action-card small" onClick={() => navigate("/upload")}>
              📤 <h3>Upload</h3>
            </div>

            <div className="action-card small" onClick={() => navigate("/create-template")}>
              📝 <h3>Template</h3>
            </div>

            <div className="action-card small" onClick={() => navigate("/reports")}>
              📊 <h3>Reports</h3>
            </div>

            <div className="action-card small" onClick={() => navigate("/compose-email")}>
              📧 <h3>Compose Email</h3>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;