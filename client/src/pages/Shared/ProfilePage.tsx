import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Save, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Account Profile</h1>
        <p className="text-xs text-zinc-500 mt-1">Manage your user details and portal preferences.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200/60">
          <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-xl shadow-md">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-zinc-900">{name}</h3>
            <p className="text-xs text-zinc-500">{email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-900 border border-zinc-300 text-[10px] font-mono font-bold">
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full template-input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full template-input pl-10"
              />
            </div>
          </div>

          {saved && (
            <div className="p-3 bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 size={16} />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button type="submit" className="template-btn-black flex items-center gap-2">
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
