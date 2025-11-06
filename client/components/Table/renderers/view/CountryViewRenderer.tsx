import React from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import countries from "@/client/lib/country";
import { useAppTranslation } from "@/client/locale";
import { CountryCode } from "@/client/graphql/generated/gql/graphql";

export interface CountryViewRendererProps {
  value: CountryCode | null | undefined;
}

/**
 * CountryViewRenderer Component
 *
 * Displays a country flag and translated country name.
 * Used for rendering country values in table cells.
 */
export const CountryViewRenderer: React.FC<CountryViewRendererProps> = ({ value }) => {
  const { countryTranslations: countryStrings } = useAppTranslation();

  if (!value) {
    return <span />;
  }

  const country = countries.find(c => c.code === value);

  if (!country) {
    return <span>{value}</span>;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Image
        src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
        alt=""
        width={20}
        height={15}
        style={{ objectFit: "cover" }}
        loading="lazy"
      />
      {countryStrings[country.code]}
    </Box>
  );
};

export default CountryViewRenderer;
