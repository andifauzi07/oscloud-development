import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { z } from "zod";
import apiClient from "@/api/apiClient";

const emailSchema = z.string().email("Invalid email format");

export function InviteUserDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Validate email
            emailSchema.parse(email);
            
            setIsLoading(true);
            
            await apiClient.post("/auth/invite", {
                email,
                redirectTo: `${window.location.origin}/workspace`
            });

            alert(`Invitation sent to ${email}`);
            setEmail("");
            setIsOpen(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                alert("Please enter a valid email address");
            } else {
                alert("Failed to send invitation" + error);
                console.error("Invite error:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger className="flex w-full border-t" asChild>
                    <Button
                        className="flex self-end justify-end text-black bg-transparent border-l place-self-end md:w-20 link min-h-10"
                        variant="ghost"
                    >
                        ADD+
                    </Button>
                </PopoverTrigger>
            <PopoverContent
                className="w-[400px] p-4 rounded-none"
                align="center"
                sideOffset={2}
            >
                <form onSubmit={handleInvite}>
                    <div className="grid gap-4">
                        <h3 className="font-medium leading-none">Invite User</h3>
                        <div className="grid gap-3">
                            <Input
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="rounded-none"
                                enableEmoji={false}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="w-20 rounded-none"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send"}
                            </Button>
                        </div>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
}

