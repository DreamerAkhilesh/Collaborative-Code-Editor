import React, { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import ACTIONS from "../Actons";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const [value, setValue] = useState("// Start coding!");

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          setValue(code);
        }
      });

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      };
    }
  }, [socketRef.current]);

  const onChange = (val) => {
    setValue(val);
    onCodeChange(val);
  };

  return (
    <CodeMirror
      value={value}
      height="500px"
      theme={dracula}
      extensions={[javascript({ jsx: true })]}
      onChange={onChange}
    />
  );
};

export default Editor;