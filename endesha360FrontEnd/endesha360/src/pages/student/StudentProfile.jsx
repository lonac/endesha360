
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { User } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBE6]">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-bold text-[#00712D] mb-4">No user data found.</h2>
          <Button onClick={() => navigate('/login')} className="bg-[#FF9100] hover:bg-[#e6820e] mt-4">Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f8fafc] to-[#fffbe6] p-4">
      <div className="bg-white/90 border border-[#e0e7ff] p-8 md:p-14 rounded-3xl shadow-2xl max-w-3xl w-full relative">
        {/* Decorative gradient circle */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-br from-[#dbeafe] to-[#fffbe6] rounded-full opacity-30 blur-2xl z-0"></div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 relative z-10">
          <div>
            <h2 className="text-3xl font-bold text-[#00712D] mb-1 tracking-tight">Welcome, {user.firstName || 'Student'}</h2>
            <div className="text-gray-400 text-sm">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div className="flex items-center gap-6 mt-8 md:mt-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#dbeafe] to-[#fef9c3] flex items-center justify-center overflow-hidden border-4 border-[#fffbe6] shadow-md">
              {/* Avatar or fallback icon */}
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-[#00712D]" />
              )}
            </div>
            <div className="ml-2">
              <div className="font-semibold text-xl text-gray-800">{user.firstName} {user.lastName}</div>
              <div className="text-gray-500 text-sm">{user.email}</div>
            </div>
            <Button className="ml-4 bg-[#2563eb] hover:bg-[#1d4ed8] px-8 py-2 rounded-lg shadow text-white font-semibold transition-all duration-150" size="sm">Edit</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">Full Name</label>
            <input type="text" value={`${user.firstName || ''} ${user.lastName || ''}`.trim()} readOnly className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm" />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">Nick Name</label>
            <input type="text" value={user.nickName || ''} readOnly className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm" />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">Gender</label>
            <input type="text" value={user.gender || ''} readOnly className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm" />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">Country</label>
            <input type="text" value={user.country || ''} readOnly className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm" />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">Language</label>
            <input type="text" value={user.language || ''} readOnly className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm" />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">Time Zone</label>
            <input type="text" value={user.timeZone || ''} readOnly className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm" />
          </div>
        </div>
        <div className="mb-10 relative z-10">
          <label className="block text-gray-500 text-xs mb-1 font-semibold">My email Address</label>
          <div className="flex items-center gap-4">
            <div className="text-gray-700 font-medium text-base">{user.email}</div>
            <span className="text-gray-400 text-xs">1 month ago</span>
          </div>
          <Button className="mt-3 bg-[#e0e7ff] text-[#2563eb] hover:bg-[#c7d2fe] px-4 py-1 rounded-lg text-xs font-semibold shadow">+ Add Email Address</Button>
        </div>
        <Button onClick={() => navigate(-1)} className="w-full bg-[#FF9100] hover:bg-[#e6820e] py-3 rounded-xl text-lg font-semibold shadow transition-all duration-150">Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default StudentProfile;
