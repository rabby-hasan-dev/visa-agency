import React, { useState, useEffect, useRef } from "react";
import {
  useGetApplicationMessagesQuery,
  useAddMessageMutation,
  useMarkMessagesAsReadMutation,
} from "@/redux/api/messageApi";
import { useAppSelector } from "@/redux/hooks";
import { TUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { Send, User, ShieldCheck, Clock, MessageSquare, Loader2 } from "lucide-react";

export const MessagesTab = ({ applicationId }: { applicationId: string }) => {
  const { data, isLoading } = useGetApplicationMessagesQuery(applicationId);
  const [addMessage, { isLoading: isSending }] = useAddMessageMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();
  const [newMessage, setNewMessage] = useState("");
  const user = useAppSelector((state) => state.auth.user) as TUser | null;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (applicationId) {
      markAsRead(applicationId)
        .unwrap()
        .catch(() => {});
    }
  }, [applicationId, markAsRead]);

  useEffect(() => {
    if (data?.data) {
      scrollToBottom();
    }
  }, [data]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await addMessage({
        applicationId,
        text: newMessage,
        type:
          user?.role === "admin" || user?.role === "superAdmin"
            ? "RFI"
            : "GENERAL",
      }).unwrap();
      setNewMessage("");
      toast.success("Message sent");
      // Immediate scroll after sending
      setTimeout(scrollToBottom, 100);
    } catch (err: unknown) {
      toast.error("Failed to send message");
      console.error(err);
    }
  };

  const messages = data?.data || [];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#2150a0] font-bold text-base flex items-center gap-1.5 uppercase tracking-tight">
          <MessageSquare size={18} />
          Messages & Correspondence
        </h2>
      </div>

      <div className="text-[11px] text-gray-600 mb-5 bg-blue-50/50 p-3 border-l-4 border-blue-400">
        <p className="m-0 leading-relaxed font-medium">
          Monitor your application correspondence below. You can directly
          communicate with officers regarding requirements or missing documents.
          Correspondence history is kept for the duration of the application.
        </p>
      </div>

      <div
        className="flex-1 overflow-y-auto mb-5 border border-gray-200 rounded-sm bg-white shadow-inner flex flex-col min-h-[450px] max-h-[600px]"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-gray-400">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-xs font-bold uppercase tracking-widest">Retrieving Secure Messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-gray-400 opacity-60">
            <MessageSquare size={48} strokeWidth={1} className="mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">No Secure Correspondence Found</p>
          </div>
        ) : (
          <div className="p-4 space-y-4 flex-1">
            {messages.map(
              (msg: {
                _id: string;
                senderId: { _id: string; name: string; role: string };
                type: string;
                createdAt: string;
                text: string;
              }) => {
                const isAdmin = msg.senderId?.role === "admin" || msg.senderId?.role === "superAdmin";
                const isMe = msg.senderId?._id === user?.userId;

                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-sm message-bubble transition-all ${
                        isMe 
                          ? 'bg-[#e6f2ff] border border-[#cce5ff]' 
                          : isAdmin 
                            ? 'bg-[#fff4e5] border border-[#ffe0b3]' 
                            : 'bg-white border border-gray-200'
                      } shadow-sm`}
                    >
                      {/* Message Header */}
                      <div className={`px-3 py-1.5 flex items-center justify-between gap-4 border-b ${
                        isMe ? 'border-[#cce5ff]' : isAdmin ? 'border-[#ffe0b3]' : 'border-gray-100'
                      }`}>
                        <div className="flex items-center gap-2">
                          {isAdmin ? (
                            <ShieldCheck size={12} className="text-[#b36b00]" />
                          ) : (
                            <User size={12} className="text-gray-400" />
                          )}
                          <span className={`text-[10px] font-bold uppercase tracking-tight ${isAdmin ? 'text-[#b36b00]' : 'text-gray-600'}`}>
                            {msg.senderId?.name} 
                            <span className="ml-1 opacity-70 font-semibold">({msg.senderId?.role})</span>
                          </span>
                        </div>
                        {msg.type === 'RFI' && (
                           <span className="text-[9px] bg-[#cc3300] text-white px-1.5 py-0.5 rounded-sm font-bold animate-pulse">OFFICIAL REQUEST</span>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="px-3 py-2.5 text-[12px] text-gray-800 leading-normal whitespace-pre-wrap font-medium">
                        {msg.text}
                      </div>

                      {/* Message Footer */}
                      <div className="px-3 py-1 flex items-center justify-end border-t border-transparent-white">
                        <span className="text-[9px] text-gray-400 font-semibold flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(msg.createdAt).toLocaleString('en-GB', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form 
        onSubmit={handleSend} 
        className="flex flex-col gap-3 bg-gray-50 border border-gray-200 p-4 rounded-sm shadow-inner"
      >
        <div className="relative">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your secure message here..."
            className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0] min-h-[80px] shadow-sm transition-all resize-none font-medium text-gray-700"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e as unknown as React.FormEvent);
              }
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-gray-500 italic font-medium">
            <span className="font-bold text-[#cc3300]">Warning:</span> All communication is logged and may be used for visa assessment purposes.
          </p>
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="bg-[#2150a0] hover:bg-[#1a408a] text-white py-2 px-6 rounded-sm text-[11px] font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:grayscale shadow-md active:scale-95 uppercase tracking-wide"
          >
            {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {isSending ? "Processing..." : "Submit Message"}
          </button>
        </div>
      </form>
    </div>
  );
};
