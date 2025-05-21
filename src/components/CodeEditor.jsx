import React from "react";
import MonacoEditor from "@monaco-editor/react";

function CodeEditor({ code, setCode, language = "python" }) {
  return (
    <MonacoEditor
      height="400px"
      language={language}
      value={code}
      onChange={(value) => setCode(value || "")}
      theme="vs-dark"
      options={{
        fontSize: 16,
        minimap: { enabled: false },
      }}
    />
  );
}

export default CodeEditor;