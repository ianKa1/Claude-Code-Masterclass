import {
  FieldValue,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

// Document — what you read from Firestore (after conversion)
export interface Heist {
  id: string;
  createdAt: Date;
  title: string;
  description: string;
  createdBy: string; // uid
  createdByCodename: string;
  createdFor: string; // uid
  createdForCodename: string;
  deadline: Date;
  isActive: boolean;
  finalStatus: "success" | "failure" | null;
}

// Create Input — what you pass to addDoc
export interface CreateHeistInput {
  createdAt: FieldValue; // serverTimestamp()
  title: string;
  description: string;
  createdBy: string;
  createdByCodename: string;
  createdFor: string;
  createdForCodename: string;
  deadline: Date;
  isActive: boolean;
  finalStatus: "success" | "failure" | null;
}

// Update Input — partial fields for updateDoc (no createdAt)
export interface UpdateHeistInput {
  title?: string;
  description?: string;
  createdBy?: string;
  createdByCodename?: string;
  createdFor?: string;
  createdForCodename?: string;
  deadline?: Date;
  isActive?: boolean;
  finalStatus?: "success" | "failure" | null;
}

// Converter
export const heistConverter = {
  toFirestore: (data: Partial<Heist>): DocumentData => data,

  fromFirestore: (snapshot: QueryDocumentSnapshot): Heist =>
    ({
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate(),
      deadline: snapshot.data().deadline?.toDate(),
    }) as Heist,
};
