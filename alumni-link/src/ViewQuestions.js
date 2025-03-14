import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [reply, setReply] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("❌ No token found! Login required.");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/mentorship/questions", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Fixed header
        });

        setQuestions(res.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleReply = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found! Login required.");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/mentorship/reply/${id}`,
        { answer: reply[id] },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ Fixed header
      );

      alert("Reply sent!");
      setReply((prev) => ({ ...prev, [id]: "" })); // Clear input after sending
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  return (
    <div>
      <h2>Student Questions</h2>
      {questions.map((q) => (
        // <div key={q._id}>
        //   <p>
        //     <strong>{q.studentName}:</strong> {q.question}
        //   </p>


        <div key={q._id} className="question-card">
          <p>
            <strong>{q.studentName}:</strong> {q.question}
          </p>

          {/* ✅ Show Alumni Name with Answer */}
          {q.answer && (
            <p>
              <strong>{q.alumniName || "Alumni"}:</strong> {q.answer}
            </p>
          )}

          {/* ✅ Reply Section */}
          {!q.answer && (
            <>


          <textarea
            placeholder="Type your reply..."
            value={reply[q._id] || ""}
            onChange={(e) => setReply({ ...reply, [q._id]: e.target.value })}
          />
          <button onClick={() => handleReply(q._id)}>Send Reply</button>
        </>
      )}
    </div>
  ))}
  </div>
  );
};

export default ViewQuestions;
