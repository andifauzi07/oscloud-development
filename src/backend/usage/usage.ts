import { supabase } from "../supabase/supabaseClient";


interface Usage {
	id: string;
	workspace_id: string;
	storage_used: number;
	bandwidth_used: number;
	user_count: number;
	plan_id?: string | null;
}

// 🔹 Create a new Usage entry
async function createUsage(usage: Omit<Usage, "id">) {
	const { data, error } = await supabase.from("usage").insert(usage);

	if (error) {
		throw error;
	}

	return data;
}

// 🔹 Get Usage by ID
async function getUsage(id: string) {
	const { data, error } = await supabase
		.from("usage")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw error;
	}

	return data;
}

// 🔹 Get Usage by Workspace
async function getUsageByWorkspace(workspace_id: string) {
	const { data, error } = await supabase
		.from("usage")
		.select("*")
		.eq("workspace_id", workspace_id)
		.single();

	if (error) {
		throw error;
	}

	return data;
}

// 🔹 Update Usage entry
async function updateUsage(id: string, updates: Partial<Omit<Usage, "id">>) {
	const { data, error } = await supabase
		.from("usage")
		.update(updates)
		.eq("id", id);

	if (error) {
		throw error;
	}

	return data;
}

// 🔹 Delete Usage entry
async function deleteUsage(id: string) {
	const { data, error } = await supabase.from("usage").delete().eq("id", id);

	if (error) {
		throw error;
	}

	return data;
}

export { createUsage, getUsage, getUsageByWorkspace, updateUsage, deleteUsage };
