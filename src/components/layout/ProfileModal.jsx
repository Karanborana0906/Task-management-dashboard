import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from '../common';
import { useAuth } from '../../context/AuthContext';
import authApi from '../../services/authApi';
import toast from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.updateProfile({ name: name.trim() });
      if (response.data.success) {
        updateUser({ name: response.data.data.name });
        toast.success('Profile updated successfully!');
        onClose();
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Profile" size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="profile-name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Full Name
          </label>
          <Input
            id="profile-name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            error={!!error}
          />
          {error && <p className="text-danger-600 dark:text-danger-400 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileModal;
