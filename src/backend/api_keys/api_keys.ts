import { supabase } from "../supabase/supabaseClient";


interface APIKey {
	id: string;
	workspace_id: string;
	tool_id: string;
	secret_key: string;
}

// 🔹 Create a new API Key
async function createAPIKey(apiKey: Omit<APIKey, "id">) {
	const { data, error } = await supabase.from("api_keys").insert(apiKey);

	if (error) {
		throw error;
	}

	return data;
}

// 🔹 Get API Key by ID
async function getAPIKey(id: string) {
	const { data, error } = await supabase
		.from("api_keys")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw error;
	}

	return data;
}

// 🔹 Get all API Keys for a specific workspace
async function getAPIKeysByWorkspace(workspace_id: string) {
	const { data, error } = await supabase
		.from("api_keys")
		.select("*")
		.eq("workspace_id", workspace_id);

	if (error) {
		throw error;
	}

	return data;
}

// 🔹 Update an API Key
async function updateAPIKey(id: string, updates: Partial<Omit<APIKey, "id">>) {
	const { data, error } = await supabase
		.from("api_keys")
		.update(updates)
		.eq("id", id);

	if (error) {
		throw error;
	}

	return data;
}

// 🔹 Delete an API Key
async function deleteAPIKey(id: string) {
	const { data, error } = await supabase.from("api_keys").delete().eq("id", id);

	if (error) {
		throw error;
	}

	return data;
}

export {
	createAPIKey,
	getAPIKey,
	getAPIKeysByWorkspace,
	updateAPIKey,
	deleteAPIKey,
};
