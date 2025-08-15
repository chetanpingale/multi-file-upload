import { useRef } from "react";

interface FileUploaderProps {
  onFilesAdded: (files: FileList) => void;
}

export default function FileUploader({ onFilesAdded }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilesAdded(e.target.files as FileList);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onFilesAdded(e.dataTransfer.files as FileList);
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