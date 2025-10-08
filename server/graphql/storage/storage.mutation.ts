import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as StoragePothos from "./storage.pothos";
import { getStorageService } from "../../storage/storage.service";
import { StorageDbRepository } from "../../storage/db/storage-db.service";

gqlSchemaBuilder.mutationFields((t) => ({
    renameFile: t.field({
        type: StoragePothos.FileOperationResultPothosObject,
        args: {
            input: t.arg({
                type: StoragePothos.FileRenameInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_parent, { input }) => {
            const storageService = await getStorageService();
            return await storageService.renameFile(input);
        },
    }),

    deleteFile: t.field({
        type: StoragePothos.FileOperationResultPothosObject,
        args: {
            path: t.arg.string({ required: true }),
        },
        resolve: async (_parent, { path }) => {
            const storageService = await getStorageService();
            return await storageService.deleteFile(path);
        },
    }),

    generateUploadSignedUrl: t.field({
        type: "String",
        args: {
            input: t.arg({
                type: StoragePothos.GenerateUploadSignedUrlInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_parent, { input }) => {
            const storageService = await getStorageService();
            return await storageService.generateUploadSignedUrl(input);
        },
    }),

    createFolder: t.field({
        type: StoragePothos.FileOperationResultPothosObject,
        args: {
            input: t.arg({
                type: StoragePothos.FolderCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_parent, { input }) => {
            const storageService = await getStorageService();
            return await storageService.createFolder(input);
        },
    }),

    moveStorageItems: t.field({
        type: StoragePothos.BulkOperationResultPothosObject,
        args: {
            input: t.arg({
                type: StoragePothos.StorageItemsMoveInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_parent, { input }) => {
            const storageService = await getStorageService();
            return await storageService.moveItems(input);
        },
    }),

    copyStorageItems: t.field({
        type: StoragePothos.BulkOperationResultPothosObject,
        args: {
            input: t.arg({
                type: StoragePothos.StorageItemsCopyInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_parent, { input }) => {
            const storageService = await getStorageService();
            return await storageService.copyItems(input);
        },
    }),

    deleteStorageItems: t.field({
        type: StoragePothos.BulkOperationResultPothosObject,
        args: {
            input: t.arg({
                type: StoragePothos.StorageItemsDeleteInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_parent, { input }) => {
            const storageService = await getStorageService();
            return await storageService.deleteItems(input);
        },
    }),

    updateDirectoryPermissions: t.field({
        type: StoragePothos.FileOperationResultPothosObject,
        args: {
            input: t.arg({
                type: StoragePothos.DirectoryPermissionsUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_parent, { input }) => {
            return await StorageDbRepository.updateDirectoryPermissions(input);
        },
    }),

    setStorageItemProtection: t.field({
        type: StoragePothos.FileOperationResultPothosObject,
        args: {
            input: t.arg({
                type: StoragePothos.StorageItemProtectionUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_parent, { input }) => {
            return await StorageDbRepository.setProtection(input);
        },
    }),
}));
