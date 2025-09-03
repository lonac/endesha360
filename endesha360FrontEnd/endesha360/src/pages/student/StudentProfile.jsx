
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
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBE6] p-4">
      <div className="bg-white border border-[#D5ED9F] p-6 md:p-12 rounded-3xl shadow-2xl max-w-3xl w-full relative">
        {/* Decorative gradient circle */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-br from-[#D5ED9F] to-[#FFFBE6] rounded-full opacity-30 blur-2xl z-0"></div>
        <div className="flex flex-col items-center mb-10 relative z-10">
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D5ED9F] to-[#FFFBE6] flex items-center justify-center overflow-hidden border-4 border-[#FFFBE6] shadow-md mb-2">
              {/* Avatar or fallback icon, now with a subtle background and larger size */}
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-[#00712D] bg-[#F6FDDC] rounded-full p-3" />
              )}
            </div>
            <div className="font-semibold text-2xl text-gray-800 text-center">{user.firstName} {user.lastName}</div>
            <div className="text-gray-500 text-sm text-center">{user.email}</div>
            <Button className="mt-2 bg-[#FF9100] hover:bg-[#e6820e] px-8 py-2 rounded-lg shadow text-white font-semibold transition-all duration-150" size="sm">Edit</Button>
          </div>
          <div className="mt-6 text-center w-full">
            <h2 className="text-2xl font-bold text-[#00712D] mb-1 tracking-tight">Welcome, {user.firstName || 'Student'}</h2>
            <div className="text-gray-400 text-sm">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 relative z-10">
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">Full Name</label>
            <input type="text" value={`${user.firstName || ''} ${user.lastName || ''}`.trim()} readOnly className="w-full bg-[#F6FDDC] rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm" />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">Nick Name</label>
            <input type="text" value={user.nickName || ''} readOnly className="w-full bg-[#F6FDDC] rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm" />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">Gender</label>
            <input type="text" value={user.gender || ''} readOnly className="w-full bg-[#F6FDDC] rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm" />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">Country</label>
            <input type="text" value={user.country || ''} readOnly className="w-full bg-[#F6FDDC] rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm" />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">Language</label>
            <input type="text" value={user.language || ''} readOnly className="w-full bg-[#F6FDDC] rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm" />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">Time Zone</label>
            <input type="text" value={user.timeZone || ''} readOnly className="w-full bg-[#F6FDDC] rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm" />
          </div>
        </div>
  <div className="mb-10 relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <label className="block text-gray-500 text-xs mb-1 font-semibold">My email Address</label>
            <div className="flex items-center gap-2">
              <div className="text-gray-700 font-medium text-base">{user.email}</div>
              <span className="text-gray-400 text-xs">1 month ago</span>
            </div>
          </div>
          <Button className="bg-[#D5ED9F] text-[#00712D] hover:bg-[#b6e388] px-4 py-1 rounded-lg text-xs font-semibold shadow whitespace-nowrap">+ Add Email Address</Button>
        </div>
        <Button onClick={() => navigate(-1)} className="w-full bg-[#FF9100] hover:bg-[#e6820e] py-3 rounded-xl text-lg font-semibold shadow transition-all duration-150">Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default StudentProfile;
