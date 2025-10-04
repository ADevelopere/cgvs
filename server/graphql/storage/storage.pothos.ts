import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as StorageTypes from "../../storage/storage.types";
import { SortDirectionPothosObject } from "../base/sort.pothos";

// File type enum
export const FileTypePothosObject = gqlSchemaBuilder.enumType("FileType", {
    values: Object.values(StorageTypes.FileTypeServerType),
});

// Directory permissions object
export const DirectoryPermissionsPothosObject = gqlSchemaBuilder
    .objectRef<StorageTypes.DirectoryPermissionsServerType>(
        "DirectoryPermissions",
    )
    .implement({
        fields: (t) => ({
            allowUploads: t.exposeBoolean("allowUploads"),
            allowDelete: t.exposeBoolean("allowDelete"),
            allowMove: t.exposeBoolean("allowMove"),
            allowCreateSubDirs: t.exposeBoolean("allowCreateSubDirs"),
            allowDeleteFiles: t.exposeBoolean("allowDeleteFiles"),
            allowMoveFiles: t.exposeBoolean("allowMoveFiles"),
        }),
    });

// File usage info
export const FileUsageInfoPothosObject = gqlSchemaBuilder
    .objectRef<StorageTypes.FileUsageInfoServerType>("FileUsageInfo")
    .implement({
        fields: (t) => ({
            id: t.field({
                type: "String",
                resolve: (usageInfo) => usageInfo.id.toString(),
            }),
            filePath: t.exposeString("filePath"),
            usageType: t.exposeString("usageType"),
            referenceId: t.field({
                type: "String",
                resolve: (usageInfo) => usageInfo.referenceId.toString(),
            }),
            referenceTable: t.exposeString("referenceTable"),
            created: t.expose("created", { type: "DateTime" }),
        }),
    });

// Directory info
export const DirectoryInfoPothosObject = gqlSchemaBuilder
    .objectRef<StorageTypes.DirectoryInfoServerType>("DirectoryInfo")
    .implement({
        fields: (t) => ({
            path: t.exposeString("path"),
            name: t.exposeString("name"),
            isProtected: t.exposeBoolean("isProtected"),
            permissions: t.expose("permissions", {
                type: DirectoryPermissionsPothosObject,
            }),
            protectChildren: t.exposeBoolean("protectChildren"),
            created: t.expose("created", { type: "DateTime" }),
            lastModified: t.expose("lastModified", { type: "DateTime" }),
            isFromBucket: t.exposeBoolean("isFromBucket"),
            fileCount: t.exposeInt("fileCount"),
            folderCount: t.exposeInt("folderCount"),
            totalSize: t.exposeInt("totalSize"),
        }),
    });

// File info
export const FileInfoPothosObject = gqlSchemaBuilder
    .objectRef<StorageTypes.FileInfoServerType>("FileInfo")
    .implement({
        fields: (t) => ({
            path: t.exposeString("path"),
            name: t.exposeString("name"),
            isProtected: t.exposeBoolean("isProtected"),
            directoryPath: t.exposeString("directoryPath"),
            size: t.field({
                type: "String",
                resolve: (fileInfo) => fileInfo.size.toString(),
            }),
            contentType: t.exposeString("contentType", { nullable: true }),
            md5Hash: t.exposeString("md5Hash", { nullable: true }),
            created: t.expose("created", { type: "DateTime" }),
            lastModified: t.expose("lastModified", { type: "DateTime" }),
            isFromBucket: t.exposeBoolean("isFromBucket"),
            url: t.exposeString("url"),
            mediaLink: t.exposeString("mediaLink", { nullable: true }),
            fileType: t.expose("fileType", { type: FileTypePothosObject }),
            isPublic: t.exposeBoolean("isPublic"),
            isInUse: t.exposeBoolean("isInUse"),
            usages: t.expose("usages", { type: [FileUsageInfoPothosObject] }),
        }),
    });

// Union type for storage items (file or directory)
export const StorageItemPothosObject = gqlSchemaBuilder.unionType(
    "StorageItem",
    {
        types: [FileInfoPothosObject, DirectoryInfoPothosObject],
        resolveType: (item) => {
            // If it has 'size' property, it's a file
            if ("size" in item) {
                return FileInfoPothosObject;
            }
            return DirectoryInfoPothosObject;
        },
    },
);

export const StorageObjectListPothosObject = gqlSchemaBuilder
    .objectRef<StorageTypes.StorageObjectList>("StorageObjectList")
    .implement({
        fields: (t) => ({
            items: t.expose("items", { type: [StorageItemPothosObject] }),
            totalCount: t.exposeInt("totalCount"),
            hasMore: t.exposeBoolean("hasMore"),
            offset: t.exposeInt("offset"),
            limit: t.exposeInt("limit"),
        }),
    });

export const SortByValues = Object.values(StorageTypes.FileSortFieldServerType);

export const SortByPothosObject = gqlSchemaBuilder.enumType("FileSortField", {
    values: SortByValues,
});

export const ListFileInputPothosObject = gqlSchemaBuilder
    .inputRef<StorageTypes.FilesListInput>("FilesListInput")
    .implement({
        fields: (t) => ({
            path: t.string({ required: true }),
            limit: t.int({ required: false }),
            offset: t.int({ required: false }),
            searchTerm: t.string({ required: false }),
            fileType: t.string({ required: false }),
            sortDirection: t.field({
                type: SortDirectionPothosObject,
                required: false,
            }),
            sortBy: t.field({
                type: SortByPothosObject,
                required: false,
            }),
        }),
    });
