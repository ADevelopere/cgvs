import React from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { PureTextElement } from "./PureTextElement";
import { resolveTextContent } from "./textResolvers";
import { FontFamily, getFontByFamily } from "@/lib/font/google";
import { getFontFamilyString } from "../nodeRenderer/utils";
import WebFont from "webfontloader";

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
export const CertificateRenderer: React.FC<CertificateRendererProps> = ({
  elements,
  config,
  onReady,
}) => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [textElements, setTextElements] = React.useState<TextElementData[]>(
    []
  );

  React.useEffect(() => {
    // Filter and sort text elements by renderOrder
    const textEls = elements
      .filter((el): el is GQL.TextElement => el.__typename === "TextElement")
      .sort((a, b) => a.base.renderOrder - b.base.renderOrder);

    // Collect unique Google fonts to load
    const fontsToLoad: string[] = [];
    const fontFamilyMap = new Map<number, string>();
    let needsRoboto = false;

    textEls.forEach(el => {
      if (el.textProps.fontRef.__typename === "FontReferenceGoogle") {
        const identifier = el.textProps.fontRef.identifier;
        if (identifier) {
          const font = getFontByFamily(identifier as FontFamily);
          if (font) {
            const fontString = getFontFamilyString(font);
            if (fontString && !fontsToLoad.includes(fontString)) {
              fontsToLoad.push(fontString);
            }
            fontFamilyMap.set(el.base.id, identifier);
          }
        } else {
          // Fallback if identifier is missing
          fontFamilyMap.set(el.base.id, "Roboto");
          needsRoboto = true;
        }
      } else {
        // TODO: Add support for self-hosted fonts
        // For now, default self-hosted fonts to use Roboto from Google
        fontFamilyMap.set(el.base.id, "Roboto");
        needsRoboto = true;
      }
    });

    // Add Roboto if needed as fallback
    if (needsRoboto && !fontsToLoad.includes("Roboto")) {
      fontsToLoad.push("Roboto");
    }

    // Resolve text content for each element
    const resolvedElements: TextElementData[] = textEls.map(el => ({
      element: el,
      textContent: resolveTextContent(
        el.textDataSource,
        config.language,
        "Text"
      ),
      fontFamily: fontFamilyMap.get(el.base.id) || "Cairo",
    }));

    setTextElements(resolvedElements);

    // Load fonts
    if (fontsToLoad.length > 0) {
      WebFont.load({
        google: {
          families: fontsToLoad,
        },
        active: () => {
          setFontsLoaded(true);
          onReady?.();
        },
        inactive: () => {
          // Even if fonts fail, proceed
          setFontsLoaded(true);
          onReady?.();
        },
      });
    } else {
      setFontsLoaded(true);
      onReady?.();
    }
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
