import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { MessageSquare, ShieldCheck, Search } from 'lucide-react';

export const CommentsPage: React.FC = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    API.get('/lecturer/comments')
      .then(res => {
        setComments(res.data || []);
      })
      .catch(err => {
        console.error('Error fetching comments:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  const filtered = comments.filter(c =>
    (c.comment || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.courseCode || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Anonymous Student Feedback</h1>
          <p className="text-xs text-zinc-500 mt-1">Constructive qualitative feedback submitted during active evaluation sessions.</p>
        </div>

        <div className="px-3.5 py-2 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center gap-2 text-xs text-zinc-800 font-semibold">
          <ShieldCheck size={16} className="text-black" />
          <span>Student Identities Anonymized</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm flex items-center gap-3">
        <Search size={18} className="text-zinc-400" />
        <input
          type="text"
          placeholder="Filter feedback by course code or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-zinc-900 text-sm focus:outline-none w-full placeholder-zinc-400"
        />
      </div>

      {isLoading ? (
        <p className="text-xs text-zinc-500">Loading student comments...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-zinc-500 text-xs border border-zinc-200">
          No qualitative feedback submitted yet matching search filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200 font-mono font-bold text-xs">
                  {c.courseCode} - {c.courseTitle}
                </span>
                <span className="text-xs text-zinc-500 font-mono">{formatDate(c.createdAt)}</span>
              </div>
              <p className="text-sm text-zinc-800 leading-relaxed italic bg-zinc-50 p-4 rounded-xl border border-zinc-200/60">
                "{c.comment}"
              </p>
              <p className="text-[11px] text-zinc-500 text-right">{c.period}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

