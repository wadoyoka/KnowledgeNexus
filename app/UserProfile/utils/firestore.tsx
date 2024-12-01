'use client';
import { firestore } from '@/lib/firebase';
import { collection, limit, query, where } from 'firebase/firestore';
import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

export const FirestoreCollection = () => {
    const [value, loading, error] = useCollection(
        query(
            collection(firestore, `${process.env.NEXT_PUBLIC_FIREBASE_CLOUD_FIRESTORE_DOCUMENT}`),
            where("name", "==", "榎本篤志"),
            limit(10),
        ),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    return (
        <div>
            <p>
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <span>Collection: Loading...</span>}
                {value && (
                    <span>
                        Collection:{' '}
                        {value.docs.map((doc) => (
                            <React.Fragment key={doc.id}>
                                {JSON.stringify(doc.data())},{' '}
                            </React.Fragment>
                        ))}
                    </span>
                )}
            </p>
        </div>
    );
};