"use client";

import { useEffect, useState } from "react";

type CurrencyInfo = {
  /** True while the live exchange rate is still being fetched. */
  loading: boolean;
  /**
   * Formats a base ZAR price as USD: converts it at the live exchange
   * rate, then doubles it. e.g. R6 500 -> "$715"
   */
  formatPrice: (zarAmount: number) => string;
};

// Used only if the live exchange-rate lookup fails.
const FALLBACK_ZAR_TO_USD_RATE = 0.055;

// Module-level cache so we only hit the network once per page load,
// no matter how many components call useCurrency().
let cachedRate: number | null = null;
let ratePromise: Promise<number> | null = null;

async function fetchRate(): Promise<number> {
  if (cachedRate !== null) {
    return cachedRate;
  }

  if (!ratePromise) {
    ratePromise = (async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/ZAR");
        const data = await res.json();
        const rate = data?.rates?.USD;
        cachedRate = typeof rate === "number" ? rate : FALLBACK_ZAR_TO_USD_RATE;
      } catch (err) {
        console.error("Currency: exchange rate lookup failed — using fallback rate.", err);
        cachedRate = FALLBACK_ZAR_TO_USD_RATE;
      }
      return cachedRate;
    })();
  }

  return ratePromise;
}

/**
 * Returns a `formatPrice` helper that converts a base ZAR price to USD at
 * the live exchange rate and doubles it, e.g. "$715".
 *
 * All prices you pass in should be the base ZAR amount (the real price).
 * The rate is fetched once per page load and cached/shared across components.
 */
export function useCurrency(): CurrencyInfo {
  const [rate, setRate] = useState(FALLBACK_ZAR_TO_USD_RATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchRate().then((r) => {
      if (cancelled) return;
      setRate(r);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const formatPrice = (zarAmount: number): string => {
    const usdAmount = zarAmount * rate * 2;
    return `$${usdAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  };

  return { loading, formatPrice };
}