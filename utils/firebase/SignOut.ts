
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

/**
 * ログアウトをする
 */
export async function userSignOut() {
    await signOut(auth);
}