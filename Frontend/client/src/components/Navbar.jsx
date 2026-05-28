import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <span>MeetN</span>
          <span className="logo-dot"></span>
          <span>w</span>
        </Link>

        {!isAuthenticated && (
          <div className="navbar-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <Link to="/login">Login</Link>
          </div>
        )}

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="btn btn-secondary btn-sm">
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
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary">
                Start Meeting
              </Link>
              <button 
                className="navbar-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
