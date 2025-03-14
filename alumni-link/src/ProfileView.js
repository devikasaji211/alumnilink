import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const ProfileView = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  // ✅ Fixed
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log("📡 Fetching profile...");
                
                const token = localStorage.getItem("token");
                console.log("🛠 Token being sent:", token);
    

                const response = await axios.get(`http://localhost:5000/api/user/profile`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
    
                console.log("🔍 Profile Data Received:", response.data);
                setUser(response.data);
            } catch (error) {
                console.error("❌ Error fetching profile:", error);
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchProfile();
    }, []);
    

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>No profile data found.</p>;

        return (
            <div className="profile-container">
                <div className="edit-button" onClick={() => navigate("/edit-profile")}>✏️ Edit</div>
    
                <div className="profile-header">
                    {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="profile-avatar" />
                    ) : (
                        <div className="profile-avatar">👤</div>
                    )}
                    <h2 className="profile-name">{user.name}</h2>
                    <p className="profile-role">{user.role === "alumni" ? "Alumni" : "Student"}</p>

                </div>
    
                <div className="profile-details">
                    <div className="detail-box">📧 <strong>Email:</strong> {user.email}</div>
                    <div className="detail-box">👩‍🦰 <strong>Gender:</strong> {user.gender}</div>
                    <div className="detail-box">🎂 <strong>DOB:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}</div>
                    <div className="detail-box">🏫 <strong>Department:</strong> {user.department}</div>
                    <div className="detail-box">🎓 <strong>Graduation Year:</strong> {user.graduationYear}</div>
                    
                    {user.role === "Alumni" ? (
                        <>
                            <div className="detail-box">💼 <strong>Industry:</strong> {user.industry}</div>
                            <div className="detail-box">📌 <strong>Experience:</strong> {user.yearsOfExperience} years</div>
                            <div className="detail-box">🏢 <strong>Company:</strong> {user.company}</div>
                            <div className="detail-box">🔗 <strong>LinkedIn:</strong> <a href={user.linkedInProfile} target="_blank" rel="noopener noreferrer">{user.linkedInProfile}</a></div>
                            {user.idProof && <div className="detail-box">📄 <strong>ID Proof:</strong> <a href={user.idProof} download>Download</a></div>}
                        </>
                    ) : (
                        <>
                            <div className="detail-box">📅 <strong>Year of Admission:</strong> {user.yearOfAdmission}</div>
                            <div className="detail-box">📖 <strong>Current Year:</strong> {user.currentYear}</div>
                            <div className="detail-box">🆔 <strong>Roll Number:</strong> {user.rollNumber}</div>
                            <div className="detail-box">🏷 <strong>KTU ID:</strong> {user.ktuId}</div>
                            {user.idCard && <div className="detail-box">📃 <strong>ID Card:</strong> <a href={user.idCard} download>Download</a></div>}
                        </>
                    )}

                </div>
            </div>
        );
    };

//<button onClick={() => navigate("/edit-profile")}>Edit Profile</button>

       

export default ProfileView;
