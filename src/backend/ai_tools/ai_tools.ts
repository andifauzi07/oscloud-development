import { supabase } from "../supabase/supabaseClient";

// Define the AITool interface
interface AITool {
    id: string;
    name: string;
    secret_key: string;
    specific_properties?: object; // JSONB type in the database
    workspace_id: string;
}

// Define ApiType as an array of AITool objects
type ApiType = AITool[];

// 🔹 Create a new AI tool
async function createAITool(tool: Omit<AITool, "id">) {
    const { data, error } = await supabase.from("ai_tools").insert(tool);
    if (error) {
        throw error;
    }
    return data;
}

// 🔹 Get AI tool by workspace ID
async function getAITool(workspace_id: string): Promise<ApiType> {
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
async function updateAITool(id: string, updates: Partial<Omit<AITool, "id">>) {
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
async function deleteAITool(id: string) {
    const { data, error } = await supabase.from("ai_tools").delete().eq("id", id);
    if (error) {
        throw error;
    }
    return data;
}

export { createAITool, getAITool, updateAITool, deleteAITool };