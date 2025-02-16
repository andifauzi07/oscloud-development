import { supabase } from "../supabase/supabaseClient";


interface User {
	id: string;
	username: string;
	name?: string;
	email: string;
	backup_email?: string;
	phone_number?: string;
	language?: string;
	profile_image?: string;
	avatar?: string;
	created_at?: string;
}

// Create a new user
async function createUser(user: Omit<User, "id" | "created_at">) {
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
async function getUser(id: string) {
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
async function getUserByUsername(username: string) {
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
async function updateUser(id: string, updates: Partial<User>) {
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
async function deleteUser(id: string) {
	const { data, error } = await supabase.from("users").delete().eq("id", id);

	if (error) {
		throw error;
	}

	return data;
}

export { createUser, getUser, getUserByUsername, updateUser, deleteUser };
