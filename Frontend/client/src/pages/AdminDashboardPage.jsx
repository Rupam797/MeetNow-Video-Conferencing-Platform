import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Video, Activity, ShieldAlert, Trash2, Search, 
  ArrowLeft, UserCheck, LayoutDashboard, Plus, Clipboard, Link as LinkIcon
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalUsers: 0, totalRooms: 0, activeRooms: 0, inactiveRooms: 0 });
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [userSearch, setUserSearch] = useState('');
  const [roomSearch, setRoomSearch] = useState('');

  const [deleteUserModal, setDeleteUserModal] = useState({ show: false, userId: null, userName: '' });
  const [deleteRoomModal, setDeleteRoomModal] = useState({ show: false, roomId: null });

  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, roomsRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
        api.get('/api/admin/rooms')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setRooms(roomsRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      toast.error('Unauthorized or failed to retrieve admin data.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated successfully to ${newRole}`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Role update failed:', err);
      toast.error('Failed to update user role.');
    }
  };

  const openDeleteUserConfirm = (id, name) => setDeleteUserModal({ show: true, userId: id, userName: name });
  const closeDeleteUserConfirm = () => setDeleteUserModal({ show: false, userId: null, userName: '' });

  const handleDeleteUser = async () => {
    const { userId } = deleteUserModal;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      toast.success('User account deleted successfully.');
      setUsers(prev => prev.filter(u => u.id !== userId));
      closeDeleteUserConfirm();
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Delete user failed:', err);
      toast.error('Failed to delete user.');
    }
  };

  const openDeleteRoomConfirm = (roomId) => setDeleteRoomModal({ show: true, roomId });
  const closeDeleteRoomConfirm = () => setDeleteRoomModal({ show: false, roomId: null });

  const handleDeleteRoom = async () => {
    const { roomId } = deleteRoomModal;
    try {
      await api.delete(`/api/admin/rooms/${roomId}`);
      toast.success('Meeting room ended and deleted.');
      setRooms(prev => prev.filter(r => r.roomId !== roomId));
      closeDeleteRoomConfirm();
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Delete room failed:', err);
      toast.error('Failed to delete meeting room.');
    }
  };

  const generateRoomCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * 26)]).join('');
    const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 26)]).join('');
    const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * 26)]).join('');
    return `${part1}-${part2}-${part3}`;
  };

  const handleCreateRoom = async () => {
    setIsCreatingRoom(true);
    const code = generateRoomCode();
    try {
      const response = await api.post('/api/meetings/create', {
        roomId: code,
        roomName: `Admin Quick Room`,
        createdBy: user?.email || 'admin@vidor.com'
      });
      if (response.data.roomId) {
        toast.success('Quick meeting room created.');
        setCreatedRoom({ code, link: `${window.location.origin}/join/${code}` });
        const [roomsRes, statsRes] = await Promise.all([
          api.get('/api/admin/rooms'),
          api.get('/api/admin/stats')
        ]);
        setRooms(roomsRes.data);
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Failed to create room:', err);
      toast.error('Failed to create meeting room.');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredRooms = rooms.filter(r => 
    r.roomId?.toLowerCase().includes(roomSearch.toLowerCase()) || 
    r.createdBy?.toLowerCase().includes(roomSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-offwhite dark:bg-primary text-secondary dark:text-offwhite/70 transition-colors duration-300">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-brand dark:border-border-primary dark:border-t-brand rounded-full animate-spin" />
        <p className="font-[Outfit]">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-offwhite dark:bg-primary text-primary dark:text-white transition-colors duration-300">
      <Navbar />

      <div className="max-w-[1120px] mx-auto px-6 pt-10 pb-16">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 text-brand">
              <LayoutDashboard size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider font-[Outfit]">System Administration</span>
            </div>
            <h1 className="text-3xl font-extrabold font-[Outfit]">Admin Dashboard</h1>
            <p className="text-sm text-secondary dark:text-offwhite/60 font-[Outfit]">Manage system users, meeting rooms, and monitor platform health.</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 dark:border-border-primary bg-transparent hover:border-primary dark:hover:border-white hover:bg-gray-50 dark:hover:bg-surface-hover text-primary dark:text-white transition-all duration-150 cursor-pointer font-[Outfit]"
          >
            <ArrowLeft size={16} />
            <span>User Portal</span>
          </button>
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: <Users size={20} />, bgColor: 'bg-brand-soft', iconColor: 'text-brand' },
            { label: 'Total Rooms', value: stats.totalRooms, icon: <Video size={20} />, bgColor: 'bg-purple-soft', iconColor: 'text-purple' },
            { label: 'Active Rooms', value: stats.activeRooms, icon: <Activity size={20} />, bgColor: 'bg-brand-soft', iconColor: 'text-brand' },
            { label: 'Inactive Rooms', value: stats.inactiveRooms, icon: <ShieldAlert size={20} />, bgColor: 'bg-coral-soft', iconColor: 'text-coral' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 dark:border-border-primary/60 bg-white dark:bg-secondary transition-all duration-300 hover:border-brand dark:hover:border-brand hover:-translate-y-0.5 shadow-sm hover:shadow-md">
              <div className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center ${stat.bgColor} ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider font-[Outfit] text-secondary dark:text-offwhite/50">{stat.label}</span>
                <span className="text-xl font-bold leading-tight mt-1 font-[Outfit]">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-border-primary/60 pb-0.5 mb-6">
          {['overview', 'users', 'rooms'].map((tab) => (
            <button 
              key={tab}
              className={`px-4 py-2.5 text-sm font-semibold cursor-pointer transition-all duration-150 border-b-2 font-[Outfit] bg-transparent ${
                activeTab === tab 
                  ? 'border-brand text-brand' 
                  : 'border-transparent text-secondary dark:text-offwhite/60 hover:text-primary dark:hover:text-white'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' ? 'Overview' : tab === 'users' ? `User Management (${users.length})` : `Meeting Rooms (${rooms.length})`}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-border-primary/60 bg-white dark:bg-secondary shadow-sm">
              <h2 className="text-lg font-bold mb-4 font-[Outfit]">Platform Quick Links</h2>
              <div className="flex gap-3 flex-wrap">
                <button 
                  onClick={handleCreateRoom} 
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl bg-brand text-secondary hover:bg-brand-hover cursor-pointer transition-all duration-150 shadow-md shadow-brand/10 disabled:opacity-55 font-[Outfit]" 
                  disabled={isCreatingRoom}
                >
                  <Plus size={16} />
                  <span>Spin Up Quick Meeting</span>
                </button>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 dark:border-border-primary bg-transparent hover:border-primary dark:hover:border-white hover:bg-gray-50 dark:hover:bg-surface-hover text-primary dark:text-white transition-all duration-150 font-[Outfit]"
                >
                  <span>Go to Meeting Lobby</span>
                </button>
              </div>

              {createdRoom && (
                <div className="mt-4 p-4 rounded-xl bg-offwhite dark:bg-input animate-[fade-in_0.2s_ease-out] border border-gray-200 dark:border-border-primary/40">
                  <p className="font-bold text-sm mb-2 font-[Outfit]">Room Created Successfully!</p>
                  <div className="flex gap-3 items-center mb-2 text-xs">
                    <span className="font-semibold text-secondary/60 dark:text-offwhite/40 uppercase tracking-wider font-[Outfit]">Code</span>
                    <code className="font-mono text-sm text-brand font-bold">{createdRoom.code}</code>
                    <button onClick={() => copyToClipboard(createdRoom.code)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-surface-hover text-secondary dark:text-offwhite transition-colors"><Clipboard size={14} /></button>
                  </div>
                  <div className="flex gap-3 items-center text-xs">
                    <span className="font-semibold text-secondary/60 dark:text-offwhite/40 uppercase tracking-wider font-[Outfit]">Link</span>
                    <code className="font-mono text-xs text-secondary dark:text-offwhite truncate max-w-[300px]">{createdRoom.link}</code>
                    <button onClick={() => copyToClipboard(createdRoom.link)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-surface-hover text-secondary dark:text-offwhite transition-colors"><LinkIcon size={14} /></button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-border-primary/60 bg-white dark:bg-secondary shadow-sm">
                <h3 className="text-base font-bold mb-3 font-[Outfit]">Recent Registered Users</h3>
                {users.length === 0 ? (
                  <p className="text-sm text-secondary dark:text-offwhite/50 font-[Outfit]">No users found.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {users.slice(-5).reverse().map(u => (
                      <div key={u.id} className="flex justify-between items-center p-3 rounded-xl border border-gray-200 dark:border-border-primary/40 bg-gray-50 dark:bg-input">
                        <div>
                          <div className="font-bold text-sm font-[Outfit]">{u.name}</div>
                          <div className="text-xs text-secondary dark:text-offwhite/50 font-[Outfit]">{u.email}</div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider font-[Outfit] ${
                          u.role === 'ADMIN' ? 'bg-brand-soft text-brand' : 'bg-gray-200/50 dark:bg-surface-hover text-secondary dark:text-offwhite/60'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Rooms */}
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-border-primary/60 bg-white dark:bg-secondary shadow-sm">
                <h3 className="text-base font-bold mb-3 font-[Outfit]">Recent Meeting Rooms</h3>
                {rooms.length === 0 ? (
                  <p className="text-sm text-secondary dark:text-offwhite/50 font-[Outfit]">No meetings created yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {rooms.slice(-5).reverse().map(r => (
                      <div key={r.id || r.roomId} className="flex justify-between items-center p-3 rounded-xl border border-gray-200 dark:border-border-primary/40 bg-gray-50 dark:bg-input">
                        <div>
                          <div className="font-bold font-mono text-sm text-brand">{r.roomId}</div>
                          <div className="text-xs text-secondary dark:text-offwhite/50 font-[Outfit]">Host: {r.createdBy}</div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider font-[Outfit] ${
                          r.active ? 'bg-brand-soft text-brand' : 'bg-coral-soft text-coral'
                        }`}>
                          {r.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-border-primary/60 bg-white dark:bg-secondary shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-[320px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary/40 dark:text-offwhite/30" />
                <input 
                  type="text" 
                  className="w-full py-2.5 pl-10 pr-3 text-sm rounded-xl border border-gray-300 dark:border-border-primary/60 bg-offwhite dark:bg-input text-primary dark:text-white focus:border-brand dark:focus:border-brand outline-none transition-all font-[Outfit]"
                  placeholder="Search users by name or email..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-150 dark:border-border-primary/40">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-border-primary/60 bg-gray-50 dark:bg-input">
                    {['Name', 'Email', 'Role', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-bold font-[Outfit] text-secondary dark:text-offwhite/50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 font-[Outfit] text-secondary/40 dark:text-offwhite/35">
                        No users found matching "{userSearch}"
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-gray-150 dark:border-border-primary/40 last:border-b-0 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-surface-hover">
                        <td className="px-4 py-3.5 font-bold font-[Outfit] text-sm">{u.name}</td>
                        <td className="px-4 py-3.5 text-sm font-[Outfit] text-secondary dark:text-offwhite/70">{u.email}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider font-[Outfit] ${
                            u.role === 'ADMIN' ? 'bg-brand-soft text-brand' : 'bg-gray-100 dark:bg-surface text-secondary dark:text-offwhite/60'
                          }`}>{u.role}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleToggleRole(u.id, u.role)} 
                              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-border-primary bg-transparent hover:border-primary dark:hover:border-white hover:bg-gray-100 dark:hover:bg-surface cursor-pointer transition-all duration-150 text-primary dark:text-white font-[Outfit] disabled:opacity-55 disabled:cursor-not-allowed"
                              disabled={u.email === user?.email}
                              title="Toggle Role"
                            >
                              <UserCheck size={12} />
                              <span>{u.role === 'ADMIN' ? 'Make User' : 'Make Admin'}</span>
                            </button>
                            <button 
                              onClick={() => openDeleteUserConfirm(u.id, u.name)} 
                              className="w-7 h-7 rounded-full flex items-center justify-center bg-coral hover:bg-coral-dark text-white cursor-pointer transition-all duration-150 disabled:opacity-55 disabled:cursor-not-allowed shadow-sm"
                              disabled={u.email === user?.email}
                              title="Delete User"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Meeting Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-border-primary/60 bg-white dark:bg-secondary shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-[320px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary/40 dark:text-offwhite/30" />
                <input 
                  type="text" 
                  className="w-full py-2.5 pl-10 pr-3 text-sm rounded-xl border border-gray-300 dark:border-border-primary/60 bg-offwhite dark:bg-input text-primary dark:text-white focus:border-brand dark:focus:border-brand outline-none transition-all font-[Outfit]"
                  placeholder="Search by Room Code or Host email..." 
                  value={roomSearch}
                  onChange={(e) => setRoomSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-150 dark:border-border-primary/40">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-border-primary/60 bg-gray-50 dark:bg-input">
                    {['Room Code', 'Room Name', 'Created By', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-bold font-[Outfit] text-secondary dark:text-offwhite/50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 font-[Outfit] text-secondary/40 dark:text-offwhite/35">
                        No meeting rooms found matching "{roomSearch}"
                      </td>
                    </tr>
                  ) : (
                    filteredRooms.map(r => (
                      <tr key={r.id || r.roomId} className="border-b border-gray-150 dark:border-border-primary/40 last:border-b-0 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-surface-hover">
                        <td className="px-4 py-3.5">
                          <code className="font-mono text-sm text-brand font-bold">{r.roomId}</code>
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold font-[Outfit]">{r.roomName || 'Meeting'}</td>
                        <td className="px-4 py-3.5 text-sm font-[Outfit] text-secondary dark:text-offwhite/70">{r.createdBy}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider font-[Outfit] ${
                            r.active ? 'bg-brand-soft text-brand' : 'bg-coral-soft text-coral'
                          }`}>
                            {r.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button 
                            onClick={() => openDeleteRoomConfirm(r.roomId)} 
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-coral hover:bg-coral-dark text-white cursor-pointer transition-all duration-150 font-[Outfit] shadow-sm shadow-coral/10"
                            title="End and Delete Room"
                          >
                            <Trash2 size={12} />
                            <span>End Room</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete User Modal */}
      {deleteUserModal.show && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[420px] p-6 bg-white dark:bg-secondary border border-gray-200 dark:border-border-primary/60 rounded-3xl shadow-2xl animate-[fade-in_0.2s_ease-out]">
            <h3 className="text-lg font-bold mb-2 font-[Outfit]">Delete User Account</h3>
            <p className="text-sm text-secondary dark:text-offwhite/60 mb-6 font-[Outfit] font-light leading-relaxed">
              Are you sure you want to delete user <strong>{deleteUserModal.userName}</strong>? This will permanently erase their credentials and portal history. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 text-sm font-semibold font-[Outfit]">
              <button onClick={closeDeleteUserConfirm} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-border-primary text-primary dark:text-white bg-transparent hover:bg-gray-50 dark:hover:bg-surface-hover transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleDeleteUser} className="px-4 py-2 rounded-xl bg-coral hover:bg-coral-dark text-white shadow-md shadow-coral/10 cursor-pointer">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Room Modal */}
      {deleteRoomModal.show && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[420px] p-6 bg-white dark:bg-secondary border border-gray-200 dark:border-border-primary/60 rounded-3xl shadow-2xl animate-[fade-in_0.2s_ease-out]">
            <h3 className="text-lg font-bold mb-2 font-[Outfit]">Terminate Meeting Room</h3>
            <p className="text-sm text-secondary dark:text-offwhite/60 mb-6 font-[Outfit] font-light leading-relaxed">
              Are you sure you want to end and delete room <strong>{deleteRoomModal.roomId}</strong>? All participants will lose connection to the room.
            </p>
            <div className="flex justify-end gap-2 text-sm font-semibold font-[Outfit]">
              <button onClick={closeDeleteRoomConfirm} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-border-primary text-primary dark:text-white bg-transparent hover:bg-gray-50 dark:hover:bg-surface-hover transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleDeleteRoom} className="px-4 py-2 rounded-xl bg-coral hover:bg-coral-dark text-white shadow-md shadow-coral/10 cursor-pointer">Confirm Terminate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
