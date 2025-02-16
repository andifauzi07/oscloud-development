import { supabase } from "../supabase/supabaseClient";
// Create a new user
async function createUser(user) {
    const { data, error } = await supabase
        .from("users")
        .insert(user)
        .select()
        .single();
    if (error) {
        throw error;
    }
    return data;
}
// Read a user by ID
async function getUser(id) {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
    if (error) {
        throw error;
    }
    return data;
}
// Read a user by username
async function getUserByUsername(username) {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();
    if (error) {
        throw error;
    }
    return data;
}
// Update a user by ID
async function updateUser(id, updates) {
    const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
    if (error) {
        throw error;
    }
    return data;
}
// Delete a user by ID
async function deleteUser(id) {
    const { data, error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
        throw error;
    }
    return data;
}
export { createUser, getUser, getUserByUsername, updateUser, deleteUser };
