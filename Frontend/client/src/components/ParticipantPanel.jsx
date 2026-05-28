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
    <div className="w-80 bg-tertiary/95 backdrop-blur-xl border-l border-border-primary/60 flex flex-col shrink-0 animate-[fade-in_0.25s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary/60">
        <h3 className="text-sm font-semibold text-white font-[Outfit] tracking-wide">
          Participants ({remoteUsers.length + 1})
        </h3>
        <button 
          onClick={onClose} 
          className="w-7 h-7 rounded-full flex items-center justify-center text-offwhite/60 hover:text-white hover:bg-surface-hover transition-all duration-150 cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Participant List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {/* Local user */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover/60 transition-colors duration-150 group">
          <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-secondary text-xs font-bold font-[Outfit] shrink-0 shadow-md shadow-brand/20">
            {getInitials(user?.name)}
          </div>
          <span className="text-sm font-medium text-white font-[Outfit] truncate flex-1">
            {user?.name || 'You'}
          </span>
          <span className="text-[10px] font-semibold text-brand bg-brand/15 px-2 py-0.5 rounded-full font-[Outfit] uppercase tracking-wider">
            Host
          </span>
        </div>

        {/* Remote users */}
        {remoteUsers.map((remoteUser) => {
          const uid = remoteUser.uid;
          const remoteName = getRemoteUserName(uid);
          return (
            <div key={uid} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover/60 transition-colors duration-150 group">
              <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-offwhite text-xs font-bold font-[Outfit] shrink-0 border border-border-primary/60">
                {getInitials(remoteName)}
              </div>
              <span className="text-sm font-medium text-white font-[Outfit] truncate flex-1">
                {remoteName}
              </span>
              <span className="text-[10px] font-medium text-offwhite/50 bg-surface px-2 py-0.5 rounded-full font-[Outfit]">
                Joined
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantPanel;
