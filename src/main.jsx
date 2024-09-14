import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import CursoPage from "./pages/cursos/CursoPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/courses" element={<CursoPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
