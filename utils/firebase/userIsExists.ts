import { doc, getDoc, getFirestore } from 'firebase/firestore';


export async function userIsExists(uid: string): Promise<boolean> {
    const db = getFirestore();
    const userRef = doc(db, 'users', uid);

    try {
        const userDoc = await getDoc(userRef);
        return userDoc.exists();
    } catch (error) {
        console.error('Error finding or creating user:', error);
        throw error;
    }
}

// Usage example:
/*
try {
  const user = await userIsExists({
    uid: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://example.com/profile.jpg'
  });
  console.log('User:', user);
} catch (error) {
  console.error('Failed to find or create user:', error);
}
*/

