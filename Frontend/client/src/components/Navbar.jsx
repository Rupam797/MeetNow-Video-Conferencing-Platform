import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Video, LogOut, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={isAuthenticated ? (user?.role === 'ADMIN' ? "/admin" : "/dashboard") : "/"} className="navbar-logo">
          <div className="navbar-logo-icon">
            <Video size={18} />
          </div>
          <span>MeetNow</span>
        </Link>

        <div className="navbar-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="btn btn-secondary btn-sm" style={{ marginRight: '4px' }}>
                  Admin Panel
                </Link>
              )}
              <div className="navbar-user">
                <div className="navbar-avatar">
                  {getInitials(user?.name)}
                </div>
                <span>{user?.name || 'User'}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
