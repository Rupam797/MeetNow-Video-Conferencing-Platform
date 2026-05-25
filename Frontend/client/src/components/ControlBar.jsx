import React from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MessageSquare, 
  Users, 
  PhoneOff 
} from 'lucide-react';

const ControlBar = ({
  micActive,
  cameraActive,
  screenShareActive,
  chatOpen,
  participantsOpen,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleChat,
  onToggleParticipants,
  onLeave
}) => {
  return (
    <div className="meeting-controls">
      {/* Mic toggle */}
      <div className="control-btn">
        <button 
          onClick={onToggleMic}
          className={micActive ? 'active' : 'inactive'}
          title={micActive ? 'Mute Mic' : 'Unmute Mic'}
        >
          {micActive ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <span className="control-btn-label">Mic</span>
      </div>

      {/* Camera toggle */}
      <div className="control-btn">
        <button 
          onClick={onToggleCamera}
          className={cameraActive ? 'active' : 'inactive'}
          title={cameraActive ? 'Turn Camera Off' : 'Turn Camera On'}
        >
          {cameraActive ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
        <span className="control-btn-label">Camera</span>
      </div>

      {/* Screen share toggle */}
      <div className="control-btn">
        <button 
          onClick={onToggleScreenShare}
          className={screenShareActive ? 'inactive' : 'active'} 
          style={screenShareActive ? { backgroundColor: 'var(--success)', color: '#fff' } : {}}
          title={screenShareActive ? 'Stop Sharing' : 'Share Screen'}
        >
          <Monitor size={20} />
        </button>
        <span className="control-btn-label">Share</span>
      </div>

      {/* Chat toggle */}
      <div className="control-btn">
        <button 
          onClick={onToggleChat}
          className={chatOpen ? 'active' : 'inactive'}
          style={chatOpen ? { borderColor: 'var(--accent)' } : {}}
          title={chatOpen ? 'Close Chat' : 'Open Chat'}
        >
          <MessageSquare size={20} />
        </button>
        <span className="control-btn-label">Chat</span>
      </div>

      {/* Participants toggle */}
      <div className="control-btn">
        <button 
          onClick={onToggleParticipants}
          className={participantsOpen ? 'active' : 'inactive'}
          style={participantsOpen ? { borderColor: 'var(--accent)' } : {}}
          title={participantsOpen ? 'Close Participants' : 'Open Participants'}
        >
          <Users size={20} />
        </button>
        <span className="control-btn-label">People</span>
      </div>

      {/* Leave button */}
      <button 
        onClick={onLeave}
        className="leave-btn"
        title="Leave Meeting"
      >
        <PhoneOff size={18} />
        <span>Leave</span>
      </button>
    </div>
  );
};

export default ControlBar;
