"use client";
import React, { FC, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}
const Editor: FC<EditorProps> = ({ value, onChange }): JSX.Element => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  return (
    <div className="bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};

export default Editor;
