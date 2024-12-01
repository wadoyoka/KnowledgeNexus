'use client';
import { Button } from "@/components/ui/button";
import { userSignOutFireBase } from "@/utils/firebase/SignOut";
import { userSignOutNextAuth } from "@/utils/nextAuth/SignOut";

export default function SignOutButton() {
    const handleSignOut = async () => {
        userSignOutFireBase();
        userSignOutNextAuth();
    }

    return (
        <Button onClick={handleSignOut}>ログアウト</Button>
    );
}