import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Bookmarks.css"; // Add CSS for styling

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get("/api/bookmarks"); // Correct API endpoint
        setBookmarks(response.data);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="bookmarks-container">
      <h2>My Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <p>No bookmarks found.</p>
      ) : (
        <div className="bookmarks-list">
          {bookmarks.map((bookmark) => (
            <div key={bookmark._id} className="bookmark-item">
              {bookmark.internship && (
                <div className="internship-card">
                  <h3>{bookmark.internship.title}</h3>
                  <p>{bookmark.internship.company}</p>
                  <Link to={`/internship/${bookmark.internship._id}`}>View Details</Link>
                </div>
              )}
              {bookmark.workshop && (
                <div className="workshop-card">
                  <h3>{bookmark.workshop.title}</h3>
                  <p>{bookmark.workshop.organizer}</p>
                  <Link to={`/workshop/${bookmark.workshop._id}`}>View Details</Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;