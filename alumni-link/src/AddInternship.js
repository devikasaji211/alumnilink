import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddInternship.css";

const AddInternship = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    stipend: "",
    duration: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the token from localStorage
    const token = localStorage.getItem("token");
    console.log("Token retrieved:", token); // Debugging: Log the token

    if (!token) {
      alert("No token found. Please log in again.");
      navigate("/login"); // Redirect to login page
      return;
    }

    try {
      console.log("Sending request with token:", token); // Debugging: Log the token being sent
      const response = await axios.post(
        "http://localhost:5000/api/internships/add",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      console.log("Server response:", response.data); // Debugging: Log the response
      alert("Internship added successfully!");

      // Reset the form
      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        stipend: "",
        duration: "",
      });

      // Redirect to dashboard or internships page
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding internship:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error || "Failed to add internship. Please try again.");
    }
  };

  return (
    <div className="add-internship-container">
      <h2>Add Internship</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="stipend"
          placeholder="Stipend"
          value={formData.stipend}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Internship</button>
      </form>
    </div>
  );
};

export default AddInternship;

