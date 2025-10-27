import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const STORAGE_DEFAULT_PARAMS: Graphql.FilesListInput = {
  path: "", // Start at the root of the public directory (showing predefined locations)
  limit: 50,
  offset: 0,
};
