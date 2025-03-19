import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDispatch } from "react-redux";
import { signInWithEmail } from "@/backend/auth/auth";
import { setSession } from '@/store/slices/authSlice';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";

const signInSchema = z.object({
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

interface SignInProps {
    email: string;
    password: string;
}

function SignInComponent() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInProps>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInProps) => {
        try {
            setLoading(true);
            const { data: { session }, error } = await signInWithEmail(data.email, data.password);

            if (error) {
                alert(error.message);
                return;
            }

            if (session) {
                dispatch(setSession(session));
                // Redirect based on user type
                if (session.user.user_metadata?.isEmployee) {
                    navigate({ to: "/guest/dashboard" }); // or wherever employees should go
                } else {
                    navigate({ to: "/" });
                }
            }
        } catch (err) {
            console.error(err);
            alert('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <Card className="w-[400px]">
                    <CardHeader className="text-center">
                        <CardTitle>Login to Your Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="flex items-center border rounded-md">
                                        <Mail className="w-5 h-5 mx-3 text-muted-foreground" />
                                        <Input
                                            enableEmoji={false}
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="border-0"
                                            {...register("email")}
                                        />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="flex items-center border rounded-md">
                                        <Lock className="w-5 h-5 mx-3 text-muted-foreground" />
                                        <Input
                                            enableEmoji={false}
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            className="border-0"
                                            {...register("password")}
                                        />
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full mt-6"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export const Route = createFileRoute('/auth/signin/')({
    component: SignInComponent
});
