'use client';
import SubmitButton from "@/components/Buttons/SubmitButton/SubmitButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import router from "next/router";
import { useState } from "react";

export default function UserProfile() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const pathname = usePathname();

    if (status !== "authenticated") {
        return <p>Loadng...</p>
    }

    if (!session) {
        router.push(`/Signin?callbackUrl=${pathname}`);
    }


    return (
        <div className="flex max-md:flex-col mt-4">
            <div>
                <button>
                    <div className="text-slate-400 duration-200 hover:text-slate-700">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={session.user.image} alt={session.user.email} />
                            <AvatarFallback>Icon</AvatarFallback>
                        </Avatar>
                        <p>変更する</p>
                    </div>
                </button>
            </div>
            <div className="grow ml-4">
                <h2 className="font-semibold">ユーザー名</h2>
                <div className="flex">
                    <Input
                        className="bg-white border-2 mr-2"
                    />
                    <SubmitButton preText={"変更する"} postText={"変更中"} disabled={isLoading} />
                </div>
                <h2 className="font-semibold">メールアドレス</h2>
                <p>{session.user.email}</p>
            </div>

        </div>
    );
}

