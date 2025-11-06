import * as GQL from "@/client/graphql/generated/gql/graphql";

// Random verification code generator
const generateVerificationCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
};

const studentEmailPreview = "example@email.com";

/**
 * Resolves text content from a TextElement's data source
 * Returns preview/dummy data for certificate and student fields
 */
export function resolveTextContent(
  dataSource: GQL.TextDataSource | null | undefined,
  language: GQL.AppLanguage,
  fallbackText: string = "Text"
): string {
  if (!dataSource) {
    return fallbackText;
  }

  // Static text
  if (dataSource.__typename === "TextDataSourceStatic") {
    return dataSource.value || fallbackText;
  }

  // Certificate field
  if (dataSource.__typename === "TextDataSourceCertificateField") {
    if (dataSource.certificateField === GQL.CertificateTextField.VerificationCode) {
      return generateVerificationCode();
    }
    return `{{${dataSource.certificateField}}}`;
  }

  // Student field
  if (dataSource.__typename === "TextDataSourceStudentField") {
    if (dataSource.studentField === GQL.StudentTextField.StudentEmail) {
      return studentEmailPreview;
    }
    return `{{${dataSource.studentField}}}`;
  }

  // Template variables (text or select)
  if (dataSource.__typename === "TextDataSourceTemplateTextVariable") {
    return `{{TextVariable#${dataSource.textVariableId}}}`;
  }

  if (dataSource.__typename === "TextDataSourceTemplateSelectVariable") {
    return `{{SelectVariable#${dataSource.selectVariableId}}}`;
  }

  return fallbackText;
}
