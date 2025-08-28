import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function App() {
  const [file, setFile] = useState(null);

  const handleUpload = async (docType) => {
    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("doc_type", docType);

    try {
      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `documentation.${docType}`;
        a.click();
      } else {
        const errorText = await res.text();
        alert("Error: " + errorText);
      }
    } catch (err) {
      alert("Fetch error: " + err.message);
    }
  };

  const pageStyle = {
    textAlign: "center",
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const navStyle = {
    backgroundColor: "#0d47a1",
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    gap: "30px",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "18px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    color: "white",
    margin: "0 5px",
  };

  const buttonColors = ["#1976d2", "#2e7d32", "#6a1b9a"];

  return (
    <Router>
      <div>
        <nav style={navStyle}>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/about" style={linkStyle}>About</Link>
          <Link to="/contact" style={linkStyle}>Contact</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div style={pageStyle}>
                <h1 style={{ color: "#0d47a1" }}>📄 Code to Documentation</h1>
                <input
                  type="file"
                  accept=".py,.java,.js,.abap,.txt"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ marginTop: "20px" }}
                />
                <div style={{ marginTop: "20px" }}>
                  <button
                    style={{ ...buttonStyle, backgroundColor: buttonColors[0] }}
                    onClick={() => handleUpload("txt")}
                  >
                    Generate TXT
                  </button>
                  <button
                    style={{ ...buttonStyle, backgroundColor: buttonColors[1] }}
                    onClick={() => handleUpload("markdown")}
                  >
                    Generate Markdown
                  </button>
                  <button
                    style={{ ...buttonStyle, backgroundColor: buttonColors[2] }}
                    onClick={() => handleUpload("docx")}
                  >
                    Generate DOCX
                  </button>
                </div>
              </div>
            }
          />
          <Route
            path="/about"
            element={
              <div style={pageStyle}>
                <h1 style={{ color: "#0d47a1" }}>About This Project</h1>
                <p>
                  This project automatically generates detailed documentation for your code using advanced AI.
                  Simply upload your code file and choose the output format.
                  The tool supports TXT, Markdown, and DOCX formats. It is designed to save developers time
                  and improve code understanding across teams.
                </p>
              </div>
            }
          />
          <Route
            path="/contact"
            element={
              <div style={pageStyle}>
                <h1 style={{ color: "#0d47a1" }}>Contact Us</h1>
                <p>Email: support@example.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Address: 123 AI Street, Tech City, India</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
