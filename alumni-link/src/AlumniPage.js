import React, { useState, useEffect } from "react";
import { postProjectTopic, fetchAlumniTopics, updateProjectIdea } from "./api";

const AlumniPage = ({ alumniId }) => {
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [ideas, setIdeas] = useState({});
  const [feedback, setFeedback] = useState({});

  // Fetch topics and ideas posted by alumni
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAlumniTopics(alumniId);
        setTopics(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchData();
  }, [alumniId]);

  // Handle topic submission
  const handlePostTopic = async (e) => {
    e.preventDefault();

    // Debugging alumniId before sending the request
    const alumniId = localStorage.getItem("userId");
    console.log("✅ Retrieved alumniId:", alumniId); // Check if this logs a valid ID

    if (!alumniId || !topic || !description) {
        console.error("❌ Missing Fields:", { alumniId, topic, description });
        alert("All fields are required!");
        return;
    }

    try {
        const response = await postProjectTopic(alumniId, topic, description);
        console.log("✅ API Response:", response);

        setTopic("");
        setDescription("");
        alert("Project topic posted successfully!");
    } catch (error) {
        console.error("❌ Error posting topic:", error.response ? error.response.data : error.message);
        alert("Failed to post topic.");
    }
};


  
  // Handle status update
  const handleStatusUpdate = async (ideaId, status) => {
    try {
      await updateProjectIdea(ideaId, status, feedback[ideaId] || "");
      alert(`Project idea ${status}!`);
      setFeedback({ ...feedback, [ideaId]: "" }); // Reset feedback field
    } catch (error) {
      console.error("Error updating idea:", error);
    }
  };

  return (
    <div>
      <h2>Alumni Page</h2>

      {/* Form to post a new project topic */}
      <form onSubmit={handlePostTopic}>
        <input
          type="text"
          placeholder="Project Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit">Post Topic</button>
      </form>

      {/* List of submitted project ideas */}
      <h3>Submitted Project Ideas</h3>
      {topics.map((topic) => (
        <div key={topic._id}>
          <h4>{topic.topic}</h4>
          {ideas[topic._id]?.map((idea) => (
            <div key={idea._id}>
              <p><strong>Student:</strong> {idea.studentId.name}</p>
              <p><strong>Description:</strong> {idea.description}</p>
              <p><strong>Status:</strong> {idea.status}</p>

              {idea.status === "Pending Review" && (
                <div>
                  <textarea
                    placeholder="Feedback (if rejecting)"
                    value={feedback[idea._id] || ""}
                    onChange={(e) =>
                      setFeedback({ ...feedback, [idea._id]: e.target.value })
                    }
                  />
                  <button onClick={() => handleStatusUpdate(idea._id, "Accepted")}>Accept</button>
                  <button onClick={() => handleStatusUpdate(idea._id, "Rejected")}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AlumniPage;
