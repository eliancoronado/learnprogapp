import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import CursoPage from "./pages/cursos/CursoPage.jsx";
import Teachers from "./pages/teachers/teachers.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import TeacherProfile from "./pages/teacherprofile/TeacherProfile.jsx";
import UserProfile from "./components/AccountPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<App />} />
        <Route path="/courses" element={<CursoPage />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/profile/:id" element={<TeacherProfile />} />
        <Route path="/account" element={<UserProfile />} />
      </Routes>
    </Router>
  </StrictMode>
);
