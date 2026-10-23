"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function GoogleTagManager() {
  const [containerId, setContainerId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void apiRequest<{ gtm_container_id: string | null }>("/config/analytics")
      .then(({ gtm_container_id: id }) => {
        if (!active) return;
        if (id !== null && !/^GTM-[A-Z0-9]+$/.test(id)) {
          throw new Error("The analytics configuration returned an invalid Google Tag Manager ID.");
        }
        setContainerId(id);
      })
      .catch((error: unknown) => {
        if (active) console.error("Google Tag Manager configuration could not be loaded.", error);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!containerId) return null;

  return (
    <Script id="google-tag-manager" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!=='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(containerId)});`}
    </Script>
  );
}
