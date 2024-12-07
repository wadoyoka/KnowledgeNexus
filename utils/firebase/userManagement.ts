import { firestore } from '@/lib/firebase';
import { UserData } from '@/types/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';



export async function CreateUser(userData: Omit<UserData, 'createdAt' | 'updatedAt'>): Promise<UserData> {
  const userRef = doc(firestore, 'users', userData.uid);

  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log('User already exists');
      return userDoc.data() as UserData;
    } else {
      console.log('Creating new user');
      const newUser: UserData = {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await setDoc(userRef, newUser);
      return newUser;
    }
  } catch (error) {
    console.error('Error finding or creating user:', error);
    throw error;
  }
}

export async function findUser(uid:string): Promise<UserData> {
  const userRef = doc(firestore, 'users', uid);

  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log('User already exists');
      return userDoc.data() as UserData;
    } else {
      throw new Error("Error finding or creating user");
    }
  } catch (error) {
    console.error('Error finding or creating user:', error);
    throw error;
  }
}

// Usage example:
/*
try {
  const user = await findOrCreateUser({
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

