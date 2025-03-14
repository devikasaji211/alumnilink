import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";
import welcomeImage from "./emoji.png";
import profilePic from "./pfpic.png";
import internshipIcon from "./internshipsq.png";
import workshopIcon from "./internshipsq.png";

const internships = [
  { title: "Software Development", company: "Zoho" },
  { title: "Machine Learning", company: "TCS" },
  { title: "Cybersecurity", company: "IBM" },
  { title: "Data Science", company: "Microsoft" },
  { title: "Cloud Computing", company: "Amazon" },
  { title: "Artificial Intelligence", company: "Google" },
  { title: "Blockchain", company: "Accenture" },
  { title: "UI/UX Design", company: "Adobe" },
];

const workshops = [
  { title: "Software Development", company: "Zoho" },
  { title: "Machine Learning", company: "TCS" },
  { title: "Cybersecurity", company: "IBM" },
  { title: "Data Science", company: "Microsoft" },
  { title: "Cloud Computing", company: "Amazon" },
  { title: "Artificial Intelligence", company: "Google" },
  { title: "Blockchain", company: "Accenture" },
  { title: "UI/UX Design", company: "Adobe" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  // Get user role and name from localStorage
  const userRole = localStorage.getItem("userRole")?.trim().toLowerCase();
  const userName = localStorage.getItem("userName") || "User";

  // Define profile and review paths based on user role
  //const profilePath = userRole === "alumni" ? "/alumni/profile" : "/student/profile";
  const reviewPath = userRole === "alumni" ? "/AlumniReview" : "/StudentReview";
  const fundPath = userRole === "alumni" ? "/alumni" : "/student";

  // Handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clear all stored user data
    navigate("/login"); // Redirect to Login Page
  };

  return (
    <div className="dashboard-container">
      <div className="top-section">
        <input type="text" placeholder="Search..." className="search-bar" />
        <div className="profile-section">
          <img src={profilePic} alt="Profile" className="profile-pic" />
          <div className="student-details">
            <h3>{userName}</h3>
            <p>3rd Year, CSE</p> {/* Update this if you store year/branch */}
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Sidebar with navigation */}
        <nav className="sidebar">
          <h2>ALUMNILINK</h2>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            {/* Show "Add Internship" only for alumni */}
            {userRole === "alumni" && (
              <li>
                <Link to="/add-internship">Add Internship</Link>
              </li>
            )}
            {/* Show "View Internships" only for students */}
            {userRole === "student" && (
              <li>
                <Link to="/view-internship">View Internships</Link>
              </li>
            )}
            {/* Show "Add Workshop" only for alumni */}
            {userRole === "alumni" && (
              <li>
                <Link to="/add-workshop">Add Workshop</Link>
              </li>
            )}
            {/* Show "View Workshops" only for students */}
            {userRole === "student" && (
              <li>
                <Link to="/view-workshops">View Workshops</Link>
              </li>
            )}
             {/* <li><Link to="/mentorship">Mentorship</Link></li> */}
            {/* Mentorship Section - Replaced with Post/View Questions */}
            {userRole === "student" && <li><Link to="/post-questions">Mentorship</Link></li>}
            {userRole === "alumni" && <li><Link to="/view-questions">Mentorship</Link></li>}

            <li><Link to="/resources">Resources</Link></li>
            <li><Link to={fundPath}>Fund Details</Link></li>
            <li><Link to={userRole === "alumni" ? "/alumni-page" : "/student-page"}>Projects</Link></li>

            <li><Link to="/bookmarks">Bookmarks</Link></li>
            <li><Link to={reviewPath}>Reviews</Link></li>
            <li><Link to="/reports">Reports</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>Welcome back, {userName}!</h1>
              <p>
                {userRole === "alumni"
                  ? "Manage your posted internships and workshops, and connect with students."
                  : "Discover new opportunities and grow with AlumniLink."}
              </p>
            </div>
            <div className="welcome-img-container">
              <img src={welcomeImage} alt="Welcome" className="welcome-img" />
            </div>
          </div>

          {/* Internships Section */}
          <div className="internships">
            <h3>INTERNSHIPS</h3>
            <div className="internship-cards">
              {internships.map((internship, index) => (
                <div key={index} className="internship-card">
                  <img src={internshipIcon} alt="Internship" className="internship-img" />
                  <h4>{internship.title}</h4>
                  <p>{internship.company}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Workshops Section */}
          <div className="workshops">
            <h3>WORKSHOPS</h3>
            <div className="workshop-cards">
              {workshops.map((workshop, index) => (
                <div key={index} className="workshop-card">
                  <img src={workshopIcon} alt="Workshop" className="workshop-img" />
                  <h4>{workshop.title}</h4>
                  <p>{workshop.company}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;