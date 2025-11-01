import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { CountryRepresentationSelector } from "./CountryRepresentationSelector";
import { CountryRepresentation } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof CountryRepresentationSelector> = {
  title: "Template/Editor/Form/Element/Country/CountryRepresentationSelector",
  component: CountryRepresentationSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CountryRepresentationSelector>;

export const CountryName: Story = {
  args: {
    value: CountryRepresentation.CountryName,
    onChange: value => logger.log("Representation changed:", value),
    disabled: false,
  },
};

export const Nationality: Story = {
  args: {
    value: CountryRepresentation.Nationality,
    onChange: value => logger.log("Representation changed:", value),
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    value: CountryRepresentation.CountryName,
    onChange: value => logger.log("Representation changed:", value),
    error: "Representation is required",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: CountryRepresentation.CountryName,
    onChange: value => logger.log("Representation changed:", value),
    disabled: true,
  },
};
