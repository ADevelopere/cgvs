/* eslint-disable */
import type { Prisma, Certificate, RecipientGroupItemVariableValue, TemplateRecipientGroupItem, TemplateRecipientGroup, StorageFile, FileUsage, StorageDirectory, Student, TemplateConfigs, TemplateCategory, Template, TemplateElements, TemplateStaticTextElements, TemplateDataTextElements, TemplateQrCodeElements, TemplateImageElements, TemplateDataDateElements, TemplateVariableBase, TextTemplateVariable, NumberTemplateVariable, DateTemplateVariable, SelectTemplateVariable, Session, PasswordResetTokens, Users } from "/home/pc/Projects/cgsvNew/node_modules/@prisma/client/index.js";
export default interface PrismaTypes {
    Certificate: {
        Name: "Certificate";
        Shape: Certificate;
        Include: Prisma.CertificateInclude;
        Select: Prisma.CertificateSelect;
        OrderBy: Prisma.CertificateOrderByWithRelationInput;
        WhereUnique: Prisma.CertificateWhereUniqueInput;
        Where: Prisma.CertificateWhereInput;
        Create: Prisma.CertificateCreateInput;
        Update: Prisma.CertificateUpdateInput;
        RelationName: "template" | "student" | "templateRecipientGroup";
        ListRelations: never;
        Relations: {
            template: {
                Shape: Template;
                Name: "Template";
                Nullable: false;
            };
            student: {
                Shape: Student;
                Name: "Student";
                Nullable: false;
            };
            templateRecipientGroup: {
                Shape: TemplateRecipientGroup;
                Name: "TemplateRecipientGroup";
                Nullable: false;
            };
        };
    };
    RecipientGroupItemVariableValue: {
        Name: "RecipientGroupItemVariableValue";
        Shape: RecipientGroupItemVariableValue;
        Include: Prisma.RecipientGroupItemVariableValueInclude;
        Select: Prisma.RecipientGroupItemVariableValueSelect;
        OrderBy: Prisma.RecipientGroupItemVariableValueOrderByWithRelationInput;
        WhereUnique: Prisma.RecipientGroupItemVariableValueWhereUniqueInput;
        Where: Prisma.RecipientGroupItemVariableValueWhereInput;
        Create: Prisma.RecipientGroupItemVariableValueCreateInput;
        Update: Prisma.RecipientGroupItemVariableValueUpdateInput;
        RelationName: "templateRecipientGroupItem" | "templateVariable";
        ListRelations: never;
        Relations: {
            templateRecipientGroupItem: {
                Shape: TemplateRecipientGroupItem;
                Name: "TemplateRecipientGroupItem";
                Nullable: false;
            };
            templateVariable: {
                Shape: TemplateVariableBase;
                Name: "TemplateVariableBase";
                Nullable: false;
            };
        };
    };
    TemplateRecipientGroupItem: {
        Name: "TemplateRecipientGroupItem";
        Shape: TemplateRecipientGroupItem;
        Include: Prisma.TemplateRecipientGroupItemInclude;
        Select: Prisma.TemplateRecipientGroupItemSelect;
        OrderBy: Prisma.TemplateRecipientGroupItemOrderByWithRelationInput;
        WhereUnique: Prisma.TemplateRecipientGroupItemWhereUniqueInput;
        Where: Prisma.TemplateRecipientGroupItemWhereInput;
        Create: Prisma.TemplateRecipientGroupItemCreateInput;
        Update: Prisma.TemplateRecipientGroupItemUpdateInput;
        RelationName: "variableValues" | "templateRecipientGroup" | "student";
        ListRelations: "variableValues";
        Relations: {
            variableValues: {
                Shape: RecipientGroupItemVariableValue[];
                Name: "RecipientGroupItemVariableValue";
                Nullable: false;
            };
            templateRecipientGroup: {
                Shape: TemplateRecipientGroup;
                Name: "TemplateRecipientGroup";
                Nullable: false;
            };
            student: {
                Shape: Student;
                Name: "Student";
                Nullable: false;
            };
        };
    };
    TemplateRecipientGroup: {
        Name: "TemplateRecipientGroup";
        Shape: TemplateRecipientGroup;
        Include: Prisma.TemplateRecipientGroupInclude;
        Select: Prisma.TemplateRecipientGroupSelect;
        OrderBy: Prisma.TemplateRecipientGroupOrderByWithRelationInput;
        WhereUnique: Prisma.TemplateRecipientGroupWhereUniqueInput;
        Where: Prisma.TemplateRecipientGroupWhereInput;
        Create: Prisma.TemplateRecipientGroupCreateInput;
        Update: Prisma.TemplateRecipientGroupUpdateInput;
        RelationName: "items" | "certificates" | "template";
        ListRelations: "items" | "certificates";
        Relations: {
            items: {
                Shape: TemplateRecipientGroupItem[];
                Name: "TemplateRecipientGroupItem";
                Nullable: false;
            };
            certificates: {
                Shape: Certificate[];
                Name: "Certificate";
                Nullable: false;
            };
            template: {
                Shape: Template;
                Name: "Template";
                Nullable: false;
            };
        };
    };
    StorageFile: {
        Name: "StorageFile";
        Shape: StorageFile;
        Include: never;
        Select: Prisma.StorageFileSelect;
        OrderBy: Prisma.StorageFileOrderByWithRelationInput;
        WhereUnique: Prisma.StorageFileWhereUniqueInput;
        Where: Prisma.StorageFileWhereInput;
        Create: Prisma.StorageFileCreateInput;
        Update: Prisma.StorageFileUpdateInput;
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    FileUsage: {
        Name: "FileUsage";
        Shape: FileUsage;
        Include: never;
        Select: Prisma.FileUsageSelect;
        OrderBy: Prisma.FileUsageOrderByWithRelationInput;
        WhereUnique: Prisma.FileUsageWhereUniqueInput;
        Where: Prisma.FileUsageWhereInput;
        Create: Prisma.FileUsageCreateInput;
        Update: Prisma.FileUsageUpdateInput;
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    StorageDirectory: {
        Name: "StorageDirectory";
        Shape: StorageDirectory;
        Include: never;
        Select: Prisma.StorageDirectorySelect;
        OrderBy: Prisma.StorageDirectoryOrderByWithRelationInput;
        WhereUnique: Prisma.StorageDirectoryWhereUniqueInput;
        Where: Prisma.StorageDirectoryWhereInput;
        Create: Prisma.StorageDirectoryCreateInput;
        Update: Prisma.StorageDirectoryUpdateInput;
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    Student: {
        Name: "Student";
        Shape: Student;
        Include: Prisma.StudentInclude;
        Select: Prisma.StudentSelect;
        OrderBy: Prisma.StudentOrderByWithRelationInput;
        WhereUnique: Prisma.StudentWhereUniqueInput;
        Where: Prisma.StudentWhereInput;
        Create: Prisma.StudentCreateInput;
        Update: Prisma.StudentUpdateInput;
        RelationName: "recipientGroupItems" | "certificates";
        ListRelations: "recipientGroupItems" | "certificates";
        Relations: {
            recipientGroupItems: {
                Shape: TemplateRecipientGroupItem[];
                Name: "TemplateRecipientGroupItem";
                Nullable: false;
            };
            certificates: {
                Shape: Certificate[];
                Name: "Certificate";
                Nullable: false;
            };
        };
    };
    TemplateConfigs: {
        Name: "TemplateConfigs";
        Shape: TemplateConfigs;
        Include: never;
        Select: Prisma.TemplateConfigsSelect;
        OrderBy: Prisma.TemplateConfigsOrderByWithRelationInput;
        WhereUnique: Prisma.TemplateConfigsWhereUniqueInput;
        Where: Prisma.TemplateConfigsWhereInput;
        Create: Prisma.TemplateConfigsCreateInput;
        Update: Prisma.TemplateConfigsUpdateInput;
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    TemplateCategory: {
        Name: "TemplateCategory";
        Shape: TemplateCategory;
        Include: Prisma.TemplateCategoryInclude;
        Select: Prisma.TemplateCategorySelect;
        OrderBy: Prisma.TemplateCategoryOrderByWithRelationInput;
        WhereUnique: Prisma.TemplateCategoryWhereUniqueInput;
        Where: Prisma.TemplateCategoryWhereInput;
        Create: Prisma.TemplateCategoryCreateInput;
        Update: Prisma.TemplateCategoryUpdateInput;
        RelationName: "parentCategory" | "subCategories" | "templates" | "preSuspensionTemplates";
        ListRelations: "subCategories" | "templates" | "preSuspensionTemplates";
        Relations: {
            parentCategory: {
                Shape: TemplateCategory | null;
                Name: "TemplateCategory";
                Nullable: true;
            };
            subCategories: {
                Shape: TemplateCategory[];
                Name: "TemplateCategory";
                Nullable: false;
            };
            templates: {
                Shape: Template[];
                Name: "Template";
                Nullable: false;
            };
            preSuspensionTemplates: {
                Shape: Template[];
                Name: "Template";
                Nullable: false;
            };
        };
    };
    Template: {
        Name: "Template";
        Shape: Template;
        Include: Prisma.TemplateInclude;
        Select: Prisma.TemplateSelect;
        OrderBy: Prisma.TemplateOrderByWithRelationInput;
        WhereUnique: Prisma.TemplateWhereUniqueInput;
        Where: Prisma.TemplateWhereInput;
        Create: Prisma.TemplateCreateInput;
        Update: Prisma.TemplateUpdateInput;
        RelationName: "certificates" | "recipientGroups" | "category" | "preSuspensionCategory" | "templateVariables" | "elements";
        ListRelations: "certificates" | "recipientGroups" | "templateVariables" | "elements";
        Relations: {
            certificates: {
                Shape: Certificate[];
                Name: "Certificate";
                Nullable: false;
            };
            recipientGroups: {
                Shape: TemplateRecipientGroup[];
                Name: "TemplateRecipientGroup";
                Nullable: false;
            };
            category: {
                Shape: TemplateCategory;
                Name: "TemplateCategory";
                Nullable: false;
            };
            preSuspensionCategory: {
                Shape: TemplateCategory | null;
                Name: "TemplateCategory";
                Nullable: true;
            };
            templateVariables: {
                Shape: TemplateVariableBase[];
                Name: "TemplateVariableBase";
                Nullable: false;
            };
            elements: {
                Shape: TemplateElements[];
                Name: "TemplateElements";
                Nullable: false;
            };
        };
    };
    TemplateElements: {
        Name: "TemplateElements";
        Shape: TemplateElements;
        Include: Prisma.TemplateElementsInclude;
        Select: Prisma.TemplateElementsSelect;
        OrderBy: Prisma.TemplateElementsOrderByWithRelationInput;
        WhereUnique: Prisma.TemplateElementsWhereUniqueInput;
        Where: Prisma.TemplateElementsWhereInput;
        Create: Prisma.TemplateElementsCreateInput;
        Update: Prisma.TemplateElementsUpdateInput;
        RelationName: "dataDateElement" | "imageElement" | "qrCodeElement" | "template" | "staticTextElement" | "dataTextElement";
        ListRelations: never;
        Relations: {
            dataDateElement: {
                Shape: TemplateDataDateElements | null;
                Name: "TemplateDataDateElements";
                Nullable: true;
            };
            imageElement: {
                Shape: TemplateImageElements | null;
                Name: "TemplateImageElements";
                Nullable: true;
            };
            qrCodeElement: {
                Shape: TemplateQrCodeElements | null;
                Name: "TemplateQrCodeElements";
                Nullable: true;
            };
            template: {
                Shape: Template;
                Name: "Template";
                Nullable: false;
            };
            staticTextElement: {
                Shape: TemplateStaticTextElements | null;
                Name: "TemplateStaticTextElements";
                Nullable: true;
            };
            dataTextElement: {
                Shape: TemplateDataTextElements | null;
                Name: "TemplateDataTextElements";
                Nullable: true;
            };
        };
    };
    TemplateStaticTextElements: {
        Name: "TemplateStaticTextElements";
        Shape: TemplateStaticTextElements;
        Include: Prisma.TemplateStaticTextElementsInclude;
        Select: Prisma.TemplateStaticTextElementsSelect;
        OrderBy: Prisma.TemplateStaticTextElementsOrderByWithRelationInput;
        WhereUnique: Prisma.TemplateStaticTextElementsWhereUniqueInput;
        Where: Prisma.TemplateStaticTextElementsWhereInput;
        Create: Prisma.TemplateStaticTextElementsCreateInput;
        Update: Prisma.TemplateStaticTextElementsUpdateInput;
        RelationName: "element";
        ListRelations: never;
        Relations: {
            element: {
                Shape: TemplateElements;
                Name: "TemplateElements";
                Nullable: false;
            };
        };
    };
    TemplateDataTextElements: {
        Name: "TemplateDataTextElements";
        Shape: TemplateDataTextElements;
        Include: Prisma.TemplateDataTextElementsInclude;
        Select: Prisma.TemplateDataTextElementsSelect;
        OrderBy: Prisma.TemplateDataTextElementsOrderByWithRelationInput;
        WhereUnique: Prisma.TemplateDataTextElementsWhereUniqueInput;
        Where: Prisma.TemplateDataTextElementsWhereInput;
        Create: Prisma.TemplateDataTextElementsCreateInput;
        Update: Prisma.TemplateDataTextElementsUpdateInput;
        RelationName: "element";
        ListRelations: never;
        Relations: {
            element: {
                Shape: TemplateElements;
                Name: "TemplateElements";
                Nullable: false;
            };
        };
    };
    TemplateQrCodeElements: {
        Name: "TemplateQrCodeElements";
        Shape: TemplateQrCodeElements;
        Include: Prisma.TemplateQrCodeElementsInclude;
        Select: Prisma.TemplateQrCodeElementsSelect;
        OrderBy: Prisma.TemplateQrCodeElementsOrderByWithRelationInput;
        WhereUnique: Prisma.TemplateQrCodeElementsWhereUniqueInput;
        Where: Prisma.TemplateQrCodeElementsWhereInput;
        Create: Prisma.TemplateQrCodeElementsCreateInput;
        Update: Prisma.TemplateQrCodeElementsUpdateInput;
        RelationName: "element";
        ListRelations: never;
        Relations: {
            element: {
                Shape: TemplateElements;
                Name: "TemplateElements";
                Nullable: false;
            };
        };
    };
    TemplateImageElements: {
        Name: "TemplateImageElements";
        Shape: TemplateImageElements;
        Include: Prisma.TemplateImageElementsInclude;
        Select: Prisma.TemplateImageElementsSelect;
        OrderBy: Prisma.TemplateImageElementsOrderByWithRelationInput;
        WhereUnique: Prisma.TemplateImageElementsWhereUniqueInput;
        Where: Prisma.TemplateImageElementsWhereInput;
        Create: Prisma.TemplateImageElementsCreateInput;
        Update: Prisma.TemplateImageElementsUpdateInput;
        RelationName: "element";
        ListRelations: never;
        Relations: {
            element: {
                Shape: TemplateElements;
                Name: "TemplateElements";
                Nullable: false;
            };
        };
    };
    TemplateDataDateElements: {
        Name: "TemplateDataDateElements";
        Shape: TemplateDataDateElements;
        Include: Prisma.TemplateDataDateElementsInclude;
        Select: Prisma.TemplateDataDateElementsSelect;
        OrderBy: Prisma.TemplateDataDateElementsOrderByWithRelationInput;
        WhereUnique: Prisma.TemplateDataDateElementsWhereUniqueInput;
        Where: Prisma.TemplateDataDateElementsWhereInput;
        Create: Prisma.TemplateDataDateElementsCreateInput;
        Update: Prisma.TemplateDataDateElementsUpdateInput;
        RelationName: "element";
        ListRelations: never;
        Relations: {
            element: {
                Shape: TemplateElements;
                Name: "TemplateElements";
                Nullable: false;
            };
        };
    };
    TemplateVariableBase: {
        Name: "TemplateVariableBase";
        Shape: TemplateVariableBase;
        Include: Prisma.TemplateVariableBaseInclude;
        Select: Prisma.TemplateVariableBaseSelect;
        OrderBy: Prisma.TemplateVariableBaseOrderByWithRelationInput;
        WhereUnique: Prisma.TemplateVariableBaseWhereUniqueInput;
        Where: Prisma.TemplateVariableBaseWhereInput;
        Create: Prisma.TemplateVariableBaseCreateInput;
        Update: Prisma.TemplateVariableBaseUpdateInput;
        RelationName: "recipientGroupItemValues" | "template" | "TextTemplateVariable" | "NumberTemplateVariable" | "DateTemplateVariable" | "SelectTemplateVariable";
        ListRelations: "recipientGroupItemValues";
        Relations: {
            recipientGroupItemValues: {
                Shape: RecipientGroupItemVariableValue[];
                Name: "RecipientGroupItemVariableValue";
                Nullable: false;
            };
            template: {
                Shape: Template;
                Name: "Template";
                Nullable: false;
            };
            TextTemplateVariable: {
                Shape: TextTemplateVariable | null;
                Name: "TextTemplateVariable";
                Nullable: true;
            };
            NumberTemplateVariable: {
                Shape: NumberTemplateVariable | null;
                Name: "NumberTemplateVariable";
                Nullable: true;
            };
            DateTemplateVariable: {
                Shape: DateTemplateVariable | null;
                Name: "DateTemplateVariable";
                Nullable: true;
            };
            SelectTemplateVariable: {
                Shape: SelectTemplateVariable | null;
                Name: "SelectTemplateVariable";
                Nullable: true;
            };
        };
    };
    TextTemplateVariable: {
        Name: "TextTemplateVariable";
        Shape: TextTemplateVariable;
        Include: Prisma.TextTemplateVariableInclude;
        Select: Prisma.TextTemplateVariableSelect;
        OrderBy: Prisma.TextTemplateVariableOrderByWithRelationInput;
        WhereUnique: Prisma.TextTemplateVariableWhereUniqueInput;
        Where: Prisma.TextTemplateVariableWhereInput;
        Create: Prisma.TextTemplateVariableCreateInput;
        Update: Prisma.TextTemplateVariableUpdateInput;
        RelationName: "base";
        ListRelations: never;
        Relations: {
            base: {
                Shape: TemplateVariableBase;
                Name: "TemplateVariableBase";
                Nullable: false;
            };
        };
    };
    NumberTemplateVariable: {
        Name: "NumberTemplateVariable";
        Shape: NumberTemplateVariable;
        Include: Prisma.NumberTemplateVariableInclude;
        Select: Prisma.NumberTemplateVariableSelect;
        OrderBy: Prisma.NumberTemplateVariableOrderByWithRelationInput;
        WhereUnique: Prisma.NumberTemplateVariableWhereUniqueInput;
        Where: Prisma.NumberTemplateVariableWhereInput;
        Create: Prisma.NumberTemplateVariableCreateInput;
        Update: Prisma.NumberTemplateVariableUpdateInput;
        RelationName: "base";
        ListRelations: never;
        Relations: {
            base: {
                Shape: TemplateVariableBase;
                Name: "TemplateVariableBase";
                Nullable: false;
            };
        };
    };
    DateTemplateVariable: {
        Name: "DateTemplateVariable";
        Shape: DateTemplateVariable;
        Include: Prisma.DateTemplateVariableInclude;
        Select: Prisma.DateTemplateVariableSelect;
        OrderBy: Prisma.DateTemplateVariableOrderByWithRelationInput;
        WhereUnique: Prisma.DateTemplateVariableWhereUniqueInput;
        Where: Prisma.DateTemplateVariableWhereInput;
        Create: Prisma.DateTemplateVariableCreateInput;
        Update: Prisma.DateTemplateVariableUpdateInput;
        RelationName: "base";
        ListRelations: never;
        Relations: {
            base: {
                Shape: TemplateVariableBase;
                Name: "TemplateVariableBase";
                Nullable: false;
            };
        };
    };
    SelectTemplateVariable: {
        Name: "SelectTemplateVariable";
        Shape: SelectTemplateVariable;
        Include: Prisma.SelectTemplateVariableInclude;
        Select: Prisma.SelectTemplateVariableSelect;
        OrderBy: Prisma.SelectTemplateVariableOrderByWithRelationInput;
        WhereUnique: Prisma.SelectTemplateVariableWhereUniqueInput;
        Where: Prisma.SelectTemplateVariableWhereInput;
        Create: Prisma.SelectTemplateVariableCreateInput;
        Update: Prisma.SelectTemplateVariableUpdateInput;
        RelationName: "base";
        ListRelations: never;
        Relations: {
            base: {
                Shape: TemplateVariableBase;
                Name: "TemplateVariableBase";
                Nullable: false;
            };
        };
    };
    Session: {
        Name: "Session";
        Shape: Session;
        Include: Prisma.SessionInclude;
        Select: Prisma.SessionSelect;
        OrderBy: Prisma.SessionOrderByWithRelationInput;
        WhereUnique: Prisma.SessionWhereUniqueInput;
        Where: Prisma.SessionWhereInput;
        Create: Prisma.SessionCreateInput;
        Update: Prisma.SessionUpdateInput;
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: Users | null;
                Name: "Users";
                Nullable: true;
            };
        };
    };
    PasswordResetTokens: {
        Name: "PasswordResetTokens";
        Shape: PasswordResetTokens;
        Include: never;
        Select: Prisma.PasswordResetTokensSelect;
        OrderBy: Prisma.PasswordResetTokensOrderByWithRelationInput;
        WhereUnique: Prisma.PasswordResetTokensWhereUniqueInput;
        Where: Prisma.PasswordResetTokensWhereInput;
        Create: Prisma.PasswordResetTokensCreateInput;
        Update: Prisma.PasswordResetTokensUpdateInput;
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    Users: {
        Name: "Users";
        Shape: Users;
        Include: Prisma.UsersInclude;
        Select: Prisma.UsersSelect;
        OrderBy: Prisma.UsersOrderByWithRelationInput;
        WhereUnique: Prisma.UsersWhereUniqueInput;
        Where: Prisma.UsersWhereInput;
        Create: Prisma.UsersCreateInput;
        Update: Prisma.UsersUpdateInput;
        RelationName: "sessions";
        ListRelations: "sessions";
        Relations: {
            sessions: {
                Shape: Session[];
                Name: "Session";
                Nullable: false;
            };
        };
    };
}