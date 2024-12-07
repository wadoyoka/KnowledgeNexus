'use client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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


export default function GoogleSignIn() {
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl')

  const signInWithGoogle = async () => {
    const provider = googleProvider;
    provider.setCustomParameters({
      hd: 'cps.im.dendai.ac.jp'
    });

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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Google サインイン</h1>
        <Button
          onClick={signInWithGoogle}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Google でサインイン
        </Button>
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

