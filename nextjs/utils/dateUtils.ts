import logger from "./logger";

/**
 * Formats a date string with logging for debugging
 * @param dateString - The date string to format
 * @returns Formatted date string or 'N/A' if invalid
 */
export const formatDate = (dateString: string | null | undefined): string => {
    logger.log("Formatting date:", {
        input: dateString,
        type: typeof dateString,
    });

    if (!dateString) {
        logger.log("Date string is empty or null");
        return "N/A";
    }

    try {
        const date = new Date(dateString);
        logger.log("Parsed date object:", {
            date: date,
            isValid: !isNaN(date.getTime()),
            timestamp: date.getTime(),
            toISOString: date.toISOString(),
        });

        if (isNaN(date.getTime())) {
            logger.warn("Invalid date after parsing");
            return "N/A";
        }

        const formatted = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(date);

        logger.log("Formatted result:", formatted);
        return formatted;
    } catch (error) {
        logger.error("Error formatting date:", error);
        return "N/A";
    }
};
