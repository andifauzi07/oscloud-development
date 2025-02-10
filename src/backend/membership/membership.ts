import { Member } from "@/types/types";
import { supabase } from "../supabase/supabaseClient";

interface ChannelMembership {
	id: string; // UUID
	channel_id: string; // Foreign key referencing channels(id)
	user_id?: string; // Foreign key referencing users(id)
	role: "admin" | "user"; // Role constraint
}

// Add a user to a channel
async function addUserToChannel(membership: Omit<ChannelMembership, "id">) {
	const { data, error } = await supabase
		.from("channel_memberships")
		.insert(membership)
		.select("*")
		.single(); // Ensure it returns the inserted row

	if (error) {
		throw error;
	}

	return data;
}

async function addNewUserToChannel(
	email: string,
	membership: Omit<ChannelMembership, "id">
) {
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
		.from("channel_memberships")
		.insert(membership)
		.select("*")
		.single(); // Ensure it returns the inserted row

	if (error) {
		throw error;
	}

	return data;
}

// Get a specific membership by ID
async function getMembership(id: string) {
	const { data, error } = await supabase
		.from("channel_memberships")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw error;
	}

	return data;
}

// Get all users in a channel with user details
async function getUsersInChannel(channel_id: string): Promise<Member[]> {
	const { data, error } = await supabase
		.from("channel_memberships")
		.select("*, users(*)") // Join with users table
		.eq("channel_id", channel_id);

	if (error) {
		throw error;
	}

	return data.map((item) => ({
		id: item.id,
		channel_id: item.channel_id,
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

// Get all channels a user is part of
async function getUserChannels(user_id: string) {
	const { data, error } = await supabase
		.from("channel_memberships")
		.select("*")
		.eq("user_id", user_id);

	if (error) {
		throw error;
	}

	return data;
}

// Update a user's role in a channel
async function updateUserRole(id: string, role: "admin" | "user") {
	const { data, error } = await supabase
		.from("channel_memberships")
		.update({ role })
		.eq("id", id)
		.select("*")
		.single();

	if (error) {
		throw error;
	}

	return data;
}

// Remove a user from a channel
async function removeUserFromChannel(channel_id: string, member_id: string) {
	console.log(`Removing user ${member_id} from channel ${channel_id}`);

	const { data, error } = await supabase
		.from("channel_memberships")
		.delete()
		.eq("channel_id", channel_id)
		.eq("user_id", member_id)
		.select();

	if (error) {
		console.error("Error removing user from channel:", error);
		throw error;
	}

	console.log("User removed successfully:", data);
	return data;
}

export {
	addUserToChannel,
	getMembership,
	getUsersInChannel,
	getUserChannels,
	updateUserRole,
	removeUserFromChannel,
	addNewUserToChannel,
};
