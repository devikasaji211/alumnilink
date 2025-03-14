import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddUser.css";

const AddUser = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        admissionNumber: "",
        name: "",
        email: ""
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/admin/users");
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/admin/add-user", formData);
            alert("User added successfully");
            setFormData({ admissionNumber: "", name: "", email: "" });
            fetchUsers(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.message || "Error adding user");
        }
    };

    return (
        <div className="container">
            <h2>Add User</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="admissionNumber" placeholder="Admission Number" value={formData.admissionNumber} onChange={handleChange} required />
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <button type="submit">Add User</button>
            </form>

            <h3>Existing Users</h3>
            <table>
                <thead>
                    <tr>
                        <th>Admission Number</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.admissionNumber}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AddUser;
