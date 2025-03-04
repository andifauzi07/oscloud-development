import MenuList from '@/components/menuList';
import { createFileRoute } from '@tanstack/react-router';
import { PasswordInputSetting } from '@/components/PasswordInputSetting';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
export const Route = createFileRoute('/workspace/setting/security/')({
	component: RouteComponent,
});

function RouteComponent() {
	const [password, setPassword] = useState<string>();
	return (
		<>
			<div className="pl-4 bg-white border border-t-0 border-l-0">
				<MenuList
					items={[
						{
							label: 'Profile',
							path: `/workspace/setting/profile`,
						},
						{
							label: 'Security',
							path: `/workspace/setting/security`,
						},
					]}
				/>
			</div>

			<div className="w-full bg-white items-center flex justify-start gap-6 py-4 pl-8 border-b border-r">
				<div className="w-1/2 flex items-center gap-4">
					<div className="flex flex-col gap-3">
						<h1 className="text-sm">Password</h1>
						<p className="text-xs text-neutral-500">Set your password to protect your account</p>
					</div>
					<PasswordInputSetting
						id="password"
						placeholder="· · · · · · · · · · · · · · ·"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
			</div>

			<div className="w-full bg-white items-center flex justify-start gap-6 py-4 pl-8 border-b border-r">
				<div className="w-1/2 flex items-center gap-4">
					<div className="flex flex-col gap-3 w-1/2">
						<h1 className="text-sm">Two Step verification</h1>
						<p className="text-xs text-neutral-500">We recommend requiring a verification code in addition to your password.</p>
					</div>
					<div className="flex w-1/2">
						<Button
							size="sm"
							className="rounded-none w-16">
							ON
						</Button>
						<Button
							size="sm"
							variant="outline"
							className="rounded-none w-16">
							OFF
						</Button>
					</div>
				</div>
			</div>

			<div className="w-full bg-white items-center flex justify-start gap-6 py-4 pl-8 border-b border-r">
				<div className="w-1/2 flex items-center gap-8">
					<div className="flex flex-col gap-3 w-1/2">
						<h1 className="text-sm">Two Step verification</h1>
						<p className="text-xs text-neutral-500">We recommend requiring a verification code in addition to your password.</p>
					</div>
					<div className="flex flex-col gap-4 w-1/2">
						<div className="flex items-center gap-2">
							<Icon
								icon="logos:google-gmail"
								width="16"
								height="16"
							/>
							<p className="text-xs text-neutral-500">Connected</p>
						</div>
						<div className="flex items-center gap-2">
							<Icon
								icon="logos:x"
								width="16"
								height="16"
							/>
							<p className="text-xs text-neutral-500">Login now</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
