"use client";

import React, { useEffect, useRef } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useNavigationStateStore } from './useNavigationStateStore';

/**
 * Automated Navigation Provider
 * 
 * Replaces the manual resolver registration system with automatic state management.
 * 
 * Key features:
 * - Automatically saves URL parameters for every page
 * - Restores saved state when returning to pages
 * - Tracks parent-child navigation relationships for sidebar
 * - Works entirely through Next.js hooks, no manual registration needed
 */
export const AutomatedNavigationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get store actions
  const { 
    savePageState, 
    saveLastVisitedChild, 
    restorePageState, 
    restoreLastVisitedChild 
  } = useNavigationStateStore();
  
  // Track previous pathname to detect navigation changes
  const prevPathnameRef = useRef<string>(pathname);
  const isRestoringRef = useRef<boolean>(false);

  // ============================================================================
  // EFFECT 1: Continuously save current page state to store (even when params change)
  // ============================================================================
  useEffect(() => {
    // This effect runs whenever pathname OR searchParams change
    // It continuously updates the store with the current page state
    // This does NOT trigger navigation, just updates the Zustand store
    
    const paramsString = searchParams.toString();
    
    // Always save current state to store (overwrites previous)
    savePageState(pathname, paramsString);
    
    // Also update parent segment's "last visited child" for sidebar
    // Extract parent path from current pathname
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 2) { // Has sub-pages (e.g., /admin/templates/15/manage)
      const parentPath = `/${segments.slice(0, 2).join('/')}`; // e.g., /admin/templates
      const fullPath = paramsString ? `${pathname}?${paramsString}` : pathname;
      saveLastVisitedChild(parentPath, fullPath);
    }
    
    // This effect does NOT call router.push/replace, so it doesn't cause loops
    // It only updates the Zustand store
  }, [pathname, searchParams, savePageState, saveLastVisitedChild]);
  // Depends on BOTH pathname and searchParams
  // Why no loop? Because this effect only SAVES to store, never navigates

  // ============================================================================
  // EFFECT 2: Restore state when pathname changes (navigation detection)
  // ============================================================================
  useEffect(() => {
    const currentPathname = pathname;
    const previousPathname = prevPathnameRef.current;
    
    // Only restore when pathname actually changes (real navigation happened)
    if (previousPathname !== currentPathname && !isRestoringRef.current) {
      
      // First, try to restore exact page state
      let savedParams = restorePageState(currentPathname);
      let shouldRestore = false;
      
      // If no exact match, try to restore parent segment's last visited child
      if (!savedParams) {
        const segments = currentPathname.split('/').filter(Boolean);
        if (segments.length >= 2) {
          const parentPath = `/${segments.slice(0, 2).join('/')}`;
          const lastVisitedChild = restoreLastVisitedChild(parentPath);
          
          // If the current pathname is the base parent path, redirect to last child
          if (lastVisitedChild && currentPathname === parentPath) {
            // Navigate to the last visited child instead of restoring params
            router.replace(lastVisitedChild);
            isRestoringRef.current = true;
            setTimeout(() => {
              isRestoringRef.current = false;
            }, 100);
            return; // Exit early, no need to check params
          }
        }
      }
      
      // Check if we should restore params for the current page
      const currentParams = searchParams.toString();
      
      // Only restore if:
      // 1. We have saved params for this exact path
      // 2. Current URL has NO params (clean navigation from sidebar/link)
      if (savedParams && !currentParams) {
        shouldRestore = true;
      }
      
      if (shouldRestore) {
        isRestoringRef.current = true; // Prevent re-triggering
        
        const newUrl = `${currentPathname}?${savedParams}`;
        router.replace(newUrl);
        
        // Reset flag after navigation completes
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 100);
      }
    }
    
    // Update ref for next navigation
    prevPathnameRef.current = currentPathname;
  }, [pathname, router, searchParams, restorePageState, restoreLastVisitedChild]);
  // ONLY pathname - not searchParams
  // Why no loop? Because:
  // 1. router.replace() changes searchParams, not pathname
  // 2. This effect only depends on pathname
  // 3. isRestoringRef prevents multiple restorations
  // 4. Effect 1 will run after restoration (saving the restored state), but that's OK

  return <>{children}</>;
};
