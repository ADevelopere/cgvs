"use client";

import React from "react";
import * as Mui from "@mui/material";
import { AspectRatio as ContainIcon, CropFree as CoverIcon, Fullscreen as FillIcon } from "@mui/icons-material";
import { useAppTranslation } from "@/client/locale";
import { ElementImageFit, ImageElementSpecPropsInput } from "@/client/graphql/generated/gql/graphql";
import { ImagePropsFormErrors, UpdateImagePropsFn } from "./types";

export interface ImagePropsFormProps {
  imageProps: ImageElementSpecPropsInput;
  errors: ImagePropsFormErrors;
  updateImageProps: UpdateImagePropsFn;
  disabled?: boolean;
}

export const ImagePropsForm: React.FC<ImagePropsFormProps> = ({
  imageProps,
  errors,
  updateImageProps,
  disabled = false,
}) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();

  const fitOptions: Array<{
    value: ElementImageFit;
    label: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      value: ElementImageFit.Contain,
      label: strings.imageElement.fitContain,
      description: strings.imageElement.fitContainDesc,
      icon: <ContainIcon />,
    },
    {
      value: ElementImageFit.Cover,
      label: strings.imageElement.fitCover,
      description: strings.imageElement.fitCoverDesc,
      icon: <CoverIcon />,
    },
    {
      value: ElementImageFit.Fill,
      label: strings.imageElement.fitFill,
      description: strings.imageElement.fitFillDesc,
      icon: <FillIcon />,
    },
  ];

  return (
    <Mui.Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Image Fit */}
      <Mui.FormControl error={Boolean(errors.fit)} disabled={disabled}>
        <Mui.FormLabel required>{strings.imageElement.fitLabel}</Mui.FormLabel>
        <Mui.RadioGroup
          value={imageProps.fit}
          onChange={e =>
            updateImageProps({
              key: "fit",
              value: e.target.value as ElementImageFit,
            })
          }
          sx={{ mt: 1 }}
        >
          {fitOptions.map(option => (
            <Mui.Box
              key={option.value}
              sx={{
                border: 1,
                borderColor: imageProps.fit === option.value ? "primary.main" : "divider",
                borderRadius: 1,
                p: 1.5,
                mb: 1,
                backgroundColor: imageProps.fit === option.value ? "action.selected" : "background.paper",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: imageProps.fit === option.value ? "primary.main" : "primary.light",
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Mui.FormControlLabel
                value={option.value}
                control={<Mui.Radio />}
                label={
                  <Mui.Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Mui.Box sx={{ color: "primary.main" }}>{option.icon}</Mui.Box>
                    <Mui.Box>
                      <Mui.Typography variant="body2" fontWeight="medium">
                        {option.label}
                      </Mui.Typography>
                      <Mui.Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Mui.Typography>
                    </Mui.Box>
                  </Mui.Box>
                }
                sx={{ width: "100%", m: 0 }}
              />
            </Mui.Box>
          ))}
        </Mui.RadioGroup>
        {errors.fit && <Mui.FormHelperText>{errors.fit}</Mui.FormHelperText>}
      </Mui.FormControl>
    </Mui.Box>
  );
};
