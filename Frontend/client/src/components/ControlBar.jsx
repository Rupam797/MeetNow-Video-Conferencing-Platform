import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MessageSquare, 
  Users, 
  PhoneOff,
  Smile
} from 'lucide-react';

const EMOJIS = ['👍', '❤️', '😂', '🎉', '🙌'];

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
  onLeave,
  onSendEmoji
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const handleEmojiClick = (emoji) => {
    if (onSendEmoji) {
      onSendEmoji(emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleLeaveClick = () => {
    setShowLeaveConfirm(true);
  };

  const confirmLeave = () => {
    setShowLeaveConfirm(false);
    onLeave();
  };

  return (
    <>
      <div className="meeting-controls">
        <div className="control-bar-pill">
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
              className={screenShareActive ? 'active' : 'inactive'} 
              style={screenShareActive ? { 
                backgroundColor: 'var(--success)', 
                color: '#fff' 
              } : {}}
              title={screenShareActive ? 'Stop Sharing' : 'Share Screen'}
            >
              <Monitor size={20} />
            </button>
            <span className="control-btn-label">Share</span>
          </div>

          {/* Emoji Reaction */}
          <div className="control-btn" style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="active"
              title="Send Reaction"
            >
              <Smile size={20} />
            </button>
            <span className="control-btn-label">React</span>
          </div>

          {/* Participants toggle */}
          <div className="control-btn">
            <button 
              onClick={onToggleParticipants}
              className={participantsOpen ? 'inactive' : 'active'}
              style={participantsOpen ? { 
                borderColor: 'var(--accent)',
                background: 'var(--accent-soft)',
                color: 'var(--accent)'
              } : {}}
              title={participantsOpen ? 'Close Participants' : 'Open Participants'}
            >
              <Users size={20} />
            </button>
            <span className="control-btn-label">People</span>
          </div>

          {/* Chat toggle */}
          <div className="control-btn">
            <button 
              onClick={onToggleChat}
              className={chatOpen ? 'inactive' : 'active'}
              style={chatOpen ? { 
                borderColor: 'var(--accent)',
                background: 'var(--accent-soft)',
                color: 'var(--accent)'
              } : {}}
              title={chatOpen ? 'Close Chat' : 'Open Chat'}
            >
              <MessageSquare size={20} />
            </button>
            <span className="control-btn-label">Chat</span>
          </div>
        </div>

        {/* Leave button */}
        <button 
          onClick={handleLeaveClick}
          className="leave-btn"
          title="Leave Meeting"
        >
          <PhoneOff size={18} />
          <span>End</span>
        </button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="emoji-picker">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                className="emoji-btn"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Leave Confirmation Dialog */}
      {showLeaveConfirm && (
        <div className="confirm-dialog-overlay" onClick={() => setShowLeaveConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Leave Meeting?</h3>
            <p>Are you sure you want to leave this meeting?</p>
            <div className="confirm-dialog-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowLeaveConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={confirmLeave}
              >
                Leave Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ControlBar;
