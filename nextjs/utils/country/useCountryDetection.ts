"use client";
import { useState, useEffect } from "react";
import { loadFromLocalStorage } from "../localStorage";

interface CountryDetectionResult {
    countryCode: string;
    countryCodeLoading: boolean;
    countryCodeError: string | null;
}

const MAX_REQUESTS_PER_DAY = 5;

const detectCountry = async (
    setCountryCode: (code: string) => void,
    setError: (error: string | null) => void,
    setLoading: (loading: boolean) => void,
    defaultCountryCode: string,
) => {
    try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.status === 429) {
            setError("Request limit reached for today");
            setLoading(false);
            return;
        }
        const data: { country_code: string } = await response.json();
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("countryCode", data.country_code);
            localStorage.setItem(
                "countryCodeFetchDate",
                new Date().toISOString(),
            );
        }
        setCountryCode(data.country_code);
    } catch {
        setError("Failed to detect country");
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(
                "countryCodeRequestCount",
                MAX_REQUESTS_PER_DAY.toString(),
            );
            localStorage.setItem("countryCode", defaultCountryCode);
        }
        setCountryCode(defaultCountryCode);
    } finally {
        if (typeof localStorage !== "undefined") {
            const storedRequestCount = loadFromLocalStorage<string>(
                "countryCodeRequestCount",
            );
            const requestCount = storedRequestCount
                ? parseInt(storedRequestCount, 10)
                : 0;
            localStorage.setItem(
                "countryCodeRequestCount",
                (requestCount + 1).toString(),
            );
        }
        setLoading(false);
    }
};

const fetchCountryCode = (
    setCountryCode: (code: string) => void,
    setError: (error: string | null) => void,
    setLoading: (loading: boolean) => void,
    defaultCountryCode: string,
) => {
    if (typeof localStorage !== "undefined") {
        const storedCountryCode = loadFromLocalStorage<string>("countryCode");
        const storedFetchDate = loadFromLocalStorage<string>(
            "countryCodeFetchDate",
        );
        const storedRequestCount = loadFromLocalStorage<string>(
            "countryCodeRequestCount",
        );
        const fetchDate = storedFetchDate ? new Date(storedFetchDate) : null;
        const now = new Date();
        const requestCount = storedRequestCount
            ? parseInt(storedRequestCount, 10)
            : 0;

        if (
            storedCountryCode &&
            fetchDate &&
            now.getDate() === fetchDate.getDate()
        ) {
            if (requestCount < MAX_REQUESTS_PER_DAY) {
                localStorage.setItem(
                    "countryCodeRequestCount",
                    (requestCount + 1).toString(),
                );
                setCountryCode(storedCountryCode);
                setLoading(false);
                return;
            } else {
                setError("Request limit reached for today");
                localStorage.setItem(
                    "countryCodeRequestCount",
                    MAX_REQUESTS_PER_DAY.toString(),
                );
                setLoading(false);
                return;
            }
        } else if (storedCountryCode && (!fetchDate || !storedRequestCount)) {
            localStorage.setItem(
                "countryCodeFetchDate",
                new Date().toISOString(),
            );
            localStorage.setItem("countryCodeRequestCount", "1");
            setCountryCode(storedCountryCode);
            setLoading(false);
            return;
        }
    }
    detectCountry(setCountryCode, setError, setLoading, defaultCountryCode);
};

const useCountryDetection = (
    timeout: number = 2000,
    defaultCountryCode: string = "SA",
): CountryDetectionResult => {
    const [countryCode, setCountryCode] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (loading) {
                setCountryCode(defaultCountryCode);
                setLoading(false);
            }
        }, timeout);

        if (typeof localStorage !== "undefined") {
            const storedCountryCode =
                loadFromLocalStorage<string>("countryCode");
            const storedFetchDate = loadFromLocalStorage<string>(
                "countryCodeFetchDate",
            );
            const fetchDate = storedFetchDate
                ? new Date(storedFetchDate)
                : null;
            const now = new Date();

            if (
                storedCountryCode &&
                fetchDate &&
                now.getDate() === fetchDate.getDate()
            ) {
                setCountryCode(storedCountryCode);
                setLoading(false);
            } else {
                fetchCountryCode(
                    setCountryCode,
                    setError,
                    setLoading,
                    defaultCountryCode,
                );
            }
        } else {
            fetchCountryCode(
                setCountryCode,
                setError,
                setLoading,
                defaultCountryCode,
            );
        }

        return () => clearTimeout(timeoutId);
    }, [loading, timeout, defaultCountryCode]);

    return {
        countryCode: countryCode ?? defaultCountryCode,
        countryCodeLoading: loading,
        countryCodeError: error,
    };
};

export default useCountryDetection;
