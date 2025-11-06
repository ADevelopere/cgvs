import React, { useEffect, useState } from "react";
import * as MUI from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import logger from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import { useAppTheme } from "@/client/contexts";

interface FontPreviewProps {
  fontName: string;
  fontUrl: string;
}

export const FontPreview: React.FC<FontPreviewProps> = ({ fontName, fontUrl }) => {
  const { fontManagementTranslations: strings } = useAppTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontFaceLoaded, setFontFaceLoaded] = useState(false);
  const { isRtl } = useAppTheme();

  useEffect(() => {
    const loadFont = async () => {
      try {
        setLoading(true);
        setError(null);
        setFontFaceLoaded(false);

        // Create unique font family name
        const fontFamily = `font-preview-${fontName.replace(/\s+/g, "-")}`;

        // Check if font is already loaded
        const existingFont = Array.from(document.fonts).find(font => font.family === fontFamily);

        if (existingFont && existingFont.status === "loaded") {
          setFontFaceLoaded(true);
          setLoading(false);
          return;
        }

        // Remove existing font if present but not loaded
        if (existingFont) {
          document.fonts.delete(existingFont);
        }

        // Load the font
        const fontFace = new FontFace(fontFamily, `url("${fontUrl}")`);
        const loadedFont = await fontFace.load();
        document.fonts.add(loadedFont);

        // Wait for the font to be ready
        await document.fonts.ready;

        // Verify the font is actually loaded
        const isFontLoaded = document.fonts.check(`12px "${fontFamily}"`);

        if (!isFontLoaded) {
          throw new Error("Font loaded but not available");
        }

        setFontFaceLoaded(true);
      } catch (err) {
        logger.error("[FontPreview] Error loading font:", err);
        setError(strings.failedToLoadPreview);
      } finally {
        setLoading(false);
      }
    };

    if (fontUrl) {
      loadFont();
    }

    // Cleanup
    return () => {
      setFontFaceLoaded(false);
    };
  }, [fontUrl, fontName, strings.failedToLoadPreview]);

  const fontFamily = `font-preview-${fontName.replace(/\s+/g, "-")}`;

  if (loading) {
    return (
      <MUI.Card>
        <MUI.CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <MUI.Skeleton variant="text" width="100%" height={40} />
          <MUI.Skeleton variant="text" width="75%" height={32} />
          <MUI.Skeleton variant="text" width="100%" height={28} />
        </MUI.CardContent>
      </MUI.Card>
    );
  }

  if (error) {
    return (
      <MUI.Alert severity="error" icon={<ErrorIcon />}>
        {error}
      </MUI.Alert>
    );
  }

  return (
    <MUI.Card>
      <MUI.CardContent>
        <MUI.Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontFamily: fontFaceLoaded ? `"${fontFamily}", sans-serif` : "inherit",
            width: "100%",
          }}
        >
          {/* Preview text in different sizes */}
          <MUI.Typography
            variant="h4"
            component="p"
            fontWeight="bold"
            sx={{
              fontFamily: "inherit",
              alignSelf: isRtl ? "flex-end" : "flex-start",
            }}
          >
            The quick brown fox jumps over the lazy dog
          </MUI.Typography>
          <MUI.Typography
            variant="h4"
            component="p"
            sx={{
              fontFamily: "inherit",
              alignSelf: isRtl ? "flex-start" : "flex-end",
            }}
          >
            السلام عليكم ورحمة الله وبركاته
          </MUI.Typography>
          <MUI.Typography
            variant="h4"
            component="p"
            sx={{
              fontFamily: "inherit",
              alignSelf: isRtl ? "flex-end" : "flex-start",
            }}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </MUI.Typography>
          <MUI.Typography
            variant="h4"
            component="p"
            sx={{
              fontFamily: "inherit",
              alignSelf: isRtl ? "flex-end" : "flex-start",
            }}
          >
            abcdefghijklmnopqrstuvwxyz
          </MUI.Typography>
          <MUI.Typography variant="h4" component="p" sx={{ fontFamily: "inherit" }}>
            0123456789 !@#$%^&*()_+-=[]&#123;&#125;|;&apos;&quot;:,./&lt;&gt;?
          </MUI.Typography>

          {/* Font info */}
          <MUI.Divider sx={{ mt: 2 }} />
          <MUI.Typography variant="caption" color="text.secondary">
            {strings.previewFont.replace("%{fontName}", fontName)}
          </MUI.Typography>
        </MUI.Box>
      </MUI.CardContent>
    </MUI.Card>
  );
};
