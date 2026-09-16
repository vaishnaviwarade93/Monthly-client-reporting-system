require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("./db");
const PDFDocument = require("pdfkit");


const app = express();

app.use(cors());
app.use(express.json());

/* ===================================================
   UPLOAD FOLDER SETUP
=================================================== */

const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ===================================================
   MULTER STORAGE
=================================================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ===================================================
   GET ALL CLIENTS
=================================================== */

app.get("/clients", (req, res) => {
  db.query("SELECT * FROM clients", (err, result) => {
    if (err) {
      console.log(err);
      return res.json({
        error: "Error fetching clients",
      });
    }

    res.json(result);
  });
});

/* ===================================================
   ADD CLIENT
=================================================== */

app.post("/clients", (req, res) => {
  const {
    name,
    email,
    project,
    status,
    paid,
  } = req.body;

  if (!name || !email) {
    return res.json({
      error: "Name and Email are required",
    });
  }

  const sql = `
    INSERT INTO clients
    (name, email, project, status, paid)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE email=email
  `;

  db.query(
    sql,
    [name, email, project, status, paid],
    (err) => {
      if (err) {
        console.log(err);

        return res.json({
          error: "Error adding client",
        });
      }

      res.json({
        success: true,
        message: "Client Added Successfully",
      });
    }
  );
});

/* ===================================================
   DELETE CLIENT
=================================================== */

app.delete("/clients/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM clients WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.json({
          error: "Error deleting client",
        });
      }

      if (result.affectedRows === 0) {
        return res.json({
          error: "Client not found",
        });
      }

      res.json({
        message: "Client Deleted Successfully",
      });
    }
  );
});

/* ===================================================
   UPDATE CLIENT
=================================================== */

app.put("/clients/:id", (req, res) => {
  const id = req.params.id;

  const {
    name,
    email,
    project,
    status,
    paid,
  } = req.body;

  if (!name || !email) {
    return res.json({
      error: "Name and Email are required",
    });
  }

  const sql = `
    UPDATE clients
    SET
      name=?,
      email=?,
      project=?,
      status=?,
      paid=?
    WHERE id=?
  `;

  db.query(
    sql,
    [name, email, project, status, paid, id],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.json({
          error: "Error updating client",
        });
      }

      if (result.affectedRows === 0) {
        return res.json({
          error: "Client not found",
        });
      }

      res.json({
        message: "Client Updated Successfully",
      });
    }
  );
});

/* ===================================================
   EXCEL UPLOAD
=================================================== */

