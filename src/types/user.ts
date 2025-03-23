export type UserRole = 'Admin' | 'Manager' | 'Staff';
export type UserStatus = 'Active' | 'Inactive' | 'Blocked';

export interface AppUser {
	id: string; // UUID
	email: string;
	name: string;
	workspaceid: number;
	image?: string;
	phone_number?: string;
	backup_email?: string;
	role?: UserRole;
	status?: UserStatus;
}

export interface CreateUserData {
	email: string;
	name: string;
	workspaceid: number;
	image?: string;
	phone_number?: string;
	backup_email?: string;
	role?: UserRole;
	status?: UserStatus;
}

export interface UpdateUserData {
	name?: string;
	email?: string;
	image?: string;
	phone_number?: string;
	backup_email?: string;
	role?: UserRole;
	status?: UserStatus;
}

export interface UserFilters {
	role?: UserRole;
	status?: UserStatus;
	search?: string;
}
