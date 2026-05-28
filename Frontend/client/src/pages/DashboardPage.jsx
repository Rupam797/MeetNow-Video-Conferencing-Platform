import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Video, Plus, Key, Link as LinkIcon, Clipboard, ArrowRight, Clock, ShieldCheck, Cpu } from 'lucide-react';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const { user } = useAuth();
  const { roomId: urlRoomId } = useParams();
  const navigate = useNavigate();

  const [joinRoomId, setJoinRoomId] = useState('');
  const [createdRoomId, setCreatedRoomId] = useState('');
  const [createdRoomLink, setCreatedRoomLink] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [recentMeetings, setRecentMeetings] = useState([]);

  useEffect(() => {
    if (urlRoomId) {
      setJoinRoomId(urlRoomId);
      toast.info(`Pre-filled Room ID: ${urlRoomId}. Click Join to enter.`);
    }
  }, [urlRoomId]);

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
      const response = await api.post('/api/meetings/create', {
        roomId: code,
        roomName: `${user?.name || 'User'}'s Meeting`,
        createdBy: user?.email || 'Guest'
      });

      if (response.data.roomId) {
        const link = `${window.location.origin}/join/${code}`;
        setCreatedRoomId(code);
        setCreatedRoomLink(link);
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

    let code = joinRoomId.trim();
    if (code.includes('/join/')) {
      code = code.split('/join/')[1];
    } else if (code.includes('/room/')) {
      code = code.split('/room/')[1];
    } else if (code.includes('/lobby/')) {
      code = code.split('/lobby/')[1];
    }
    code = code.toLowerCase().replace(/[^a-z0-9-]/g, '');

    setIsJoining(true);
    try {
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
    const filtered = list.filter(item => item.code !== code);
    const updated = [
      { code, name, date: new Date().toLocaleDateString() },
      ...filtered
    ].slice(0, 5);
    localStorage.setItem('recentMeetings', JSON.stringify(updated));
    setRecentMeetings(updated);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen pt-16 bg-offwhite dark:bg-primary text-primary dark:text-white transition-colors duration-300">
      <Navbar />

      {/* Hero Header Area */}
      <div className="max-w-[1120px] mx-auto px-6 pt-12 pb-6 relative">
        {/* Glow backdrop decorative */}
        <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-brand/10 dark:bg-brand/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-border-primary/60 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-[Outfit]">
              Welcome, <span className="text-brand dark:text-brand italic font-serif">{user?.name || 'User'}</span>!
            </h1>
            <p className="text-sm text-secondary dark:text-offwhite/60 mt-1 font-[Outfit]">
              Start a secure session, schedule collaborative discussions, or join a room instantly.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-secondary p-3 rounded-2xl border border-gray-200 dark:border-border-primary/60 shadow-sm text-xs font-[Outfit]">
            <div className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
              <Cpu size={16} />
            </div>
            <div>
              <span className="font-semibold block text-primary dark:text-white">Active Node: OK</span>
              <span className="text-[10px] text-secondary dark:text-offwhite/50">Agora RTC Network Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[920px] mx-auto px-6 py-8">
        
        {/* Create Card */}
        <div className="p-6 md:p-8 bg-white dark:bg-secondary rounded-3xl border border-gray-200 dark:border-border-primary/60 transition-all duration-300 hover:border-brand dark:hover:border-brand shadow-sm hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-brand-soft text-brand">
              <Plus size={24} />
            </div>
            <h2 className="text-xl font-bold mb-1.5 font-[Outfit]">Create a Meeting</h2>
            <p className="text-sm text-secondary dark:text-offwhite/60 mb-6 leading-relaxed font-[Outfit]">
              Generate a unique permanent meeting room code and secure link to share with your collaborators.
            </p>

            {createdRoomId && (
              <div className="flex flex-col gap-3 mb-6 animate-[fade-in_0.2s_ease-out]">
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-border-primary bg-offwhite dark:bg-input text-sm">
                  <span className="text-[10px] font-bold text-secondary dark:text-offwhite/40 tracking-wider font-[Outfit] uppercase">Code</span>
                  <code className="flex-1 font-mono text-sm text-brand font-bold text-center">{createdRoomId}</code>
                  <button onClick={() => copyToClipboard(createdRoomId)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-surface-hover text-secondary dark:text-offwhite transition-colors" title="Copy Code">
                    <Clipboard size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-border-primary bg-offwhite dark:bg-input text-sm">
                  <span className="text-[10px] font-bold text-secondary dark:text-offwhite/40 tracking-wider font-[Outfit] uppercase">Link</span>
                  <code className="flex-1 font-mono text-[10px] truncate max-w-[200px] text-secondary dark:text-offwhite">{createdRoomLink}</code>
                  <button onClick={() => copyToClipboard(createdRoomLink)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-surface-hover text-secondary dark:text-offwhite transition-colors" title="Copy Link">
                    <LinkIcon size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {!createdRoomId ? (
            <button 
              onClick={handleCreateMeeting} 
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl bg-primary text-brand hover:bg-primary/95 dark:bg-brand dark:text-secondary dark:hover:bg-brand-hover cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-55 font-[Outfit] shadow-md shadow-brand/10"
              disabled={isCreating}
            >
              {isCreating ? (
                <span className="w-5 h-5 border-2 rounded-full animate-spin border-brand border-t-transparent dark:border-secondary dark:border-t-transparent" />
              ) : (
                <>
                  <span>Create Meeting</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          ) : (
            <button 
              onClick={() => navigate(`/lobby/${createdRoomId}`)} 
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl bg-brand text-secondary hover:bg-brand-hover cursor-pointer transition-all duration-150 active:scale-[0.98] font-[Outfit] shadow-md shadow-brand/15"
            >
              <span>Enter Lobby</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Join Card */}
        <div className="p-6 md:p-8 bg-white dark:bg-secondary rounded-3xl border border-gray-200 dark:border-border-primary/60 transition-all duration-300 hover:border-brand dark:hover:border-brand shadow-sm hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-brand-soft text-brand">
              <Key size={24} />
            </div>
            <h2 className="text-xl font-bold mb-1.5 font-[Outfit]">Join a Meeting</h2>
            <p className="text-sm text-secondary dark:text-offwhite/60 mb-6 leading-relaxed font-[Outfit]">
              Enter a Room ID (e.g., abc-defg-hij) or paste a shareable invite link to connect with an active room.
            </p>

            <form onSubmit={handleJoinMeeting} className="flex flex-col gap-4 mb-4">
              <input
                type="text"
                className="w-full py-3 px-4 text-sm rounded-xl border border-gray-300 dark:border-border-primary bg-transparent focus:border-brand dark:focus:border-brand focus:shadow-[0_0_0_3px_rgba(219,234,141,0.2)] dark:bg-input text-primary dark:text-white outline-none transition-all duration-150 font-[Outfit]"
                placeholder="abc-defg-hij or paste room link"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl border border-gray-300 dark:border-border-primary hover:border-primary dark:hover:border-white hover:bg-gray-50 dark:hover:bg-surface-hover cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-55 font-[Outfit]"
                disabled={isJoining}
              >
                {isJoining ? (
                  <span className="w-5 h-5 border-2 rounded-full animate-spin border-primary border-t-transparent dark:border-white dark:border-t-transparent" />
                ) : (
                  <>
                    <span>Join Meeting</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Recent Meetings */}
      {recentMeetings.length > 0 && (
        <div className="max-w-[920px] mx-auto px-6 pb-16">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-secondary dark:text-offwhite/65 font-[Outfit]">
            <Clock size={16} className="text-brand" />
            <span>Recent Meetings History</span>
          </h3>
          <div className="rounded-2xl border border-gray-200 dark:border-border-primary/60 overflow-hidden bg-white dark:bg-secondary shadow-sm">
            {recentMeetings.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between px-5 py-4 border-b border-gray-150 dark:border-border-primary/40 last:border-b-0 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-surface-hover"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0">
                    <Video size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-primary dark:text-white font-[Outfit]">{item.name}</div>
                    <div className="text-xs text-secondary dark:text-offwhite/50 mt-0.5 font-[Outfit]">Code: <span className="font-mono">{item.code}</span> &bull; Hosted on {item.date}</div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/lobby/${item.code}`)} 
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-border-primary hover:border-primary dark:hover:border-white hover:bg-gray-100 dark:hover:bg-surface cursor-pointer transition-all duration-150 text-primary dark:text-white bg-transparent font-[Outfit]"
                >
                  <span>Rejoin Room</span>
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
