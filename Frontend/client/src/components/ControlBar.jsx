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
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slide-up_0.4s_ease-out] w-[calc(100%-2rem)] sm:w-auto max-w-max">
      <div className="flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2.5 bg-tertiary/95 backdrop-blur-xl rounded-full shadow-2xl border border-border-primary/60 justify-center">
        
        {/* Chat toggle */}
        <button 
          onClick={onToggleChat}
          className={`group relative w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 ease-out cursor-pointer shrink-0
            ${chatOpen 
              ? 'bg-brand text-secondary shadow-lg shadow-brand/25 scale-105' 
              : 'bg-surface hover:bg-surface-hover text-offwhite'
            }`}
          title={chatOpen ? 'Close Chat' : 'Open Chat'}
        >
          <MessageSquare size={16} />
          {chatOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand rounded-full animate-ping" />
          )}
        </button>

        {/* Mic toggle */}
        <button 
          onClick={onToggleMic}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 ease-out cursor-pointer shrink-0
            ${micActive 
              ? 'bg-surface hover:bg-surface-hover text-offwhite' 
              : 'bg-coral/20 text-coral hover:bg-coral/30'
            }`}
          title={micActive ? 'Mute Mic' : 'Unmute Mic'}
        >
          {micActive ? <Mic size={16} /> : <MicOff size={16} />}
        </button>

        {/* Camera toggle */}
        <button 
          onClick={onToggleCamera}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 ease-out cursor-pointer shrink-0
            ${cameraActive 
              ? 'bg-surface hover:bg-surface-hover text-offwhite' 
              : 'bg-coral/20 text-coral hover:bg-coral/30'
            }`}
          title={cameraActive ? 'Turn Camera Off' : 'Turn Camera On'}
        >
          {cameraActive ? <Video size={16} /> : <VideoOff size={16} />}
        </button>

        {/* Divider */}
        <div className="w-px h-5 sm:h-7 bg-border-primary/50 mx-0.5 sm:mx-1 shrink-0" />

        {/* Leave / End Call button — pill shape, coral red */}
        <button 
          onClick={onLeave}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-coral hover:bg-coral-dark text-white flex items-center justify-center transition-all duration-200 ease-out hover:scale-105 active:scale-95 shadow-lg shadow-coral/30 cursor-pointer shrink-0"
          title="Leave Meeting"
        >
          <PhoneOff size={18} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 sm:h-7 bg-border-primary/50 mx-0.5 sm:mx-1 shrink-0" />

        {/* Screen share toggle */}
        <button 
          onClick={onToggleScreenShare}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 ease-out cursor-pointer shrink-0
            ${screenShareActive 
              ? 'bg-brand text-secondary shadow-lg shadow-brand/25 scale-105' 
              : 'bg-surface hover:bg-surface-hover text-offwhite'
            }`}
          title={screenShareActive ? 'Stop Sharing' : 'Share Screen'}
        >
          {screenShareActive ? <MonitorOff size={16} /> : <Monitor size={16} />}
        </button>

        {/* Participants People */}
        <button 
          onClick={onToggleParticipants}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 ease-out cursor-pointer shrink-0
            ${participantsOpen 
              ? 'bg-brand text-secondary shadow-lg shadow-brand/25 scale-105' 
              : 'bg-surface hover:bg-surface-hover text-offwhite'
            }`}
          title={participantsOpen ? 'Close Participants' : 'Open Participants'}
        >
          <Users size={16} />
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
