import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        gender: "",
        dob: "",
        department: "",
        graduationYear: "",
        profilePicture: "",
        idProof: "",
        industry: "",
        yearsOfExperience: "",
        currentJobTitle: "",
        company: "",
        linkedInProfile: "",
        yearOfAdmission: "",
        currentYear: "",
        rollNumber: "",
        ktuId: "",
        idCard: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("/api/user/profile", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, [e.target.name]: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put("/api/user/updateProfile", formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("Profile updated successfully!");
            navigate("/profile");
        } catch (error) {
            console.error("Error updating profile", error);
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label>Email:</label>
                <input type="email" name="email" value={formData.email} disabled />

                <label>Gender:</label>
                <input type="text" name="gender" value={formData.gender} onChange={handleChange} required />

                <label>Date of Birth:</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

                <label>Department:</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} required />

                <label>Graduation Year:</label>
                <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} required />

                {formData.role === "alumni" && (
                    <>
                        <label>Industry:</label>
                        <input type="text" name="industry" value={formData.industry} onChange={handleChange} />

                        <label>Years of Experience:</label>
                        <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} />

                        <label>Current Job Title:</label>
                        <input type="text" name="currentJobTitle" value={formData.currentJobTitle} onChange={handleChange} />

                        <label>Company:</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} />

                        <label>LinkedIn Profile:</label>
                        <input type="text" name="linkedInProfile" value={formData.linkedInProfile} onChange={handleChange} />

                        <label>ID Proof:</label>
                        <input type="file" accept="image/*" name="idProof" onChange={handleFileChange} />
                    </>
                )}

                {formData.role === "student" && (
                    <>
                        <label>Year of Admission:</label>
                        <input type="number" name="yearOfAdmission" value={formData.yearOfAdmission} onChange={handleChange} />

                        <label>Current Year:</label>
                        <input type="text" name="currentYear" value={formData.currentYear} onChange={handleChange} />

                        <label>Roll Number:</label>
                        <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} />

                        <label>KTU ID:</label>
                        <input type="text" name="ktuId" value={formData.ktuId} onChange={handleChange} />

                        <label>ID Card:</label>
                        <input type="file" accept="image/*" name="idCard" onChange={handleFileChange} />
                    </>
                )}

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
