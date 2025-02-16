import { supabase } from "../supabase/supabaseClient";
// Create a new message
async function createMessage(message) {
    const { data, error } = await supabase
        .from("messages")
        .insert(message)
        .select("*")
        .single();
    if (error) {
        throw error;
    }
    return data;
}
// Get a specific message by ID
async function getMessage(id) {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("id", id)
        .single();
    if (error) {
        throw error;
    }
    return data;
}
// Get all messages in a channel
async function getMessagesByChannel(channel_id) {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("channel_id", channel_id)
        .order("timestamp", { ascending: true });
    if (error) {
        throw error;
    }
    return data;
}
// Update a message by ID
async function updateMessage(id, updates) {
    const { data, error } = await supabase
        .from("messages")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();
    if (error) {
        throw error;
    }
    return data;
}
// Delete a message by ID
async function deleteMessage(id) {
    const { data, error } = await supabase
        .from("messages")
        .delete()
        .eq("id", id)
        .select("*") // Optional: return deleted row
        .single();
    if (error) {
        throw error;
    }
    return data;
}
export { createMessage, getMessage, getMessagesByChannel, updateMessage, deleteMessage, };
