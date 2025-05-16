
import React from 'react';

interface RoleNoteProps {
  role: string;
}

export const RoleNote: React.FC<RoleNoteProps> = ({ role }) => {
  if (role !== 'admin') return null;
  
  return (
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
      <strong>Note:</strong> Admin users always have view access to all areas of the system and cannot have this permission removed.
    </div>
  );
};
