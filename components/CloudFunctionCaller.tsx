'use client'

import { useState } from 'react';
import { callCloudFunction } from '../utils/callCloudFunction';

export default function CloudFunctionCaller() {
    const [result, setResult] = useState<string | null>(null);

    const handleCallFunction = async () => {
        const response = await callCloudFunction('on_request_example');
        if (response.success) {
            setResult(JSON.stringify(response.data));
        } else {
            setResult('Error: ' + response.error);
        }
    };

    return (
        <div className="p-4">
            <button
                onClick={handleCallFunction}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
                Call on_request_example
            </button>
            {result && <pre className="mt-4 p-2 bg-gray-100 rounded">{result}</pre>}
        </div>
    );
}

