type ManagerStatus = 'Active' | 'Inactive' | 'Blocked';
type ManagerRole = 'Staff' | 'Admin' | 'Manager';

export interface Manager {
	name: string;
	userId: string;
	email: string;
	status: ManagerStatus;
	role: ManagerRole;
	image: string | null | undefined;
	phoneNumber: string | null | undefined;
	backupEmail: string | null | undefined;
}
