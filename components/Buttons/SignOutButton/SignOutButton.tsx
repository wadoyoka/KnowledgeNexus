'use client';
import SubmitButton from "@/components/Buttons/SubmitButton/SubmitButton";
import { userSignOut } from "@/utils/firebase/SignOut";
import { useState } from "react";

export default function SignOutButton(){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleSignOut = async (e: React.FormEvent) => {
        setIsLoading(true);
        try {
            await userSignOut();
        } catch (error) {
            console.error(error);
        }finally{
            setIsLoading(false);
        }
    }

    return(
        <form onSubmit={handleSignOut}>
            <SubmitButton preText={"ログアウト"} postText={"ログアウト中"} disabled={isLoading} />
        </form>
    );
}