import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard">
            <h2>Welcome to the Admin Dashboard</h2>
            <div className="buttons">
                <button onClick={() => navigate("/add-user")}>Add User</button>
                <button onClick={() => navigate("/add-report")}>Add Report</button>
                <button onClick={() => navigate("/admin-fund")}>Manage Fund</button>
            </div>
        </div>
    );
};

export default AdminDashboard;