app.post(
  "/upload",
  upload.single("file"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.json({
          error: "No file uploaded",
        });
      }

      const workbook =
        xlsx.readFile(req.file.path);

      const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const data =
        xlsx.utils.sheet_to_json(sheet);

      let inserted = 0;

      for (const row of data) {

        const name = row.Name;
        const email = row.Email;

        if (!name || !email) {
          continue;
        }

        /* CHECK EXISTING EMAIL */

        const existingUser =
          await new Promise((resolve, reject) => {

            db.query(
              "SELECT * FROM clients WHERE email = ?",
              [email],

              (err, result) => {

                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });

        /* SKIP DUPLICATES */

        if (existingUser.length > 0) {
          continue;
        }

        /* INSERT CLIENT */

        await new Promise((resolve, reject) => {

          db.query(
            `
            INSERT INTO clients
            (name, email, project, status, paid)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
              name,
              email,
              row.Project || "N/A",
              row.Status || "Pending",
              row.Paid || "No",
            ],

            (err) => {

              if (err) {
                reject(err);
              } else {
                inserted++;
                resolve();
              }
            }
          );
        });
      }

      fs.unlinkSync(req.file.path);

      res.json({
        message:
          `Upload Successful ✅ Inserted: ${inserted}`,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: "Upload Failed ❌",
      });
    }
  }
);
/* ===================================================
   REGISTER API
=================================================== */

app.post("/register", async (req, res) => {

  const {
    name,
    email,
    password,
  } = req.body;

  try {

    /* CHECK EXISTING USER */

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],

      async (err, result) => {

        if (err) {

          console.log(err);

          return res.status(500).json({
            error: "Database error",
          });
        }

        if (result.length > 0) {

          return res.json({
            error: "Email already exists",
          });
        }

        /* HASH PASSWORD */

        const hashedPassword =
          await bcrypt.hash(password, 10);

        /* INSERT USER */

        db.query(
          `
          INSERT INTO users
          (name, email, password)
          VALUES (?, ?, ?)
          `,
          [
            name,
            email,
            hashedPassword,
          ],

          (err) => {

            if (err) {

              console.log(err);

              return res.status(500).json({
                error: "Registration failed",
              });
            }

            res.json({
              message:
                "User Registered Successfully ✅",
            });
          }
        );
      }
    );

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Server error",
    });

  }
});
/* ===================================================
   LOGIN API
=================================================== */

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) =>  {
    if (err) {
      console.log(err);

      return res.json({
        error: "Server error",
      });
    }

    if (result.length === 0) {
      return res.json({
        error: "User not found",
      });
    }

    const user = result[0];

   const validPassword =
  await bcrypt.compare(
    password,
    user.password
  );
    if (!validPassword) {
      return res.json({
        error: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user.id },
     process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user,
    });
  });
});

/* ===================================================
   DASHBOARD REPORT API
=================================================== */

app.get("/report", (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(status = 'Active') AS active,
      SUM(status = 'Pending') AS pending,
      SUM(paid = 'Yes') AS paid,
      SUM(paid = 'No') AS unpaid
    FROM clients
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);

      return res.json({
        error: "Error generating report",
      });
    }

    res.json(result[0]);
  });
});
/* ===================================================
   SAVE TEMPLATE API
=================================================== */

app.post("/templates", (req, res) => {

  const {
    templateName,
    subject,
    content,
  } = req.body;

  const sql = `
    INSERT INTO templates
    (template_name, subject, content)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [templateName, subject, content],
    (err) => {

      if (err) {
        console.log(err);

        return res.json({
          error: "Error saving template",
        });
      }

      res.json({
        message: "Template Saved Successfully ✅",
      });
    }
  );
});/* ===================================================
   SHORTCODE MAPPING ENGINE
=================================================== */

app.post("/preview-template", (req, res) => {

  const {
    template,
    clientId,
  } = req.body;

  const sql =
    "SELECT * FROM clients WHERE id = ?";

  db.query(sql, [clientId], (err, result) => {

    if (err) {
      console.log(err);

      return res.json({
        error: "Database error",
      });
    }

    if (result.length === 0) {
      return res.json({
        error: "Client not found",
      });
    }

    const client = result[0];

    let finalContent = template;

    finalContent = finalContent.replace(
      /{name}/g,
      client.name
    );

    finalContent = finalContent.replace(
      /{project}/g,
      client.project
    );

    finalContent = finalContent.replace(
      /{status}/g,
      client.status
    );

    finalContent = finalContent.replace(
      /{paid}/g,
      client.paid
    );

    res.json({
      preview: finalContent,
    });

  });
});
/* ===================================================
   SEND EMAIL API
=================================================== */

app.post("/send-email", async (req, res) => {

  const {
    to,
    subject,
    message,
  } = req.body;

  try {

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {
       user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
        },

      });

    const mailOptions = {

      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: message,

    };

    await transporter.sendMail(
      mailOptions
    );

    res.json({
      message:
        "Email Sent Successfully ✅",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Email sending failed",
    });

  }

});
/* ===================================================
   SEND EMAIL WITH PDF ATTACHMENT
=================================================== */

app.post(
  "/send-email-with-pdf",

  async (req, res) => {

    const {
      clientId,
      subject,
      message,
    } = req.body;

    try {

      /* GET CLIENT */

      db.query(
        "SELECT * FROM clients WHERE id = ?",
        [clientId],

        async (err, result) => {

          if (err) {

            console.log(err);

            return res.status(500).json({
              error: "Database Error",
            });
          }

          if (result.length === 0) {

            return res.json({
              error: "Client not found",
            });
          }

          const client = result[0];

          /* PDF FILE NAME */

          const pdfPath =
            `uploads/Client_${client.id}.pdf`;

          /* CREATE PDF */

          const doc =
            new PDFDocument({
              margin: 50,
            });

          const stream =
            fs.createWriteStream(pdfPath);

          doc.pipe(stream);

          /* PDF CONTENT */

          doc
            .fontSize(24)
            .fillColor("#2563eb")
            .text(
              "Client Report",
              {
                align: "center",
              }
            );

          doc.moveDown(2);

          doc
            .fontSize(14)
            .fillColor("black");

          doc.text(
            `Client ID: ${client.id}`
          );

          doc.text(
            `Name: ${client.name}`
          );

          doc.text(
            `Email: ${client.email}`
          );

          doc.text(
            `Project: ${client.project}`
          );

          doc.text(
            `Status: ${client.status}`
          );

          doc.text(
            `Payment: ${client.paid}`
          );

          doc.moveDown(2);

          doc.text(
            "Generated by Monthly Client Reporting System"
          );

          doc.end();

          /* WAIT FOR PDF */

          stream.on(
            "finish",

            async () => {

              try {

                /* EMAIL TRANSPORT */

                const transporter =
                  nodemailer.createTransport({

                    service: "gmail",

                    auth: {
                      user:
                        process.env.EMAIL_USER,

                      pass:
                        process.env.EMAIL_PASS,
                    },

                  });

                /* SEND EMAIL */

                await transporter.sendMail({

                  from:
                    process.env.EMAIL_USER,

                  to: client.email,

                  subject: subject,

                  text: message,

                  attachments: [
                    {
                      filename:
                        `Client_Report_${client.id}.pdf`,

                      path: pdfPath,
                    },
                  ],

                });

                /* DELETE TEMP PDF */

                fs.unlinkSync(pdfPath);

                res.json({
                  message:
                    "Email with PDF sent successfully ✅",
                });

              } catch (emailErr) {

                console.log(emailErr);

                res.status(500).json({
                  error:
                    "Email sending failed",
                });
              }
            }
          );
        }
      );

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: "Server Error",
      });
    }
  }
);

