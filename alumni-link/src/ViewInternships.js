import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBookmark, FaRegBookmark } from "react-icons/fa"; // Import bookmark icons
import "./ViewInternships.css";

const ViewInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    stipend: "",
    duration: "",
  });
  const [bookmarks, setBookmarks] = useState([]); // State for bookmarks

  useEffect(() => {
    fetchInternships();
    fetchBookmarks(); // Fetch bookmarks when the component loads
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/internships/all");
      setInternships(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setError("Failed to fetch internships. Please try again.");
      setLoading(false);
    }
  };

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bookmarks/my-bookmarks");
      setBookmarks(response.data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  // Check if an internship is bookmarked
  const isBookmarked = (id) => {
    return bookmarks.some((bookmark) => bookmark.internship?._id === id);
  };

  // Handle bookmark/unbookmark
  const handleBookmark = async (id) => {
    try {
      const endpoint = isBookmarked(id) ? `/api/bookmarks/remove/${id}` : "/api/bookmarks/add";
      const response = await axios.post(endpoint, { internshipId: id });

      if (response.data.message === "Bookmark added successfully") {
        setBookmarks([...bookmarks, response.data.bookmark]);
      } else if (response.data.message === "Bookmark removed successfully") {
        setBookmarks(bookmarks.filter((bookmark) => bookmark.internship?._id !== id));
      }
    } catch (err) {
      console.error("Error bookmarking internship:", err);
    }
  };

  // Filter internships based on search query and filters
  const filteredInternships = internships.filter((internship) => {
    const matchesSearchQuery =
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (!filters.stipend || internship.stipend >= filters.stipend) &&
      (!filters.duration || internship.duration === filters.duration);

    return matchesSearchQuery && matchesFilters;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  if (loading) {
    return <p>Loading internships...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="internships-container">
      <h2>Available Internships</h2>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search internships..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      {/* Filters */}
      <div className="filters">
        <input
          type="number"
          placeholder="Min Stipend"
          name="stipend"
          value={filters.stipend}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Duration"
          name="duration"
          value={filters.duration}
          onChange={handleFilterChange}
        />
      </div>
      {filteredInternships.length === 0 ? (
        <p>No internships found.</p>
      ) : (
        <ul className="internships-list">
          {filteredInternships.map((internship) => (
            <li key={internship._id} className="internship-item">
              <h3>{internship.title}</h3>
              <p><strong>Company:</strong> {internship.company}</p>
              <p><strong>Location:</strong> {internship.location}</p>
              <p><strong>Description:</strong> {internship.description}</p>
              <p><strong>Stipend:</strong> {internship.stipend}</p>
              <p><strong>Duration:</strong> {internship.duration}</p>
              <p><strong>Posted By:</strong> {internship.postedBy?.name}</p>
              <button onClick={() => alert("View Details functionality here")}>
                View Details
              </button>
              {/* Bookmark Icon */}
              <button
                className="bookmark-button"
                onClick={() => handleBookmark(internship._id)}
              >
                {isBookmarked(internship._id) ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewInternships;