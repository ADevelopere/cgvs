import { Template } from "@/client/graphql/generated/gql/graphql";
import { TemplateUpdateInput } from "@/server/graphql/template/template.types";

export const mapTemplateToUpdateInput = (
    template: Template,
): TemplateUpdateInput => {
    if (!template.category) {
        throw new Error("Template category is required");
    }
    return {
        id: template.id,
        name: template.name,
        description: template.description,
        categoryId: template.category?.id,
    };
};
