import React from "react";
import "./FrontPage.css";
import heroImage from "./hero-image.png"; // Add a relevant image
import { useNavigate } from "react-router-dom";

const FrontPage = () => {
    const navigate = useNavigate(); 
    return (
        <div className="front-page">
            {/* Navbar */}
            <header className="navbar">
                <div className="logo-text">AlumniLink</div> {/* Only text, no image */}
                <nav>
                    <ul>
                        <li><button onClick={() => navigate("/")}>Home</button></li>
                        <li><button onClick={() => navigate("/about")}>About</button></li>
                        <li><button onClick={() => navigate("/features")}>Features</button></li>
                        <li><button onClick={() => navigate("/contact")}>Contact</button></li>
                    </ul>
                </nav>
                <div className="auth-buttons">
                    <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
                    <button className="register-btn" onClick={() => navigate("/register")}>Register</button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-text">
                    <h1>Connecting Alumni & Students for a Brighter Future</h1>
                    <p>Join a community where alumni support students with mentorship, opportunities, and career growth.</p>
                    <button className="cta-button">Get Started</button>
                </div>
                <div className="hero-image">
                    <img src={heroImage} alt="Networking" />
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Why Join AlumniLink?</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <h3>
                            <span role="img" aria-label="graduation cap">🎓</span> Mentorship
                        </h3>
                        <p>Get career guidance from experienced alumni.</p>
                    </div>
                    <div className="feature-card">
                        <h3>
                            <span role="img" aria-label="briefcase">💼</span> Internships & Jobs
                        </h3>
                        <p>Find exclusive opportunities through alumni referrals.</p>
                    </div>
                    <div className="feature-card">
                        <h3>
                            <span role="img" aria-label="rocket">🚀</span> Project Collaboration
                        </h3>
                        <p>Work with alumni on real-world projects.</p>
                    </div>
                    <div className="feature-card">
                        <h3>
                            <span role="img" aria-label="handshake">🤝</span> Community Support
                        </h3>
                        <p>Engage in discussions and networking.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 AlumniLink | Connecting the Future</p>
            </footer>
        </div>
    );
};

export default FrontPage;
