import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccountKey =
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountKey) {
    throw new Error(
      'Firebase service account not found. Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_SERVICE_ACCOUNT in your environment variables.'
    );
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountKey);
  } catch {
    throw new Error('Firebase service account key is not valid JSON.');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'perfume-adbcb',
  });
}

export const adminDb = admin.firestore();
export default admin;
