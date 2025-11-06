import React from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { PureTextElement } from "./PureTextElement";
import { resolveTextContent } from "./textResolvers";
import { FontFamily } from "@/lib/font/google";
import { embedGoogleFonts } from "@/lib/font/fontUtils";

export interface CertificateRendererProps {
  elements: GQL.CertificateElementUnion[];
  config: GQL.TemplateConfig;
  onReady?: () => void;
}

interface TextElementData {
  element: GQL.TextElement;
  textContent: string;
  fontFamily: string;
}

/**
 * Renders certificate elements purely from data
 * No ReactFlow, no editor state - just raw element data
 */
export const CertificateRenderer: React.FC<CertificateRendererProps> = ({ elements, config, onReady }) => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [fontStyles, setFontStyles] = React.useState<string>("");
  const [textElements, setTextElements] = React.useState<TextElementData[]>([]);

  React.useEffect(() => {
    // Filter and sort text elements by renderOrder
    const textEls = elements
      .filter((el): el is GQL.TextElement => el.__typename === "TextElement")
      .sort((a, b) => a.base.renderOrder - b.base.renderOrder);

    // Collect unique Google fonts to load
    const uniqueFonts = new Set<FontFamily>();
    const fontFamilyMap = new Map<number, string>();

    textEls.forEach(el => {
      if (el.textProps.fontRef.__typename === "FontReferenceGoogle") {
        const identifier = el.textProps.fontRef.identifier as FontFamily;
        if (identifier) {
          uniqueFonts.add(identifier);
          fontFamilyMap.set(el.base.id, identifier);
        } else {
          fontFamilyMap.set(el.base.id, "Roboto");
          uniqueFonts.add(FontFamily.ROBOTO);
        }
      } else {
        // TODO: Add support for self-hosted fonts
        fontFamilyMap.set(el.base.id, "Roboto");
        uniqueFonts.add(FontFamily.ROBOTO);
      }
    });

    // Resolve text content for each element
    const resolvedElements: TextElementData[] = textEls.map(el => ({
      element: el,
      textContent: resolveTextContent(el.textDataSource, config.language, "Text"),
      fontFamily: fontFamilyMap.get(el.base.id) || "Roboto",
    }));

    setTextElements(resolvedElements);

    // Embed fonts
    embedGoogleFonts(Array.from(uniqueFonts))
      .then(styles => {
        setFontStyles(styles);
        setFontsLoaded(true);
        onReady?.();
      })
      .catch(() => {
        // Even if fonts fail, proceed
        setFontsLoaded(true);
        onReady?.();
      });
  }, [elements, config.language, onReady]);

  if (!fontsLoaded) {
    return null; // Wait for fonts to load
  }

  return (
    <div
      style={{
        position: "relative",
        width: config.width,
        height: config.height,
        backgroundColor: "white",
        overflow: "hidden", // Container clips children
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: fontStyles }} />
      {textElements.map(({ element, textContent, fontFamily }) => (
        <PureTextElement
          key={element.base.id}
          base={element.base}
          textProps={element.textProps}
          textContent={textContent}
          fontFamily={fontFamily}
        />
      ))}
    </div>
  );
};
