import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import FrontPage from "./FrontPage";
import Login from "./login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Resources from "./Resources";
import AlumniReview from "./AlumnilinkReview";
import StudentReview from "./StudentReview";
import AlumniProfile from "./AlumniProfile"; // Import Alumni Profile Page
import StudentProfile from "./StudentProfile";
import EditAlumniProfile from "./EditAlumniProfile";
import AddInternship from "./AddInternship";
import ViewInternships from "./ViewInternships";
import AddWorkshop from "./AddWorkshop";
import ViewWorkshops from "./ViewWorkshops";
import WorkshopDetails from "./WorkshopDetails";
import InternshipDetails from "./InternshipDetails";
import Bookmarks from "./Bookmarks";
import "./App.css";

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

function AppWrapper() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";
  const [userType, setUserType] = useState(localStorage.getItem("userType") ?? "student");

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType") ?? "student";
    console.log("Stored userType in localStorage:", storedUserType);
    setUserType(storedUserType);
  }, []);

  console.log("Current userType:", userType);

  return (
    <div className={isAuthPage ? "auth-background" : "dashboard-background"}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/alumni/profile" element={<AlumniProfile />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/edit-profile" element={<EditAlumniProfile />} />
        <Route path="/add-internship" element={<AddInternship />} />
        <Route path="/view-internship" element={<ViewInternships />} />
        <Route path="/add-workshop" element={<AddWorkshop />} />
        <Route path="/view-workshops" element={<ViewWorkshops />} />
        <Route path="/internship/:id" element={<InternshipDetails />} />
        <Route path="/workshop/:id" element={<WorkshopDetails />} />
        {/* Review Pages */}
        <Route path="/AlumniReview" element={<AlumniReview />} />
        <Route path="/StudentReview" element={<StudentReview />} />
        <Route path="/bookmarks" element={<Bookmarks />} /> 

        {/* Fallback Route (404 Page) */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;