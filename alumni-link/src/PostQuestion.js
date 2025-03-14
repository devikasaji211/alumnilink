import React, { useState, useEffect } from "react";
import axios from "axios";

const PostQuestion = () => {
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

 

  // Fetch User's Questions on Load
   // ✅ No need for `token` dependency
   useEffect(() => {
    const fetchQuestions = async () => {
      if (!token) return; // Ensure token is available before making the request

      try {
        const res = await axios.get("http://localhost:5000/api/mentorship/my-questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data);
      } catch (error) {
        console.error("❌ Error fetching questions:", error.response?.data || error.message);
      }
    };

    fetchQuestions();
  }, [token]); // Use `token` stored in state
  // Handle Posting a Question
  const handleAskQuestion = async () => {
    if (!question.trim()) {
      alert("❌ Please enter a question!");
      return;
    }
    
    if (!token) {
      console.error("❌ No token found! User might not be logged in.");
      alert("You are not logged in! Please login first.");
      return; // Prevent component from rendering
    }




    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/mentorship/ask",
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Question posted successfully!");

      if (res.data && res.data.question) {
        setQuestions((prevQuestions) => [...prevQuestions, res.data.question]);
      }

      setQuestion(""); // Clear input after success
    } catch (error) {
      console.error("❌ Error posting question:", error.response?.data || error.message);
      alert("❌ Failed to post question!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Ask a Question</h2>
      <textarea
        placeholder="Type your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleAskQuestion} disabled={loading}>
        {loading ? "Posting..." : "Post Question"}
      </button>

      <h2>Your Questions & Replies</h2>
      {questions.length === 0 ? (
        <p>No questions asked yet.</p>
      ) : (
        questions.map((q) => (
          <div key={q._id} style={{ border: "1px solid gray", padding: "10px", margin: "10px 0" }}>
            <p><strong>You:</strong> {q.question}</p>
            {q.answer ? <p><strong>Reply:</strong> {q.answer}</p> : <p><em>No reply yet</em></p>}
          </div>
        ))
      )}
    </div>
  );
};

export default PostQuestion;

