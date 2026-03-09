import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) { setCount(0); return; }

    const fetchUnread = async () => {
      // Get all conversations where user is participant
      const { data: convos } = await supabase
        .from("conversations")
        .select("id")
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`);

      if (!convos || convos.length === 0) { setCount(0); return; }

      const convoIds = convos.map((c) => c.id);

      // Count unread messages NOT sent by the user
      const { count: unread } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("conversation_id", convoIds)
        .neq("sender_id", user.id)
        .eq("read", false);

      setCount(unread || 0);
    };

    fetchUnread();

    // Refresh on new messages via realtime
    const channel = supabase
      .channel("unread-count")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
      }, () => fetchUnread())
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "messages",
      }, () => fetchUnread())
      .subscribe();

    // Also poll every 30s
    const interval = setInterval(fetchUnread, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [user]);

  return count;
};