/* ===================================================
   GENERATE PDF REPORT
=================================================== */

app.get("/generate-pdf/:id", (req, res) => {

  const id = req.params.id;

  const sql =
    "SELECT * FROM clients WHERE id = ?";

  db.query(sql, [id], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        error: "Database Error",
      });
    }

    if (result.length === 0) {

      return res.json({
        error: "Client not found",
      });
    }

    const client = result[0];

    /* PDF DOCUMENT */

    const doc = new PDFDocument({
      margin: 50,
    });

    /* FILE NAME */

    const filename =
      `Client_Report_${client.id}.pdf`;

    /* RESPONSE HEADERS */

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}`
    );

    /* PIPE PDF */

    doc.pipe(res);

    /* HEADER */

    doc
      .fontSize(26)
      .fillColor("#2563eb")
      .text(
        "Monthly Client Report",
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    /* CLIENT INFO */

    doc
      .fontSize(18)
      .fillColor("black")
      .text("Client Information");

    doc.moveDown();

    doc
      .fontSize(14)
      .text(`Client ID: ${client.id}`);

    doc.text(`Name: ${client.name}`);

    doc.text(`Email: ${client.email}`);

    doc.text(`Project: ${client.project}`);

    doc.text(`Status: ${client.status}`);

    doc.text(`Payment: ${client.paid}`);

    doc.moveDown(2);

    /* SUMMARY */

    doc
      .fontSize(18)
      .text("Report Summary");

    doc.moveDown();

    doc
      .fontSize(13)
      .text(
        `This report contains the latest project status and payment details for the client. The Monthly Client Reporting System automatically generates and manages reports for efficient business operations.`,
        {
          lineGap: 6,
        }
      );

    doc.moveDown(3);

    /* FOOTER */

    doc
      .fontSize(12)
      .fillColor("gray")
      .text(
        "Generated by Monthly Client Reporting System",
        {
          align: "center",
        }
      );

    /* END PDF */

    doc.end();

  });
});
/* ===================================================
   GENERATE ALL CLIENTS PDF
=================================================== */

app.get(
  "/generate-all-pdf",
  (req, res) => {

    db.query(
      "SELECT * FROM clients",

      (err, result) => {

        if (err) {

          console.log(err);

          return res.status(500).json({
            error: "Database Error",
          });
        }

        const doc =
          new PDFDocument({
            margin: 50,
          });

        res.setHeader(
          "Content-Type",
          "application/pdf"
        );

        res.setHeader(
          "Content-Disposition",
          "attachment; filename=All_Clients_Report.pdf"
        );

        doc.pipe(res);

        /* HEADER */

        doc
          .fontSize(26)
          .fillColor("#2563eb")
          .text(
            "Monthly Client Full Report",
            {
              align: "center",
            }
          );

        doc.moveDown(2);

        result.forEach((client, index) => {

          doc
            .fontSize(18)
            .fillColor("black")
            .text(
              `Client ${index + 1}`
            );

          doc.moveDown(0.5);

          doc
            .fontSize(13)
            .text(
              `Name: ${client.name}`
            );

          doc.text(
            `Email: ${client.email}`
          );

          doc.text(
            `Project: ${client.project}`
          );

          doc.text(
            `Status: ${client.status}`
          );

          doc.text(
            `Paid: ${client.paid}`
          );

          doc.moveDown(1.5);

          doc.moveTo(50, doc.y)
             .lineTo(550, doc.y)
             .strokeColor("#cbd5e1")
             .stroke();

          doc.moveDown(1.5);

        });

        doc.end();
      }
    );
  }
);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});