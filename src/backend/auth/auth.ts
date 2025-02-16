import { supabase } from "../supabase/supabaseClient";

// Get session function
export const getSession = async () => {
	const { data } = await supabase.auth.getUser();
	return data.user;
};

// Get user
export const getUser = async () => {
	const { data } = await supabase.auth.getUser();
	if (!data.user) {
		throw new Error("User not found");
	}
	const { data: user, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", data.user.id)
		.single();
	if (error) {
		throw new Error(`Failed to fetch user data: ${error.message}`);
	}
	return user;
};

// Sign Up Function
export const signUp = async (email: string, password: string, name: string) => {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		throw new Error(error.message);
	}

	const user = data?.user;
	if (!user) {
		throw new Error("User signup failed! Please try again.");
	}

	// 🛠 Fix: Ensure the user is inserted correctly
	const { error: insertError } = await supabase.from("users").insert([
		{
			id: user.id, // Ensure this matches the UUID from Supabase Auth
			email: user.email,
			username: user.email, // Use name for username
			name: name, // Explicitly add the name field
		},
	]);

	if (insertError) {
		throw new Error(`Failed to save user data: ${insertError.message}`);
	}

	return "Sign-up successful!";
};

// Sign In Function
export const signInWithEmail = async (email: string, password: string) => {
	const data = await supabase.auth.signInWithPassword({ email, password });
	return data;
};

export const signInWithOAuth = async (provider: "google" | "github") => {
	return await supabase.auth.signInWithOAuth({ provider });
};

// Sign out function

export const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) {
		console.error("Sign out error:", error.message);
		return { error };
	}
	return { success: true };
};
