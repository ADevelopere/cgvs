import { TemplateCategoryGraphQLProvider } from "../../views/(root)/(auth)/admin/categories/1-categories.apollo";
import { TemplateGraphQLProvider } from "./template.apollo";
import { TemplateVariableGraphQLProvider } from "./templateVariable/templateVariable.apollo";
import { RecipientGraphQLProvider } from "./recipient.apollo";
import { RecipientGroupGraphQLProvider } from "./recipientGroup.apollo";
import { StorageGraphQLProvider } from "./storage.apollo";
import { StudentGraphQLProvider } from "./student.apollo";

export const ApolloRepositoryProvider: React.FC<{
 children: React.ReactNode;
}> = ({ children }) => {
 return (
  <TemplateCategoryGraphQLProvider>
   <TemplateGraphQLProvider>
    <TemplateVariableGraphQLProvider>
     <RecipientGraphQLProvider>
      <RecipientGroupGraphQLProvider>
       <StorageGraphQLProvider>
        <StudentGraphQLProvider>{children}</StudentGraphQLProvider>
       </StorageGraphQLProvider>
      </RecipientGroupGraphQLProvider>
     </RecipientGraphQLProvider>
    </TemplateVariableGraphQLProvider>
   </TemplateGraphQLProvider>
  </TemplateCategoryGraphQLProvider>
 );
};
