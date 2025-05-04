import React, { createContext, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationPageItem } from './adminLayout.types';

interface NavigationContextType {
    isPathActive: (item: NavigationPageItem) => boolean;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const isPathActive = useCallback((item: NavigationPageItem): boolean => {
        // Remove trailing slash for consistent comparison
        const normalizedPathname = location.pathname.replace(/\/$/, "");
        
        // Get the item's path from pattern or build it from segment
        const itemPath = item.pattern || (item.segment ? `/${item.segment}` : "");
        
        if (itemPath) {
            // Direct match
            if (normalizedPathname === itemPath) {
                return true;
            }
            
            // Check if current path starts with the item path (for nested routes)
            // Only match at segment boundaries to avoid partial matches
            if (normalizedPathname.startsWith(itemPath + "/")) {
                return true;
            }
        }

        // Check children recursively
        if (item.children) {
            return item.children.some(
                (child) => child.kind === "page" && isPathActive(child),
            );
        }

        return false;
    }, [location.pathname]);

    return (
        <NavigationContext.Provider value={{ isPathActive }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};
