import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Video, Plus, Key, Link as LinkIcon, Clipboard, ArrowRight, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const { user } = useAuth();
  const { roomId: urlRoomId } = useParams(); // For /join/:roomId redirect mapping
  const navigate = useNavigate();

  const [joinRoomId, setJoinRoomId] = useState('');
  const [createdRoomId, setCreatedRoomId] = useState('');
  const [createdRoomLink, setCreatedRoomLink] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [recentMeetings, setRecentMeetings] = useState([]);

  // Auto fill join code if provided via URL
  useEffect(() => {
    if (urlRoomId) {
      setJoinRoomId(urlRoomId);
      toast.info(`Pre-filled Room ID: ${urlRoomId}. Click Join to enter.`);
    }
  }, [urlRoomId]);

  // Load recent meetings
  useEffect(() => {
    const recents = JSON.parse(localStorage.getItem('recentMeetings') || '[]');
    setRecentMeetings(recents);
  }, []);

  const generateRoomCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * 26)]).join('');
    const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 26)]).join('');
    const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * 26)]).join('');
    return `${part1}-${part2}-${part3}`;
  };

  const handleCreateMeeting = async () => {
    setIsCreating(true);
    const code = generateRoomCode();
    try {
      // POST to backend
      const response = await api.post('/api/meetings/create', {
        roomId: code,
        roomName: `${user?.name || 'User'}'s Meeting`,
        createdBy: user?.email || 'Guest'
      });

      if (response.data.roomId) {
        const link = `${window.location.origin}/join/${code}`;
        setCreatedRoomId(code);
        setCreatedRoomLink(link);
        
        // Save to recents
        saveToRecents(code, `${user?.name || 'User'}'s Meeting`);
        toast.success('Meeting room created successfully!');
      }
    } catch (error) {
      console.error('Failed to create meeting:', error);
      toast.error(error.response?.data?.message || 'Failed to create meeting.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinMeeting = async (e) => {
    e.preventDefault();
    if (!joinRoomId.trim()) {
      toast.error('Please enter a valid Room ID or link.');
      return;
    }

    // Extract code if user pasted full URL
    let code = joinRoomId.trim();
    if (code.includes('/join/')) {
      code = code.split('/join/')[1];
    } else if (code.includes('/room/')) {
      code = code.split('/room/')[1];
    } else if (code.includes('/lobby/')) {
      code = code.split('/lobby/')[1];
    }

    // Clean up code format
    code = code.toLowerCase().replace(/[^a-z0-9-]/g, '');

    setIsJoining(true);
    try {
      // Validate with backend
      const response = await api.get(`/api/meetings/validate/${code}`);
      
      if (response.data.roomId) {
        saveToRecents(code, 'Joined Meeting');
        toast.success('Room validated! Entering lobby...');
        navigate(`/lobby/${code}`);
      }
    } catch (error) {
      console.error('Failed to validate room:', error);
      toast.error(error.response?.data?.message || 'Room not found or invalid. Please check the ID.');
    } finally {
      setIsJoining(false);
    }
  };

  const saveToRecents = (code, name) => {
    const list = JSON.parse(localStorage.getItem('recentMeetings') || '[]');
    // Avoid duplicates
    const filtered = list.filter(item => item.code !== code);
    const updated = [
      { code, name, date: new Date().toLocaleDateString() },
      ...filtered
    ].slice(0, 5); // Keep last 5

    localStorage.setItem('recentMeetings', JSON.stringify(updated));
    setRecentMeetings(updated);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-header">
        <h1 className="dashboard-greeting">
          Welcome, <span className="accent">{user?.name || 'User'}</span>!
        </h1>
        <p className="dashboard-subtitle">Start a new meeting or join an existing one instantly</p>
      </div>

      <div className="dashboard-grid">
        {/* Create Card */}
        <div className="dashboard-card create">
          <div className="dashboard-card-icon">
            <Plus size={24} />
          </div>
          <h2 className="dashboard-card-title">Create a Meeting</h2>
          <p className="dashboard-card-desc">Generate a secure room code and shareable link for participants to join.</p>

          {!createdRoomId ? (
            <button 
              onClick={handleCreateMeeting} 
              className="btn btn-primary w-full btn-lg"
              disabled={isCreating}
            >
              {isCreating ? <span className="spinner" /> : <span>Start New Meeting</span>}
            </button>
          ) : (
            <div className="dashboard-card-form">
              <div className="room-id-display">
                <code>{createdRoomId}</code>
                <button 
                  onClick={() => copyToClipboard(createdRoomId)} 
                  className="btn btn-ghost btn-sm btn-icon"
                  title="Copy Code"
                >
                  <Clipboard size={14} />
                </button>
              </div>

              <div className="room-id-display" style={{ marginTop: 'var(--space-2)' }}>
                <code style={{ fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {createdRoomLink}
                </code>
                <button 
                  onClick={() => copyToClipboard(createdRoomLink)} 
                  className="btn btn-ghost btn-sm btn-icon"
                  title="Copy Link"
                >
                  <LinkIcon size={14} />
                </button>
              </div>

              <button 
                onClick={() => navigate(`/lobby/${createdRoomId}`)} 
                className="btn btn-primary w-full"
                style={{ marginTop: 'var(--space-2)' }}
              >
                <span>Enter Lobby</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Join Card */}
        <div className="dashboard-card join">
          <div className="dashboard-card-icon">
            <Key size={24} />
          </div>
          <h2 className="dashboard-card-title">Join a Meeting</h2>
          <p className="dashboard-card-desc">Enter the Room ID or shareable link to access a room created by another host.</p>

          <form onSubmit={handleJoinMeeting} className="dashboard-card-form">
            <div className="input-group">
              <input
                type="text"
                className="input"
                placeholder="abc-defg-hij or paste link"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-secondary w-full btn-lg"
              disabled={isJoining}
            >
              {isJoining ? <span className="spinner" /> : <span>Join Meeting</span>}
            </button>
          </form>
        </div>
      </div>

      {/* Recent Meetings */}
      {recentMeetings.length > 0 && (
        <div 
          className="container"
          style={{ maxWidth: '900px', paddingBottom: 'var(--space-16)' }}
        >
          <h3 style={{ fontSize: 'var(--font-md)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Clock size={16} style={{ color: 'var(--accent)' }} />
            <span>Recent Meetings</span>
          </h3>
          <div className="recent-list">
            {recentMeetings.map((item, index) => (
              <div 
                key={index} 
                className="recent-item"
              >
                <div>
                  <div className="recent-item-title">{item.name}</div>
                  <div className="recent-item-meta">Code: {item.code} • {item.date}</div>
                </div>
                <button 
                  onClick={() => navigate(`/lobby/${item.code}`)} 
                  className="btn btn-secondary btn-sm"
                >
                  <span>Rejoin</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
