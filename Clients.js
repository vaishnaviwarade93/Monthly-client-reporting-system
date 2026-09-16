import "./Clients.css";

import React, {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

function Clients() {

  const [clients, setClients] =
    useState([]);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [project, setProject] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [paid, setPaid] =
    useState("");

  /* =========================================
     FETCH CLIENTS
  ========================================= */

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

  /* =========================================
     ADD CLIENT
  ========================================= */

  const addClient = async () => {

    if (
      !name ||
      !email ||
      !project ||
      !status ||
      !paid
    ) {

      alert("Please fill all fields");

      return;
    }

    try {

      const res = await API.post(
        "/clients",
        {
          name,
          email,
          project,
          status,
          paid,
        }
      );

      if (res.data.error) {

        alert(res.data.error);

        return;
      }

      alert(
        "Client Added Successfully ✅"
      );

      setName("");
      setEmail("");
      setProject("");
      setStatus("");
      setPaid("");

      fetchClients();

    } catch (err) {

      console.log(err);

      alert("Error adding client");

    }
  };

  /* =========================================
     DELETE CLIENT
  ========================================= */

  const deleteClient = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this client?"
      );

    if (!confirmDelete) return;

    try {

      await API.delete(
        `/clients/${id}`
      );

      fetchClients();

    } catch (err) {

      console.log(err);

      alert("Delete failed");

    }
  };

  /* =========================================
     DOWNLOAD PDF REPORT
  ========================================= */

  const downloadPDF = (id) => {

    window.open(
      `http://localhost:5000/generate-pdf/${id}`,
      "_blank"
    );
  };

  /* =========================================
     VIEW CLIENT
  ========================================= */

  const viewClient = (client) => {

    alert(
`Client Details

Name: ${client.name}
Email: ${client.email}
Project: ${client.project}
Status: ${client.status}
Paid: ${client.paid}`
    );
  };

  return (

    <div className="clients-page">

      <h1>
        👥 Clients Management
      </h1>

      {/* =====================================
          ADD CLIENT
      ===================================== */}

      <div className="card">

        <h2>Add Client</h2>

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
          type="text"
          placeholder="Project Name"
          value={project}
          onChange={(e) =>
            setProject(e.target.value)
          }
        />

        {/* STATUS */}

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >

          <option value="">
            Select Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Pending">
            Pending
          </option>

        </select>

        {/* PAYMENT */}

        <select
          value={paid}
          onChange={(e) =>
            setPaid(e.target.value)
          }
        >

          <option value="">
            Payment Status
          </option>

          <option value="Yes">
            Yes
          </option>

          <option value="No">
            No
          </option>

        </select>

        <button onClick={addClient}>
          Add Client
        </button>

      </div>

      {/* =====================================
          CLIENT LIST
      ===================================== */}

      <div className="card">

        <h2>Client List</h2>

        <table className="client-table">

          <thead>

            <tr>

              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Project</th>
              <th>Status</th>
              <th>Paid</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {clients.map((c) => (

              <tr key={c.id}>

                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.project}</td>
                <td>{c.status}</td>
                <td>{c.paid}</td>

                <td className="action-buttons">

                  <button
                    className="view-btn"
                    onClick={() =>
                      viewClient(c)
                    }
                  >
                    View
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteClient(c.id)
                    }
                  >
                    Delete
                  </button>

                  <button
                    className="pdf-btn"
                    onClick={() =>
                      downloadPDF(c.id)
                    }
                  >
                    PDF
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Clients;