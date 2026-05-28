import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    const result = await login('demo@meetnow.com', 'demo1234');
    setIsLoading(false);

    if (result.success) {
      toast.success('Logged in with Demo Account!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated Background Orbs */}
      <div className="orb orb-indigo"></div>
      <div className="orb orb-cyan"></div>

      <div className="auth-card">
        <Link to="/" className="navbar-logo" style={{ justifyContent: 'center', marginBottom: '32px' }}>
          <span>MeetN</span>
          <span className="logo-dot"></span>
          <span>w</span>
        </Link>

        <h2 className="auth-title text-center">Welcome Back</h2>
        <p className="auth-subtitle text-center">Sign in to start and join secure video meetings</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '44px' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                id="password"
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '44px' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full btn-lg" 
            style={{ marginTop: '8px' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          margin: '24px 0',
          color: 'var(--text-muted)',
          fontSize: '13px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          <span>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
        </div>

        <button 
          onClick={handleDemoLogin} 
          className="btn btn-secondary w-full"
          disabled={isLoading}
        >
          <span>Use Demo Account</span>
        </button>

        <div className="auth-footer">
          <span>{"Don't have an account? "}</span>
          <Link to="/signup">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
