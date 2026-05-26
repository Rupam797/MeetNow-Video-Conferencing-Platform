import React from 'react';
import { X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ParticipantPanel = ({ remoteUsers = [], participantNames = {}, onClose }) => {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getRemoteUserName = (uid) => {
    return participantNames[String(uid)] || `Participant ${uid}`;
  };

  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <h3>Participants ({remoteUsers.length + 1})</h3>
        <button onClick={onClose} className="side-panel-close">
          <X size={16} />
        </button>
      </div>

      <div className="side-panel-body" style={{ padding: 'var(--space-2)' }}>
        {/* Local user */}
        <div className="participant-item">
          <div className="participant-avatar">
            {getInitials(user?.name)}
          </div>
          <span className="participant-name">{user?.name || 'You'}</span>
          <span className="participant-tag">Host</span>
        </div>

        {/* Remote users */}
        {remoteUsers.map((remoteUser) => {
          const uid = remoteUser.uid;
          const remoteName = getRemoteUserName(uid);
          return (
            <div key={uid} className="participant-item">
              <div className="participant-avatar">
                {getInitials(remoteName)}
              </div>
              <span className="participant-name">{remoteName}</span>
              <span className="participant-tag" style={{ color: 'var(--text-muted)' }}>Joined</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantPanel;
