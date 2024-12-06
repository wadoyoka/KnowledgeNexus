'use client';
import { handleSignOut } from "@/utils/userSignOut";
import { LogOut, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
            <DropdownMenuContent side="bottom" className="mr-10">
                <DropdownMenuItem>
                    <Link href={"/UserProfile"}>
                        <div className="flex my-auto">
                            <User />
                            <span className="ml-2">プロフィール</span>
                        </div>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                    <div className="flex">
                        <LogOut />
                        <span className="ml-2">ログアウト</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}