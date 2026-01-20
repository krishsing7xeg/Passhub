import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Please log in</div>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="space-y-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.subscription && (
          <div>
            <p><strong>Subscription:</strong> {user.subscription.planName || 'None'}</p>
            <p><strong>Days Remaining:</strong> {user.subscription.daysRemaining || 0}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;