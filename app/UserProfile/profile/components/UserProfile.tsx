'use client';
import SubmitButton from "@/components/Buttons/SubmitButton/SubmitButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateKnowledgeNexusNames } from "@/utils/firebase/updateKnowledgeNexusNames";
import { uploadProfileImageToStorage } from "@/utils/firebase/uploadProfileImage";
import { handleSignOut } from "@/utils/userSignOut";
import { AlertCircle } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { z } from "zod";

interface UserProfileProps {
    session: Session;
}

export default function UserProfile({ session }: UserProfileProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [bufUserName, setBufUserName] = useState<string>(session.user.name);
    const [username, setUsername] = useState<string>(session.user.name);
    const [profileImageUrl, setProfileImageUrl] = useState(session.user.image);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: sessionData, update } = useSession();
    const router = useRouter();

    const handleUploadComplete = (url: string) => {
        setProfileImageUrl(url);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const imageUrl = URL.createObjectURL(file);
            const downloadUrl = await uploadProfileImageToStorage(imageUrl, session.user.id);
            handleUploadComplete(downloadUrl);
        } catch (err) {
            setError('画像のアップロードに失敗しました。もう一度お試しください。');
            console.error('Error uploading image:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleNameChange = async () => {
        setIsLoading(true);
        const nameSchema = z.string().min(1, "名前は一文字以上にしてください。").max(100, "名前は１００文字までにしてください。");
        if (bufUserName === username) {
            setIsLoading(false);
            setError("ユーザーネームに変更はありませんでした。")
            return;
        } else {
            try {
                nameSchema.parse(username);
                const updatedCount = await updateKnowledgeNexusNames(session.user.id, username);
                console.log(`Updated ${updatedCount} documents`);
                if (sessionData) {
                    await update({
                        ...sessionData,
                        user: {
                            ...sessionData.user,
                            name: username
                        }
                    });
                }
                // Update the local state
                setBufUserName(username);
                handleSignOut();
            } catch (error) {
                if (error instanceof z.ZodError) {
                    // 最初のエラーメッセージを返す
                    setError(error.errors[0].message);
                }
                console.error('Failed to update documents:', error);

                // Handle the error appropriately (e.g., show user feedback, log to monitoring service)
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="flex max-md:flex-col mt-4 p-2">
            <div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
                <button
                    onClick={handleButtonClick}
                    disabled={isUploading}
                    className="text-slate-400 duration-200 group hover:text-slate-700"
                >
                    <div className="text-slate-700 duration-200 group-hover:text-slate-400">
                        <Avatar className="w-24 h-24 group-hover:opacity-50 duration-200">
                            <AvatarImage src={profileImageUrl} alt={session.user.email} />
                            <AvatarFallback>Icon</AvatarFallback>
                        </Avatar>
                        <p> {isUploading ? '変更中...' : '変更する'}</p>
                    </div>
                </button>
            </div>
            <div className="grow ml-4">
                <h2 className="font-semibold max-md:mt-1">ユーザー名</h2>
                <div className="flex max-w-screen-xl">
                    <Input
                        className="bg-white border-2 mr-2"
                        id="username"
                        name="username"
                        required
                        placeholder={"ユーザー名"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <SubmitButton preText={"変更する"} postText={"変更中"} disabled={isLoading} type="button" onClick={handleNameChange} width="w-36" />
                </div>
                <p className="text-slate-400 mb-4">※ユーザー名を変更すると、一度ログアウトします。</p>
                <h2 className="font-semibold">メールアドレス</h2>
                <p>{session.user.email}</p>
                <Button variant="destructive" onClick={() => router.push("/DeleteAccount")} className="mt-6">アカウント削除</Button>
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

