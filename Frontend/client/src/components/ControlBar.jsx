import React from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff,
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slide-up_0.4s_ease-out]">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-tertiary/95 backdrop-blur-xl rounded-full shadow-2xl border border-border-primary/60">
        
        {/* Chat toggle */}
        <button 
          onClick={onToggleChat}
          className={`group relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ease-out cursor-pointer
            ${chatOpen 
              ? 'bg-brand text-secondary shadow-lg shadow-brand/25 scale-105' 
              : 'bg-surface hover:bg-surface-hover text-offwhite'
            }`}
          title={chatOpen ? 'Close Chat' : 'Open Chat'}
        >
          <MessageSquare size={18} />
          {chatOpen && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand rounded-full animate-ping" />
          )}
        </button>

        {/* Mic toggle */}
        <button 
          onClick={onToggleMic}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ease-out cursor-pointer
            ${micActive 
              ? 'bg-surface hover:bg-surface-hover text-offwhite' 
              : 'bg-coral/20 text-coral hover:bg-coral/30'
            }`}
          title={micActive ? 'Mute Mic' : 'Unmute Mic'}
        >
          {micActive ? <Mic size={18} /> : <MicOff size={18} />}
        </button>

        {/* Camera toggle */}
        <button 
          onClick={onToggleCamera}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ease-out cursor-pointer
            ${cameraActive 
              ? 'bg-surface hover:bg-surface-hover text-offwhite' 
              : 'bg-coral/20 text-coral hover:bg-coral/30'
            }`}
          title={cameraActive ? 'Turn Camera Off' : 'Turn Camera On'}
        >
          {cameraActive ? <Video size={18} /> : <VideoOff size={18} />}
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-border-primary/50 mx-1" />

        {/* Leave / End Call button — pill shape, coral red */}
        <button 
          onClick={onLeave}
          className="w-12 h-12 rounded-full bg-coral hover:bg-coral-dark text-white flex items-center justify-center transition-all duration-200 ease-out hover:scale-105 active:scale-95 shadow-lg shadow-coral/30 cursor-pointer"
          title="Leave Meeting"
        >
          <PhoneOff size={20} />
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-border-primary/50 mx-1" />

        {/* Screen share toggle */}
        <button 
          onClick={onToggleScreenShare}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ease-out cursor-pointer
            ${screenShareActive 
              ? 'bg-brand text-secondary shadow-lg shadow-brand/25 scale-105' 
              : 'bg-surface hover:bg-surface-hover text-offwhite'
            }`}
          title={screenShareActive ? 'Stop Sharing' : 'Share Screen'}
        >
          {screenShareActive ? <MonitorOff size={18} /> : <Monitor size={18} />}
        </button>

        {/* Participants People */}
        <button 
          onClick={onToggleParticipants}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ease-out cursor-pointer
            ${participantsOpen 
              ? 'bg-brand text-secondary shadow-lg shadow-brand/25 scale-105' 
              : 'bg-surface hover:bg-surface-hover text-offwhite'
            }`}
          title={participantsOpen ? 'Close Participants' : 'Open Participants'}
        >
          <Users size={18} />
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
