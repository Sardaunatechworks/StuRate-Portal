import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Search, Mail, Bell, User as UserIcon, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  return (
    <header className="bg-[#f3f4f6] dark:bg-zinc-950 px-6 py-4 flex items-center justify-between sticky top-0 z-30 border-b border-zinc-200/60 dark:border-zinc-800 transition-colors duration-200">
      {/* Search Input Bar */}
      <div className="w-full max-w-md relative">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-zinc-200/60 dark:bg-zinc-900 border border-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-500 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-300 dark:focus:border-zinc-700 transition-all"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
      </div>

      {/* Header Actions: Theme Toggle, Mail, Notifications, Profile Badge */}
      <div className="flex items-center gap-3">
        {/* Dark / Light Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          className="p-2.5 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-800 rounded-xl transition-all flex items-center gap-1.5"
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-zinc-700" />
          ) : (
            <Sun size={18} className="text-amber-400" />
          )}
        </button>

        <button
          type="button"
          title="Messages"
          className="p-2.5 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-800 rounded-xl transition-all"
        >
          <Mail size={18} />
        </button>

        <button
          type="button"
          title="Notifications"
          className="p-2.5 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-800 rounded-xl transition-all relative"
        >
          <Bell size={18} />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2" />
        </button>

        {/* User Profile Badge */}
        <div className="bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800 rounded-2xl px-3 py-1.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold shadow-sm">
            <UserIcon size={16} />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight">{user.name}</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
