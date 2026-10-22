"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { ServicePricingCopy } from "@/lib/public-copy";

export function usePublicPricingCopy() {
  const [copy, setCopy] = useState<ServicePricingCopy | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void apiRequest<{ pricing: ServicePricingCopy }>("/config/pricing-copy")
      .then(({ pricing }) => {
        if (active) setCopy(pricing);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Service pricing details could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { copy, error, loading };
}
