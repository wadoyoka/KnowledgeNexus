import { firestore } from '@/lib/firebase';
import { collection, DocumentReference, getDocs, query, updateDoc, where, writeBatch } from 'firebase/firestore';

/**
 * Updates the 'name' field for all documents in the KnowledgeNexus collection
 * that match the given uid.
 * 
 * @param uid The uid to match documents against
 * @param newName The new name to set for matching documents
 * @returns A promise that resolves with the number of updated documents
 */
export async function updateKnowledgeNexusNames(uid: string, newName: string): Promise<number> {
  const knowledgeNexusRef = collection(firestore, 'KnowledgeNexus');
  const usersRef = collection(firestore, 'users');
  const q = query(knowledgeNexusRef, where('uid', '==', uid));
  const userQ = query(usersRef, where('uid', '==', uid));

  let totalUpdated = 0;

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`No documents found with uid: ${uid}`);
      return 0;
    }

    const userQuerySnapShot = await getDocs(userQ);

    if (userQuerySnapShot.empty) {
      console.log('指定されたuidを持つユーザーが見つかりません');
      return 0;
    }

    const userDoc = userQuerySnapShot.docs[0];
    await updateDoc(userDoc.ref, {
      name: newName
    });

    const totalDocs = querySnapshot.size;
    console.log(`Found ${totalDocs} documents to update`);

    // Process in batches of 500 (Firestore limit)
    const batchSize = 500;
    let batch = writeBatch(firestore);
    let count = 0;

    for (const doc of querySnapshot.docs) {
      batch.update(doc.ref as DocumentReference, { name: newName });
      count++;
      totalUpdated++;

      if (count === batchSize || totalUpdated === totalDocs) {
        await batch.commit();
        console.log(`Batch update completed. Total updated: ${totalUpdated}`);

        // Reset batch and count if there are more documents
        if (totalUpdated < totalDocs) {
          batch = writeBatch(firestore);
          count = 0;
        }
      }
    }

    console.log(`Successfully updated ${totalUpdated} documents`);
    return totalUpdated;
  } catch (error) {
    console.error('Error updating documents:', error);
    throw new Error(`Failed to update documents: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Usage example:
/*
async function updateNames() {
  try {
    const updatedCount = await updateKnowledgeNexusNames('user123', 'New Name');
    console.log(`Updated ${updatedCount} documents`);
  } catch (error) {
    console.error('Failed to update documents:', error);
    // Handle the error appropriately (e.g., show user feedback, log to monitoring service)
  }
}

updateNames();
*/

