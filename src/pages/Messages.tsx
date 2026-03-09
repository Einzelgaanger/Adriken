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

  const { data: conversations, isLoading: convosLoading } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*, listings(title)")
        .or(`participant_1.eq.${user!.id},participant_2.eq.${user!.id}`)
        .order("updated_at", { ascending: false });
      if (error) throw error;

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (!activeConvoId || !user || !messages) return;
    const unreadIds = messages
      .filter((m: any) => m.sender_id !== user.id && !m.read)
      .map((m: any) => m.id);
    if (unreadIds.length > 0) {
      supabase.from("messages").update({ read: true }).in("id", unreadIds).then(() => {});
    }
  }, [activeConvoId, user, messages]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!newMessage.trim() || !activeConvoId || !user) return;
      const { error } = await supabase.from("messages").insert({
        conversation_id: activeConvoId,
        sender_id: user.id,
        content: newMessage.trim(),
      });
      if (error) throw error;
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
  const showConvoList = !activeConvoId;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 sm:pt-20 pb-0 sm:pb-4 px-0 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Desktop title */}
          <div className="hidden sm:block px-4 sm:px-0 pt-4 pb-4">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Messages</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 sm:gap-4 h-[calc(100dvh-64px)] sm:h-[calc(100vh-160px)]">
            {/* Conversation List - hide on mobile when chatting */}
            <div className={`${activeConvoId ? "hidden md:flex" : "flex"} rounded-none sm:rounded-2xl bg-card border-0 sm:border border-border overflow-hidden flex-col`}>
              <div className="p-3.5 sm:p-3 border-b border-border flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary sm:hidden" />
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
                      className={`w-full p-3.5 sm:p-3 text-left border-b border-border/50 hover:bg-secondary/50 transition-colors touch-manipulation ${
                        activeConvoId === c.id ? "bg-secondary" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={c.otherProfile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${c.otherProfile?.full_name}`}
                          alt="" className="w-10 h-10 sm:w-9 sm:h-9 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-foreground truncate">{c.otherProfile?.full_name}</p>
                          {c.listings?.title && (
                            <p className="text-xs text-muted-foreground truncate">{c.listings.title}</p>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(c.updated_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-1 font-medium">No conversations yet</p>
                    <p className="text-xs text-muted-foreground/60">Start a chat from any provider's page</p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Panel - full screen on mobile */}
            <div className={`${!activeConvoId ? "hidden md:flex" : "flex"} md:col-span-2 rounded-none sm:rounded-2xl bg-card border-0 sm:border border-border overflow-hidden flex-col`}>
              {activeConvoId && activeConvo ? (
                <>
                  <div className="p-3 sm:p-3 border-b border-border flex items-center gap-3 bg-card">
                    <Button variant="ghost" size="icon" className="md:hidden min-w-[44px] min-h-[44px] rounded-xl touch-manipulation" onClick={() => navigate("/messages")}>
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <img
                      src={activeConvo.otherProfile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${activeConvo.otherProfile?.full_name}`}
                      alt="" className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{activeConvo.otherProfile?.full_name}</p>
                      {activeConvo.listings?.title && (
                        <p className="text-xs text-muted-foreground truncate">{activeConvo.listings.title}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
                    {msgsLoading ? (
                      <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
                    ) : messages && messages.length > 0 ? (
                      messages.map((m: any) => {
                        const isMine = m.sender_id === user.id;
                        return (
                          <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] sm:max-w-[70%] px-3.5 py-2.5 rounded-2xl text-[14px] ${
                              isMine
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-secondary text-secondary-foreground rounded-bl-md"
                            }`}>
                              <p className="leading-relaxed">{m.content}</p>
                              <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/50" : "text-muted-foreground/60"}`}>
                                {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex-1 flex items-center justify-center py-12">
                        <p className="text-center text-sm text-muted-foreground">No messages yet. Say hello! 👋</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-2.5 sm:p-3 border-t border-border bg-card safe-area-bottom">
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage.mutate(); }} className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-xl text-[16px] sm:text-sm"
                        autoComplete="off"
                      />
                      <Button type="submit" variant="hero" size="icon" className="rounded-xl shrink-0 min-w-[44px] min-h-[44px]" disabled={!newMessage.trim() || sendMessage.isPending}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center px-6">
                    <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">Select a conversation</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">or start one from a provider's page</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
