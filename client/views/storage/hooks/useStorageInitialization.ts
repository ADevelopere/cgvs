// "use client";

// import { useEffect, useRef } from "react";
// import { useAppTranslation } from "@/client/locale";
// import logger from "@/client/lib/logger";

// export const useStorageInitialization = () => {
//   const { params, setItems, setPagination } = useStorageDataStore();
//   const { setDirectoryTree } = useStorageTreeStore();
//   const {
//     updateLoading,
//     updateError,
//     setFocusedItem: setUIFocusedItem,
//     focusedItem,
//   } = useStorageUIStore();
//   const { fetchDirectoryChildren, fetchList } = useStorageDataOperations();
//   const { ui: translations } = useAppTranslation("storageTranslations");

//   // Track if this is the initial mount
//   const isInitialMount = useRef(true);

//   // Use refs to store latest values for functions/values used in effect
//   // This allows the effect to access latest values without re-running
//   const paramsRef = useRef(params);
//   const updateLoadingRef = useRef(updateLoading);
//   const updateErrorRef = useRef(updateError);
//   const fetchDirectoryChildrenRef = useRef(fetchDirectoryChildren);
//   const fetchListRef = useRef(fetchList);
//   const setDirectoryTreeRef = useRef(setDirectoryTree);
//   const setItemsRef = useRef(setItems);
//   const setPaginationRef = useRef(setPagination);
//   const setUIFocusedItemRef = useRef(setUIFocusedItem);
//   const focusedItemRef = useRef(focusedItem);
//   const translationsRef = useRef(translations);

//   // Update refs with latest values before each render
//   paramsRef.current = params;
//   updateLoadingRef.current = updateLoading;
//   updateErrorRef.current = updateError;
//   fetchDirectoryChildrenRef.current = fetchDirectoryChildren;
//   fetchListRef.current = fetchList;
//   setDirectoryTreeRef.current = setDirectoryTree;
//   setItemsRef.current = setItems;
//   setPaginationRef.current = setPagination;
//   setUIFocusedItemRef.current = setUIFocusedItem;
//   focusedItemRef.current = focusedItem;
//   translationsRef.current = translations;

//   // Initialize directory tree and root items on mount only
//   useEffect(() => {
//     logger.info("useStorageInitialization effect triggered", {
//       isInitialMount: isInitialMount.current,
//       currentPath: paramsRef.current.path,
//     });

//     // Only run on initial mount
//     if (!isInitialMount.current) {
//       logger.info("Skipping initialization - not initial mount");
//       return;
//     }

//     let isMounted = true;

//     const initializeStorageData = async () => {
//       logger.info("Starting storage initialization", {
//         path: paramsRef.current.path,
//         limit: paramsRef.current.limit,
//         offset: paramsRef.current.offset,
//       });

//       // Wait for hydration to complete
//       await new Promise(resolve => setTimeout(resolve, 0));

//       // Check if the component is still mounted
//       if (!isMounted) {
//         logger.warn("Component unmounted before initialization started");
//         return;
//       }

//       try {
//         // Initial mount: Initialize both directory tree and root items
//         logger.info("Setting loading states for initialization");
//         updateLoadingRef.current("prefetchingNode", "");
//         updateLoadingRef.current("fetchList", true);

//         logger.info(
//           "Fetching root directory tree and initial items in parallel"
//         );
//         const [rootDirectories, rootItems] = await Promise.all([
//           fetchDirectoryChildrenRef.current(),
//           fetchListRef.current(paramsRef.current),
//         ]);

//         logger.info("Parallel fetch completed", {
//           hasDirectories: !!rootDirectories,
//           hasItems: !!rootItems,
//           directoryCount: rootDirectories?.length || 0,
//           itemCount: rootItems?.items.length || 0,
//         });

//         // Check again if component is still mounted before updating the state
//         if (isMounted) {
//           if (rootDirectories) {
//             logger.info("Setting directory tree", {
//               count: rootDirectories.length,
//             });
//             setDirectoryTreeRef.current(rootDirectories);
//           } else {
//             logger.warn("No root directories returned");
//           }

//           if (rootItems) {
//             logger.info("Setting items and pagination", {
//               itemCount: rootItems.items.length,
//               totalCount: rootItems.pagination.total,
//               hasMorePages: rootItems.pagination.hasMorePages,
//             });
//             setItemsRef.current(rootItems.items);
//             setPaginationRef.current(rootItems.pagination);

//             // Set focus to first item if no focused item
//             if (rootItems.items.length > 0 && !focusedItemRef.current) {
//               logger.info("Setting focus to first item", {
//                 itemPath: rootItems.items[0].path,
//               });
//               setUIFocusedItemRef.current(rootItems.items[0].path);
//             } else if (rootItems.items.length === 0) {
//               logger.info("No items to focus - directory is empty");
//             } else {
//               logger.info("Focus already set", {
//                 focusedItem: focusedItemRef.current,
//               });
//             }
//           } else {
//             logger.warn("No root items returned");
//           }
//         } else {
//           logger.warn("Component unmounted before state update");
//         }

//         // Mark that initial mount is complete
//         logger.info("Initial mount completed successfully");
//         isInitialMount.current = false;
//       } catch (error) {
//         // Only log if not an abort error during unmount
//         if (isMounted) {
//           logger.error("Error during storage initialization", {
//             error: error instanceof Error ? error.message : "Unknown error",
//             stack: error instanceof Error ? error.stack : undefined,
//             path: paramsRef.current.path,
//           });
//           updateErrorRef.current(
//             "fetchList",
//             translationsRef.current.failedToNavigateToDirectory
//           );
//         } else {
//           logger.info("Error during initialization but component unmounted", {
//             error: error instanceof Error ? error.message : "Unknown error",
//           });
//         }
//       } finally {
//         if (isMounted) {
//           logger.info("Clearing loading states");
//           updateLoadingRef.current("prefetchingNode", null);
//           updateLoadingRef.current("fetchList", false);
//         }
//       }
//     };

//     // Use setTimeout to ensure this runs after hydration
//     logger.info("Scheduling initialization with 100ms delay for hydration");
//     const timeoutId = setTimeout(initializeStorageData, 100);

//     return () => {
//       logger.info("useStorageInitialization cleanup", {
//         isMounted,
//         isInitialMount: isInitialMount.current,
//       });
//       isMounted = false;
//       clearTimeout(timeoutId);
//     };
//   }, []); // Empty dependency array - only run once on mount, refs provide latest values
// };
