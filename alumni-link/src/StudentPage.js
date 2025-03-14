import React, { useState, useEffect } from "react";
import { fetchProjectTopics, submitProjectIdea, fetchStudentIdeas } from "./api";


const StudentPage = ({ studentId }) => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [description, setDescription] = useState("");
  const [ideas, setIdeas] = useState([]);

  // ✅ Ensure studentId is fetched correctly
  const storedStudentId = localStorage.getItem("userId");
  const finalStudentId = studentId || storedStudentId;

  useEffect(() => {
    console.log("✅ Retrieved studentId:", finalStudentId); // Debugging log
  }, [finalStudentId]);

  // Fetch available project topics
 useEffect(() => {
    const loadTopics = async () => {
        try {
            const response = await fetchProjectTopics();
            console.log("📌 Topics in State:", response.data); // Debugging log
            setTopics(response.data);
        } catch (error) {
            console.error("❌ Error fetching topics:", error);
        }
    };
    loadTopics();
}, []);

  // Fetch student's submitted project ideas
  useEffect(() => {
    if (!finalStudentId) return;
    
    const loadIdeas = async () => {
      try {
        const response = await fetchStudentIdeas(finalStudentId);
        setIdeas(response.data);
      } catch (error) {
        console.error("Error fetching student ideas:", error);
      }
    };
    loadIdeas();
  }, [finalStudentId]);

  // Handle project idea submission
  const handleSubmitIdea = async (e) => {
    e.preventDefault();
    if (!selectedTopic) {
      alert("Please select a topic!");
      return;
    }
    try {
      await submitProjectIdea(finalStudentId, selectedTopic, description);
      alert("Project idea submitted successfully!");
      setDescription("");
      setSelectedTopic("");
    } catch (error) {
      console.error("Error submitting project idea:", error);
    }
  };

  return (
    <div>
      <h2>Student Page</h2>

      {/* List available project topics */}
      <h3>Available Project Topics</h3>
      <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
        <option value="">Select a Topic</option>
        {topics.map((topic) => (
          <option key={topic._id} value={topic._id}>
            {topic.topic} (Posted by: {topic.alumniId?.name || "Unknown"})
          </option>
        ))}
      </select>
      <textarea
        placeholder="Describe your project idea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>
      <button onClick={handleSubmitIdea}>Submit Idea</button>

      {/* Track submitted project ideas */}
      <h3>Your Submitted Ideas</h3>
      {ideas.map((idea) => (
        <div key={idea._id}>
          <p><strong>Topic:</strong> {idea.topicId ? idea.topicId.topic : "Unknown"}</p>
          <p><strong>Description:</strong> {idea.description}</p>
          <p><strong>Status:</strong> {idea.status}</p>
          {idea.status === "Rejected" && <p><strong>Feedback:</strong> {idea.feedback}</p>}
        </div>
      ))}
    </div>
  );
};

export default StudentPage;
