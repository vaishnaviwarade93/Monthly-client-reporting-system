import React, {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import "./Reports.css";

function Reports() {

  const [clients, setClients] =
    useState([]);

  const [selectedClient, setSelectedClient] =
    useState("");

  /* FETCH CLIENTS */

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {

    try {

      const res = await API.get(
        "/clients"
      );

      setClients(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  /* SINGLE PDF */

  const generateClientPDF = () => {

    if (!selectedClient) {

      return alert(
        "Please select client"
      );
    }

    window.open(
      `http://localhost:5000/generate-pdf/${selectedClient}`,
      "_blank"
    );
  };

  /* ALL CLIENTS PDF */

  const generateAllPDF = () => {

    window.open(
      "http://localhost:5000/generate-all-pdf",
      "_blank"
    );
  };

  return (

    <div className="reports-page">

      <div className="reports-header">

        <h1>
          Reports Management
        </h1>

        <p>
          Generate professional client
          reports and export business
          analytics.
        </p>

      </div>

      <div className="reports-grid">

        {/* SINGLE REPORT */}

        <div className="report-card">

          <div className="report-tag">
            <span>📄</span>
            Single Client Report
          </div>

          <h2>
            Generate Client Report
          </h2>

          <p>
            Download detailed PDF report
            for a specific client.
          </p>

          <select
            value={selectedClient}
            onChange={(e) =>
              setSelectedClient(
                e.target.value
              )
            }
          >

            <option value="">
              Select Client
            </option>

            {clients.map((client) => (

              <option
                key={client.id}
                value={client.id}
              >
                {client.name}
              </option>

            ))}

          </select>

          <button
            onClick={generateClientPDF}
          >
            Download Client PDF
          </button>

        </div>

        {/* ALL REPORT */}

        <div className="report-card">

          <div className="report-tag">
            <span>📊</span>
            Full Business Report
          </div>

          <h2>
            Full Business Report
          </h2>

          <p>
            Export all client data with
            monthly business summary.
          </p>

          <button
            className="all-btn"
            onClick={generateAllPDF}
          >
            Download Full Report
          </button>

        </div>

      </div>

    </div>
  );
}

export default Reports;