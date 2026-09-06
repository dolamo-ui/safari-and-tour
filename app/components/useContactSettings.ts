"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { defaultContactSettings, type ContactSettings } from "../lib/siteSettings";

export function useContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>(defaultContactSettings);

  useEffect(() => {
    return onSnapshot(doc(db, "siteSettings", "contact"), (snapshot) => {
      const data = snapshot.data();
      setSettings({
        phone: typeof data?.phone === "string" ? data.phone : defaultContactSettings.phone,
        alternativePhone: typeof data?.alternativePhone === "string" ? data.alternativePhone : defaultContactSettings.alternativePhone,
      });
    });
  }, []);

  return settings;
}
