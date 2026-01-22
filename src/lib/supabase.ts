import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dev-only logger to avoid console noise in production builds
const logError = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
};

// Types for chat messages
export interface ChatMessage {
  id?: string;
  user_id: string;
  pet_id: number;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

// Helper functions for chat operations
export async function saveChatMessage(
  message: Omit<ChatMessage, "id" | "created_at">,
) {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([message])
      .select()
      .single();

    if (error) {
      logError("Error saving chat message:", error);
      return null;
    }
    return data;
  } catch (error) {
    logError("Error saving chat message:", error);
    return null;
  }
}

export async function getChatHistory(
  userId: string,
  petId: number,
  limit: number = 50,
) {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .eq("pet_id", petId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      logError("Error fetching chat history:", error);
      return [];
    }
    return (data || []) as ChatMessage[];
  } catch (error) {
    logError("Error fetching chat history:", error);
    return [];
  }
}

export async function clearChatHistory(userId: string, petId: number) {
  try {
    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("user_id", userId)
      .eq("pet_id", petId);

    if (error) {
      logError("Error clearing chat history:", error);
      return false;
    }
    return true;
  } catch (error) {
    logError("Error clearing chat history:", error);
    return false;
  }
}
