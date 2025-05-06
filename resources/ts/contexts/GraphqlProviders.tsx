import { TemplateCategoryGraphQLProvider } from "./template/TemplateCategoryGraphQLContext";

export default function GraphqlProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TemplateCategoryGraphQLProvider>
            {children}
        </TemplateCategoryGraphQLProvider>
    );
}
