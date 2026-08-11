'use client';
import { useState, useRef } from 'react';
import { IoCloudUploadOutline, IoClose, IoImage } from 'react-icons/io5';

export default function ImageUpload({ currentImage, onUpload, onRemove, disabled }) {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleRemove = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
    onRemove?.();
  };

  const displayImage = preview || currentImage;

  if (displayImage) {
    return (
      <div className="relative inline-block">
        <img src={displayImage} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-surface-200" />
        <button
          type="button"
          onClick={handleRemove}
          disabled={disabled}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          <IoClose size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
        dragActive ? 'border-brand-500 bg-brand-50' : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} disabled={disabled} />
      <IoCloudUploadOutline size={32} className="mx-auto text-surface-400 mb-2" />
      <p className="text-sm text-surface-500">Drag & drop or <span className="text-brand-600 font-medium">browse</span></p>
      <p className="text-xs text-surface-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
    </div>
  );
}
