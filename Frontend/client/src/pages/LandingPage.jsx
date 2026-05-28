import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Video, Monitor, Zap, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="landing-hero">
        {/* Animated Background Orbs */}
        <div className="hero-orbs">
          <div className="orb orb-indigo"></div>
          <div className="orb orb-cyan"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Meet Without Limits.
          </h1>

          <p className="hero-description">
            Crystal-clear HD video, instant screen sharing, and secure meeting rooms. 
            Connect with anyone, anywhere — no downloads required.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">
              <span>Start Meeting</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              <span>Join a Meeting</span>
            </Link>
          </div>
        </div>

        {/* Mock Video Grid Visual */}
        <div className="hero-visual">
          <div className="mock-video-grid">
            <div className="mock-video-tile">
              <div className="mock-avatar">JD</div>
            </div>
            <div className="mock-video-tile">
              <div className="mock-avatar">MK</div>
            </div>
            <div className="mock-video-tile">
              <div className="mock-avatar">AR</div>
            </div>
            <div className="mock-video-tile">
              <div className="mock-avatar">TS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <div className="container">
          <div className="features-header">
            <h2>Built for Modern Teams</h2>
            <p>
              Everything you need for seamless video collaboration, 
              designed with security and simplicity in mind.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 - HD Video */}
            <div className="feature-card">
              <div className="feature-icon">
                <Video size={24} />
              </div>
              <h3 className="feature-title">HD Video</h3>
              <p className="feature-description">
                Crystal clear 1080p video for every call. Automatic bandwidth 
                adaptation ensures smooth streaming even on slower connections.
              </p>
            </div>

            {/* Feature 2 - Screen Share */}
            <div className="feature-card">
              <div className="feature-icon">
                <Monitor size={24} />
              </div>
              <h3 className="feature-title">Screen Share</h3>
              <p className="feature-description">
                Share your entire screen or individual application windows 
                with a single click. Perfect for presentations and demos.
              </p>
            </div>

            {/* Feature 3 - Instant Rooms */}
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={24} />
              </div>
              <h3 className="feature-title">Instant Rooms</h3>
              <p className="feature-description">
                No downloads required. Create a meeting room instantly and 
                share the link — guests can join directly from their browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>MeetNow — Premium video conferencing for modern teams.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
