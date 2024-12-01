import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

/**
 * ログアウトをする
 */
export async function userSignOutFireBase() {
    await signOut(auth)
}