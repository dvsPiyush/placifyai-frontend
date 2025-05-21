import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CodeEditor from './CodeEditor';

const LEVELS = ["Beginner", "Intermediate", "Expert"];

const SystemAsks = ({ setExternalMessage }) => {
  const [level, setLevel] = useState("Beginner");
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  // Fetch question on mount or when level changes
  useEffect(() => {
    const fetchQuestion = async () => {
      setQuestion(null);
      setCode('');
      setOutput('');
      setSuggestion('');
      try {
        const res = await axios.get(`http://localhost:5000/api/get-random-question?level=${level}`);
        setQuestion(res.data);
      } catch (err) {
        setQuestion({ question: "No question found for this level." });
      }
    };
    fetchQuestion();
  }, [level]);

  const getSuggestion = async (code, output) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/chatbot',
        { message: `Suggest improvements for this code:\n${code}\nOutput:\n${output}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
       if (setExternalMessage) {
        setExternalMessage({ sender: 'bot', text: res.data.response });
      }
      setSuggestion(res.data.response);
    } catch (err) {
      setSuggestion('Could not get suggestion.');
    }
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setOutput('');
    setSuggestion('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/evaluate',
        { code, language: 'python' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutput(res.data.output);
      await getSuggestion(code, res.data.output);
    } catch (err) {
      setOutput('❌ Error: ' + (err.response?.data?.output || err.message));
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>System Asks You</h2>
      <label>
        Select Level:{" "}
        <select value={level} onChange={e => setLevel(e.target.value)}>
          {LEVELS.map(lvl => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
      </label>
      <br />
      {/* Show question if available */}
      {question && (
        <>
          <h3>Level: {question.type}</h3>
          <p>{question.question}</p>
        </>
      )}

      {/* Always show the code editor and submit button */}
      <CodeEditor code={code} setCode={setCode} language="python" />
      <button onClick={handleEvaluate} disabled={loading}>
        {loading ? "Evaluating..." : "Submit Answer"}
      </button>

      {/* Show output if available */}
      {output && (
        <div>
          <h4>Output:</h4>
          <pre>{output}</pre>
        </div>
      )}

      {/* Show suggestion if available */}
      {suggestion && (
        <div>
          <h4>Chatbot Suggestion:</h4>
          <pre>{suggestion}</pre>
        </div>
      )}
    </div>
  );
};

export default SystemAsks;