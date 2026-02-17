import type {
  DocumentData,
  FieldValue,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export type HeistFinalStatus = "success" | "failure";

// Document — what you read from Firestore (after conversion)
export interface Heist {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdByCodename: string;
  assignedTo: string;
  assignedToCodename: string;
  deadline: Date;
  finalStatus: HeistFinalStatus | null;
  createdAt: Date;
}

// Create Input — what you pass to addDoc
export interface CreateHeistInput {
  title: string;
  description: string;
  createdBy: string;
  createdByCodename: string;
  assignedTo: string;
  assignedToCodename: string;
  deadline: Date;
  finalStatus: null;
  createdAt: FieldValue;
}

// Update Input — partial fields for updateDoc (no createdAt)
export interface UpdateHeistInput {
  title?: string;
  description?: string;
  assignedTo?: string;
  assignedToCodename?: string;
  deadline?: Date;
  finalStatus?: HeistFinalStatus | null;
}

// Converter — handles Timestamp → Date for deadline and createdAt
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
