import { firestore } from '@/lib/firebase';
import { Knowledge } from '@/types/KnowledgeResponse';
import { doc, getDoc } from 'firebase/firestore';

export async function getKnowledgeById(id: string): Promise<Knowledge | null> {
    const docRef = doc(firestore, 'KnowledgeNexus', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Knowledge;
    } else {
        console.log('No such document!');
        return null;
    }
}

