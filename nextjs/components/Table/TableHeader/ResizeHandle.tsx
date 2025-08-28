import { useAppTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTableLocale } from "@/locale/table/TableLocaleContext";

type ResizeHandleProps = {
    onResize: (
        event:
            | React.MouseEvent<HTMLButtonElement>
            | React.TouchEvent<HTMLButtonElement>,
    ) => void;
};

const buttonStyle = {
    position: "absolute" as const,
    top: 0,
    height: "100%",
    width: "16px",
    cursor: "col-resize",
    userSelect: "none" as const,
    touchAction: "none" as const,
    padding: 0,
    border: "none",
    background: "transparent",
    display: "flex",
    alignContent: "end",
    justifyContent: "end",
};

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize }) => {
    const { isRtl, theme } = useAppTheme();
    const { strings } = useTableLocale();
    const [isResizing, setIsResizing] = useState(false);

    // Start resizing on mousedown or touchstart

    const startResizing = useCallback(
        (
            event:
                | React.MouseEvent<HTMLButtonElement>
                | React.TouchEvent<HTMLButtonElement>,
        ) => {
            event.preventDefault();
            event.stopPropagation();
            setIsResizing(true);
            onResize(event);
        },
        [onResize],
    );

    // Listen for mouseup/touchend on window to always end resizing
    useEffect(() => {
        if (!isResizing) return;

        const handleEnd = () => setIsResizing(false);

        window.addEventListener("mouseup", handleEnd);
        window.addEventListener("touchend", handleEnd);

        return () => {
            window.removeEventListener("mouseup", handleEnd);
            window.removeEventListener("touchend", handleEnd);
        };
    }, [isResizing]);

    const endResizing = useCallback(() => {
        if (isResizing) {
            setIsResizing(false);
        }
    }, [isResizing]);

    const hrStyle = {
        margin: 0,
        height: "100%",
        width: "1px",
        border: "none",
        backgroundColor: isResizing
            ? theme.palette.primary.main
            : theme.palette.divider,
    };

    return (
        <button
            className="resize-handle-wrapper"
            style={{
                ...buttonStyle,
                [isRtl ? "left" : "right"]: "0px",
            }}
            onMouseDown={startResizing}
            onTouchStart={startResizing}
            onTouchEnd={endResizing}
            onMouseUp={endResizing}
            onKeyUp={endResizing}
            onBlur={endResizing}
            onFocus={endResizing}
            aria-label={strings.column.resize}
        >
            <hr style={hrStyle} />
        </button>
    );
};

export default ResizeHandle;
