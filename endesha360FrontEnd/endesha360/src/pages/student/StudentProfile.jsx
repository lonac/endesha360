
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { User, MapPin, Phone, CloudUpload } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    nickName: user?.nickName || '',
    gender: user?.gender || '',
    country: user?.country || '',
    language: user?.language || '',
    timeZone: user?.timeZone || '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        nickName: user.nickName || '',
        gender: user.gender || '',
        country: user.country || '',
        language: user.language || '',
        timeZone: user.timeZone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleSave = () => {
    try {
      const updated = { ...user, ...form };
      localStorage.setItem('user', JSON.stringify(updated));
      // Reload so AuthProvider picks updated localStorage user
      window.location.reload();
    } catch (err) {
      console.error('Save profile error', err);
      alert('Failed to save profile locally');
    }
  };

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
        {/* Header card (green) */}
        <div className="relative z-10 mb-6">
          <div className="bg-[#0b8140] text-white rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <div>
                <div className="font-semibold text-lg md:text-xl">{user.firstName} {user.lastName}</div>
                <div className="text-sm opacity-90 mt-1 flex items-center gap-2"><MapPin size={14} /> <span className="text-sm">{user.location || 'No location set'}</span></div>
                <div className="text-sm opacity-90 mt-1 flex items-center gap-2"><Phone size={14} /> <span className="text-sm">{user.phoneNumber || 'No phone'}</span></div>
              </div>
            </div>
            <div className="ml-auto">
              <Button onClick={() => setIsEditOpen(true)} className="bg-white text-[#0b8140] hover:bg-gray-100 px-4 py-2 rounded-md">Edit</Button>
            </div>
          </div>
        </div>

        {/* Personal Information section */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-800 font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">First Name</label>
              <Input value={form.firstName} onChange={handleChange('firstName')} className="bg-[#F6FDDC] border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Last Name</label>
              <Input value={form.lastName} onChange={handleChange('lastName')} className="bg-[#F6FDDC] border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Your Location</label>
              <Input value={user.location || ''} readOnly className="bg-[#F6FDDC] border-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Your phone number</label>
              <Input value={user.phoneNumber || ''} readOnly className="bg-[#F6FDDC] border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Profile Picture</label>
              <div className="border-2 border-dashed border-[#E6F6E0] rounded-md bg-[#F6FFF2] p-6 flex items-center justify-center flex-col text-center text-sm text-gray-500">
                <CloudUpload size={28} className="text-[#0b8140] mb-2" />
                <div className="text-xs text-[#0b8140] font-medium">Click to upload or drag & drop</div>
                <div className="text-xs text-gray-400">Max resolution 200×200px</div>
              </div>
            </div>
            <div className="md:col-span-3" />
          </div>
        </div>
        <Button onClick={() => navigate(-1)} className="w-full bg-[#FF9100] hover:bg-[#e6820e] py-3 rounded-xl text-lg font-semibold shadow transition-all duration-150">Back to Dashboard</Button>

        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile">
          <div className="space-y-3">
            <Input label="First name" value={form.firstName} onChange={handleChange('firstName')} />
            <Input label="Last name" value={form.lastName} onChange={handleChange('lastName')} />
            <Input label="Nick name" value={form.nickName} onChange={handleChange('nickName')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Gender" value={form.gender} onChange={handleChange('gender')} />
              <Input label="Country" value={form.country} onChange={handleChange('country')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Language" value={form.language} onChange={handleChange('language')} />
              <Input label="Time zone" value={form.timeZone} onChange={handleChange('timeZone')} />
            </div>
            <Input label="Email" value={form.email} onChange={handleChange('email')} />
            <div className="flex items-center justify-end gap-3 mt-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default StudentProfile;
