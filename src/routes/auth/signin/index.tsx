import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Mail } from "lucide-react";
import { signInWithEmail, signInWithOAuth } from "@/backend/auth/auth";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ✅ Validation schema
const signInSchema = z.object({
	email: z.string().email("Invalid email").min(1, "Email is required"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

interface signInProps {
	email: string;
	password: string;
}



export const Route = createFileRoute('/auth/signin/')({
  component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<signInProps>({
		resolver: zodResolver(signInSchema),
	});

	const onSubmit = async (data: signInProps) => {
		setLoading(true);
		const { error } = await signInWithEmail(data.email, data.password); // Use `auth.ts` function

		if (error) {
			alert(error.message);
		} else {
			navigate({ to: "/" });
		}
		setLoading(false);
	};
    return (
		<div>
			<Navbar />
			<div className="flex items-center justify-center min-h-screen">
				<Card className="w-[400px]">
					<CardHeader className="text-center">
						<CardTitle>Login</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="grid gap-4">
								{/* Email Field */}
								<div className="space-y-1.5">
									<Label htmlFor="email">Email Address</Label>
									<div className="flex items-center border-b">
										<Mail className="w-5 text-muted-foreground" />
										<Input
											id="email"
											type="email"
											placeholder="Type your email"
											className="ml-2"
											{...register("email")}
										/>
									</div>
									{errors.email && (
										<p className="text-xs text-red-500">
											{errors.email.message}
										</p>
									)}
								</div>

								{/* Password Field */}
								<div className="space-y-1.5">
									<Label htmlFor="password">Password</Label>
									<div className="flex items-center border-b">
										<Lock className="w-5 text-muted-foreground" />
										<Input
											id="password"
											type="password"
											placeholder="Enter your password"
											className="ml-2"
											{...register("password")}
										/>
									</div>
									{errors.password && (
										<p className="text-xs text-red-500">
											{errors.password.message}
										</p>
									)}
								</div>
							</div>

							{/* Forgot Password & Login Button */}
							<div className="mt-3 text-right">
								<a href="/forgot-password" className="text-xs text-slate-500">
									Forgot your password?
								</a>
								<Button
									type="submit"
									className="w-full my-4"
									disabled={loading}>
									{loading ? "Logging in..." : "Login"}
								</Button>
							</div>

							{/* Social Login */}
							<div className="text-sm font-bold text-center">
								or Login Using
							</div>
							<div className="grid gap-2 mt-2">
								<Button
									variant="default"
									className="w-full text-xs"
									onClick={() => signInWithOAuth("google")}>
									Login with Google
								</Button>
								<Button
									variant="default"
									className="w-full text-xs"
									onClick={() => signInWithOAuth("github")}>
									Login with Github
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
