"use client";

import React from "react";
import { useMutation } from "@apollo/client/react";
import * as Documents from "../../glqDocuments/element";

export const useElementCreateMutations = () => {
  const [createTextElementMutation] = useMutation(
    Documents.createTextElementMutationDocument,
    {
      update(cache, { data: mutationResult }) {
        const newElement = mutationResult?.createTextElement;
        if (!newElement?.base?.templateId) {
          return;
        }

        const existingData = cache.readQuery({
          query: Documents.elementsByTemplateIdQueryDocument,
          variables: {
            templateId: newElement.base.templateId,
          },
        });

        if (existingData?.elementsByTemplateId) {
          cache.writeQuery({
            query: Documents.elementsByTemplateIdQueryDocument,
            variables: {
              templateId: newElement.base.templateId,
            },
            data: {
              elementsByTemplateId: [
                ...existingData.elementsByTemplateId,
                newElement,
              ],
            },
          });
        }
      },
    }
  );

  const [createImageElementMutation] = useMutation(
    Documents.createImageElementMutationDocument,
    {
      update(cache, { data: mutationResult }) {
        const newElement = mutationResult?.createImageElement;
        if (!newElement?.base?.templateId) {
          return;
        }

        const existingData = cache.readQuery({
          query: Documents.elementsByTemplateIdQueryDocument,
          variables: {
            templateId: newElement.base.templateId,
          },
        });

        if (existingData?.elementsByTemplateId) {
          cache.writeQuery({
            query: Documents.elementsByTemplateIdQueryDocument,
            variables: {
              templateId: newElement.base.templateId,
            },
            data: {
              elementsByTemplateId: [
                ...existingData.elementsByTemplateId,
                newElement,
              ],
            },
          });
        }
      },
    }
  );

  const [createDateElementMutation] = useMutation(
    Documents.createDateElementMutationDocument,
    {
      update(cache, { data: mutationResult }) {
        const newElement = mutationResult?.createDateElement;
        if (!newElement?.base?.templateId) {
          return;
        }

        const existingData = cache.readQuery({
          query: Documents.elementsByTemplateIdQueryDocument,
          variables: {
            templateId: newElement.base.templateId,
          },
        });

        if (existingData?.elementsByTemplateId) {
          cache.writeQuery({
            query: Documents.elementsByTemplateIdQueryDocument,
            variables: {
              templateId: newElement.base.templateId,
            },
            data: {
              elementsByTemplateId: [
                ...existingData.elementsByTemplateId,
                newElement,
              ],
            },
          });
        }
      },
    }
  );

  const [createCountryElementMutation] = useMutation(
    Documents.createCountryElementMutationDocument,
    {
      update(cache, { data: mutationResult }) {
        const newElement = mutationResult?.createCountryElement;
        if (!newElement?.base?.templateId) {
          return;
        }

        const existingData = cache.readQuery({
          query: Documents.elementsByTemplateIdQueryDocument,
          variables: {
            templateId: newElement.base.templateId,
          },
        });

        if (existingData?.elementsByTemplateId) {
          cache.writeQuery({
            query: Documents.elementsByTemplateIdQueryDocument,
            variables: {
              templateId: newElement.base.templateId,
            },
            data: {
              elementsByTemplateId: [
                ...existingData.elementsByTemplateId,
                newElement,
              ],
            },
          });
        }
      },
    }
  );

  const [createGenderElementMutation] = useMutation(
    Documents.createGenderElementMutationDocument,
    {
      update(cache, { data: mutationResult }) {
        const newElement = mutationResult?.createGenderElement;
        if (!newElement?.base?.templateId) {
          return;
        }

        const existingData = cache.readQuery({
          query: Documents.elementsByTemplateIdQueryDocument,
          variables: {
            templateId: newElement.base.templateId,
          },
        });

        if (existingData?.elementsByTemplateId) {
          cache.writeQuery({
            query: Documents.elementsByTemplateIdQueryDocument,
            variables: {
              templateId: newElement.base.templateId,
            },
            data: {
              elementsByTemplateId: [
                ...existingData.elementsByTemplateId,
                newElement,
              ],
            },
          });
        }
      },
    }
  );

  const [createNumberElementMutation] = useMutation(
    Documents.createNumberElementMutationDocument,
    {
      update(cache, { data: mutationResult }) {
        const newElement = mutationResult?.createNumberElement;
        if (!newElement?.base?.templateId) {
          return;
        }

        const existingData = cache.readQuery({
          query: Documents.elementsByTemplateIdQueryDocument,
          variables: {
            templateId: newElement.base.templateId,
          },
        });

        if (existingData?.elementsByTemplateId) {
          cache.writeQuery({
            query: Documents.elementsByTemplateIdQueryDocument,
            variables: {
              templateId: newElement.base.templateId,
            },
            data: {
              elementsByTemplateId: [
                ...existingData.elementsByTemplateId,
                newElement,
              ],
            },
          });
        }
      },
    }
  );

  const [createQRCodeElementMutation] = useMutation(
    Documents.createQRCodeElementMutationDocument,
    {
      update(cache, { data: mutationResult }) {
        const newElement = mutationResult?.createQRCodeElement;
        if (!newElement?.base?.templateId) {
          return;
        }

        const existingData = cache.readQuery({
          query: Documents.elementsByTemplateIdQueryDocument,
          variables: {
            templateId: newElement.base.templateId,
          },
        });

        if (existingData?.elementsByTemplateId) {
          cache.writeQuery({
            query: Documents.elementsByTemplateIdQueryDocument,
            variables: {
              templateId: newElement.base.templateId,
            },
            data: {
              elementsByTemplateId: [
                ...existingData.elementsByTemplateId,
                newElement,
              ],
            },
          });
        }
      },
    }
  );

  return React.useMemo(
    () => ({
      /**
       * Mutation to create a new text element and append it to elementsByTemplateId query
       */
      createTextElementMutation,
      /**
       * Mutation to create a new image element and append it to elementsByTemplateId query
       */
      createImageElementMutation,
      /**
       * Mutation to create a new date element and append it to elementsByTemplateId query
       */
      createDateElementMutation,
      /**
       * Mutation to create a new country element and append it to elementsByTemplateId query
       */
      createCountryElementMutation,
      /**
       * Mutation to create a new gender element and append it to elementsByTemplateId query
       */
      createGenderElementMutation,
      /**
       * Mutation to create a new number element and append it to elementsByTemplateId query
       */
      createNumberElementMutation,
      /**
       * Mutation to create a new QR code element and append it to elementsByTemplateId query
       */
      createQRCodeElementMutation,
    }),
    [
      createTextElementMutation,
      createImageElementMutation,
      createDateElementMutation,
      createCountryElementMutation,
      createGenderElementMutation,
      createNumberElementMutation,
      createQRCodeElementMutation,
    ]
  );
};
