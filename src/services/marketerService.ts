import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Marketer } from '../pages/Marketers';

const COLLECTION_NAME = 'marketers';
const marketersCollection = collection(db, COLLECTION_NAME);

export const getMarketers = async (): Promise<Marketer[]> => {
    try {
        const snapshot = await getDocs(marketersCollection);
        return snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
                id: docSnap.id, // Ensure id is string
                name: data.name,
                email: data.email,
                status: data.status,
                campaigns: data.campaigns || []
            } as Marketer;
        });
    } catch (error) {
        console.error("Error fetching marketers:", error);
        throw error;
    }
};

export const addMarketer = async (marketerData: Omit<Marketer, 'id'>): Promise<Marketer> => {
    try {
        const docRef = await addDoc(marketersCollection, marketerData);
        return {
            id: docRef.id,
            ...marketerData
        } as Marketer;
    } catch (error) {
        console.error("Error adding marketer:", error);
        throw error;
    }
};

export const updateMarketer = async (id: string | number, marketerData: Partial<Marketer>): Promise<void> => {
    try {
        const marketerRef = doc(db, COLLECTION_NAME, id.toString());
        await updateDoc(marketerRef, marketerData);
    } catch (error) {
        console.error("Error updating marketer:", error);
        throw error;
    }
};

export const deleteMarketer = async (id: string | number): Promise<void> => {
    try {
        const marketerRef = doc(db, COLLECTION_NAME, id.toString());
        await deleteDoc(marketerRef);
    } catch (error) {
        console.error("Error deleting marketer:", error);
        throw error;
    }
};
