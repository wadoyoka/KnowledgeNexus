import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

export async function callCloudFunction(name: string, data?: any) {
  try {
    const functionRef = httpsCallable(functions, name);
    const result = await functionRef(data);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error calling Cloud Function:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

