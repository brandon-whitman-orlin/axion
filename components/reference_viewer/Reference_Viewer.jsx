import React, { useEffect, useState } from "react";
import { ReactComponent as Cross } from "../../assets/icons/cross.svg";

function Reference_Viewer({ file, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file || !previewUrl) {
    return <div className="reference-viewer-fallback">No file</div>;
  }

  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");

  return (
    <div className="reference-viewer-container">
      <button
        className="remove-media"
        aria-label="Remove file"
        onClick={onRemove}
      >
        <Cross />
      </button>

      {error ? (
        <div className="reference-error">Failed to load preview</div>
      ) : isVideo ? (
        <video
          src={previewUrl}
          autoPlay
          loop
          muted
          playsInline
          className="reference-preview"
          onError={() => setError(true)}
        />
      ) : isImage ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="reference-preview"
          onError={() => setError(true)}
        />
      ) : (
        <div className="reference-error">Unsupported format</div>
      )}
    </div>
  );
}

export default Reference_Viewer;
