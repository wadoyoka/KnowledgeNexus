'use client'

import { callCloudFunction } from '@/utils/callCloudFunction';
import { useState } from 'react';

export default function CloudFunctionCaller() {
  const [result, setResult] = useState<string | null>(null);

  const handleCallFunction = async () => {
    const response = await callCloudFunction('yourFunctionName', { key: 'value' });
    if (response.success) {
      setResult(JSON.stringify(response.data));
    } else {
      setResult('Error: ' + response.error);
    }
  };

  return (
    <div>
      <button onClick={handleCallFunction}>Call Cloud Function</button>
      {result && <pre>{result}</pre>}
    </div>
  );
}

