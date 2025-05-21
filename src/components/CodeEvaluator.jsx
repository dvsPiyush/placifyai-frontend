import React, { useState } from "react";
import axios from 'axios';
import CodeEditor from "./CodeEditor";
import SystemAsks from "./SystemAsks";
import './CodeEvaluator.css';


function CodeEvaluator({ setExternalMessage }) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [time, setTime] = useState("");
  const [language] = useState("python");
  const [loading, setLoading] = useState(false);
  const [showSystemAsks, setShowSystemAsks] = useState(false);

  const handleEvaluate = async () => {
    setLoading(true);
    setOutput("");
    setTime("");
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/evaluate",
        { code, language },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOutput(response.data.output);
      setTime(response.data.time_complexity);
      // Get suggestion from chatbot
      const suggestionRes = await axios.post(
        "http://localhost:5000/chatbot",
        { message: `Suggest improvements for this code:\n${code}\nOutput:\n${response.data.output}` }
      );
      if (setExternalMessage) {
        setExternalMessage({ sender: 'bot', text: suggestionRes.data.response });
      }
    } catch (error) {
      setOutput("❌ Error evaluating code: " + (error.response?.data?.output || error.message));
    }
    setLoading(false);
  };

  return (
    <div className="code-evaluator">
      <h2>🧠 Code Evaluator</h2>
       <button onClick={() => setShowSystemAsks(true)}>
            🤖 System Asks You
          </button>
      <p>Write your PYTHON code below and run it to see the output.</p>
      {!showSystemAsks ? (
        <>
          <CodeEditor code={code} setCode={setCode} language={language} />
          <br />
          <button onClick={handleEvaluate}>
            {loading ? "Evaluating..." : "Run Code"}
          </button>
          <br />
         
          {output && (
            <div className="output-section">
              <h3>📤 Output:</h3>
              <pre>{output}</pre>
              <p>⏱ Time Taken: {time}</p>
            </div>
          )}
        </>
      ) : (
        <SystemAsks />
      )}
    </div>
  );
}

export default CodeEvaluator;