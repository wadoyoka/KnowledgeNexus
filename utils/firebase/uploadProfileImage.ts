import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export async function uploadProfileImageToStorage(googlePhotoUrl: string, userId: string): Promise<string> {
  try {
    // Fetch the image
    console.log(googlePhotoUrl);
    const response = await fetch(googlePhotoUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    
    console.log(response)
    // Get the image blob
    const imageBlob = await response.blob();

    // Create FormData and append the image
    const formData = new FormData();
    formData.append('image', imageBlob);

    // Send the image to our conversion API
    const conversionResponse = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    if (!conversionResponse.ok) {
      throw new Error('Failed to convert image');
    }

    // Get the converted WebP buffer
    const webpBuffer = await conversionResponse.arrayBuffer();
    
    // Create a reference to the new file location
    const storageRef = ref(storage, `profile-images/${userId}/profile.webp`);

    // Upload the WebP buffer
    await uploadBytes(storageRef, webpBuffer, {
      contentType: 'image/webp',
    });

    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef);
    
    return downloadUrl;
  } catch (error) {
    console.error('Error processing profile image:', error);
    throw error;
  }
}

