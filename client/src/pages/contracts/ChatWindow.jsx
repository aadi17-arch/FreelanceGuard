import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, X, MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ChatWindow = ({ contractId, isOpen, onClose }) => {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  // Fetch chat history function
  const fetchChat = async () => {
    try {
      const response = await axios.get(`/chat/${contractId}`);
      setMessages(response.data);
    } catch (e) {
      console.error("Failed to load chat history", e);
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial Load & Setup REST Polling (3 seconds interval)
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetchChat();

    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, [contractId, isOpen]);

  // 2. Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    setSending(true);
    try {
      const response = await axios.post(`/chat/${contractId}`, { text });
      setMessages((prev) => [...prev, response.data]);
      setText("");
    } catch (e) {
      console.error("Failed to send message", e);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white border-l border-zinc-200 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">

      {/* Header */}
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-zinc-900 text-white rounded-md">
            <MessageSquare size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-wider text-zinc-900">Chat</h3>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400 hover:text-zinc-900 active:scale-95" aria-label="Close chat">
          <X size={20} />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 scrollbar-none pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Loader2 className="animate-spin text-zinc-900" size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Connecting...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
            <p className="text-xs font-bold text-zinc-900">No messages</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className={`p-3 max-w-[85%] rounded-xl text-xs font-medium leading-relaxed ${
                  isMe
                    ? "bg-zinc-900 text-white shadow-sm rounded-tr-none"
                    : "bg-white border border-zinc-200 text-zinc-900 shadow-sm rounded-tl-none"
                }`}>
                  <p className="break-words whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[8px] font-black uppercase text-zinc-400 tracking-wider mt-1.5 px-1.5">
                  {isMe ? "You" : msg.sender?.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSend} className="p-4 border-t border-zinc-200 bg-white flex items-center gap-2 shrink-0 pb-safe">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 text-xs border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-900 transition-all font-medium bg-zinc-50 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="p-3 bg-zinc-900 hover:bg-black disabled:opacity-50 text-white rounded-xl transition-all active:scale-95 shrink-0"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
