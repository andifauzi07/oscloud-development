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

// Regular user authentication
export const signInWithEmail = async (email: string, password: string) => {
	// First try employee login
	const { data: employee, error: employeeError } = await supabase
		.from('employee')
		.select('*')
		.eq('email', email)
		.eq('password', password) // Note: In production, use proper password hashing
		.single();

	if (employee) {
		// If employee login successful, create a custom session
		return {
			data: {
				session: {
					access_token: 'employee_token', // You might want to generate a proper token
					user: {
						id: `emp_${employee.employeeid}`, // Prefix to distinguish from UUID
						email: employee.email,
						user_metadata: {
							isEmployee: true,
							name: employee.name,
							employeeid: employee.employeeid,
							departmentid: employee.departmentid,
							workspaceid: employee.workspaceid
						}
					}
				}
			},
			error: null
		};
	}

	// If not an employee, try regular auth
	return await supabase.auth.signInWithPassword({ email, password });
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
