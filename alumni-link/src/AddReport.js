import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddReport.css";

const AddReport = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [image, setImage] = useState(null);
    const [reports, setReports] = useState([]);

    // Handle File Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("year", year);
        formData.append("month", month);
        if (image) {
            formData.append("image", image);
        }

        
            const token = localStorage.getItem("adminToken");
           // const token = localStorage.getItem("adminToken");
            console.log("Token being sent in request:", token); // Log token
            try {
            await axios.post("http://localhost:5000/api/reports/add-report", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Report added successfully!");
            fetchReports();
        } catch (error) {
            alert("Failed to add report");
        }
    };

    // Fetch Reports
    const fetchReports = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const { data } = await axios.get("http://localhost:5000/api/reports/get-reports", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <div className="container">
            <h2>Add Report</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Alumni Meetups">Alumni Meetups</option>
                    <option value="Cultural Events">Cultural Events</option>
                    <option value="Others">Others</option>
                </select>
                <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
                <input type="number" placeholder="Month" value={month} onChange={(e) => setMonth(e.target.value)} required />
                <input type="file" onChange={handleImageChange} accept="image/*" />
                <button type="submit">Add Report</button>
            </form>

            <h2>Reports List</h2>
            <ul>
                {reports.map((report) => (
                    <li key={report._id}>
                        <h3>{report.title}</h3>
                        <p>{report.description}</p>
                        {report.image && <img src={`data:image/png;base64,${report.image}`} alt="Report" style={{ width: "100px" }} />}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddReport;
