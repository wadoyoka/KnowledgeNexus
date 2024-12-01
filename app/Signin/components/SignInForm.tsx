'use client';
import SignOutButton from '@/components/Buttons/SignOutButton/SignOutButton';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, validatePassword } from 'firebase/auth';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const ALLOWED_DOMAINS = ['cps.im.dendai.ac.jp']; // 許可するドメインのリスト

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user] = useAuthState(auth);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const domain = email.split('@')[1];
    if (!ALLOWED_DOMAINS.includes(domain)) {
      setError('このドメインからのサインインは許可されていません。');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // サインイン成功時の処理
    } catch (error) {
      const status = await validatePassword(auth, password);
      if (!status.isValid) {
        setError('パスワードが脆弱です。パスワードを再設定してください。');
      } else {
        setError('サインインに失敗しました。メールアドレスとパスワードを確認してください。');
      }
      console.error('Error signing in:', error);
    }
  };

  if (user) {
    return (
      <div>
        <p>サインイン済み: {user.email}</p>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにサインイン
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2" role="alert">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/PasswordReset" className="font-medium text-indigo-600 hover:text-indigo-500">
                パスワードを忘れましたか？
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              サインイン
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

