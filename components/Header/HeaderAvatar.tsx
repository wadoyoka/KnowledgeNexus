'use client';
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import router from "next/router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";


export default function HeaderAvatar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    if (status !== "authenticated") {
        return <p>Loadng...</p>
    }

    if (!session) {
        router.push(`/Signin?callbackUrl=${pathname}`);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="ml-4 my-auto h-14 w-14 duration-200 hover:opacity-75">
                    <AvatarImage src="/logo.webp" alt="logo" />
                    <AvatarFallback>Logo</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" className="mr-6">
                <DropdownMenuItem>
                    <span>名前の変更</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>削除</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}