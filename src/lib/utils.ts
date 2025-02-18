import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatUrlString(str: string): string {
	return decodeURIComponent(str).replace(/\s+/g, '-').toLowerCase();
}

export function revertUrlString(str: string): string {
	return str.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
