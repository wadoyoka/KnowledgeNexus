'use client';
import SubmitButton from "@/components/Buttons/SubmitButton/SubmitButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, provider as googleProvider } from '@/lib/firebase';
import { UserData } from "@/types/firebase";
import { uploadProfileImageToStorage } from "@/utils/firebase/uploadProfileImage";
import { userIsExists } from "@/utils/firebase/userIsExists";
import { CreateUser, findUser } from "@/utils/firebase/userManagement";
import { signInWithPopup } from 'firebase/auth';
import { AlertCircle } from 'lucide-react';
import { signIn } from "next-auth/react";
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";



export default function GoogleSignIn() {
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl')

  const signInWithGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    const provider = googleProvider;
    provider.setCustomParameters({
      hd: 'cps.im.dendai.ac.jp'
    });
    setIsLogin(true)
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email?.endsWith('@cps.im.dendai.ac.jp')) {
        await auth.signOut();
        setError('このドメインからのサインインは許可されていません。');
        return;
      }
      const idToken = await user.getIdToken(true);
      const isUserExist = await userIsExists(user.uid);
      if (!isUserExist) {
        console.log(user.photoURL)
        const photoURL = await uploadProfileImageToStorage(
          user.photoURL || "/base.webp",
          user.uid
        );
        const userData: UserData = await CreateUser({
          uid: user.uid,
          name: user.displayName || 'user',
          email: user.email,
          image: photoURL
        });
        const userName = userData.name;
        await signIn("credentials", { idToken, photoURL, userName, callbackUrl: `${callbackUrl ? callbackUrl : "/"}` })
      } else {
        const userData: UserData = await findUser(user.uid);
        const userName = userData.name;
        const photoURL = userData.image;
        await signIn("credentials", { idToken, photoURL, userName, callbackUrl: `${callbackUrl ? callbackUrl : "/"}` })
      }

      // サインイン成功時の処理
      console.log('Signed in successfully:', user.email);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Google サインインに失敗しました。もう一度お試しください。');
    } finally {
      setIsLogin(false)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-200">
      <div className="p-8">
        <Avatar className="w-32 h-32 md:w-48 md:h-48 mx-auto animate-spin-slow">
          <AvatarImage src="/logodata/logo.webp" alt="Logo" className='p-1' />
          <AvatarFallback>Logo</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold mb-4 text-center text-3xl md:text-5xl mt-24">KnowledgeNexus</h1>
        {/* <p>岩井研究室の皆様ようこそ!!</p>
        <p className="text-slate-400">※@cps.im.dendai.ac.jpのドメインをお持ちの方のみいただけます。</p> */}
        <form onSubmit={signInWithGoogle} className="mt-32">
          <SubmitButton preText={"Googleでログイン"} postText={"ログイン中"} disabled={isLogin} width="w-full" height="h-12" fontSize="text-xl" fontweight="font-bold" baseColor="bg-slate-50" hoverColor="hover:bg-sky-800" baseTextColor="text-slate-600" icon={FcGoogle} iconSize={36} iconPosition="left"/>
        </form>
        {/* <Button
          onClick={signInWithGoogle}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Google でサインイン
          <FcGoogle />
        </Button> */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

