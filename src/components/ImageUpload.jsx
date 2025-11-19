import React, { useState, useRef } from 'react';
import { fileToBase64, validateImageFile } from '../utils/imageUtils';

const ImageUpload = ({ onImageSelect, optional = false, label = 'Upload Image' }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    setError('');

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      // Convert to base64
      const base64 = await fileToBase64(file);
      setPreview(base64);
      onImageSelect(base64);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error(err);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = () => {
    setPreview(null);
    setError('');
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      <label className="image-upload-label">
        {label} {optional && <span className="optional-tag">(Optional)</span>}
      </label>

      {!preview ? (
        <div
          className={`image-upload-dropzone ${isDragging ? 'dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <div className="upload-icon">📷</div>
          <p className="upload-text">
            <strong>Click to upload</strong> or drag and drop
          </p>
          <p className="upload-hint">JPG, PNG, HEIC, or WEBP (Max 10MB)</p>
        </div>
      ) : (
        <div className="image-preview-container">
          <img src={preview} alt="Preview" className="image-preview" />
          <button className="clear-image-btn" onClick={handleClear}>
            Remove Image
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ImageUpload;
