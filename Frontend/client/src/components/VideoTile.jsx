import React, { useEffect, useRef } from 'react';
import { MicOff, User } from 'lucide-react';

const VideoTile = ({ track, isLocal, user, name, videoActive, audioActive }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const container = videoRef.current;
    if (!container) return;

    // Determine the actual video track to play
    const videoTrack = isLocal ? track : user?.videoTrack;

    if (!videoTrack || !videoActive) {
      // Clean the container when there's no track or video is off
      container.innerHTML = '';
      return;
    }

    // Play the track into the container
    videoTrack.play(container);

    return () => {
      // Just clear the container — do NOT call videoTrack.stop() or .close()
      // because tracks are managed by Agora hooks and calling stop() on them
      // will permanently destroy them, causing crashes on re-toggle.
      container.innerHTML = '';
    };
  }, [track, user?.videoTrack, videoActive, isLocal]);

  const getInitials = (n) => {
    if (!n) return 'U';
    return n.split(' ').map(item => item[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="video-tile">
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

      {/* Avatar Fallback */}
      {!videoActive && (
        <div className="video-tile-avatar">
          <div className="video-tile-avatar-circle">
            {name ? (
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {getInitials(name)}
              </span>
            ) : (
              <User size={36} />
            )}
          </div>
        </div>
      )}

      {/* Control overlay / Labels */}
      <div className="video-tile-label flex items-center gap-2">
        <span>{name || (isLocal ? 'You' : 'Remote Participant')}</span>
        {!audioActive && (
          <span style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}>
            <MicOff size={14} />
          </span>
        )}
      </div>
    </div>
  );
};

export default VideoTile;
