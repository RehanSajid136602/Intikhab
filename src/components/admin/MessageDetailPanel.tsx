'use client';

import { useState } from 'react';
import { Mail, Calendar, Send } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import type { AdminMessage, MessageType, MessageStatus } from '@/types/admin';

interface MessageDetailPanelProps {
  message: AdminMessage;
  onClose: () => void;
}

const typeLabels: Record<MessageType, string> = {
  'order-support': 'Order Support',
  'size-question': 'Size Question',
  delivery: 'Delivery',
  return: 'Return Request',
  general: 'General',
};

const typeVariants: Record<MessageType, 'blue' | 'yellow' | 'green' | 'red' | 'purple'> = {
  'order-support': 'blue',
  'size-question': 'yellow',
  delivery: 'green',
  return: 'red',
  general: 'purple',
};

const statusVariants: Record<MessageStatus, 'red' | 'yellow' | 'green' | 'gray'> = {
  unread: 'red',
  open: 'yellow',
  resolved: 'green',
  archived: 'gray',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function MessageDetailPanel({ message, onClose }: MessageDetailPanelProps) {
  const [reply, setReply] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!reply.trim()) return;
    setSent(true);
    setReply('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-brand-border px-6 py-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">Message</h3>
        <button onClick={onClose} className="text-xs text-brand-gray hover:text-brand-dark transition-colors">
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 border-b border-brand-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-brand-light-gray flex items-center justify-center text-brand-dark font-bold text-sm">
              {message.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-dark">{message.name}</h4>
              <div className="flex items-center gap-2 text-xs text-brand-gray">
                <Mail className="w-3 h-3" />
                <a href={`mailto:${message.email}`} className="hover:text-brand-red transition-colors">{message.email}</a>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center text-xs text-brand-gray">
            <AdminStatusBadge variant={typeVariants[message.type as MessageType]}>{typeLabels[message.type as MessageType]}</AdminStatusBadge>
            <AdminStatusBadge variant={statusVariants[message.status as MessageStatus]}>
              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
            </AdminStatusBadge>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(message.date)}
            </span>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-brand-border">
          <h5 className="text-sm font-semibold text-brand-dark mb-3">{message.subject}</h5>
          <div className="text-sm text-brand-dark leading-relaxed whitespace-pre-line">
            {message.body}
          </div>
        </div>

        <div className="px-6 py-5">
          <label htmlFor="reply-textarea" className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">
            Quick Reply
          </label>
          <p className="text-xs text-brand-gray mb-2">Email sending is not configured. Save a draft or respond manually.</p>
          <textarea
            id="reply-textarea"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
            rows={4}
            className="w-full border border-brand-border rounded-sm p-3 text-sm outline-none focus:border-brand-dark resize-none transition-colors"
          />
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleSend}
              disabled={!reply.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-brand-dark text-white text-xs font-semibold rounded-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              Save Draft
            </button>
            <span className="text-xs text-brand-gray">Email sending not configured</span>
            {sent && <span className="text-xs text-brand-green font-medium">Draft saved</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export { MessageDetailPanel };
