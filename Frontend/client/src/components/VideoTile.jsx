import React, { useEffect, useRef } from 'react';
import { MicOff, User } from 'lucide-react';

const VideoTile = ({ 
  track, 
  isLocal, 
  user, 
  name, 
  videoActive, 
  audioActive,
  isSpeaking = false,
  isPinned = false 
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const container = videoRef.current;
    if (!container) return;

    if (isLocal) {
      if (track && videoActive) {
        track.play(container);
        return () => {
          track.stop();
        };
      }
    } else {
      if (user && user.videoTrack && videoActive) {
        user.videoTrack.play(container);
        return () => {
          user.videoTrack.stop();
        };
      }
    }
  }, [track, user, user?.videoTrack, videoActive, isLocal]);

  const getInitials = (n) => {
    if (!n) return 'U';
    return n.split(' ').map(item => item[0]).join('').toUpperCase().substring(0, 2);
  };

  const tileClasses = [
    'video-tile',
    isSpeaking && 'speaking',
    isPinned && 'pinned'
  ].filter(Boolean).join(' ');

  return (
    <div className={tileClasses}>
      {/* Video container */}
      <div 
        ref={videoRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: videoActive ? 'block' : 'none',
          backgroundColor: '#000'
        }} 
      />

      {/* Avatar Fallback when video is off */}
      {!videoActive && (
        <div className="video-tile-avatar">
          <div className="video-tile-avatar-circle">
            {name ? getInitials(name) : <User size={32} />}
          </div>
        </div>
      )}

      {/* Muted indicator badge */}
      {!audioActive && (
        <div className="video-tile-muted">
          <MicOff size={14} />
        </div>
      )}

      {/* Name label */}
      <div className="video-tile-label">
        <span>{name || (isLocal ? 'You' : 'Participant')}</span>
      </div>
    </div>
  );
};

export default VideoTile;
