import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import UserProfileClient from './components/UserProfileClient';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/Signin?callbackUrl=UserProfile/knowledgePost")
    }
    return (
        <div className="min-h-screen bg-slate-200 flex flex-col py-12 md:px-2 sm:px-6 lg:px-8">
            <UserProfileClient />
        </div>
    );
}

