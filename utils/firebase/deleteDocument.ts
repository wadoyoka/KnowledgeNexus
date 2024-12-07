import { firestore } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";

export default async function deleteDocument (collectionName: string, docId: string):Promise<boolean> {
    try {
        const docRef = doc(firestore, collectionName, docId);
        await deleteDoc(docRef);
        console.log("Document successfully deleted!");
        return true;
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
};

