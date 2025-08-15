import React, { useRef } from "react";

export default function FileUploader({ onFilesAdded }) {
  const fileInputRef = useRef();

  const handleSelect = (e) => onFilesAdded(e.target.files);
  const handleDrop = (e) => {
    e.preventDefault();
    onFilesAdded(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        border: "2px dashed #ccc",
        padding: "1rem",
        borderRadius: "8px",
        background: "#fafafa",
      }}
      aria-label="File uploader"
    >
      <label htmlFor="fileInput">Select files or drag them here:</label>
      <input
        id="fileInput"
        type="file"
        multiple
        onChange={handleSelect}
        ref={fileInputRef}
        style={{ display: "block", marginTop: "0.5rem" }}
      />
    </div>
  );
}
