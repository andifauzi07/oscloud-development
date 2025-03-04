import * as React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

const PasswordInputSetting = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
	const [showPassword, setShowPassword] = React.useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="relative flex items-center">
			<Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
			<Input
				type={showPassword ? 'text' : 'password'}
				className={cn('pl-10 pr-10 border-0 border-gray-300 focus:border-gray-400 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0', className)}
				ref={ref}
				{...props}
				enableEmoji={false}
			/>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
				onClick={togglePasswordVisibility}
				aria-label={showPassword ? 'Hide password' : 'Show password'}></Button>
		</div>
	);
});

PasswordInputSetting.displayName = 'PasswordInput';

export { PasswordInputSetting };
