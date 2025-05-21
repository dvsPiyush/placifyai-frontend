import React, { useState } from 'react';
import axios from 'axios';
import './ResumeEvaluator.css';
import ReactMarkdown from 'react-markdown';

const ResumeEvaluator = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [score, setScore] = useState(null);
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0]?.name || '');
    setScore(null);
    setSuggestions('');
    setUploadSuccess(false);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    setLoading(true);
    setProgress(10);

    try {
      const res = await axios.post('http://localhost:5000/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
      });
      setScore(res.data.score);
      setSuggestions(res.data.suggestions);
      setUploadSuccess(true);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Something went wrong. Try again.");
      setScore(null);
      setSuggestions('');
      setUploadSuccess(false);
    }
    setLoading(false);
  };

  return (
    <div className="resume-section">
      <h2>📄 Resume Evaluator</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {fileName && <p className="filename">Selected: {fileName}</p>}
      
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Evaluating...' : 'Upload and Evaluate'}
      </button>

      {loading && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {score !== null && (
        <div className="result">
          <p className="score">
            {uploadSuccess ? '✔️ ' : ''}💡 Resume Score: <strong>{score}/5</strong>
          </p>
          {suggestions && (
  <div className="suggestions">
    <strong>Suggestions:</strong>
    <ReactMarkdown>{suggestions}</ReactMarkdown>
  </div>
)}
        </div>
      )}
    </div>
  );
};

export default ResumeEvaluator;