'use client';
import { passwordSchema } from '@/utils/firebase/PasswordSchema';
import { signup } from '@/utils/firebase/SignUp';
import { useState } from 'react';
import { z } from 'zod';

const ALLOWED_DOMAINS = ['cps.im.dendai.ac.jp']; // 許可するドメインのリスト

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const domain = email.split('@')[1];
    if (!ALLOWED_DOMAINS.includes(domain)) {
      setError('このドメインからのサインアップは許可されていません。');
      return;
    }

    try {
      passwordSchema.parse(password);
      await signup(email, password);
      setSuccessMessage('確認メールを送信しました。メールを確認してアカウントを有効化してください。このページは5秒後にログインページにリダイレクトします。');
      setTimeout(function () {
        window.location.href = '/Signin';
      }, 5 * 1000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
        console.error("Validation errors:", error.errors);
      } else {
        setError('サインアップに失敗しました。もう一度お試しください。');
        console.error('Error signing up:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントを作成
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
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
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2" role="alert">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="text-green-500 text-sm mt-2" role="status">
              {successMessage}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              サインアップ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

