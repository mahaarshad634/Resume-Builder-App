import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { defaultResumeData } from "../utils/defaultResumeData";

// Helper: reference to a specific user's resumes subcollection
const resumesRef = (uid) => collection(db, "users", uid, "resumes");

// Create a new blank resume for a user
export async function createResume(uid) {
  const docRef = await addDoc(resumesRef(uid), {
    ...defaultResumeData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Get all resumes belonging to a user
export async function getResumes(uid) {
  const snapshot = await getDocs(resumesRef(uid));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

// Get one specific resume by ID
export async function getResume(uid, resumeId) {
  const docRef = doc(db, "users", uid, "resumes", resumeId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("Resume not found");
  }

  return { id: snapshot.id, ...snapshot.data() };
}

// Update an existing resume with new data
export async function updateResume(uid, resumeId, data) {
  const docRef = doc(db, "users", uid, "resumes", resumeId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete a resume permanently
export async function deleteResume(uid, resumeId) {
  const docRef = doc(db, "users", uid, "resumes", resumeId);
  await deleteDoc(docRef);
}

// Duplicate an existing resume as a new document
export async function duplicateResume(uid, resumeId) {
  const original = await getResume(uid, resumeId);
  const { id, createdAt, updatedAt, ...rest } = original;

  const docRef = await addDoc(resumesRef(uid), {
    ...rest,
    title: `${rest.title} (Copy)`,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}