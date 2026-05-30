import React from 'react';
import { Check, X, User } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';

const AdmissionRequestPanel = ({ admissionRequests = [], onResponded }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleRespond = async (requestId, action, name) => {
    try {
      await api.post('/api/meetings/admission/respond', { requestId, action });
      if (action === 'ACCEPT') {
        toast.success(`${name} has been admitted to the meeting.`);
      } else {
        toast.info(`${name}'s request was denied.`);
      }
      if (onResponded) onResponded(requestId);
    } catch (err) {
      console.error('Failed to respond to admission request:', err);
      toast.error('Failed to process request. Please try again.');
    }
  };

  if (!admissionRequests || admissionRequests.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
      {/* Header label */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-offwhite/40 font-[Outfit] px-1">
        Waiting to join ({admissionRequests.length})
      </div>

      {admissionRequests.map((req) => (
        <div
          key={req.requestId}
          className="flex items-center gap-3 px-4 py-3 bg-secondary/95 backdrop-blur-xl border border-border-primary/60 rounded-2xl shadow-2xl shadow-black/30 animate-[fade-in_0.3s_ease-out] min-w-[280px] max-w-[340px]"
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-offwhite text-sm font-bold font-[Outfit] shrink-0 border border-border-primary/50">
            {req.name ? getInitials(req.name) : <User size={18} />}
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white font-[Outfit] truncate leading-tight">
              {req.name || 'Someone'}
            </p>
            <p className="text-[10px] text-offwhite/50 font-[Outfit] truncate leading-tight">
              wants to join the meeting
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => handleRespond(req.requestId, 'ACCEPT', req.name)}
              className="w-9 h-9 rounded-full bg-brand text-secondary flex items-center justify-center hover:bg-brand-hover transition-all duration-150 active:scale-90 shadow-md shadow-brand/20 cursor-pointer"
              title="Accept"
            >
              <Check size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => handleRespond(req.requestId, 'DENY', req.name)}
              className="w-9 h-9 rounded-full bg-coral/20 text-coral flex items-center justify-center hover:bg-coral/30 transition-all duration-150 active:scale-90 cursor-pointer"
              title="Deny"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdmissionRequestPanel;
