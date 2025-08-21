import { useMemo } from "react";
import { useStorageManagement } from "./StorageManagementContext";
import {
    getLocationByPath,
    getUploadLocationForPath,
    isValidUploadLocation,
    getLocationInfo,
    isFileTypeAllowed,
    getUploadLocationOptions,
} from "./storage.location";
import * as Graphql from "@/graphql/generated/types";

export const useStorageLocation = () => {
    const { params } = useStorageManagement();

    const currentLocationInfo = useMemo(() => {
        return getLocationByPath(params.path);
    }, [params.path]);

    const uploadLocation = useMemo(() => {
        return getUploadLocationForPath(params.path);
    }, [params.path]);

    const canUpload = useMemo(() => {
        return isValidUploadLocation(params.path);
    }, [params.path]);

    const isAtRoot = useMemo(() => {
        return !params.path || params.path === "";
    }, [params.path]);

    const allowedContentTypes = useMemo(() => {
        if (!uploadLocation) return [];
        return getLocationInfo(uploadLocation).allowedContentTypes;
    }, [uploadLocation]);

    const isFileAllowed = useMemo(() => {
        return (contentType: Graphql.ContentType) => {
            if (!uploadLocation) return false;
            return isFileTypeAllowed(uploadLocation, contentType);
        };
    }, [uploadLocation]);

    const allLocations = useMemo(() => {
        return getUploadLocationOptions();
    }, []);

    return {
        currentLocationInfo,
        uploadLocation,
        canUpload,
        isAtRoot,
        allowedContentTypes,
        isFileAllowed,
        allLocations,
        path: params.path,
    };
};
