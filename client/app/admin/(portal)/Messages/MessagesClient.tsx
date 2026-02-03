'use client';

import { useState } from 'react';
import { MessageSquare, Phone, User, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

type MessageDTO = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  replied: boolean;
};

const ITEMS_PER_PAGE = 5;

export default function MessagesClient({ messages }: { messages: MessageDTO[] }) {
  const [filter, setFilter] = useState<'replied' | 'unreplied'>('unreplied');
  const [page, setPage] = useState(1);
  const [messagesState, setMessagesState] = useState<MessageDTO[]>(messages);

  const filteredMessages = messagesState.filter((msg) => 
    filter === "unreplied" ? !msg.replied : msg.replied
  );

  const markAsReplied = (id: string) => {
    setMessagesState((prev) =>
      prev.map((msg) =>
        msg.id === id ? {...msg, replied:true} :msg
      )
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setFilter('unreplied')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            filter === 'unreplied'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Unreplied
        </button>
        <button
          onClick={() => setFilter('replied')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            filter === 'replied'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Replied
        </button>
      </div>

      {/* Messages list */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-500">No messages found</h3>
            <p className="text-slate-400 text-sm">Nothing in this category.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl border border-indigo-100">
                  {msg.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {msg.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {format(new Date(msg.createdAt), 'PPP p')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {msg.email}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 leading-relaxed">
                    {msg.message}
                  </div>

                  {/*Mark as replied */}
                  {!msg.replied && (
                    <button
                      onClick={() => markAsReplied(msg.id)}
                      className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark as replied
                    </button>
                  )}

                  {/*Replied badge*/}
                  {msg.replied && (
                    <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                      Replied
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
