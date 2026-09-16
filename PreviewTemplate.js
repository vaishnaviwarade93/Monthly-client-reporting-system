import React, {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import "./PreviewTemplate.css";

function PreviewTemplate() {

  const defaultTemplate = `Hello {name},

Your project "{project}"
status is {status}.

Payment Status: {paid}

Thank You,
Monthly Client Reporting Team`;

  const [clients, setClients] =
    useState([]);

  const [clientId, setClientId] =
    useState("");

  const [template, setTemplate] =
    useState(defaultTemplate);

  const [preview, setPreview] =
    useState("");

  const [message, setMessage] =
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
     GENERATE PREVIEW
  ========================================= */

  const generatePreview = async () => {

    if (!clientId || !template) {

      return alert(
        "Please select client and template"
      );
    }

    try {

      const res = await API.post(
        "/preview-template",
        {
          clientId,
          template,
        }
      );

      setPreview(res.data.preview);

      setMessage(
        "Preview generated successfully"
      );

    } catch (err) {

      console.log(err);

      setMessage(
        "Preview generation failed"
      );
    }
  };

  /* =========================================
     SEND EMAIL
  ========================================= */

  const sendEmail = async () => {

    if (!preview) {

      return alert(
        "Please generate preview first"
      );
    }

    try {

      const selectedClientData =
        clients.find(
          (c) =>
            c.id === Number(clientId)
        );

      const res = await API.post(
        "/send-email",
        {
          to: selectedClientData.email,

          subject:
            "Monthly Client Report",

          message: preview,
        }
      );

      setMessage(res.data.message);

    } catch (err) {

      console.log(err);

      setMessage(
        "Email sending failed"
      );
    }
  };

  return (

    <div className="preview-page">

      <div className="preview-box">

        {/* HEADER */}

        <div className="preview-header">

          <h1>
            Template Preview
          </h1>

          <p>
            Generate personalized email
            previews before sending reports
            to clients.
          </p>

        </div>

        {/* CLIENT SELECT */}

        <div className="form-group">

          <label>
            Select Client
          </label>

          <select
            value={clientId}
            onChange={(e) =>
              setClientId(
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

        </div>

        {/* SHORTCODE HELP */}

        <div className="shortcode-box">

          <h3>
            Available Shortcodes
          </h3>

          <div className="shortcodes">

            <span>{`{name}`}</span>
            <span>{`{project}`}</span>
            <span>{`{status}`}</span>
            <span>{`{paid}`}</span>

          </div>

        </div>

        {/* TEMPLATE */}

        <div className="form-group">

          <label>
            Email Template
          </label>

          <textarea
            rows="10"
            value={template}
            onChange={(e) =>
              setTemplate(
                e.target.value
              )
            }
          ></textarea>

        </div>

        {/* BUTTONS */}

        <div className="button-group">

          <button
            className="preview-btn"
            onClick={generatePreview}
          >
            Generate Preview
          </button>

          <button
            className="send-btn"
            onClick={sendEmail}
          >
            Send Email
          </button>

        </div>

        {/* MESSAGE */}

        {message && (

          <div className="message-box">
            {message}
          </div>

        )}

        {/* PREVIEW */}

        {preview && (

          <div className="preview-result">

            <h2>
              Email Preview
            </h2>

            <div className="preview-content">
              {preview}
            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default PreviewTemplate;