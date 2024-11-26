'use server'

import { firebaseAdmin } from '../lib/firebase-admin';

export async function callCloudFunction(name: string, data: any) {
  try {
    const result = await firebaseAdmin.functions().httpsCallable(name)(data);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error calling Cloud Function:', error);
    return { success: false, error: 'Failed to call Cloud Function' };
  }
}

export async function callOnRequestExample() {
  try {
    const result = await firebaseAdmin.functions().httpsCallable('on_request_example')();
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error calling Cloud Function:', error);
    return { success: false, error: 'Failed to call Cloud Function' };
  }
}

