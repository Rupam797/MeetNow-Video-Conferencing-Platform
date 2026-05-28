import React from 'react';
import { X, Mic, MicOff, Video, VideoOff } from 'lucide-react';
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

  // Mock participant statuses for demo
  const mockStatuses = [
    { mic: true, camera: true },
    { mic: false, camera: true },
    { mic: true, camera: false },
    { mic: false, camera: false },
  ];

  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <h3>Participants ({remoteUsers.length + 1})</h3>
        <button onClick={onClose} className="side-panel-close" aria-label="Close participants">
          <X size={18} />
        </button>
      </div>

      <div className="side-panel-body">
        {/* Local user (You) */}
        <div className="participant-item">
          <div className="participant-avatar">
            {getInitials(user?.name)}
          </div>
          <span className="participant-name">{user?.name || 'You'}</span>
          <span className="participant-tag">You</span>
          <div className="participant-status">
            <Mic size={16} />
            <Video size={16} />
          </div>
        </div>

        {/* Remote users */}
        {remoteUsers.map((remoteUser, index) => {
          const uid = remoteUser.uid;
          const remoteName = getRemoteUserName(uid);
          const status = mockStatuses[index % mockStatuses.length];
          
          return (
            <div key={uid} className="participant-item">
              <div className="participant-avatar">
                {getInitials(remoteName)}
              </div>
              <span className="participant-name">{remoteName}</span>
              <div className="participant-status">
                {status.mic ? (
                  <Mic size={16} />
                ) : (
                  <MicOff size={16} className="muted" />
                )}
                {status.camera ? (
                  <Video size={16} />
                ) : (
                  <VideoOff size={16} className="muted" />
                )}
              </div>
            </div>
          );
        })}

        {/* Show mock participants if no real remote users */}
        {remoteUsers.length === 0 && (
          <>
            <div className="participant-item" style={{ opacity: 0.5 }}>
              <div className="participant-avatar">JD</div>
              <span className="participant-name">John Doe</span>
              <span className="participant-tag" style={{ 
                background: 'var(--glass-bg)', 
                color: 'var(--text-muted)' 
              }}>Invited</span>
            </div>
            <div className="participant-item" style={{ opacity: 0.5 }}>
              <div className="participant-avatar">MK</div>
              <span className="participant-name">Mary Kim</span>
              <span className="participant-tag" style={{ 
                background: 'var(--glass-bg)', 
                color: 'var(--text-muted)' 
              }}>Invited</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParticipantPanel;
