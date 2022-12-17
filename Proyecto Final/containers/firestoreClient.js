import admin from "firebase-admin";
import { CNX_STR_FIRESTORE } from '../config/config.js';
import fs from 'fs';

const serviceAccount = JSON.parse(await fs.promises.readFile(CNX_STR_FIRESTORE, 'utf-8'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const firestoreDatabase = admin.firestore();