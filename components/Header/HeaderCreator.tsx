'use client';

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderCreator() {
    // Define paths that should be accessible without authentication
    const publicPaths = ['/Signin', '/Signup', '/PasswordReset']

    const pathname = usePathname();

    // Check if the current path is in the public paths
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    if (isPublicPath) {
        return null;
    }
    return (
        <Header />
    )
}