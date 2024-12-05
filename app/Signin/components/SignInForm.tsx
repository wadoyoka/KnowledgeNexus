'use client';
import SubmitButton from '@/components/Buttons/SubmitButton/SubmitButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth } from '@/lib/firebase';
import { passwordSchema } from '@/utils/firebase/PasswordSchema';
import { userSignOutFireBase } from '@/utils/firebase/SignOut';
import { sendEmailVerification, signInWithEmailAndPassword, validatePassword } from 'firebase/auth';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';


const ALLOWED_DOMAINS = ['cps.im.dendai.ac.jp']; // 許可するドメインのリスト


export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const domain = email.split('@')[1];
    if (!ALLOWED_DOMAINS.includes(domain)) {
      setError('このドメインからのサインインは許可されていません。');
      return;
    }

    try {
      passwordSchema.parse(password);
      const userCredencial = await signInWithEmailAndPassword(auth, email, password);
      const isNotVerified = !userCredencial.user.emailVerified
      if (isNotVerified) {
        if (userCredencial.user) {
          await sendEmailVerification(userCredencial.user);
        }
        await userSignOutFireBase()
        return;
      }
      if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken(true);
        await signIn("credentials", { idToken, callbackUrl: `${callbackUrl ? callbackUrl :"/"}` })
      }else{
        setError("現在のユーザーの取得に失敗しました");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
        console.error("Validation errors:", error.errors);
      }else if (!(await validatePassword(auth, password)).isValid) {
        setError('パスワードが脆弱です。パスワードを再設定してください。');
      } else {
        setError('サインインに失敗しました。メールアドレスとパスワードを確認してください。または、メール認証が済んでいない可能性があります。');
      }
      console.error('Error signing in:', error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにサインイン
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="space-y-2">
            <div>
              <Label htmlFor="email-address">
                メールアドレス
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="hoge@exaple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">
                パスワード
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center"
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
              <Link href="/Signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                アカウント登録
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/PasswordReset" className="font-medium text-indigo-600 hover:text-indigo-500">
                パスワードを忘れましたか？
              </Link>
            </div>
          </div>

          <div>
            <SubmitButton preText={'ログイン'} postText={'ログイン中'} disabled={isLoading} width='w-full' />
          </div>
        </form>
      </div>
    </div>
  );
}

