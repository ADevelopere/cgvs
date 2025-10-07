import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as StoragePothos from "./storage.pothos";
import {
    getStorageService,
} from "../../storage/storage.service";
import { checkFileUsage } from "@/server/storage/db/storage-db.service";

gqlSchemaBuilder.queryFields((t) => ({
    listFiles: t.field({
        type: StoragePothos.StorageObjectListPothosObject,
        args: {
            input: t.arg({
                type: StoragePothos.ListFileInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_parent, { input }) => {
            const storageService = await getStorageService();
            return await storageService.listFiles(input);
        },
    }),

    fileInfo: t.field({
        type: StoragePothos.FileInfoPothosObject,
        args: {
            path: t.arg.string({ required: true }),
        },
        nullable: true,
        resolve: async (_parent, { path }) => {
            const storageService = await getStorageService();
            return await storageService.fileInfoByPath(path);
        },
    }),

    folderInfo: t.field({
        type: StoragePothos.DirectoryInfoPothosObject,
        args: {
            path: t.arg.string({ required: true }),
        },
        resolve: async (_parent, { path }) => {
            const storageService = await getStorageService();
            return await storageService.directoryInfoByPath(path);
        },
    }),

    searchFiles: t.field({
        type: StoragePothos.StorageObjectListPothosObject,
        args: {
            searchTerm: t.arg.string({ required: true }),
            fileType: t.arg.string({
                required: false,
                description: "File type filter (optional)",
            }),
            folder: t.arg.string({
                required: false,
                description:
                    "Folder to search in (optional, searches entire bucket if not specified)",
            }),
            limit: t.arg.int({
                required: false,
                defaultValue: 50,
                description: "Maximum number of results",
            }),
        },
        resolve: async (_parent, { searchTerm, fileType, folder, limit }) => {
            const storageService = await getStorageService();
            const input = {
                path: folder || "",
                limit: limit || 50,
                searchTerm,
                fileType,
            };
            return await storageService.listFiles(input);
        },
    }),

    storageStats: t.field({
        type: StoragePothos.StorageStatsPothosObject,
        args: {
            path: t.arg.string({
                required: false,
                description:
                    "Folder path to get stats for (optional, gets stats for entire bucket if not specified)",
            }),
        },
        resolve: async (_parent, { path }) => {
            const storageService = await getStorageService();
            return await storageService.storageStatistics(path);
        },
    }),

    directoryChildren: t.field({
        type: [StoragePothos.DirectoryInfoPothosObject],
        args: {
            path: t.arg.string({
                required: false,
                description:
                    "Parent directory path (empty or null for root level)",
            }),
        },
        resolve: async (_parent, { path }) => {
            const storageService = await getStorageService();
            const children = await storageService.fetchDirectoryChildren(path);
            return children;
        },
    }),

    fileUsage: t.field({
        type: StoragePothos.FileUsageResultPothosObject,
        args: {
            input: t.arg({
                type: StoragePothos.FileUsageCheckInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_parent, { input }) => await checkFileUsage(input),
    }),
}));
