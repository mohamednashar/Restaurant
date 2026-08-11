'use client';
import Modal from './Modal';
import { IoWarningOutline } from 'react-icons/io5';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <IoWarningOutline size={24} className="text-red-500" />
        </div>
        <p className="text-surface-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="btn-secondary btn-sm" disabled={loading}>Cancel</button>
          <button onClick={onConfirm} className="btn-danger btn-sm" disabled={loading}>
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
