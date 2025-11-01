"use client";

import React from "react";
import * as MUI from "@mui/material";
import {
  AspectRatio as ContainIcon,
  CropFree as CoverIcon,
  Fullscreen as FillIcon,
} from "@mui/icons-material";
import { useAppTranslation } from "@/client/locale";
import { ElementImageFit } from "@/client/graphql/generated/gql/graphql";
import { UpdateStateFn } from "../../types";
import { ImagePropsState, ImagePropsFormErrors } from "./types";

export interface ImagePropsFormProps {
  imageProps: ImagePropsState;
  errors: ImagePropsFormErrors;
  updateImageProps: UpdateStateFn<ImagePropsState>;
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
    <MUI.Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Image Fit */}
      <MUI.FormControl error={Boolean(errors.fit)} disabled={disabled}>
        <MUI.FormLabel required>{strings.imageElement.fitLabel}</MUI.FormLabel>
        <MUI.RadioGroup
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
            <MUI.Box
              key={option.value}
              sx={{
                border: 1,
                borderColor:
                  imageProps.fit === option.value ? "primary.main" : "divider",
                borderRadius: 1,
                p: 1.5,
                mb: 1,
                backgroundColor:
                  imageProps.fit === option.value
                    ? "action.selected"
                    : "background.paper",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor:
                    imageProps.fit === option.value
                      ? "primary.main"
                      : "primary.light",
                  backgroundColor: "action.hover",
                },
              }}
            >
              <MUI.FormControlLabel
                value={option.value}
                control={<MUI.Radio />}
                label={
                  <MUI.Box
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <MUI.Box sx={{ color: "primary.main" }}>
                      {option.icon}
                    </MUI.Box>
                    <MUI.Box>
                      <MUI.Typography variant="body2" fontWeight="medium">
                        {option.label}
                      </MUI.Typography>
                      <MUI.Typography variant="caption" color="text.secondary">
                        {option.description}
                      </MUI.Typography>
                    </MUI.Box>
                  </MUI.Box>
                }
                sx={{ width: "100%", m: 0 }}
              />
            </MUI.Box>
          ))}
        </MUI.RadioGroup>
        {errors.fit && <MUI.FormHelperText>{errors.fit}</MUI.FormHelperText>}
      </MUI.FormControl>
    </MUI.Box>
  );
};
