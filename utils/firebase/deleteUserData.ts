import { firestore, storage } from '@/lib/firebase';
import { collection, DocumentReference, getDocs, query, Query, QuerySnapshot, where, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

const BATCH_SIZE = 500; // Firestore batch size limit

async function deleteUserDocuments(db: any, collectionName: string, uid: string) {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where("uid", "==", uid));
  
  let deletedCount = 0;
  let lastDoc: DocumentReference | null = null;

  do {
    const batch = writeBatch(db);
    let currentQuery: Query = lastDoc ? query(q, where("__name__", ">", lastDoc)) : q;
    const snapshot: QuerySnapshot = await getDocs(currentQuery);

    if (snapshot.empty) {
      break;
    }

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
      deletedCount++;
    });

    await batch.commit();
    lastDoc = snapshot.docs[snapshot.docs.length - 1].ref;
  } while (lastDoc);

  return deletedCount;
}

async function deleteUserStorageFiles(storage: any, uid: string) {
  const profileImagesRef = ref(storage, `profile-images/${uid}/profile.webp`);
  
  try {
    await deleteObject(profileImagesRef);
    console.log('Deleted profile image from Storage');
  } catch (error) {
    console.log('No profile image found or error deleting:', error);
  }
}

export async function deleteUserData(uid: string): Promise<void> {

  try {
    // Delete documents from KnowledgeNexus collection
    const knowledgeNexusDeleted = await deleteUserDocuments(firestore, 'KnowledgeNexus', uid);
    console.log(`Deleted ${knowledgeNexusDeleted} documents from KnowledgeNexus for user ${uid}`);

    // Delete documents from users collection
    const usersDeleted = await deleteUserDocuments(firestore, 'users', uid);
    console.log(`Deleted ${usersDeleted} documents from users for user ${uid}`);

    // Delete user files from Storage
    await deleteUserStorageFiles(storage, uid);

  } catch (error) {
    console.error('Error deleting user data:', error);
    throw new Error('Failed to delete user data');
  }
}

