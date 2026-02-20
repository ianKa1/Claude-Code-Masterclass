"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { serverTimestamp } from "firebase/firestore";
import { useUser } from "@/lib/firebase/auth-context";
import { fetchUsers } from "@/lib/firebase/fetchUsers";
import { createHeist } from "@/lib/firebase/createHeist";
import type { UserDoc } from "@/types/firestore/user";
import type { CreateHeistInput } from "@/types/firestore/heist";
import styles from "./CreateHeist.module.css";

export default function CreateHeistPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToUid, setAssignedToUid] = useState("");

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [assignedToError, setAssignedToError] = useState("");
  const [firebaseError, setFirebaseError] = useState("");

  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<UserDoc[]>([]);

  useEffect(() => {
    if (authLoading || !user) return;

    const loadUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const allUsers = await fetchUsers();
        const filteredUsers = allUsers.filter((u) => u.id !== user.uid);
        setUsers(filteredUsers);
      } catch {
        setFirebaseError("Failed to load agents. Please refresh the page.");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, [authLoading, user]);

  const validateTitle = (value: string): string => {
    if (!value.trim()) return "Title is required";
    if (value.length > 20) return "Title must be 20 characters or less";
    return "";
  };

  const validateDescription = (value: string): string => {
    if (!value.trim()) return "Description is required";
    if (value.length > 200) return "Description must be 200 characters or less";
    return "";
  };

  const validateAssignedTo = (value: string): string => {
    if (!value) return "Please select an agent to assign this heist to";
    return "";
  };

  const handleTitleBlur = () => {
    setTitleError(validateTitle(title));
  };

  const handleDescriptionBlur = () => {
    setDescriptionError(validateDescription(description));
  };

  const handleAssignedToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAssignedToUid(e.target.value);
    setAssignedToError("");
  };

  const handleCancel = () => {
    router.push("/heists");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const titleErr = validateTitle(title);
    const descErr = validateDescription(description);
    const assignedErr = validateAssignedTo(assignedToUid);

    setTitleError(titleErr);
    setDescriptionError(descErr);
    setAssignedToError(assignedErr);

    if (titleErr || descErr || assignedErr) return;

    const selectedUser = users.find((u) => u.id === assignedToUid);
    if (!selectedUser) {
      setFirebaseError("Selected agent not found");
      return;
    }

    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 48);

    const heistInput: CreateHeistInput = {
      title: title.trim(),
      description: description.trim(),
      createdBy: user!.uid,
      createdByCodename: user!.displayName ?? "Unknown",
      assignedTo: assignedToUid,
      assignedToCodename: selectedUser.codename,
      deadline,
      finalStatus: null,
      createdAt: serverTimestamp(),
    };

    setFirebaseError("");
    setIsSubmitting(true);
    try {
      await createHeist(heistInput);
      router.push("/heists");
    } catch {
      setFirebaseError("Failed to create heist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUsers) {
    return (
      <div className="center-content">
        <div className="page-content">
          <h2 className="form-title">Create a New Heist</h2>
          <p className={styles.warningText}>Loading agents...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="center-content">
        <div className="page-content">
          <h2 className="form-title">Create a New Heist</h2>
          <p className={styles.warningText}>
            No other agents available. You need at least one other agent to
            create a heist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Create a New Heist</h2>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          aria-label="Create heist form"
        >
          <div className={styles.inputGroup}>
            <label htmlFor="title" className={styles.label}>
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className={styles.input}
              placeholder="Museum Diamond Heist"
              maxLength={20}
            />
            {titleError && <p className={styles.errorText}>{titleError}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              className={styles.textarea}
              placeholder="Infiltrate the museum and retrieve the rare diamond..."
              maxLength={200}
            />
            {descriptionError && (
              <p className={styles.errorText}>{descriptionError}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="assignedTo" className={styles.label}>
              Assign To
            </label>
            <select
              id="assignedTo"
              value={assignedToUid}
              onChange={handleAssignedToChange}
              className={styles.select}
            >
              <option value="">Select an agent</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.codename}
                </option>
              ))}
            </select>
            {assignedToError && (
              <p className={styles.errorText}>{assignedToError}</p>
            )}
          </div>

          {firebaseError && <p className={styles.errorText}>{firebaseError}</p>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitBtn}
            >
              {isSubmitting ? (
                <span className={styles.spinner} />
              ) : (
                "Create Heist"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
