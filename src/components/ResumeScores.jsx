import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ResumeEvaluator.css';
const ResumeProgress = ({ username }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (!username) return;
    axios.post(`${process.env.REACT_APP_API_URL}/resume-scores`, { username })
      .then(res => setScores(res.data.scores || []))
      .catch(() => setScores([]));
  }, [username]);

  return (
    <div className="resume-progress">
      <h3>📈 Resume Progress</h3>
      {scores.length === 0 && <p>No resume scores yet.</p>}
      <ul>
        {scores.map((s, i) => (
          <li key={i}>
            {new Date(s.timestamp).toLocaleString()}: <b>{s.score}/5</b>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeProgress;