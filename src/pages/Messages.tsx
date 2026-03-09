import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Loader2, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeConvoId = searchParams.get("c");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversations, isLoading: convosLoading } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*, listings(title)")
        .or(`participant_1.eq.${user!.id},participant_2.eq.${user!.id}`)
        .order("updated_at", { ascending: false });
      if (error) throw error;

      // Fetch other participant profiles
      const otherIds = data.map((c: any) =>
        c.participant_1 === user!.id ? c.participant_2 : c.participant_1
      );
      const uniqueIds = [...new Set(otherIds)];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", uniqueIds);

      const profileMap = Object.fromEntries(
        (profiles || []).map((p: any) => [p.user_id, p])
      );

      return data.map((c: any) => {
        const otherId = c.participant_1 === user!.id ? c.participant_2 : c.participant_1;
        return { ...c, otherProfile: profileMap[otherId] || { full_name: "User", avatar_url: null } };
      });
    },
    enabled: !!user,
  });

  // Fetch messages for active conversation
  const { data: messages, isLoading: msgsLoading } = useQuery({
    queryKey: ["messages", activeConvoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", activeConvoId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!activeConvoId,
    refetchInterval: 3000,
  });

  // Realtime subscription
  useEffect(() => {
    if (!activeConvoId) return;
    const channel = supabase
      .channel(`messages-${activeConvoId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${activeConvoId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["messages", activeConvoId] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeConvoId, queryClient]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!newMessage.trim() || !activeConvoId || !user) return;
      const { error } = await supabase.from("messages").insert({
        conversation_id: activeConvoId,
        sender_id: user.id,
        content: newMessage.trim(),
      });
      if (error) throw error;
      // Update conversation timestamp
      await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", activeConvoId);
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", activeConvoId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => toast.error("Failed to send message"),
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) { navigate("/login"); return null; }

  const activeConvo = conversations?.find((c: any) => c.id === activeConvoId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-4 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6">Messages</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
              {/* Conversation List */}
              <div className="rounded-2xl bg-card border border-border overflow-hidden flex flex-col">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">Conversations</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {convosLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
                  ) : conversations && conversations.length > 0 ? (
                    conversations.map((c: any) => (
                      <button
                        key={c.id}
                        onClick={() => navigate(`/messages?c=${c.id}`)}
                        className={`w-full p-3 text-left border-b border-border/50 hover:bg-secondary/50 transition-colors ${
                          activeConvoId === c.id ? "bg-secondary" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={c.otherProfile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${c.otherProfile?.full_name}`}
                            alt="" className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-foreground truncate">{c.otherProfile?.full_name}</p>
                            {c.listings?.title && (
                              <p className="text-xs text-muted-foreground truncate">{c.listings.title}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <MessageSquare className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No conversations yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages Panel */}
              <div className="md:col-span-2 rounded-2xl bg-card border border-border overflow-hidden flex flex-col">
                {activeConvoId && activeConvo ? (
                  <>
                    <div className="p-3 border-b border-border flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate("/messages")}>
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <img
                        src={activeConvo.otherProfile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${activeConvo.otherProfile?.full_name}`}
                        alt="" className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-sm text-foreground">{activeConvo.otherProfile?.full_name}</p>
                        {activeConvo.listings?.title && (
                          <p className="text-xs text-muted-foreground">{activeConvo.listings.title}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {msgsLoading ? (
                        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
                      ) : messages && messages.length > 0 ? (
                        messages.map((m: any) => {
                          const isMine = m.sender_id === user.id;
                          return (
                            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                                isMine
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-secondary text-secondary-foreground rounded-bl-md"
                              }`}>
                                <p>{m.content}</p>
                                <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                                  {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center text-sm text-muted-foreground py-8">No messages yet. Say hello!</p>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="p-3 border-t border-border">
                      <form onSubmit={(e) => { e.preventDefault(); sendMessage.mutate(); }} className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 rounded-xl"
                        />
                        <Button type="submit" variant="hero" size="icon" className="rounded-xl shrink-0 min-w-[44px] min-h-[44px]" disabled={!newMessage.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">Select a conversation to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
