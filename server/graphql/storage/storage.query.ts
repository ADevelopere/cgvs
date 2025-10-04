import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { ListFileInputPothosObject, StorageObjectListPothosObject } from "./storage.pothos";
import { getStorageService } from "../../storage/storage.service";

gqlSchemaBuilder.queryFields((t) => ({
    listFiles: t.field({
        type: StorageObjectListPothosObject,
        args: {
            input: t.arg({
                type: ListFileInputPothosObject,
                required: true
            })
        },
        resolve: async (_parent, {input}) => {
            // Get the configured storage service
            const storageService = await getStorageService();
            
            // Use the storage service to list files
            return await storageService.listFiles(input);
        },
    }),
}));
