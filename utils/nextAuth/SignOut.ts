import { signOut } from "next-auth/react";

/**
 * ログアウトをする
 */
export async function userSignOutNextAuth(){
    signOut({ callbackUrl: '/Signin' });
}