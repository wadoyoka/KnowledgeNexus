import { Loader2 } from 'lucide-react';
import { Suspense } from "react";
import UserProfileClient from "./components/UserProfile_CommonClient";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-slate-200 flex flex-col py-12 md:px-2 sm:px-6 lg:px-8">
            <div className='sm:w-full grow max-w-screen-2xl sm:mx-auto'>
                <Suspense fallback={
                    <div className='min-h-screen'>
                        <div className="w-full h-full flex my-auto items-center">
                            <Loader2 className="mx-auto mt-4 w-12 h-12 md:h-24 md:w-24 animate-spin" />
                        </div>
                    </div>
                }>
                    <UserProfileClient>{children}</UserProfileClient>
                </Suspense>
            </div>
        </div>
    )
}

