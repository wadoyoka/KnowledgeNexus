import { userSignOutFireBase } from "./firebase/SignOut";
import { userSignOutNextAuth } from "./nextAuth/SignOut";

export const handleSignOut = async () => {
    userSignOutFireBase();
    userSignOutNextAuth();
}