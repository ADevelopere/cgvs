import {
    useFileSelector,
    FileSelectorProvider,
    FileSelectorProviderProps,
} from "@/contexts/storage/FileSelectorContext";
import FileSelectorDialog from "@/views/storage/filePicker/FilePickerDialog";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";

type StorageFilePickerProps = Omit<FileSelectorProviderProps, "children"> & {
    open: boolean;
    onClose?: () => void;
    title?: string;
    confirmText?: string;
    cancelText?: string;
};

const StorageFilePickerContent: React.FC<StorageFilePickerProps> = ({
    open,
    onClose,
    multiple = false,
    allowUpload = true,
    maxSelection,
    title,
    confirmText,
    cancelText,
}) => {
    const {
        selectedFiles,
        location,
        changeLocation,
        files,
        loading,
        error,
        setSelectedFiles,
        clearSelection,
        refreshFiles,
        isFileProhibited,
    } = useFileSelector();
    const { startUpload } = useStorageManagement();

    return (
        <FileSelectorDialog
            open={open}
            onClose={onClose}
            selectedFiles={selectedFiles}
            startUpload={startUpload}
            location={location}
            multiple={multiple}
            allowUpload={allowUpload}
            maxSelection={maxSelection}
            title={title}
            confirmText={confirmText}
            cancelText={cancelText}
            changeLocation={changeLocation}
            files={files}
            loading={loading}
            error={error}
            setSelectedFiles={setSelectedFiles}
            clearSelection={clearSelection}
            isFileProhibited={isFileProhibited}
            refreshFiles={refreshFiles}
        />
    );
};

const StorageFilePicker: React.FC<StorageFilePickerProps> = (props) => {
    return (
        <FileSelectorProvider {...props}>
            <StorageFilePickerContent {...props} />
        </FileSelectorProvider>
    );
};

export default StorageFilePicker;
