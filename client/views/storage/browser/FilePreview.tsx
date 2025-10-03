import React, { useState } from "react";
import {
    Box,
    Skeleton,
    IconButton,
    Dialog,
    DialogContent,
    Tooltip,
} from "@mui/material";
import {
    Visibility,
    Image as ImageIcon,
    Folder as FolderIcon,
    ZoomIn,
    ZoomOut,
    RestartAlt,
    Close,
} from "@mui/icons-material";
import FileTypeIcon from "./FileTypeIcon";
import { FileInfo, StorageItem } from "@/client/contexts/storage/storage.type";
import { mimeToContentType } from "@/client/contexts/storage/storage.constant";
import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface FilePreviewProps {
    item: StorageItem;
    loading?: boolean;
    height?: number | string;
}

function isImage(file: FileInfo) {
    return (
        file.contentType &&
        ((mimeToContentType[file.contentType] &&
            ["JPEG", "PNG", "GIF", "WEBP", "SVG"].includes(
                mimeToContentType[file.contentType],
            )) ||
            file.contentType.startsWith("image/"))
    );
}

const FolderPreview: React.FC<{ height?: number | string }> = ({
    height = 120,
}) => (
    <Box
        sx={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper",
            borderRadius: 1,
        }}
    >
        <FolderIcon sx={{ fontSize: "4rem", color: "primary.main" }} />
    </Box>
);

const DefaultFilePreview: React.FC<{
    height?: number | string;
    file: FileInfo;
}> = ({ height = 120, file }) => (
    <Box
        sx={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper",
            borderRadius: 1,
        }}
    >
        <FileTypeIcon
            item={file}
            sx={{ fontSize: "4rem", color: "text.secondary" }}
        />
    </Box>
);

const ImagePreview: React.FC<{ file: FileInfo; height: number | string }> = ({
    file,
    height,
}) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box
            sx={{
                height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "background.paper",
                borderRadius: 1,
                position: "relative",
            }}
        >
            <ImageIcon sx={{ fontSize: "4rem", color: "text.secondary" }} />
            <IconButton
                onClick={handleClickOpen}
                sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                }}
            >
                <Visibility />
            </IconButton>
            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
                <DialogContent sx={{ position: "relative", p: 0 }}>
                    <TransformWrapper
                        initialScale={1}
                        initialPositionX={0}
                        initialPositionY={0}
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <React.Fragment>
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        zIndex: 1,
                                        display: "flex",
                                        gap: 1,
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        borderRadius: 1,
                                        p: 0.5,
                                    }}
                                >
                                    <Tooltip title="Zoom In">
                                        <IconButton
                                            onClick={() => zoomIn()}
                                            sx={{ color: "white" }}
                                        >
                                            <ZoomIn />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Zoom Out">
                                        <IconButton
                                            onClick={() => zoomOut()}
                                            sx={{ color: "white" }}
                                        >
                                            <ZoomOut />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Reset">
                                        <IconButton
                                            onClick={() => resetTransform()}
                                            sx={{ color: "white" }}
                                        >
                                            <RestartAlt />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Close">
                                        <IconButton
                                            onClick={handleClose}
                                            sx={{ color: "white" }}
                                        >
                                            <Close />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <TransformComponent>
                                    <Image
                                        src={file.url}
                                        alt={file.name}
                                        width={1920}
                                        height={1080}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            objectFit: "contain",
                                        }}
                                    />
                                </TransformComponent>
                            </React.Fragment>
                        )}
                    </TransformWrapper>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

const FilePreview: React.FC<FilePreviewProps> = ({
    item: file,
    loading = false,
    height = 120,
}) => {
    if (loading) {
        return (
            <Skeleton
                variant="rectangular"
                height={height}
                sx={{ borderRadius: 1 }}
            />
        );
    }

    if (file.__typename === "FileInfo") {
        if (isImage(file) && file.url) {
            return <ImagePreview file={file} height={height} />;
        }
        return <DefaultFilePreview file={file} height={height} />;
    } else {
        return <FolderPreview height={height} />;
    }
};

export default FilePreview;
