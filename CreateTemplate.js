import React, { useState } from "react";

import API from "../services/api";

import "./CreateTemplate.css";

function CreateTemplate() {

  const defaultTemplate = `Hello {name},

Your project "{project}"
status is {status}.

Payment Status: {paid}

Thank You,
Monthly Client Reporting Team`;

  const [templateName, setTemplateName] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [content, setContent] =
    useState(defaultTemplate);

  const [message, setMessage] =
    useState("");

  /* =========================================
     SAVE TEMPLATE
  ========================================= */

  const saveTemplate = async () => {

    if (
      !templateName ||
      !subject ||
      !content
    ) {

      return alert(
        "Please fill all fields"
      );
    }

    try {

      const res = await API.post(
        "/templates",
        {
          templateName,
          subject,
          content,
        }
      );

      setMessage(res.data.message);

      setTemplateName("");
      setSubject("");

      setContent(defaultTemplate);

    } catch (err) {

      console.log(err);

      setMessage(
        "Error saving template"
      );
    }
  };

  return (

    <div className="template-create-page">

      <div className="template-box">

        {/* HEADER */}

        <div className="template-header">

          <h1>
            Create Email Template
          </h1>

          <p>
            Design reusable email templates
            for automated client reporting.
          </p>

        </div>

        {/* TEMPLATE NAME */}

        <div className="form-group">

          <label>
            Template Name
          </label>

          <input
            type="text"
            placeholder="Ex: Monthly Report"
            value={templateName}
            onChange={(e) =>
              setTemplateName(
                e.target.value
              )
            }
          />

        </div>

        {/* SUBJECT */}

        <div className="form-group">

          <label>
            Email Subject
          </label>

          <input
            type="text"
            placeholder="Ex: Monthly Project Status"
            value={subject}
            onChange={(e) =>
              setSubject(
                e.target.value
              )
            }
          />

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

        {/* CONTENT */}

        <div className="form-group">

          <label>
            Template Content
          </label>

          <textarea
            rows="12"
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
          ></textarea>

        </div>

        {/* BUTTON */}

        <button
          className="save-btn"
          onClick={saveTemplate}
        >
          Save Template
        </button>

        {/* MESSAGE */}

        {message && (

          <div className="message-box">
            {message}
          </div>

        )}

      </div>

    </div>
  );
}

export default CreateTemplate;