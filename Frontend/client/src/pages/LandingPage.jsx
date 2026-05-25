import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Video, Shield, Monitor, Zap, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <section className="landing-hero page-wrapper">
        <div className="hero-badge">
          <Zap size={14} />
          <span>Next-Generation Video Conferencing</span>
        </div>

        <h1 className="hero-title">
          Connect instantly.<br />
          Collaborate <span className="accent">seamlessly.</span>
        </h1>

        <p className="hero-description">
          MeetNow provides ultra-low latency audio, HD video, and secure screen sharing powered by Agora, wrapped in a beautiful, security-first architecture.
        </p>

        <div className="hero-actions">
          <Link to="/signup" className="btn btn-primary btn-lg">
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            <span>Try Demo Account</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2 style={{ fontSize: 'var(--font-2xl)', marginBottom: 'var(--space-3)' }}>
              Built for Modern Teams
            </h2>
            <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Designed to make virtual collaboration feel as natural and polished as meeting in person.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon">
                <Video size={24} />
              </div>
              <h3 className="feature-title">Agora HD Video</h3>
              <p className="feature-description">
                Crystal clear, high-definition real-time WebRTC audio and video streaming with automatic bandwidth adaptation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'var(--success-soft)', color: 'var(--success)' }}>
                <Shield size={24} />
              </div>
              <h3 className="feature-title">Spring Boot Security</h3>
              <p className="feature-description">
                Security-first backend with stateless JWT authorization, password hashing, and MongoDB document protection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon">
                <Monitor size={24} />
              </div>
              <h3 className="feature-title">Screen Sharing</h3>
              <p className="feature-description">
                Share your entire screen or individual application windows in high-quality directly to the meeting room.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={24} />
              </div>
              <h3 className="feature-title">Interactive Panels</h3>
              <p className="feature-description">
                In-call text chat, active participant lists, and meeting status overlays designed with smooth, responsive micro-animations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
