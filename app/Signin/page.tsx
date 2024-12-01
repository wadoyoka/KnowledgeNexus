import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import AuthWrapper from './components/auth-wrapper';

export default async function SignInPage() {
    const session = await getServerSession(authOptions)

    return (
        <div>
            <AuthWrapper initialSession={session} />
        </div>
    );
}

