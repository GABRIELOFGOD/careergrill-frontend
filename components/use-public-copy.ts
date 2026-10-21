"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { PublicCopyConfiguration } from "@/lib/public-copy";

export function usePublicCopy() {
  const [copy, setCopy] = useState<PublicCopyConfiguration | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void apiRequest<PublicCopyConfiguration>("/config")
      .then((result) => {
        if (active) setCopy(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Public business content could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { copy, error, loading };
}
