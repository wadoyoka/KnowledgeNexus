import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import UserProfile from './components/UserProfile';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return null
    }

    return (
        <div>
            <UserProfile session={session} />
        </div>
    );
}