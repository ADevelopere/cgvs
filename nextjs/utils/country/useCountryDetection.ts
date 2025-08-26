"use client";
import { useState, useEffect } from "react";
import logger from "../logger";
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
    logger.log("Starting country detection");
    try {
        const response = await fetch("https://ipapi.co/json/");
        logger.log("Response received", response);
        if (response.status === 429) {
            setError("Request limit reached for today");
            setLoading(false);
            logger.log("Request limit reached for today");
            return;
        }
        const data: { country_code: string } = await response.json();
        logger.log("Country data received", data);
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("countryCode", data.country_code);
            localStorage.setItem(
                "countryCodeFetchDate",
                new Date().toISOString(),
            );
            logger.log("Country code and fetch date stored in localStorage");
        }
        setCountryCode(data.country_code);
    } catch (err) {
        setError("Failed to detect country");
        logger.error("Error detecting country", err);
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(
                "countryCodeRequestCount",
                MAX_REQUESTS_PER_DAY.toString(),
            );
            localStorage.setItem("countryCode", defaultCountryCode);
            logger.log(
                "Request count set to max and default country code stored in localStorage",
            );
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
            logger.log(
                "Request count updated in localStorage",
                requestCount + 1,
            );
        }
        setLoading(false);
        logger.log("Country detection finished");
    }
};

const fetchCountryCode = (
    setCountryCode: (code: string) => void,
    setError: (error: string | null) => void,
    setLoading: (loading: boolean) => void,
    defaultCountryCode: string,
) => {
    logger.log("Fetching country code");
    if (typeof localStorage !== "undefined") {
        const storedCountryCode = loadFromLocalStorage<string>("countryCode");
        const storedFetchDate = loadFromLocalStorage<string>("countryCodeFetchDate");
        const storedRequestCount = loadFromLocalStorage<string>(
            "countryCodeRequestCount",
        );
        const fetchDate = storedFetchDate ? new Date(storedFetchDate) : null;
        const now = new Date();
        const requestCount = storedRequestCount
            ? parseInt(storedRequestCount, 10)
            : 0;

        logger.log("LocalStorage values", {
            storedCountryCode,
            storedFetchDate,
            storedRequestCount,
        });

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
                logger.log(
                    "Country code fetched from localStorage",
                    storedCountryCode,
                );
                return;
            } else {
                setError("Request limit reached for today");
                localStorage.setItem(
                    "countryCodeRequestCount",
                    MAX_REQUESTS_PER_DAY.toString(),
                );
                setLoading(false);
                logger.log("Request limit reached for today");
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
            logger.log(
                "Country code set but fetch date or request count missing, updated localStorage",
            );
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

    logger.log("useCountryDetection started");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (loading) {
                setCountryCode(defaultCountryCode);
                setLoading(false);
                logger.log(
                    "Timeout reached, setting default country code",
                    defaultCountryCode,
                );
            }
        }, timeout);

        if (typeof localStorage !== "undefined") {
            const storedCountryCode = loadFromLocalStorage<string>("countryCode");
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
                logger.log(
                    "Country code fetched from localStorage",
                    storedCountryCode,
                );
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

    logger.log("useCountryDetection finished");

    return {
        countryCode: countryCode ?? defaultCountryCode,
        countryCodeLoading: loading,
        countryCodeError: error,
    };
};

export default useCountryDetection;
