import { supabase } from "../supabase/supabaseClient";
// 🔹 Create a new AI tool
async function createAITool(tool) {
    const { data, error } = await supabase.from("ai_tools").insert(tool);
    if (error) {
        throw error;
    }
    return data;
}
// 🔹 Get AI tool by workspace ID
async function getAITool(workspace_id) {
    const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .eq("workspace_id", workspace_id);
    if (error) {
        throw error;
    }
    return data;
}
// 🔹 Update an AI tool
async function updateAITool(id, updates) {
    const { data, error } = await supabase
        .from("ai_tools")
        .update(updates)
        .eq("id", id);
    if (error) {
        throw error;
    }
    return data;
}
// 🔹 Delete an AI tool
async function deleteAITool(id) {
    const { data, error } = await supabase.from("ai_tools").delete().eq("id", id);
    if (error) {
        throw error;
    }
    return data;
}
export { createAITool, getAITool, updateAITool, deleteAITool };
