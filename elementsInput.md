```typescript
type BaseCertificateElementFormState = {
  alignment: ElementAlignment;
  description: Scalars["String"]["input"];
  height: Scalars["Int"]["input"];
  hidden?: InputMaybe<Scalars["Boolean"]["input"]>;
  name: Scalars["String"]["input"];
  positionX: Scalars["Int"]["input"];
  positionY: Scalars["Int"]["input"];
  zIndex: Scalars["Int"]["input"];
  templateId: Scalars["Int"]["input"];
  width: Scalars["Int"]["input"];
};

type TextPropsFormState = {
  color: Graphql.Scalars["String"]["input"];
  fontRef: Graphql.FontReferenceInput;
  fontSize: Graphql.Scalars["Int"]["input"];
  overflow: Graphql.ElementOverflow;
};

type TextElementFormState = {
  base: CertificateElementBaseInput;
  dataSource: TextDataSourceInput;
  textProps: TextPropsInput;
};

type DateElementFormState = {
  base: GQL.CertificateElementBaseInput;
  dataSource: GQL.DateDataSourceInput;
  dateProps: GQL.DateElementSpecPropsInput;
  textProps: GQL.TextPropsInput;
};

type GenderElementFormState = {
  base: BaseCertificateElementFormState;
  textProps: TextPropsFormState;
};

type ImageElementFormState = {
  base: GQL.CertificateElementBaseInput;
  dataSource: GQL.ImageDataSourceInput;
  imageProps: GQL.ImageElementSpecPropsInput;
};

type NumberElementFormState = {
  base: CertificateElementBaseInput;
  dataSource: NumberDataSourceInput;
  numberProps: NumberElementSpecPropsInput;
  textProps: TextPropsInput;
};

type QrCodeElementFormState = {
  base: GQL.CertificateElementBaseInput;
  qrCodeProps: GQL.QrCodeElementSpecPropsInput;
};

type CountryElementFormState = {
  base: CertificateElementBaseInput;
  countryProps: CountryElementCountryPropsInput;
  textProps: TextPropsInput;
};
```
