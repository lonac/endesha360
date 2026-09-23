
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { User, MapPin, Phone, CloudUpload, Mail, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FFFBE6] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#D5ED9F] bg-white shadow-[0_22px_55px_rgba(0,113,45,0.14)]">
        <section className="relative overflow-hidden bg-[#00712D] px-6 py-8 text-white sm:px-10 lg:px-12">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[28px] border-white/10" />
          <div className="absolute -bottom-24 left-1/3 h-44 w-44 rounded-full bg-[#FF9100]/15" />
          <div className="relative z-10 flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white/20 bg-[#D5ED9F]/20 shadow-lg">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-[#D5ED9F]" />
                )}
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#D5ED9F]">Student profile</p>
                <h1 className="text-2xl font-bold sm:text-3xl">{user.firstName} {user.lastName}</h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-white/75"><Mail size={15} /> {user.email}</p>
              </div>
            </div>
            <Button onClick={() => setIsEditOpen(true)} className="self-start bg-white text-[#00712D] shadow-md hover:bg-[#F6FDDC] md:self-center">
              Edit profile
            </Button>
          </div>
          <div className="relative z-10 mt-8 grid max-w-xl grid-cols-1 gap-3 text-sm text-white/85 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2"><MapPin size={16} className="text-[#D5ED9F]" /> {user.location || 'No location set'}</div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2"><Phone size={16} className="text-[#D5ED9F]" /> {user.phoneNumber || 'No phone number'}</div>
          </div>
        </section>

        <section className="p-6 sm:p-8 lg:p-10">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF9100]">Account details</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Personal information</h2>
              <p className="mt-1 text-sm text-slate-500">Keep your details up to date for a better experience.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#00712D]"><ShieldCheck size={17} /> Profile is protected</div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-[#D5ED9F] bg-[#FBFEEB] p-4">
              <Input label="First name" value={form.firstName} onChange={handleChange('firstName')} className="border-[#D5ED9F] bg-white" />
            </div>
            <div className="rounded-2xl border border-[#D5ED9F] bg-[#FBFEEB] p-4">
              <Input label="Last name" value={form.lastName} onChange={handleChange('lastName')} className="border-[#D5ED9F] bg-white" />
            </div>
            <div className="rounded-2xl border border-[#D5ED9F] bg-[#FBFEEB] p-4">
              <Input label="Location" value={user.location || ''} readOnly placeholder="Add your location" className="border-[#D5ED9F] bg-white" />
            </div>
            <div className="rounded-2xl border border-[#D5ED9F] bg-[#FBFEEB] p-4">
              <Input label="Phone number" value={user.phoneNumber || ''} readOnly placeholder="Add your phone number" className="border-[#D5ED9F] bg-white" />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#D5ED9F] bg-[#FBFEEB] p-4">
            <p className="mb-3 text-sm font-medium text-[#00712D]">Profile picture</p>
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#B6E388] bg-white px-5 py-8 text-center transition-colors hover:bg-[#F6FDDC]">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D5ED9F]/60 text-[#00712D]"><CloudUpload size={24} /></div>
              <p className="text-sm font-semibold text-[#00712D]">Click to upload or drag and drop</p>
              <p className="mt-1 text-xs text-slate-400">PNG or JPG, maximum resolution 200 x 200px</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto">Back to dashboard</Button>
            <Button onClick={() => setIsEditOpen(true)} className="w-full sm:w-auto">Update profile</Button>
          </div>
        </section>

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
