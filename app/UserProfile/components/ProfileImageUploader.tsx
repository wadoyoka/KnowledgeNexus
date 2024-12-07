'use client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { uploadProfileImageToStorage } from '@/utils/firebase/uploadProfileImage';
import { AlertCircle } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface ProfileImageUploaderProps {
  userId: string;
  onUploadComplete: (url: string) => void;
}

function ProfileImageUploader({ userId, onUploadComplete }: ProfileImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const downloadUrl = await uploadProfileImageToStorage(imageUrl, userId);
      onUploadComplete(downloadUrl);
    } catch (err) {
      setError('画像のアップロードに失敗しました。もう一度お試しください。');
      console.error('Error uploading image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
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
        className="text-slate-400 duration-200 hover:text-slate-700"
      >
        {isUploading ? '変更中...' : '変更する'}
      </button>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default ProfileImageUploader;

