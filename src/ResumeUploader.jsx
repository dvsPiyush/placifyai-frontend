import React, { useState } from 'react';
import axios from 'axios';

function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setScore(null);
    setMessage('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:5000/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setScore(response.data.score);
      setMessage(response.data.suggestions);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
      setScore(null);
      setMessage('');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 rounded-xl shadow-lg bg-white mt-6 text-center space-y-4">
      <h2 className="text-xl font-bold text-gray-700">Upload Your Resume (PDF)</h2>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="border p-2 rounded-md"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Upload & Evaluate
      </button>

      {score !== null && (
        <div className="mt-4 text-green-700 font-medium">
          ✅ Score: {score}/5<br />
          <pre style={{whiteSpace: 'pre-wrap'}}>{message}</pre>
        </div>
      )}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
}

export default ResumeUploader;