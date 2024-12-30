'use client';
import KnowledgeCards from '@/components/KnowledgeCards';
import { Button } from "@/components/ui/button";
import { firestore } from '@/lib/firebase';
import { Knowledge } from '@/types/KnowledgeResponse';
import { collection, DocumentData, getDocs, limit, query, QueryDocumentSnapshot, startAfter, where } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 10;



export default function UserFirestoreCollection() {
    const { data: session, status } = useSession();
    const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
    const [isLastPage, setIsLastPage] = useState(false);

    const transformToKnowledge = (doc: QueryDocumentSnapshot<DocumentData>): Knowledge => ({
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

    const fetchKnowledges = async (isNextPage: boolean = false) => {
        if (!session?.user?.id) return;

        setLoading(true);
        setError(null);

        try {
            let q = query(
                collection(firestore, `${process.env.NEXT_PUBLIC_FIREBASE_CLOUD_FIRESTORE_DOCUMENT}`),
                where("uid", "==", session.user.id),
                limit(ITEMS_PER_PAGE)
            );

            if (isNextPage && lastVisible) {
                q = query(q, startAfter(lastVisible));
            } else if (isNextPage) {
                // If we're trying to go to the next page but don't have a lastVisible,
                // it means we're already at the last page
                setIsLastPage(true);
                setLoading(false);
                return;
            }

            const querySnapshot = await getDocs(q);
            const newKnowledges = querySnapshot.docs.map(transformToKnowledge);

            if (isNextPage) {
                setKnowledges(prevKnowledges => [...prevKnowledges, ...newKnowledges]);
            } else {
                setKnowledges(newKnowledges);
            }

            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
            setIsLastPage(querySnapshot.docs.length < ITEMS_PER_PAGE);
        } catch (err) {
            setError('Failed to fetch knowledges');
            console.error('Error fetching knowledges:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.id) {
            fetchKnowledges();
        }
    }, [session]);

    const handleLoadMore = () => {
        fetchKnowledges(true);
    };

    if (status === "loading" || loading) {
        return <div className='min-h-screen'><div className="w-full h-full flex my-auto items-center"><Loader2 className="mx-auto mt-4 w-12 h-12 md:h-24 md:w-24 animate-spin" /></div></div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const deleteKnowledge = (knowledgeId: string) => {
        setKnowledges(prevKnowledges => prevKnowledges.filter(element => element.id !== knowledgeId));
    };

    return (
        <div>
            <KnowledgeCards knowledges={knowledges} deleteKnowledge={deleteKnowledge}/>
            {!isLastPage && (
                <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="flex mt-4 mx-auto"
                >
                    {loading ? 'Loading...' : 'Load More'}
                </Button>
            )}
        </div>
    );
}

