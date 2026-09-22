import React from 'react';
import './ProfileDashboard.css';

const StatCard = ({ title, value, subtitle }) => (
  <div className="pd-stat-card">
    <div className="pd-stat-title">{title}</div>
    <div className="pd-stat-value">{value}</div>
    {subtitle && <div className="pd-stat-sub">{subtitle}</div>}
  </div>
);

export default function ProfileDashboard() {
  return (
    <div className="pd-page container">
      <h1 className="pd-heading">Profile Dashboard</h1>
      <p className="pd-subheading">Manage your profile, view stats, and track your activity</p>

      <section className="pd-card pd-profile-top">
        <div className="pd-left">
          <div className="pd-avatar">SA</div>
        </div>
        <div className="pd-center">
          <div className="pd-name-row">
            <h2 className="pd-name">Sarah Anderson</h2>
            <span className="pd-badge">Verified</span>
          </div>
          <div className="pd-role">Senior Product Designer</div>
          <div className="pd-contact">
            <div className="pd-contact-line">✉️ sarah.anderson@example.com</div>
            <div className="pd-contact-line">📍 San Francisco, CA</div>
          </div>
        </div>
        <div className="pd-right">
          <div className="pd-phone">📞 +1 (555) 123-4567</div>
        </div>
      </section>

      <section className="pd-stats-row">
        <StatCard title="Projects Completed" value="42" subtitle="+3 this month" />
        <StatCard title="Active Projects" value="8" subtitle="2 due this week" />
        <StatCard title="Hours Logged" value="1,247" subtitle="+12.5% from last month" />
      </section>

      <section className="pd-tabs">
        <button className="pd-tab active">Overview</button>
        <button className="pd-tab">Activity</button>
        <button className="pd-tab">Settings</button>
      </section>

      <section className="pd-card pd-profile-info">
        <div className="pd-info-header">
          <div>
            <h3>Profile Information</h3>
            <p className="pd-muted">Update your personal details and information</p>
          </div>
          <button className="pd-edit">Edit Profile</button>
        </div>

        <div className="pd-form-grid">
          <div className="pd-field">
            <label>Full Name</label>
            <input value="Sarah Anderson" readOnly />
          </div>
          <div className="pd-field">
            <label>Email</label>
            <input value="sarah.anderson@example.com" readOnly />
          </div>
          <div className="pd-field">
            <label>Phone</label>
            <input value="+1 (555) 123-4567" readOnly />
          </div>
          <div className="pd-field">
            <label>Location</label>
            <input value="San Francisco, CA" readOnly />
          </div>
        </div>
      </section>
    </div>
  );
}
