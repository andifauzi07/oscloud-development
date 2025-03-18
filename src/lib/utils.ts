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
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('ja-JP', {
		style: 'currency',
		currency: 'JPY'
	}).format(amount);
};
