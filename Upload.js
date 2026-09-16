import React, { useState } from "react";
import API from "../services/api";
import "./Upload.css";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post(
  "/upload",
  formData,
  {
    headers: {
      "Content-Type":
        "multipart/form-data",
    },
  }
);
      setMessage(res.data.message);
    } catch (err) {
      console.log(err);
      setMessage("Upload Failed");
    }
  };

  return (
    <div className="upload-page">

      <div className="upload-container">

        {/* LEFT SIDE */}
        <div className="upload-left">

          <h1>Excel Upload Center</h1>

          <p>
            Upload client Excel files securely
            and automatically store data into
            the Monthly Client Reporting System.
          </p>

          <div className="upload-features">

            <div className="feature-box">
              <span>📊</span>
              <p>Bulk Client Upload</p>
            </div>

            <div className="feature-box">
              <span>⚡</span>
              <p>Fast Processing</p>
            </div>

            <div className="feature-box">
              <span>🔒</span>
              <p>Secure Data Storage</p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="upload-right">

          <div className="upload-card">

            <h2>Upload Excel File</h2>

            <p className="subtitle">
              Supported format: .xlsx
            </p>

            <div className="file-upload-box">

              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
              />

            </div>

            {file && (
              <div className="file-info">
                <p>Selected File:</p>
                <h4>{file.name}</h4>
              </div>
            )}

            <button onClick={handleUpload}>
              Upload File
            </button>

            {message && (
              <div className="message-box">
                {message}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Upload;