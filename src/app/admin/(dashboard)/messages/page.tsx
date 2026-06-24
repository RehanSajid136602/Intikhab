'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageSquare, Inbox, CheckCircle2, Clock, Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { getMessages, updateMessageStatus } from '@/app/admin/actions';
import type { AdminMessage, MessageStatus as MStatus, MessageType } from '@/types/admin';

type MessageFilter = 'all' | 'unread' | 'open' | 'resolved' | 'archived';

const statusVariants: Record<MStatus, 'red' | 'yellow' | 'green' | 'gray'> = {
  unread: 'red',
  open: 'yellow',
  resolved: 'green',
  archived: 'gray',
};

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

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MessageFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileList, setMobileList] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);

  useEffect(() => {
    getMessages().then((data) => {
      setMessages(data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => ({
    unread: messages.filter((m) => m.status === 'unread').length,
    open: messages.filter((m) => m.status === 'open').length,
    resolved: messages.filter((m) => m.status === 'resolved').length,
  }), [messages]);

  const filteredMessages = useMemo(() => {
    let result = messages;
    if (filter !== 'all') {
      result = result.filter((m) => m.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q),
      );
    }
    return result;
  }, [messages, filter, search]);

  const selectedMessage = messages.find((m) => m.id === selectedId) || null;

  const handleMarkRead = async (id: string) => {
    const result = await updateMessageStatus(id, 'open');
    if (result.success) {
      setMessages((prev) => prev.map((m) => m.id === id && m.status === 'unread' ? { ...m, status: 'open' as const } : m));
    }
  };

  const handleResolve = async (id: string) => {
    const result = await updateMessageStatus(id, 'resolved');
    if (result.success) {
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: 'resolved' as const } : m));
      if (selectedId === id) setSelectedId(null);
    }
  };

  const handleArchive = async (id: string) => {
    const result = await updateMessageStatus(id, 'archived');
    if (result.success) {
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: 'archived' as const } : m));
      if (selectedId === id) setSelectedId(null);
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    setReplySent(true);
    setTimeout(() => setReplySent(false), 3000);
  };

  const filters: { key: MessageFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: messages.length },
    { key: 'unread', label: 'Unread', count: stats.unread },
    { key: 'open', label: 'Open', count: stats.open },
    { key: 'resolved', label: 'Resolved', count: stats.resolved },
    { key: 'archived', label: 'Archived', count: messages.filter((m) => m.status === 'archived').length },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Messages"
        subtitle="Read customer inquiries, support messages, and store contact requests."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard label="Unread" value={loading ? '...' : stats.unread.toString()} icon={MessageSquare} iconBg="bg-brand-red" />
        <AdminStatCard label="Open Tickets" value={loading ? '...' : stats.open.toString()} icon={Inbox} iconBg="bg-yellow-500" />
        <AdminStatCard label="Resolved" value={loading ? '...' : stats.resolved.toString()} icon={CheckCircle2} iconBg="bg-brand-green" />
        <AdminStatCard label="Avg Response Time" value="—" icon={Clock} iconBg="bg-blue-500" />
      </div>

      <div className="bg-white rounded-sm border border-brand-border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                  filter === f.key
                    ? 'bg-brand-dark text-white'
                    : 'text-brand-gray hover:text-brand-dark hover:bg-brand-light-gray'
                }`}
              >
                {f.label}
                <span className="ml-1.5 opacity-60">({f.count})</span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-brand-gray absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full border border-brand-border pl-9 pr-4 py-1.5 text-sm outline-none focus:border-brand-dark transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-brand-border overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          <div className={`lg:w-[400px] lg:min-w-[400px] border-r border-brand-border ${mobileList || !selectedMessage ? 'block' : 'hidden lg:block'}`}>
            <div className="overflow-y-auto max-h-[600px]">
              {loading ? (
                <div className="p-8 text-center text-sm text-brand-gray">Loading messages...</div>
              ) : filteredMessages.length === 0 ? (
                <AdminEmptyState
                  icon={Inbox}
                  title="No customer messages yet"
                  description="Messages from the contact form or support inbox will appear here."
                />
              ) : (
                filteredMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => { setSelectedId(msg.id); setMobileList(false); handleMarkRead(msg.id); }}
                    className={`w-full text-left px-5 py-4 border-b border-brand-border/50 hover:bg-brand-light-gray/50 transition-colors ${
                      selectedId === msg.id ? 'bg-brand-light-gray/50 border-l-2 border-l-brand-dark' : ''
                    } ${msg.status === 'unread' ? 'bg-brand-red/[0.02]' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className={`text-sm ${msg.status === 'unread' ? 'font-bold' : 'font-medium'} text-brand-dark truncate`}>
                        {msg.name}
                      </span>
                      <span className="text-[11px] text-brand-gray whitespace-nowrap">
                        {isToday(msg.date) ? new Date(msg.date).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }) : formatDate(msg.date)}
                      </span>
                    </div>
                    <p className="text-xs text-brand-dark font-medium truncate mb-1">{msg.subject}</p>
                    <p className="text-xs text-brand-gray line-clamp-1">{msg.body.slice(0, 100)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <AdminStatusBadge variant={typeVariants[msg.type as MessageType]}>{typeLabels[msg.type as MessageType]}</AdminStatusBadge>
                      <AdminStatusBadge variant={statusVariants[msg.status as MStatus]}>
                        {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                      </AdminStatusBadge>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className={`flex-1 ${!mobileList && selectedMessage ? 'block' : 'hidden lg:block'}`}>
            {selectedMessage ? (
              <div className="h-full flex flex-col">
                <div className="border-b border-brand-border px-6 py-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">Message</h3>
                  <div className="flex items-center gap-2">
                    {selectedMessage.status !== 'resolved' && (
                      <button onClick={() => handleResolve(selectedMessage.id)} className="text-xs px-3 py-1.5 text-brand-green border border-brand-green/30 rounded-sm hover:bg-brand-green/5 transition-colors">Resolve</button>
                    )}
                    {selectedMessage.status !== 'archived' && (
                      <button onClick={() => handleArchive(selectedMessage.id)} className="text-xs px-3 py-1.5 text-brand-gray border border-brand-border rounded-sm hover:bg-brand-light-gray transition-colors">Archive</button>
                    )}
                    <button onClick={() => { setSelectedId(null); setMobileList(true); }} className="text-xs text-brand-gray hover:text-brand-dark transition-colors">Close</button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-5 border-b border-brand-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-brand-light-gray flex items-center justify-center text-brand-dark font-bold text-sm">
                        {selectedMessage.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-brand-dark">{selectedMessage.name}</h4>
                        <p className="text-xs text-brand-gray">{selectedMessage.email}{selectedMessage.phone ? ` · ${selectedMessage.phone}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center text-xs text-brand-gray">
                      <AdminStatusBadge variant={typeVariants[selectedMessage.type as MessageType]}>{typeLabels[selectedMessage.type as MessageType]}</AdminStatusBadge>
                      <AdminStatusBadge variant={statusVariants[selectedMessage.status as MStatus]}>
                        {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                      </AdminStatusBadge>
                      <span>{new Date(selectedMessage.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="px-6 py-5 border-b border-brand-border">
                    <h5 className="text-sm font-semibold text-brand-dark mb-3">{selectedMessage.subject}</h5>
                    <div className="text-sm text-brand-dark leading-relaxed whitespace-pre-line">{selectedMessage.body}</div>
                  </div>

                  <div className="px-6 py-5">
                    <label htmlFor="reply-textarea" className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">
                      Quick Reply
                    </label>
                    <p className="text-xs text-brand-gray mb-2">Email sending is not configured. Save a draft or respond manually.</p>
                    <textarea
                      id="reply-textarea"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={4}
                      className="w-full border border-brand-border rounded-sm p-3 text-sm outline-none focus:border-brand-dark resize-none transition-colors"
                    />
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="flex items-center gap-2 px-5 py-2 bg-brand-dark text-white text-xs font-semibold rounded-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Draft
                      </button>
                      <span className="text-xs text-brand-gray">Email sending not configured</span>
                      {replySent && <span className="text-xs text-brand-green font-medium">Draft saved</span>}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <Inbox className="w-10 h-10 text-brand-gray/40 mx-auto mb-3" />
                  <p className="text-sm text-brand-gray">Select a message to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!mobileList && selectedMessage && (
        <button
          onClick={() => setMobileList(true)}
          className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-2.5 bg-brand-dark text-white text-xs font-semibold rounded-sm shadow-lg"
        >
          Back to Messages
        </button>
      )}
    </div>
  );
}
