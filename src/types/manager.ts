type ManagerStatus = 'Active' | 'Inactive' | 'Blocked';
type ManagerRole = 'Staff' | 'Admin' | 'Manager';

export interface Manager {
	userid: string;
	email: string;
	status: ManagerStatus;
	role: ManagerRole;
	workspaceid: number | null;
	image: string | null | undefined;
	phone_number: string | null | undefined;
	backup_email: string | null | undefined;
	name: string;
}
