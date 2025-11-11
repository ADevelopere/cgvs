"use client";

import { NodeProps } from "@xyflow/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useBaseElement } from "../../form/hooks/useBaseElementState";
import { useTextProps } from "../../form/hooks/useTextPropsState";
import React from "react";
import WebFont from "webfontloader";
import { useTextDataSource } from "../../form/hooks";
import { useCertificateElementStates } from "../../context/CertificateElementContext";
import { useAppTranslationForLanguage } from "@/client/locale";
import { getFlexAlignment } from "./utils";
import { NodeResizer } from "@xyflow/react";
import { getFontFamily } from "@/lib/font/google/utils";

export type TextElementNodeData = {
  // templateId: number;
  elementId: number;
};

type TextElementNodeProps = NodeProps & {
  data: TextElementNodeData;
};

// random verification code generator, using random
const dumpVerificationCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
};

const studentEmailPreview = "example@email.com";

export const TextElementNode = ({ data }: TextElementNodeProps) => {
  const { elementId } = data;
  const { textPropsState } = useTextProps({ elementId });
  const { textDataSourceState: source } = useTextDataSource({ elementId });
  const {
    config: {
      state: { language },
    },
  } = useCertificateElementStates();

  const {
    certificateElementsTranslations: { textElement },
  } = useAppTranslationForLanguage(language);

  const text = React.useMemo(() => {
    if (source.static) {
      return source.static.value;
    }
    if (source.certificateField) {
      if (source.certificateField.field === GQL.CertificateTextField.VerificationCode) {
        return dumpVerificationCode();
      }
      return `{{${source.certificateField.field}}}`;
    }
    if (source.studentField) {
      if (source.studentField.field === GQL.StudentTextField.StudentEmail) {
        return studentEmailPreview;
      }
    }
    return textElement.textPreviewValue;
  }, [source, textElement]);

  const { baseElementState } = useBaseElement({
    elementId,
  });

  const [fontFamily, setFontFamily] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (textPropsState.fontRef.google?.family && textPropsState.fontRef.google?.variant) {
      const family = getFontFamily(textPropsState.fontRef.google.family);
      const variant = textPropsState.fontRef.google.variant;

      setFontFamily(family);
      const fontFamilyWithVariant = `${family}:${variant}`;

      WebFont.load({
        google: {
          families: [fontFamilyWithVariant],
        },
        active: () => {
          // You can set a state here to update your UI
        },
      });
    }
  }, [textPropsState.fontRef.google?.family, textPropsState.fontRef.google?.variant]);

  const style: React.CSSProperties = React.useMemo(() => {
    return {
      fontSize: textPropsState.fontSize,
      fontFamily: fontFamily ?? "Cairo",
      color: textPropsState.color ?? "#941717ff",
      // fontFamily: data.fontFamily ?? "Cairo",
      padding: "10px",
      border: "1px solid #eee",
      borderRadius: "5px",
      backgroundColor: "transparent",
      width: baseElementState.width,
      height: baseElementState.height,
      overflow: "hidden",
      textOverflow: textPropsState.overflow === GQL.ElementOverflow.Ellipse ? "ellipsis" : "clip",
      whiteSpace: "nowrap",
      // Add a transition to make changes smooth
      transition: "all 0.3s ease",
      ...getFlexAlignment(baseElementState.alignment),
    };
  }, [textPropsState, baseElementState, fontFamily]);

  if (!textPropsState || !baseElementState) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <NodeResizer minWidth={10} minHeight={10} />
      <div style={style}>{text}</div>
    </>
  );
};
