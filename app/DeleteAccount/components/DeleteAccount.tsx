'use client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from '@/lib/firebase';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function DeleteAccount() {
  const [user, loading] = useAuthState(auth);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsDeleting(true);
    setError(null);

    try {
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('アカウントの削除に失敗しました。パスワードを確認してください。');
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
        <div className="mb-4">
          <Label htmlFor="password">パスワードを確認</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" variant="destructive" disabled={isDeleting}>
          {isDeleting ? '処理中...' : 'アカウントを削除'}
        </Button>
      </form>
    </div>
  );
}

