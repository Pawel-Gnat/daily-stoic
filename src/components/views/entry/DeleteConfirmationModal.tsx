import React from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <p className="mb-4">Are you sure you want to delete this entry?</p>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
