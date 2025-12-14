"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  COLLECTIONS,
  CreateHeistInput,
  heistConverter,
} from "@/types/firestore";
import { useUser } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import styles from "./HeistForm.module.css";

export default function HeistForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState<{ id: string; codename: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.uid) return;

      setIsLoadingUsers(true);
      try {
        const usersRef = collection(db, COLLECTIONS.USERS);
        const snapshot = await getDocs(usersRef);

        const usersList = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            codename: doc.data().codename as string,
          }))
          .filter((u) => u.id !== user.uid);

        setUsers(usersList);
      } catch {
        setError("Failed to load users. Please refresh the page.");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user?.uid]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // 1. Validate fields
    if (!title.trim() || !description.trim() || !selectedUserId) {
      setError("Please fill in all required fields");
      return;
    }

    // 2. Find selected user's codename
    const selectedUser = users.find((u) => u.id === selectedUserId);
    if (!selectedUser) {
      setError("Selected user not found");
      return;
    }

    // 3. Check authentication
    if (!user?.uid || !user?.displayName) {
      setError("You must be logged in to create a heist");
      return;
    }

    setIsLoading(true);

    try {
      // 4. Calculate deadline (48 hours from now)
      const deadline = new Date();
      deadline.setHours(deadline.getHours() + 48);

      // 5. Create heist input
      const heistInput: CreateHeistInput = {
        title: title.trim(),
        description: description.trim(),
        createdBy: user.uid,
        createdByCodename: user.displayName,
        createdFor: selectedUserId,
        createdForCodename: selectedUser.codename,
        createdAt: serverTimestamp(),
        deadline: deadline,
        isActive: true,
        finalStatus: null,
      };

      // 6. Submit to Firestore
      const heistsRef = collection(db, COLLECTIONS.HEISTS).withConverter(
        heistConverter,
      );
      await addDoc(heistsRef, heistInput);

      // 7. Show success and redirect
      setSuccess(true);
      setTimeout(() => {
        router.push("/heists");
      }, 1500);
    } catch (err) {
      console.error("Error creating heist:", err);
      setError("Failed to create heist. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        type="text"
        name="title"
        label="Title"
        placeholder="e.g., Steal the stapler"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        name="description"
        label="Description"
        placeholder="Describe the heist mission..."
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      <Select
        name="assignTo"
        label="Assign To"
        required
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        <option value="">
          {isLoadingUsers ? "Loading users..." : "Select a user..."}
        </option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.codename}
          </option>
        ))}
      </Select>

      {error && <p className={styles.error}>{error}</p>}
      {success && (
        <p className={styles.success}>
          Heist created successfully! Redirecting...
        </p>
      )}

      <button
        type="submit"
        className="btn"
        disabled={isLoading || isLoadingUsers || users.length === 0}
      >
        {isLoading ? "Creating Heist..." : "Create Heist"}
      </button>
    </form>
  );
}
