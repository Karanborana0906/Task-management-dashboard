import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Modal, Button } from './index';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Delete Task',
  message = 'Are you sure you want to delete this task?',
  itemName = '',
  isLoading = false 
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={!isLoading}
    >
      <div className="flex flex-col items-center text-center py-4">
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mb-4">
          <FiAlertTriangle className="text-3xl text-danger-600" />
        </div>

        {/* Message */}
        <p className="text-neutral-600 text-base mb-2">
          {message}
        </p>
        {itemName && (
          <p className="text-neutral-900 font-semibold text-lg mb-6">
            "{itemName}"
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
