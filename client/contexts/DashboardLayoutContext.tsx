"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import { usePathname, useSearchParams } from 'next/navigation';
import logger from "@/lib/logger";

import {
    DashboardLayoutProviderProps,
    DashboardLayoutSlots,
    SidebarState,
    SIDEBAR_STATE_STORAGE_KEY,
    SlotName,
    DashboardLayoutContextProps,
    Title,
    Navigation,
} from "./adminLayout.types";
import { loadFromLocalStorage } from "@/client/utils/localStorage";
import { useNavigationStateStore } from "./navigation/useNavigationStateStore";

const DashboardLayoutContext = createContext<
    DashboardLayoutContextProps | undefined
>(undefined);

export const DashboardLayoutProvider: React.FC<
    DashboardLayoutProviderProps
> = ({ initialTitle, initialNavigation, initialSlots, children }) => {
    logger.log('[DashboardLayoutProvider] Component rendering with props:', {
        initialTitle,
        initialNavigation,
        initialSlots,
        children: typeof children
    });
    
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    logger.log('[DashboardLayoutProvider] Current URL state:', {
        pathname,
        searchParams: searchParams.toString()
    });
    
    // Navigation state store
    const { 
        savePageState, 
        saveLastVisitedChild, 
        restoreLastVisitedChild 
    } = useNavigationStateStore();
    
    logger.log('[DashboardLayoutProvider] Navigation state store methods:', {
        savePageState: typeof savePageState,
        saveLastVisitedChild: typeof saveLastVisitedChild,
        restoreLastVisitedChild: typeof restoreLastVisitedChild
    });
    
    const [slots, setSlots] = useState<DashboardLayoutSlots>({
        ...initialSlots,
    });
    logger.log('[DashboardLayoutProvider] Initial slots state:', slots);
    
    const [titleState, setTitleState] = useState<Title | undefined>(
        initialTitle || undefined,
    );
    logger.log('[DashboardLayoutProvider] Initial title state:', titleState);

    const [sidebarState, setSidebarState] = useState<SidebarState>(() => {
        const saved = loadFromLocalStorage(SIDEBAR_STATE_STORAGE_KEY);
        logger.log('[DashboardLayoutProvider] Loading sidebar state from localStorage:', {
            saved,
            key: SIDEBAR_STATE_STORAGE_KEY
        });
        return (saved as SidebarState) || "expanded";
    });
    logger.log('[DashboardLayoutProvider] Initial sidebar state:', sidebarState);
    
    // Dynamic navigation that gets updated based on saved state
    const [navigation, setNavigation] = useState<Navigation | undefined>(
        initialNavigation,
    );
    logger.log('[DashboardLayoutProvider] Initial navigation state:', navigation);

    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const [sideBarToggleWidth, setSideBarToggleWidth] = useState<number>(0);
    const [sideBarWidth, setSideBarWidth] = useState<number>(0);
    
    logger.log('[DashboardLayoutProvider] Layout dimensions state:', {
        headerHeight,
        sideBarToggleWidth,
        sideBarWidth
    });
    
    
    // ============================================================================
    // EFFECT 1: Continuously save current page state to store
    // ============================================================================
    useEffect(() => {
        logger.log('[DashboardLayoutProvider] EFFECT 1: Saving page state - triggered by:', {
            pathname,
            searchParams: searchParams.toString(),
            timestamp: new Date().toISOString()
        });
        
        const paramsString = searchParams.toString();
        
        // Always save current state to store
        logger.log('[DashboardLayoutProvider] EFFECT 1: Saving page state to store:', {
            pathname,
            paramsString
        });
        savePageState(pathname, paramsString);
        
        // Also update parent segment's "last visited child" for sidebar
        const segments = pathname.split('/').filter(Boolean);
        logger.log('[DashboardLayoutProvider] EFFECT 1: Path segments:', {
            segments,
            segmentCount: segments.length
        });
        
        if (segments.length > 2) { // Has sub-pages (e.g., /admin/templates/15/manage)
            const parentPath = `/${segments.slice(0, 2).join('/')}`; // e.g., /admin/templates
            const fullPath = paramsString ? `${pathname}?${paramsString}` : pathname;
            
            logger.log('[DashboardLayoutProvider] EFFECT 1: Saving last visited child:', {
                parentPath,
                fullPath,
                hasSubPages: true
            });
            
            saveLastVisitedChild(parentPath, fullPath);
        } else if (segments.length === 2) {
            // User navigated to a parent path (e.g., /admin/templates)
            // Clear any saved child path for this parent since user explicitly went to the base page
            const parentPath = `/${segments.join('/')}`;
            
            logger.log('[DashboardLayoutProvider] EFFECT 1: User navigated to parent path, clearing saved child:', {
                parentPath,
                pathname,
                clearingChild: true
            });
            
            // Clear the saved child by setting it to null or removing it
            // We'll use a special marker to indicate "no saved child"
            saveLastVisitedChild(parentPath, "");
        } else {
            logger.log('[DashboardLayoutProvider] EFFECT 1: No sub-pages detected, skipping last visited child save');
        }
    }, [pathname, searchParams, savePageState, saveLastVisitedChild]);
    
    // ============================================================================
    // EFFECT 2: Update navigation items with saved state
    // ============================================================================
    useEffect(() => {
        logger.log('[DashboardLayoutProvider] EFFECT 2: Updating navigation items - triggered by:', {
            initialNavigation: initialNavigation?.map(item => ({
                kind: item.kind,
                id: 'id' in item ? item.id : 'N/A',
                segment: 'segment' in item ? item.segment : 'N/A'
            })),
            timestamp: new Date().toISOString()
        });
        
        if (!initialNavigation) {
            logger.log('[DashboardLayoutProvider] EFFECT 2: No initial navigation, skipping update');
            return;
        }
        
        logger.log('[DashboardLayoutProvider] EFFECT 2: Processing navigation items:', {
            itemCount: initialNavigation.length,
            items: initialNavigation.map(item => ({
                kind: item.kind,
                id: 'id' in item ? item.id : 'N/A',
                segment: 'segment' in item ? item.segment : 'N/A',
                title: 'title' in item ? item.title : 'N/A'
            }))
        });
        
        const updatedNavigation = initialNavigation.map((navItem, index) => {
            logger.log(`[DashboardLayoutProvider] EFFECT 2: Processing item ${index}:`, {
                kind: navItem.kind,
                id: 'id' in navItem ? navItem.id : 'N/A',
                segment: 'segment' in navItem ? navItem.segment : 'N/A'
            });
            
            if (navItem.kind === 'header' || navItem.kind === 'divider') {
                logger.log(`[DashboardLayoutProvider] EFFECT 2: Skipping ${navItem.kind} item`);
                return navItem;
            }
            
            // Only process page items that have segments
            if ('segment' in navItem && navItem.segment) {
                // Convert segment to full path format (add leading slash if missing)
                const fullPath = navItem.segment.startsWith('/') ? navItem.segment : `/${navItem.segment}`;
                logger.log(`[DashboardLayoutProvider] EFFECT 2: Checking for saved child for segment: ${navItem.segment} -> ${fullPath}`);
                
                // Get the saved last visited child for this navigation item
                const savedChild = restoreLastVisitedChild(fullPath);
                
                logger.log(`[DashboardLayoutProvider] EFFECT 2: Restored child for ${navItem.segment}:`, {
                    savedChild,
                    hasSavedChild: !!savedChild && savedChild !== ""
                });
                
                if (savedChild && savedChild !== "") {
                    // Update the segment to point to the last visited child
                    const updatedItem = {
                        ...navItem,
                        segment: savedChild,
                    };
                    
                    logger.log(`[DashboardLayoutProvider] EFFECT 2: Updated item segment:`, {
                        original: navItem.segment,
                        updated: savedChild,
                        itemId: navItem.id
                    });
                    
                    return updatedItem;
                }
            }
            
            logger.log(`[DashboardLayoutProvider] EFFECT 2: No changes for item ${index}`);
            return navItem;
        });
        
        logger.log('[DashboardLayoutProvider] EFFECT 2: Setting updated navigation:', {
            updatedNavigation: updatedNavigation.map(item => ({
                kind: item.kind,
                id: 'id' in item ? item.id : 'N/A',
                segment: 'segment' in item ? item.segment : 'N/A',
                title: 'title' in item ? item.title : 'N/A'
            }))
        });
        
        setNavigation(updatedNavigation);
    }, [initialNavigation, restoreLastVisitedChild]);

    // ============================================================================
    // EFFECT 3: Update navigation when saved state changes (after EFFECT 1 saves)
    // ============================================================================
    useEffect(() => {
        logger.log('[DashboardLayoutProvider] EFFECT 3: Checking for navigation updates - triggered by pathname change:', {
            pathname,
            timestamp: new Date().toISOString()
        });
        
        if (!initialNavigation) {
            logger.log('[DashboardLayoutProvider] EFFECT 3: No initial navigation, skipping update');
            return;
        }
        
        // Only update navigation if we're on a parent path (e.g., /admin/templates)
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length !== 2) {
            logger.log('[DashboardLayoutProvider] EFFECT 3: Not on parent path, skipping navigation update:', {
                segmentCount: segments.length,
                pathname
            });
            return;
        }
        
        logger.log('[DashboardLayoutProvider] EFFECT 3: On parent path, checking for saved children');
        
        const updatedNavigation = initialNavigation.map((navItem, index) => {
            if (navItem.kind === 'header' || navItem.kind === 'divider') {
                return navItem;
            }
            
            if ('segment' in navItem && navItem.segment) {
                // Convert segment to full path format (add leading slash if missing)
                const fullPath = navItem.segment.startsWith('/') ? navItem.segment : `/${navItem.segment}`;
                const savedChild = restoreLastVisitedChild(fullPath);
                logger.log(`[DashboardLayoutProvider] EFFECT 3: Checking saved child for ${navItem.segment} -> ${fullPath}:`, {
                    savedChild,
                    hasSavedChild: !!savedChild && savedChild !== ""
                });
                
                if (savedChild && savedChild !== "") {
                    logger.log(`[DashboardLayoutProvider] EFFECT 3: Updating navigation item ${index}:`, {
                        original: navItem.segment,
                        updated: savedChild
                    });
                    return {
                        ...navItem,
                        segment: savedChild,
                    };
                }
            }
            
            return navItem;
        });
        
        // Only update if there are changes
        const hasChanges = updatedNavigation.some((item, index) => {
            if (initialNavigation[index] && 'segment' in item && 'segment' in initialNavigation[index]) {
                return item.segment !== initialNavigation[index].segment;
            }
            return false;
        });
        
        if (hasChanges) {
            logger.log('[DashboardLayoutProvider] EFFECT 3: Navigation has changes, updating:', {
                updatedNavigation: updatedNavigation.map(item => ({
                    kind: item.kind,
                    id: 'id' in item ? item.id : 'N/A',
                    segment: 'segment' in item ? item.segment : 'N/A'
                }))
            });
            setNavigation(updatedNavigation);
        } else {
            logger.log('[DashboardLayoutProvider] EFFECT 3: No navigation changes needed');
        }
    }, [pathname, initialNavigation, restoreLastVisitedChild]);

    const toggleSidebar = useCallback(() => {
        logger.log('[DashboardLayoutProvider] toggleSidebar called');
        setSidebarState((current) => {
            const newState = current === 'expanded' ? 'collapsed' : 'expanded';
            logger.log('[DashboardLayoutProvider] toggleSidebar state change:', {
                from: current,
                to: newState,
                storageKey: SIDEBAR_STATE_STORAGE_KEY
            });
            localStorage.setItem(SIDEBAR_STATE_STORAGE_KEY, newState);
            return newState;
        });
    }, []);

    const setDashboardSlot = useCallback(
        (slotName: SlotName, component: React.ReactNode | null) => {
            logger.log('[DashboardLayoutProvider] setDashboardSlot called:', {
                slotName,
                hasComponent: !!component,
                componentType: typeof component
            });
            
            setSlots((prevSlots) => {
                const newSlots = {
                    ...prevSlots,
                    [slotName]: component || undefined,
                };
                logger.log('[DashboardLayoutProvider] setDashboardSlot updating slots:', {
                    slotName,
                    prevSlots,
                    newSlots
                });
                return newSlots;
            });

            return () => {
                logger.log('[DashboardLayoutProvider] setDashboardSlot cleanup function called for:', slotName);
                setSlots((prevSlots) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [slotName]: _, ...rest } = prevSlots;
                    logger.log('[DashboardLayoutProvider] setDashboardSlot cleanup removing slot:', {
                        slotName,
                        prevSlots,
                        newSlots: rest
                    });
                    return rest;
                });
            };
        },
        [],
    );

    const resetSlots = useCallback(() => {
        logger.log('[DashboardLayoutProvider] resetSlots called');
        setSlots((prevSlots) => {
            const newSlots = { ...prevSlots };
            logger.log('[DashboardLayoutProvider] resetSlots before reset:', prevSlots);
            
            Object.keys(newSlots).forEach((key) => {
                newSlots[key as SlotName] = undefined;
            });
            
            logger.log('[DashboardLayoutProvider] resetSlots after reset:', newSlots);
            return newSlots;
        });
    }, []);

    const setTitleSlot = useCallback((slot: React.ReactNode) => {
        logger.log('[DashboardLayoutProvider] setTitleSlot called:', {
            hasSlot: !!slot,
            slotType: typeof slot
        });
        
        setSlots((prevSlots) => {
            const newSlots = {
                ...prevSlots,
                titleRenderer: slot,
            };
            logger.log('[DashboardLayoutProvider] setTitleSlot updating slots:', {
                prevSlots,
                newSlots
            });
            return newSlots;
        });

        return () => {
            logger.log('[DashboardLayoutProvider] setTitleSlot cleanup function called');
            setSlots((prevSlots) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { titleRenderer: _, ...rest } = prevSlots;
                logger.log('[DashboardLayoutProvider] setTitleSlot cleanup removing titleRenderer:', {
                    prevSlots,
                    newSlots: rest
                });
                return rest;
            });
        };
    }, []);

    const setTitle = useCallback((newTitle: Title) => {
        logger.log('[DashboardLayoutProvider] setTitle called:', {
            newTitle,
            currentTitle: titleState
        });
        
        return () => {
            logger.log('[DashboardLayoutProvider] setTitle updater function called');
            setTitleState((prev) => {
                const updatedTitle = { ...prev, ...newTitle };
                logger.log('[DashboardLayoutProvider] setTitle updating title:', {
                    prev,
                    newTitle,
                    updatedTitle
                });
                return updatedTitle;
            });
        };
    }, [titleState]);

    const value = useMemo(() => {
        const contextValue = {
            navigation,
            slots,
            title: titleState,
            sidebarState,
            setDashboardSlot,
            resetSlots,
            setTitleSlot,
            setTitle,
            setSidebarState,
            toggleSidebar,
            //
            headerHeight,
            setHeaderHeight,
            sideBarToggleWidth,
            setSideBarToggleWidth,
            sideBarWidth,
            setSideBarWidth,
        };
        
        logger.log('[DashboardLayoutProvider] Context value memoized:', {
            navigation: navigation?.map(item => ({
                kind: item.kind,
                id: 'id' in item ? item.id : 'N/A',
                segment: 'segment' in item ? item.segment : 'N/A',
                title: 'title' in item ? item.title : 'N/A'
            })),
            slots,
            title: titleState,
            sidebarState,
            headerHeight,
            sideBarToggleWidth,
            sideBarWidth
        });
        
        return contextValue;
    }, [
        navigation,
        slots,
        titleState,
        sidebarState,
        setDashboardSlot,
        resetSlots,
        setTitleSlot,
        setTitle,
        setSidebarState,
        toggleSidebar,
        headerHeight,
        setHeaderHeight,
        sideBarToggleWidth,
        setSideBarToggleWidth,
        sideBarWidth,
        setSideBarWidth,
    ]);

    logger.log('[DashboardLayoutProvider] Rendering provider with context value:', {
        hasValue: !!value,
        navigationCount: value.navigation?.length || 0,
        slotsCount: Object.keys(value.slots || {}).length,
        hasTitle: !!value.title,
        sidebarState: value.sidebarState
    });
    
    return (
        <DashboardLayoutContext.Provider value={value}>
            {children}
        </DashboardLayoutContext.Provider>
    );
};

export const useDashboardLayout = () => {
    const context = useContext(DashboardLayoutContext);
    if (!context) {
        throw new Error(
            "useDashboardLayout must be used within a DashboardLayoutProvider",
        );
    }
    return context;
};
