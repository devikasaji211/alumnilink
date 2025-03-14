import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentFund.css";

const StudentFund = () => {
    const [requests, setRequests] = useState([]);
    const [form, setForm] = useState({ purpose: "", amount: "", description: "" });

    // Fetch studentId from localStorage
    const studentId = localStorage.getItem("userId");  // Ensure it's stored during login
    console.log("Student ID from localStorage:", studentId);

    useEffect(() => {
        const fetchRequests = async () => {
            const token = localStorage.getItem("token"); 
            if (!token) {
                console.error("No token found! User not authenticated.");
                return;
            }

            console.log("Fetching fund requests with token:", token);
            console.log(`Request URL: /api/fundrequests/student/${studentId}`);

            try {
                const res = await axios.get(`http://localhost:5000/api/fundrequests/student/${studentId}`, {  
                    headers: { Authorization: `Bearer ${token}` }  // ✅ FIXED string interpolation
                });
                
                console.log("Fund requests fetched:", res.data);
                setRequests(res.data);
            } catch (err) {
                console.error("Error fetching fund requests:", err);
            }
        };

        if (studentId) fetchRequests();
    }, [studentId]);

    // Handle input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log("Submit button clicked!");
        console.log("Form data being sent:", { ...form, studentId });
    
        if (!studentId) {
            alert("User not logged in!");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/api/fundrequests", {  
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, studentId }),
            });
    
            const data = await response.json();
            console.log("Response:", data);
    
            if (response.ok) {
                alert("Fund request submitted!");
                setForm({ purpose: "", amount: "", description: "" }); // Clear form after submission
                setRequests([...requests, data]);
            } else {
                alert(`Error: ${data.message || "Failed to submit request"}`);  // ✅ FIXED template string
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error submitting request.");
        }
    };

    return (
        <div>
            <h2>Fund Requests</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="purpose" placeholder="Purpose" value={form.purpose} onChange={handleChange} required />
                <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
                <button type="submit">Submit Request</button>
            </form>

            <h3>My Requests</h3>
            <ul>
                {requests.map((req) => (
                    <li key={req._id}>
                        {req.purpose} - ₹{req.amount} ({req.status})
                        <br />
                        Remaining: ₹{req.remainingAmount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentFund;
