import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import { Search, Mail, Bell, User as UserIcon, Sun, Moon, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toggleMobileSidebar } = useSidebar();

  if (!user) return null;

  return (
    <header className="bg-academic-50 dark:bg-[#0C1A12] px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 border-b border-academic-200/60 dark:border-academic-800/50 transition-colors duration-200 gap-3">
      {/* Mobile Hamburger Menu Toggle Button & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          title="Toggle Navigation Menu"
          className="p-2 text-academic-700 dark:text-academic-300 hover:text-academic-900 dark:hover:text-white hover:bg-academic-100 dark:hover:bg-academic-800/60 rounded-xl transition-all md:hidden shrink-0"
        >
          <Menu size={22} />
        </button>

        {/* Search Input Bar */}
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white dark:bg-[#142620] border border-academic-200/60 dark:border-academic-800 text-[#1A2E22] dark:text-zinc-100 placeholder-[#4A6350] dark:placeholder-zinc-500 rounded-xl pl-4 pr-10 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-academic-500 dark:focus:border-academic-500 focus:ring-2 focus:ring-academic-500/20 transition-all"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A6350]" size={18} />
        </div>
      </div>

      {/* Header Actions: Theme Toggle, Mail, Notifications, Profile Badge */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Dark / Light Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          className="p-2 sm:p-2.5 text-academic-700 dark:text-academic-300 hover:text-academic-900 dark:hover:text-white hover:bg-academic-100 dark:hover:bg-academic-800/60 rounded-xl transition-all flex items-center gap-1.5"
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-academic-700" />
          ) : (
            <Sun size={18} className="text-gold-400" />
          )}
        </button>

        <button
          type="button"
          title="Messages"
          className="p-2 sm:p-2.5 text-academic-700 dark:text-academic-300 hover:text-academic-900 dark:hover:text-white hover:bg-academic-100 dark:hover:bg-academic-800/60 rounded-xl transition-all hidden sm:block"
        >
          <Mail size={18} />
        </button>

        <button
          type="button"
          title="Notifications"
          className="p-2 sm:p-2.5 text-academic-700 dark:text-academic-300 hover:text-academic-900 dark:hover:text-white hover:bg-academic-100 dark:hover:bg-academic-800/60 rounded-xl transition-all relative"
        >
          <Bell size={18} />
          <span className="w-2 h-2 rounded-full bg-accent-orange absolute top-2 right-2" />
        </button>

        {/* User Profile Badge */}
        <div className="bg-white dark:bg-[#142620] border border-academic-200/60 dark:border-academic-800 rounded-2xl px-2.5 sm:px-3 py-1.5 flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-academic-700 dark:bg-gold-400 text-white dark:text-academic-950 flex items-center justify-center font-bold shadow-sm">
            <UserIcon size={15} />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-extrabold text-[#1A2E22] dark:text-zinc-100 leading-tight">{user.name}</p>
            <p className="text-[10px] text-[#4A6350] dark:text-academic-400 leading-tight">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
