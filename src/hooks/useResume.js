import { useEffect, useState, useRef } from "react";
import { getResume, updateResume } from "../services/resumeService";

export function useResume(uid, resumeId) {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const isFirstLoad = useRef(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getResume(uid, resumeId);
        if (isMounted) {
          setResumeData(data);
          isFirstLoad.current = true;
        }
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
    isFirstLoad.current = false;
    setIsDirty(true);
  };

  const save = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await updateResume(uid, resumeId, resumeData);
      setIsDirty(false);
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
    isDirty,
    updateSection,
    save,
  };
}