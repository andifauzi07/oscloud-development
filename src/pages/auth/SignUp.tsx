import { useState } from "react";
import { useNavigate } from "@tanstack/react-router"; // Import TanStack Router

import { Lock, MailIcon, User2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "../../backend/auth/auth";
import Navbar from "../../components/Navbar";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const signUpSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

interface SignUpProps {
	name: string;
	email: string;
	password: string;
}

const SignUp = () => {
	const navigate = useNavigate(); // TanStack Router navigation
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpProps>({
		resolver: zodResolver(signUpSchema),
	});

	const [loading, setLoading] = useState(false);

	const onSubmit = async (data: {
		name: string;
		email: string;
		password: string;
	}) => {
		setLoading(true);
		try {
			const session = await signUp(data.email, data.password, data.name);

			if (session) {
				navigate({ to: "/dashboard" }); // Redirect on success
			} else {
				alert("Sign-up successful! Please check your email to confirm.");
			}
		} catch (error) {
			alert((error as Error).message);
		}
		setLoading(false);
	};

	return (
		<div>
			<Navbar />
			<div className="flex items-center justify-center min-h-screen">
				<Card className="w-[400px]">
					<CardHeader className="text-center">
						<span className="text-xs text-slate-500">Register</span>
						<CardTitle>Let’s Get Started</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="grid w-full items-center gap-4">
								<div className="flex flex-col space-y-1.5 border-b">
									<Label htmlFor="name" className="text-xs">
										Name
									</Label>
									<div className="flex items-center">
										<User2 className="w-7 text-muted-foreground" />
										<Input
											id="name"
											placeholder="Type your name"
											className="ml-2"
											{...register("name")}
										/>
									</div>
									{errors.name?.message && (
										<p className="text-red-500 text-xs">
											{String(errors.name.message)}
										</p>
									)}
								</div>

								<div className="flex flex-col space-y-1.5 border-b">
									<Label htmlFor="email" className="text-xs">
										Email
									</Label>
									<div className="flex items-center">
										<MailIcon className="w-7 text-muted-foreground" />
										<Input
											id="email"
											placeholder="Type your email address"
											className="ml-2"
											{...register("email")}
										/>
									</div>
									{errors.email && (
										<p className="text-red-500 text-xs">
											{String(errors.email.message)}
										</p>
									)}
								</div>

								<div className="flex flex-col space-y-1.5 border-b">
									<Label htmlFor="password" className="text-xs">
										Password
									</Label>
									<div className="flex items-center">
										<Lock className="w-7 text-muted-foreground" />
										<Input
											id="password"
											type="password"
											placeholder="Type your password"
											className="ml-2"
											{...register("password")}
										/>
									</div>
									{errors.password && (
										<p className="text-red-500 text-xs">
											{String(errors.password.message)}
										</p>
									)}
								</div>
							</div>

							<div className="mt-0 text-center">
								<Button
									type="submit"
									className="w-[250px] bg-slate-100 text-black my-4"
									disabled={loading}>
									{loading ? "Signing Up..." : "Next"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default SignUp;
