'use client';

import { Knowledge } from '@/types/KnowledgeResponse';
import { getKnowledgeById } from '@/utils/firebase/getKnowledgeById';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import UpdateKnowledgeForm from '../components/UpdateKnowledgeForm';

export default function UpdateKnowledgePage() {
    const { id } = useParams();
    const [knowledge, setKnowledge] = useState<Knowledge | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchKnowledge() {
            if (typeof id === 'string') {
                const fetchedKnowledge = await getKnowledgeById(id);
                setKnowledge(fetchedKnowledge);
                setIsLoading(false);
            }
        }
        fetchKnowledge();
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!knowledge) {
        return <div>Knowledge not found</div>;
    }

    return (
        <div className="min-h-screen md:p-4 bg-slate-200 flex">
            <UpdateKnowledgeForm initialKnowledge={knowledge} />
        </div>
    );
}

