import { supabase } from "../supabase/supabaseClient";
// Create a new workspace
async function createWorkspace(workspace) {
    const { data, error } = await supabase
        .from("workspaces")
        .insert(workspace)
        .select("*")
        .single();
    if (error) {
        console.log("Error creating workspace:", error);
        throw error;
    }
    const { data: workspaceMember, error: workspaceMemberError } = await supabase
        .from("workspace_members") // Corrected to reference the workspace_members table
        .insert({
        workspace_id: data.id, // Use the ID of the newly created workspace
        user_id: workspace.admin_id, // Use the user ID from the session
        role: "admin", // Assign a default role (e.g., admin)
    })
        .select("*")
        .single();
    if (workspaceMemberError) {
        console.log("Error creating workspace membership:", workspaceMemberError);
        throw workspaceMemberError;
    }
    return [data, workspaceMember];
}
// Read a workspace by ID
async function getWorkspace(id) {
    const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("id", id)
        .single();
    if (error) {
        throw error;
    }
    return data;
}
// Update a workspace by ID
async function updateWorkspace(id, updates) {
    const { data, error } = await supabase
        .from("workspaces")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();
    if (error) {
        throw error;
    }
    return data;
}
// Delete a workspace by ID
async function deleteWorkspace(id) {
    const { data, error } = await supabase
        .from("workspaces")
        .delete()
        .eq("id", id)
        .select("*")
        .single();
    if (error) {
        throw error;
    }
    return data;
}
export async function getWorkspacesByUserId(userId) {
    const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("admin_id", userId);
    if (error) {
        throw error;
    }
    return data;
}
// get all user in workspace
async function getUsersInWorkspace(workspace_id) {
    const { data, error } = await supabase
        .from("workspace_members")
        .select("*, users(*)") // Join with users table
        .eq("workspace_id", workspace_id);
    if (error) {
        throw error;
    }
    return data.map((item) => ({
        id: item.id,
        workspace_id: item.workspace_id,
        user_id: item.user_id,
        role: item.role,
        user: {
            id: item.users.id,
            username: item.users.username,
            name: item.users.name,
            email: item.users.email,
            backup_email: item.users.backup_email,
            phone_number: item.users.phone_number,
            language: item.users.language,
            profile_image: item.users.profile_image,
            avatar: item.users.avatar,
            created_at: item.users.created_at,
        },
    }));
}
async function addNewUserToWorkspace(email, membership) {
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
    if (userError) {
        throw userError;
    }
    if (!user) {
        throw new Error("User with the provided email does not exist");
    }
    membership.user_id = user.id;
    const { data, error } = await supabase
        .from("workspace_members")
        .insert(membership)
        .select("*")
        .single(); // Ensure it returns the inserted row
    if (error) {
        throw error;
    }
    return data;
}
// Remove a user from a workspace
async function removeUserFromWorkspace(workspace_id, member_id) {
    console.log(`Removing user ${member_id} from channel ${workspace_id}`);
    const { data, error } = await supabase
        .from("workspace_members")
        .delete()
        .eq("workspace_id", workspace_id)
        .eq("user_id", member_id)
        .select();
    if (error) {
        console.error("Error removing user from channel:", error);
        throw error;
    }
    console.log("User removed successfully:", data);
    return data;
}
export { createWorkspace, getWorkspace, updateWorkspace, deleteWorkspace, getUsersInWorkspace, addNewUserToWorkspace, removeUserFromWorkspace, };
