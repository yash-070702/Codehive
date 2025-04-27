import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";

const MarkdownEditor = ({ onChange, value }) => {
  const [content, setContent] = useState(value);

  // Sync with parent prop when it changes
  useEffect(() => {
    setContent(value);
  }, [value]);
 
  return (
    <div className="w-full border rounded-md p-2">
      <MDEditor
        value={content}
        onChange={(val) => {
          setContent(val);
          onChange(val); // Notify parent
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
