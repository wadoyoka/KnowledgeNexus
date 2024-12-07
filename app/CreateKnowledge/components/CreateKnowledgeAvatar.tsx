'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import router from "next/router";


export default function CreateKnowledgeAvatar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    if (status !== "authenticated") {
        return <p>Loadng...</p>
    }

    if (!session) {
        router.push(`/Signin?callbackUrl=${pathname}`);
    }

    return (
        <Avatar className="my-auto h-10 w-10 duration-200 hover:opacity-75">
            <AvatarImage src={`${session.user.image}`} alt="logo" />
            <AvatarFallback>Logo</AvatarFallback>
        </Avatar>
    );
}