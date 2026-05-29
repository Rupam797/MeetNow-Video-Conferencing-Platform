import React, { useEffect, useRef } from 'react';
import { MicOff, User } from 'lucide-react';

const VideoTile = ({ track, isLocal, user, name, videoActive, audioActive }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const container = videoRef.current;
    if (!container) return;

    if (isLocal) {
      if (track && videoActive) {
        try {
          track.play(container);
        } catch (err) {
          console.error("Error playing local video track:", err);
        }
        return () => {
          if (track) {
            try {
              track.stop();
            } catch (err) {
              console.error("Error stopping local video track during cleanup:", err);
            }
          }
        };
      }
    } else {
      if (user && user.videoTrack && videoActive) {
        try {
          user.videoTrack.play(container);
        } catch (err) {
          console.error("Error playing remote video track:", err);
        }
        return () => {
          if (user && user.videoTrack) {
            try {
              user.videoTrack.stop();
            } catch (err) {
              console.error("Error stopping remote video track during cleanup:", err);
            }
          }
        };
      }
    }
  }, [track, user, user?.videoTrack, videoActive, isLocal]);

  const getInitials = (n) => {
    if (!n) return 'U';
    return n.split(' ').map(item => item[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="relative bg-secondary rounded-2xl overflow-hidden border border-border-primary/60 shadow-lg group min-h-[180px] transition-all duration-300 hover:shadow-xl hover:border-brand/40">
      {/* Video container */}
      <div 
        ref={videoRef} 
        className="w-full h-full bg-black"
        style={{ 
          display: videoActive ? 'block' : 'none',
        }} 
      />

      {/* Avatar Fallback */}
      {!videoActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-tertiary">
          <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center border border-border-primary/50 shadow-inner transition-transform duration-300 group-hover:scale-105">
            {name ? (
              <span className="text-2xl font-bold text-white tracking-wide font-[Outfit]">
                {getInitials(name)}
              </span>
            ) : (
              <User size={36} className="text-offwhite/50" />
            )}
          </div>
        </div>
      )}

      {/* Name label — bottom-left, frosted glass */}
      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg z-10">
        <span className="text-xs font-medium text-white font-[Outfit] tracking-wide truncate max-w-[140px]">
          {name || (isLocal ? 'You' : 'Participant')}
        </span>
        {!audioActive && (
          <span className="text-coral inline-flex items-center">
            <MicOff size={12} />
          </span>
        )}
      </div>

      {/* Active speaking indicator — brand ring */}
      {audioActive && (
        <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-brand shadow-lg shadow-brand/40 z-10 animate-pulse" />
      )}
    </div>
  );
};

export default VideoTile;
