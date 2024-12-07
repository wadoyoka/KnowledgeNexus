'use client';
import KnowledgeCards from '@/components/KnowledgeCards';
import { firestore } from '@/lib/firebase';
import { Knowledge } from '@/types/KnowledgeResponse';
import { collection, DocumentData, limit, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function UserFirestoreCollection() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    const [value, loading, error] = useCollection(
        session?.user?.email
            ? query(
                collection(firestore, `${process.env.NEXT_PUBLIC_FIREBASE_CLOUD_FIRESTORE_DOCUMENT}`),
                where("email", "==", session.user.email),
                limit(10)
            )
            : null,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/Signin?callbackUrl=${pathname}`);
        }
    }, [status, router, pathname]);

    const transformToKnowledge = (doc: QueryDocumentSnapshot<DocumentData, DocumentData>): Knowledge => ({
        id: doc.id,
        uid: doc.data().uid || '',
        name: doc.data().name || '',
        email: doc.data().email || '',
        image: doc.data().image || '',
        urls: doc.data().urls || {},
        text_field: doc.data().text_field || '',
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().toISOString() : '',
        updateAt: doc.data().updateAt ? doc.data().updateAt.toDate().toISOString() : '',
    });

    const knowledges: Knowledge[] = value?.docs.map(transformToKnowledge) || [];

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {error && <span>Error: {JSON.stringify(error)}</span>}
            {loading && <span>Collection: Loading...</span>}
            {value && <KnowledgeCards knowledges={knowledges} />}
        </div>
    );
}

