'use client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { auth } from '@/lib/firebase';
import { deleteUserData } from '@/utils/firebase/deleteUserData';
import { userSignOutNextAuth } from "@/utils/nextAuth/SignOut";
import { deleteUser, GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function DeleteAccount() {
  const [user, loading] = useAuthState(auth);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsDeleting(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        hd: 'cps.im.dendai.ac.jp'
      });
      await reauthenticateWithPopup(user, provider);
      
      // Delete user data from Firestore and Storage
      await deleteUserData(user.uid);

      // Delete the user account
      await deleteUser(user);
      await userSignOutNextAuth();
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('アカウントの削除に失敗しました。もう一度お試しください。');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>ログインしていません。</div>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">アカウント削除</h1>
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>警告</AlertTitle>
        <AlertDescription>
          アカウントを削除すると、すべてのデータが永久に失われます。この操作は取り消せません。
        </AlertDescription>
      </Alert>
      <form onSubmit={handleDeleteAccount}>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" variant="destructive" disabled={isDeleting}>
          {isDeleting ? '処理中...' : 'Googleで再認証してアカウントを削除'}
        </Button>
      </form>
    </div>
  );
}

