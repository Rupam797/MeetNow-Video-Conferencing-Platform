import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Video, Activity, ShieldAlert, Trash2, Search, 
  ArrowLeft, CheckCircle, XCircle, UserCheck, LayoutDashboard, Plus, Clipboard, Link as LinkIcon
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalUsers: 0, totalRooms: 0, activeRooms: 0, inactiveRooms: 0 });
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, rooms

  // Search/Filter states
  const [userSearch, setUserSearch] = useState('');
  const [roomSearch, setRoomSearch] = useState('');

  // Delete confirm modal states
  const [deleteUserModal, setDeleteUserModal] = useState({ show: false, userId: null, userName: '' });
  const [deleteRoomModal, setDeleteRoomModal] = useState({ show: false, roomId: null });

  // Quick room creation states
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
      
      // Update local stats role distribution dynamically
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Role update failed:', err);
      toast.error('Failed to update user role.');
    }
  };

  const openDeleteUserConfirm = (id, name) => {
    setDeleteUserModal({ show: true, userId: id, userName: name });
  };

  const closeDeleteUserConfirm = () => {
    setDeleteUserModal({ show: false, userId: null, userName: '' });
  };

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

  const openDeleteRoomConfirm = (roomId) => {
    setDeleteRoomModal({ show: true, roomId: roomId });
  };

  const closeDeleteRoomConfirm = () => {
    setDeleteRoomModal({ show: false, roomId: null });
  };

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
        createdBy: user?.email || 'admin@meetnow.com'
      });
      if (response.data.roomId) {
        toast.success('Quick meeting room created.');
        setCreatedRoom({
          code,
          link: `${window.location.origin}/join/${code}`
        });

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

  // Filters logic
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
      <div className="loading-screen">
        <div className="loading-spinner-lg"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>
        {/* Admin Header */}
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-8)' }}>
          <div>
            <div className="flex items-center gap-2" style={{ color: 'var(--accent-text)', marginBottom: 'var(--space-2)' }}>
              <LayoutDashboard size={18} />
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                System Administration
              </span>
            </div>
            <h1 style={{ fontSize: 'var(--font-3xl)', fontWeight: '800' }}>Admin Dashboard</h1>
            <p className="text-muted">Manage system users, meeting rooms, and monitor platform health.</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>User Portal</span>
          </button>
        </div>

        {/* Metrics Cards Grid */}
        <div className="admin-stats-grid" style={{ marginBottom: 'var(--space-10)' }}>
          <div className="admin-stat-card">
            <div className="admin-stat-icon users">
              <Users size={20} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Total Users</span>
              <span className="admin-stat-value">{stats.totalUsers}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon rooms">
              <Video size={20} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Total Rooms</span>
              <span className="admin-stat-value">{stats.totalRooms}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon active-rooms">
              <Activity size={20} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Active Rooms</span>
              <span className="admin-stat-value">{stats.activeRooms}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon inactive-rooms">
              <ShieldAlert size={20} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Inactive Rooms</span>
              <span className="admin-stat-value">{stats.inactiveRooms}</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="admin-tabs" style={{ marginBottom: 'var(--space-6)' }}>
          <button 
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management ({users.length})
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            Meeting Rooms ({rooms.length})
          </button>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            <div className="admin-panel-card">
              <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: '600', marginBottom: 'var(--space-4)' }}>Platform Quick Links</h2>
              <div className="admin-quick-actions">
                <button onClick={handleCreateRoom} className="btn btn-primary" disabled={isCreatingRoom}>
                  <Plus size={16} />
                  <span>Spin Up Quick Meeting</span>
                </button>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                  <span>Go to Meeting Lobby</span>
                </button>
              </div>

              {createdRoom && (
                <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontWeight: '600', fontSize: 'var(--font-sm)', marginBottom: 'var(--space-2)' }}>Room Created Successfully!</p>
                  <div className="flex gap-2 items-center" style={{ marginBottom: 'var(--space-2)' }}>
                    <code>{createdRoom.code}</code>
                    <button onClick={() => copyToClipboard(createdRoom.code)} className="btn btn-ghost btn-sm btn-icon"><Clipboard size={14} /></button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <code style={{ fontSize: '11px' }}>{createdRoom.link}</code>
                    <button onClick={() => copyToClipboard(createdRoom.link)} className="btn btn-ghost btn-sm btn-icon"><LinkIcon size={14} /></button>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-overview-columns">
              <div className="admin-panel-card">
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: '600', marginBottom: 'var(--space-3)' }}>Recent Registered Users</h3>
                {users.length === 0 ? (
                  <p className="text-muted">No users found.</p>
                ) : (
                  <div className="admin-recent-list">
                    {users.slice(-5).reverse().map(u => (
                      <div key={u.id} className="admin-recent-item">
                        <div>
                          <div style={{ fontWeight: '500' }}>{u.name}</div>
                          <div className="text-muted" style={{ fontSize: 'var(--font-xs)' }}>{u.email}</div>
                        </div>
                        <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-panel-card">
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: '600', marginBottom: 'var(--space-3)' }}>Recent Meeting Rooms</h3>
                {rooms.length === 0 ? (
                  <p className="text-muted">No meetings created yet.</p>
                ) : (
                  <div className="admin-recent-list">
                    {rooms.slice(-5).reverse().map(r => (
                      <div key={r.id || r.roomId} className="admin-recent-item">
                        <div>
                          <div style={{ fontWeight: '500', fontFamily: 'var(--font-mono)' }}>{r.roomId}</div>
                          <div className="text-muted" style={{ fontSize: 'var(--font-xs)' }}>By: {r.createdBy}</div>
                        </div>
                        <span className={`badge ${r.active ? 'badge-active' : 'badge-inactive'}`}>
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

        {/* User Management Tab Content */}
        {activeTab === 'users' && (
          <div className="admin-panel-card">
            <div className="admin-table-actions flex justify-between items-center" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="search-bar-container">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  className="input search-input" 
                  placeholder="Search users by name or email..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                        No users found matching "{userSearch}"
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ fontWeight: '600' }}>{u.name}</div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleToggleRole(u.id, u.role)} 
                              className="btn btn-secondary btn-sm"
                              disabled={u.email === user?.email}
                              title="Toggle Role"
                            >
                              <UserCheck size={12} />
                              <span>{u.role === 'ADMIN' ? 'Make User' : 'Make Admin'}</span>
                            </button>
                            <button 
                              onClick={() => openDeleteUserConfirm(u.id, u.name)} 
                              className="btn btn-danger btn-sm btn-icon"
                              disabled={u.email === user?.email}
                              title="Delete User"
                              style={{ width: '28px', height: '28px' }}
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

        {/* Meeting Rooms Tab Content */}
        {activeTab === 'rooms' && (
          <div className="admin-panel-card">
            <div className="admin-table-actions flex justify-between items-center" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="search-bar-container">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  className="input search-input" 
                  placeholder="Search by Room Code or Host email..." 
                  value={roomSearch}
                  onChange={(e) => setRoomSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Room Code</th>
                    <th>Room Name</th>
                    <th>Created By</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                        No meeting rooms found matching "{roomSearch}"
                      </td>
                    </tr>
                  ) : (
                    filteredRooms.map(r => (
                      <tr key={r.id || r.roomId}>
                        <td>
                          <code style={{ fontSize: 'var(--font-sm)', color: 'var(--accent-text)' }}>{r.roomId}</code>
                        </td>
                        <td>{r.roomName || 'Meeting'}</td>
                        <td>{r.createdBy}</td>
                        <td>
                          <span className={`badge ${r.active ? 'badge-active' : 'badge-inactive'}`}>
                            {r.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button 
                            onClick={() => openDeleteRoomConfirm(r.roomId)} 
                            className="btn btn-danger btn-sm"
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
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: '700', marginBottom: 'var(--space-2)' }}>Delete User Account</h3>
            <p className="text-muted" style={{ fontSize: 'var(--font-sm)', marginBottom: 'var(--space-6)' }}>
              Are you sure you want to delete user <strong>{deleteUserModal.userName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={closeDeleteUserConfirm} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteUser} className="btn btn-danger">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Room Modal */}
      {deleteRoomModal.show && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: '700', marginBottom: 'var(--space-2)' }}>Terminate Meeting Room</h3>
            <p className="text-muted" style={{ fontSize: 'var(--font-sm)', marginBottom: 'var(--space-6)' }}>
              Are you sure you want to end and delete room <strong>{deleteRoomModal.roomId}</strong>? All participants will lose connection to the room.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={closeDeleteRoomConfirm} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteRoom} className="btn btn-danger">Confirm Terminate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
