'use client';
import { Button } from "@/components/ui/button";
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function UserProfile() {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!user) {
        return <div>ユーザーがログインしていません。</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">ユーザープロフィール</h1>
            <p className="mb-4">メールアドレス: {user.email}</p>
            {user.emailVerified ? (
                <p className="mb-4 text-green-600">メール認証済み</p>
            ) : (
                <p className="mb-4 text-red-600">メール未認証</p>
            )}
            <p className="mb-4">ユーザーID: {user.uid}</p>
            <p className="mb-4">最終ログイン: {user.metadata.lastSignInTime}</p>
            {/* その他のプロフィール情報 */}
            <Link href="/delete-account">
                <Button variant="destructive">アカウント削除</Button>
            </Link>
        </div>
    );
}

