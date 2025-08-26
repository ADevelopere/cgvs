#!/usr/bin/env ts-node
// Patch script for generated gql types (temporary fix for Apollo codegen issues)
// Usage: npx ts-node patch-gql-types.ts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetPath = path.resolve(__dirname, '../nextjs/graphql/generated/types.ts');

if (!fs.existsSync(targetPath)) {
  console.error('Target file not found:', targetPath);
  process.exit(1);
}

let content = fs.readFileSync(targetPath, 'utf8');
content = '/* eslint-disable @typescript-eslint/no-explicit-any */\n' + content;

// 1. Replace import
content = content.replace(
  /import \* as Apollo from ['"]@apollo\/client['"];?/g,
  "import * as ApolloReact from '@apollo/client/react';"
);

// 2. Replace all Apollo. with ApolloReact.
content = content.replace(/Apollo\./g, 'ApolloReact.');


// 3. Replace deprecated types with new ones (from deprecated.d.ts)
const replacements: [string, string][] = [
  ['MutationHookOptions', 'useMutation.Options'],
  ['MutationResult', 'useMutation.Result'],
  ['MutationFunctionOptions', 'useMutation.MutationFunctionOptions'],
  ['MutationTuple', 'useMutation.ResultTuple'],
  ['SubscriptionResult', 'useSubscription.Result'],
  ['SubscriptionHookOptions', 'useSubscription.Options'],
  ['OnDataOptions', 'useSubscription.OnDataOptions'],
  ['OnSubscriptionDataOptions', 'useSubscription.OnSubscriptionDataOptions'],
  ['UseFragmentOptions', 'useFragment.Options'],
  ['UseFragmentResult', 'useFragment.Result'],
  ['SuspenseQueryHookOptions', 'useSuspenseQuery.Options'],
  ['UseSuspenseQueryResult', 'useSuspenseQuery.Result'],
  ['SuspenseQueryHookFetchPolicy', 'useSuspenseQuery.FetchPolicy'],
  ['BackgroundQueryHookOptions', 'useBackgroundQuery.Options'],
  ['UseBackgroundQueryResult', 'useBackgroundQuery.Result'],
  ['BackgroundQueryHookFetchPolicy', 'useBackgroundQuery.FetchPolicy'],
  ['UseSuspenseFragmentOptions', 'useSuspenseFragment.Options'],
  ['UseSuspenseFragmentResult', 'useSuspenseFragment.Result'],
  ['LoadQueryFunction', 'useLoadableQuery.LoadQueryFunction'],
  ['LoadableQueryFetchPolicy', 'useLoadableQuery.FetchPolicy'],
  ['LoadableQueryHookOptions', 'useLoadableQuery.Options'],
  ['UseLoadableQueryResult', 'useLoadableQuery.Result'],
  ['UseQueryRefHandlersResult', 'useQueryRefHandlers.Result'],
  ['UseReadQueryResult', 'useReadQuery.Result'],
  ['QueryHookOptions', 'useQuery.Options'],
  ['LazyQueryHookOptions', 'useLazyQuery.Options'],
  ['QueryResult', 'useQuery.Result'],
  ['LazyQueryResult', 'useLazyQuery.Result'],
  ['LazyQueryResultTuple', 'useLazyQuery.ResultTuple'],
  ['LazyQueryHookExecOptions', 'useLazyQuery.ExecOptions'],
  ['LazyQueryExecFunction', 'useLazyQuery.ExecFunction'],
];

for (const [from, to] of replacements) {
  // Replace type references (word boundaries)
  const re = new RegExp(`\\b${from}\\b`, 'g');
  content = content.replace(re, to);
}

// 5. Fix SuspenseQuery Options type argument: useSuspenseQuery.Options<SomeQuery, SomeQueryVariables> => useSuspenseQuery.Options<SomeQueryVariables>
content = content.replace(/useSuspenseQuery\.Options<(\w+),\s*(\w+)>/g, 'useSuspenseQuery.Options<$2>');

// 6. Fix function signature for generated suspense hooks to require correct baseOptions type
// Matches: export function useXxxSuspenseQuery(baseOptions?: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<SomeQuery>)
// and replaces with: export function useXxxSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<SomeQueryVariables>)
content = content.replace(/(export function use\w+SuspenseQuery)\(baseOptions\?: ApolloReact\.SkipToken \| ApolloReact\.useSuspenseQuery\.Options<(\w+)>\)/g, '$1(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<$2> )');

// 4. Remove lines containing BaseMutationOptions or MutationFunction
// This regex now correctly targets 'export type' and removes the entire line, even if it's the last line (no newline at EOF).
content = content.replace(/^export type [^\r\n]*?(BaseMutationOptions|MutationFunction)[^\r\n]*?;(\r?\n|$)/gm, '');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Patched:', targetPath);