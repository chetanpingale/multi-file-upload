interface FileItemProps {
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    status: "uploading" | "success" | "failed" | "canceled";
    error?: string;
    progress: number;
    preview?: string;
  };
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function FileItem({
  file,
  onCancel,
  onRetry,
  onRemove,
}: FileItemProps) {
  return (
    <tr>
      <td>{file.name}</td>
      <td>{(file.size / 1024).toFixed(1)}</td>
      <td>{file.type}</td>
      <td>
        {file.status}
        {file.error && <span style={{ color: "red" }}> ({file.error})</span>}
      </td>
      <td>
        <progress value={file.progress} max="100" />
      </td>
      <td>
        {file.status === "uploading" && (
          <button
            onClick={() => onCancel(file.id)}
            aria-label={`Cancel upload for ${file.name}`}
          >
            Cancel
          </button>
        )}
        {(file.status === "failed" || file.status === "canceled") && (
          <button
            onClick={() => onRetry(file.id)}
            aria-label={`Retry upload for ${file.name}`}
          >
            Retry
          </button>
        )}
        {(file.status === "success" ||
          file.status === "failed" ||
          file.status === "canceled") && (
          <button
            onClick={() => onRemove(file.id)}
            aria-label={`Remove ${file.name} from queue`}
          >
            Remove
          </button>
        )}
        {file.status === "success" && file.preview && (
          <img
            src={file.preview}
            alt={`${file.name} preview`}
            style={{ width: 50, marginLeft: 10 }}
          />
        )}
      </td>
    </tr>
  );
}