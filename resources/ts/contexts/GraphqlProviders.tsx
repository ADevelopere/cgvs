import { TemplateCategoryGraphQLProvider } from "./template/TemplateCategoryGraphQLContext";
import { TemplateGraphQLProvider } from "./template/TemplateGraphQLContext";

export default function GraphqlProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TemplateCategoryGraphQLProvider>
            <TemplateGraphQLProvider>{children}</TemplateGraphQLProvider>
        </TemplateCategoryGraphQLProvider>
    );
}
