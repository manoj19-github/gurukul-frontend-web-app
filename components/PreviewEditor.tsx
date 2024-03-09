"use client";
import React, { FC, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";

interface PreviewEditorProps {
  value: string;
}
const PreviewEditor: FC<PreviewEditorProps> = ({ value }): JSX.Element => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  return <ReactQuill theme="bubble" value={value} readOnly />;
};

export default PreviewEditor;
