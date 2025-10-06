export const validateStudentName = (name: string): Promise<string | null> => {
    if (name.length < 3 || name.length > 255) {
        return Promise.resolve(
            "Template name must be between 3 and 255 characters long.",
        );
    }
    return Promise.resolve(null);
};
