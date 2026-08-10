import { useEffect, useState } from "react";
import { getResume, updateResume } from "../services/resumeService";

export function useResume(uid, resumeId) {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getResume(uid, resumeId);
        if (isMounted) setResumeData(data);
      } catch (err) {
        if (isMounted) setError("Could not load this resume.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (uid && resumeId) load();

    return () => {
      isMounted = false;
    };
  }, [uid, resumeId]);

  const updateSection = (sectionKey, value) => {
    setResumeData((prev) => ({ ...prev, [sectionKey]: value }));
  };

  const save = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await updateResume(uid, resumeId, resumeData);
    } catch (err) {
      setSaveError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return {
    resumeData,
    loading,
    saving,
    error,
    saveError,
    updateSection,
    save,
  };
}