import { getSession } from "../auth/auth";
import { addUserToChannel } from "../membership/membership";
import { supabase } from "../supabase/supabaseClient";
// Create a new channel
// TODO: Fix RLS violations error when trying to insert data with is_private = true.
async function createChannel(channel) {
    // todo: might just use getSession() here : done
    const session = await getSession();
    const { data, error } = await supabase
        .from("channels")
        .insert({
        workspace_id: channel.workspace_id,
        name: channel.name,
        is_private: channel.is_private,
    })
        .select("*")
        .single();
    if (error) {
        console.log("Error creating channel:", error);
        throw error;
    }
    // create default member for channel membership
    const { memberChannel, memberChannelError } = await addUserToChannel({
        channel_id: data?.id,
        user_id: session?.id || "",
        role: "admin",
    });
    if (memberChannelError) {
        console.log("Error creating channel membership:", memberChannelError);
        throw memberChannelError;
    }
    return [data, memberChannel];
}
// Read a channel by ID
async function getChannel(id) {
    const { data, error } = await supabase
        .from("channels")
        .select("*")
        .eq("id", id)
        .single();
    if (error) {
        throw error;
    }
    return data;
}
// Read all channels in a workspace
async function getChannelsByWorkspace(workspace_id) {
    const { data, error } = await supabase
        .from("channels")
        .select("*")
        .eq("workspace_id", workspace_id);
    if (error) {
        throw error;
    }
    return data;
}
// Update a channel by ID
async function updateChannel(id, updates) {
    const { data, error } = await supabase
        .from("channels")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();
    if (error) {
        throw error;
    }
    return data;
}
// Delete a channel by ID
async function deleteChannel(id) {
    const { data, error } = await supabase
        .from("channels")
        .delete()
        .eq("id", id)
        .select("*")
        .single();
    if (error) {
        throw error;
    }
    return data;
}
export { createChannel, getChannel, getChannelsByWorkspace, updateChannel, deleteChannel, };
