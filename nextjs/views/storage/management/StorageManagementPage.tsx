"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import { useStorageLocation } from "@/contexts/storage/useStorageLocation";

// Import all the components
import StorageToolbar from "../components/StorageToolbar";
import StorageBreadcrumbs from "../components/StorageBreadcrumbs";
import StorageStatsBar from "../components/StorageStatsBar";
import SelectHeader from "../components/SelectHeader";
import FileList from "../components/FileList";
import BulkActionsBar from "../components/BulkActionsBar";
import PaginationControls from "../components/PaginationControls";
import UploadList from "../upload/UploadList";
import ErrorBanner from "../components/ErrorBanner";
import LoadingSkeletons from "../components/LoadingSkeletons";
import EmptyState from "../components/EmptyState";
import LocationGrid from "../components/LocationGrid";
import UploadLocationInfo from "../upload/UploadLocationInfo";

const StorageManagementPage: React.FC = () => {
    const {
        items,
        loading,
        error,
        selectedPaths,
        clearSelection,
        remove,
        refresh,
        goUp,
        startUpload,
        pagination,
        params,
        setPage,
        setLimit,
        stats,
        toggleSelect,
        navigateTo,
        rename,
    } = useStorageManagement();
    const { isAtRoot, canUpload } = useStorageLocation();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {/* Toolbar */}
            <StorageToolbar />

            {/* Breadcrumbs */}
            <StorageBreadcrumbs />

            {/* Main Content Container */}
            <Container
                maxWidth={false}
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    p: 0,
                }}
            >
                {/* Stats Bar */}
                <Box sx={{ p: 2, pb: 0 }}>
                    <StorageStatsBar stats={stats} items={items} />
                </Box>

                {/* Error Banner */}
                {error && <ErrorBanner error={error} onRetry={refresh} />}

                {/* Upload Location Info */}
                <UploadLocationInfo />

                {/* Content Area */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    {loading ? (
                        <LoadingSkeletons count={8} variant="list" />
                    ) : isAtRoot ? (
                        <LocationGrid onNavigateTo={navigateTo} />
                    ) : items.length === 0 && !error ? (
                        <EmptyState
                            canUpload={canUpload}
                            isAtRoot={isAtRoot}
                            onGoUp={goUp}
                            onUpload={startUpload}
                        />
                    ) : (
                        <>
                            {/* Select Header */}
                            <SelectHeader />

                            {/* File List */}
                            <FileList
                                items={items}
                                loading={loading}
                                selectedPaths={selectedPaths}
                                error={error}
                                onToggleSelect={toggleSelect}
                                onNavigateTo={navigateTo}
                                onDelete={remove}
                                onRename={rename}
                            />

                            {/* Pagination */}
                            <PaginationControls
                                pagination={pagination}
                                currentLimit={params.limit}
                                onPageChange={setPage}
                                onLimitChange={setLimit}
                            />
                        </>
                    )}
                </Box>
            </Container>

            {/* Floating Components */}
            <BulkActionsBar
                selectedPaths={selectedPaths}
                onClearSelection={clearSelection}
                onDelete={remove}
            />
            <UploadList />
        </Box>
    );
};

export default StorageManagementPage;
