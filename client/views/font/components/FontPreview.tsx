import React, { useEffect, useState } from "react";
import * as MUI from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import logger from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";

interface FontPreviewProps {
  fontName: string;
  fontUrl: string;
}

export const FontPreview: React.FC<FontPreviewProps> = ({
  fontName,
  fontUrl,
}) => {
  const strings = useAppTranslation("fontManagementTranslations");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontFaceLoaded, setFontFaceLoaded] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create unique font family name
        const fontFamily = `font-preview-${fontName.replace(/\s+/g, "-")}`;

        // Check if font is already loaded
        const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);

        await fontFace.load();
        document.fonts.add(fontFace);

        logger.info(`Font loaded: ${fontFamily}`);
        setFontFaceLoaded(true);
      } catch (err) {
        logger.error("Error loading font:", err);
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
      // Note: FontFace cleanup is complex, skipping for now
      setFontFaceLoaded(false);
    };
  }, [fontUrl, fontName, strings.failedToLoadPreview]);

  const fontFamily = `font-preview-${fontName.replace(/\s+/g, "-")}`;

  if (loading) {
    return (
      <MUI.Card>
        <MUI.CardContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
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
            fontFamily: fontFaceLoaded ? fontFamily : "inherit",
          }}
        >
          {/* Preview text in different sizes */}
          <MUI.Typography variant="h4" component="p" fontWeight="bold">
            The quick brown fox jumps over the lazy dog
          </MUI.Typography>
          <MUI.Typography variant="h5" component="p">
            السلام عليكم ورحمة الله وبركاته
          </MUI.Typography>
          <MUI.Typography variant="h6" component="p">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </MUI.Typography>
          <MUI.Typography variant="body1" component="p">
            abcdefghijklmnopqrstuvwxyz
          </MUI.Typography>
          <MUI.Typography variant="body2" component="p">
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
