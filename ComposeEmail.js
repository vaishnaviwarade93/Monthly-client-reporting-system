import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./ComposeEmail.css";

function ComposeEmail() {

  const [clients, setClients] = useState([]);

  const [clientId, setClientId] = useState("");

  const [subject, setSubject] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {

    try {

      const res = await API.get("/clients");

      setClients(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  const sendEmail = async () => {

    if (!clientId || !subject || !message) {

      alert("Please fill all fields");

      return;
    }

    try {

      const res = await API.post(
        "/send-email-with-pdf",
        {
          clientId,
          subject,
          message,
        }
      );

      alert(res.data.message);

      setSubject("");
      setMessage("");

    } catch (err) {

      console.log(err);

      alert("Email sending failed");

    }
  };

  return (

    <div className="compose-page">

      <div className="compose-card">

        <h1>
          Compose Email
        </h1>

        <select
          value={clientId}
          onChange={(e) =>
            setClientId(e.target.value)
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
              {client.name} ({client.email})
            </option>

          ))}

        </select>

        <input
          type="text"
          placeholder="Email Subject"
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
        />

        <textarea
          rows="8"
          placeholder="Write message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
        ></textarea>

        <button onClick={sendEmail}>
          Send Email with PDF
        </button>

      </div>

    </div>
  );
}

export default ComposeEmail;