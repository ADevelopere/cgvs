/**
 * Formats a date string with logging for debugging
 * @param dateString - The date string to format
 * @returns Formatted date string or 'N/A' if invalid
 */
export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
        return "N/A";
    }

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
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

        return formatted;
    } catch {
        return "N/A";
    }
};
