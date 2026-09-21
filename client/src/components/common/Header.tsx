import React, { useEffect, useState } from 'react';
import { Menu, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { periodApi } from '../../services/api';
import { EvaluationPeriod } from '../../types';
import { Badge } from './Badge';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const [activePeriod, setActivePeriod] = useState<EvaluationPeriod | null>(null);

  useEffect(() => {
    let isMounted = true;
    periodApi
      .getActive()
      .then((p) => {
        if (isMounted) setActivePeriod(p);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: hamburger + portal branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800 hidden sm:inline">
            Student Rating Teachers' Effectiveness System
          </span>
          <span className="text-sm font-semibold text-slate-800 sm:hidden">
            SRTES Portal
          </span>
        </div>
      </div>

      {/* Right side: Period status badge + user pill */}
      <div className="flex items-center gap-3">
        {activePeriod ? (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Evaluation Period Open:</span>
            <span className="font-semibold">{activePeriod.academicSession}</span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-600 font-medium">
            <span>No Active Evaluation Period</span>
          </div>
        )}

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-800 leading-tight">
              {user?.name}
            </span>
            <span className="block text-[10px] text-slate-500 leading-tight">
              {user?.role} Portal
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
