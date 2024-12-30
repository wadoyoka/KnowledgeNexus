'use client';
import { handleSignOut } from "@/utils/userSignOut";
import { FileText, LogOut, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";


export default function HeaderAvatar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    if (status !== "authenticated") {
        return <p>Loadng...</p>
    }

    if (!session) {
        router.push(`/Signin?callbackUrl=${pathname}`);
    }

    function handleUserProfile(target: string) {
        setIsOpen(false);
        router.push(`/UserProfile?target=${target}`);
    }


    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Avatar className="ml-4 my-auto h-14 w-14 duration-200 hover:opacity-75">
                    <AvatarImage src={`${session.user.image}`} alt="logo" />
                    <AvatarFallback>Logo</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" className="mr-10">
                <DropdownMenuItem onSelect={() => handleUserProfile("profile")}>
                    <div className="flex my-auto">
                        <User />
                        <span className="ml-2">プロフィール</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleUserProfile("knowledgePost")}>
                    <div className="flex my-auto">
                        <FileText />
                        <span className="ml-2">自分の投稿</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => {
                    setIsOpen(false);
                    handleSignOut();
                }}>
                    <div className="flex">
                        <LogOut />
                        <span className="ml-2">ログアウト</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}