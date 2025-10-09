export namespace TemplateUtils {
    export const validateName = (name: string) => {
        if (name.length < 3 || name.length > 255) {
            throw new Error(
                "Template name must be between 3 and 255 characters long.",
            );
        }
    };
}
