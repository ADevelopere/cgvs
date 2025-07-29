import { useState } from 'react';

export function useRecipientPanelVisibility() {
    const [isVisible, setIsVisible] = useState(true);

    const togglePanel = () => setIsVisible(prev => !prev);

    return {
        isVisible,
        togglePanel
    };
}
