import React, { useState, useEffect } from "react";
import { uploadFile } from "./upload";
import FileUploader from "./components/FileUploader";
import FileItem from "./components/FileItem";
import "./App.css";

const MAX_CONCURRENCY = 2;
const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/", "application/pdf"];

export default function App() {
  const [files, setFiles] = useState(() => {
    const saved = sessionStorage.getItem("uploadQueue");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    sessionStorage.setItem("uploadQueue", JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    processQueue();
  }, [files, activeCount]);

  const addFiles = (fileList) => {
    const newItems = [];
    Array.from(fileList).forEach((file) => {
      if (!ACCEPTED_TYPES.some((t) => file.type.startsWith(t))) {
        alert(`"${file.name}" rejected: Only images and PDFs allowed.`);
        return;
      }
      if (file.size > MAX_SIZE) {
        alert(`"${file.name}" rejected: File size exceeds 10 MB.`);
        return;
      }
      const id = `${file.name}-${Date.now()}-${Math.random()}`;
      newItems.push({
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "queued",
        progress: 0,
        error: null,
        controller: null,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      });
    });
    setFiles((prev) => [...prev, ...newItems]);
  };

  const updateFile = (id, changes) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...changes } : f))
    );
  };

  const startUpload = async (item) => {
    const controller = new AbortController();
    updateFile(item.id, { status: "uploading", error: null, controller });
    setActiveCount((c) => c + 1);
    try {
      await uploadFile(item.file, {
        signal: controller.signal,
        onProgress: (p) =>
          updateFile(item.id, { progress: Math.floor(p * 100) }),
      });
      updateFile(item.id, {
        status: "success",
        progress: 100,
        controller: null,
      });
    } catch (err) {
      if (err.name === "AbortError") {
        updateFile(item.id, { status: "canceled", controller: null });
      } else {
        updateFile(item.id, {
          status: "failed",
          error: err.message,
          controller: null,
        });
      }
    } finally {
      setActiveCount((c) => c - 1);
    }
  };

  const processQueue = () => {
    if (activeCount >= MAX_CONCURRENCY) return;
    const next = files.find((f) => f.status === "queued");
    if (next) startUpload(next);
  };

  const cancelUpload = (id) => {
    const f = files.find((f) => f.id === id);
    if (f?.controller) f.controller.abort();
  };

  const retryUpload = (id) => {
    updateFile(id, { status: "queued", progress: 0, error: null });
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>File Upload Queue</h1>
      <FileUploader onFilesAdded={addFiles} />
      {files.length > 0 && (
        <table
          style={{ marginTop: 20, borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Size (KB)</th>
              <th>Type</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onCancel={cancelUpload}
                onRetry={retryUpload}
                onRemove={removeFile}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
