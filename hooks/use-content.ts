"use client";

import { useState, useEffect, useCallback } from "react";

// This hook will be used to fetch and manage the site content globally
export function useContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/config");
      if (!response.ok) throw new Error("Failed to fetch content");
      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateContent = async (newData: any) => {
    // This can be used for local preview before saving
    setData(newData);
  };

  return { data, loading, error, refresh: fetchContent, updateContent };
}
