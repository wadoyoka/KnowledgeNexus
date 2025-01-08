import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import UserProfileClient from '../components/UserProfile_CommonClient';
import UserProfile from './components/UserProfile';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return null
    }

    return (
        <UserProfileClient>
            <div>
                <UserProfile session={session} />
            </div>
        </UserProfileClient>
    );
}