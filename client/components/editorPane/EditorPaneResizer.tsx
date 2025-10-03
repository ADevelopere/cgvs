import { useAppTheme } from "@/client/contexts/ThemeContext";
import React, {
    MouseEvent,
    TouchEvent,
    useCallback,
    useEffect,
    useState,
} from "react";

type EditorPaneResizerProps = {
    allowResize: boolean;
    orientation: "vertical" | "horizontal";
    className: string;
    onClick?: (event: React.MouseEvent) => void;
    onDoubleClick?: (event: React.MouseEvent) => void;
    onMouseDown: (event: MouseEvent<HTMLSpanElement>) => void;
    onTouchStart: (event: TouchEvent<HTMLSpanElement>) => void;
    onTouchEnd: (event: TouchEvent<HTMLSpanElement>) => void;
    style?: React.CSSProperties;
};

const EditorPaneResizer: React.FC<EditorPaneResizerProps> = (props) => {
    const [isResizing, setIsResizing] = useState(false);
    const { theme } = useAppTheme();
    const {
        allowResize,
        orientation,
        className,
        onClick,
        onDoubleClick,
        onMouseDown,
        onTouchEnd,
        onTouchStart,
        style,
    } = props;

    const handleMouseDown = useCallback(
        (e: MouseEvent<HTMLSpanElement>) => {
            setIsResizing(true);
            onMouseDown(e);
        },
        [onMouseDown],
    );

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseUp]);

    return (
        <span
            role="separator"
            aria-orientation={orientation}
            aria-valuemin={0}
            aria-valuemax={100}
            className={className}
            style={{
                cursor: allowResize ? "col-resize" : "default",
                position: "relative",
                minWidth: 4,
                minHeight: 500,
                ...style,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={(e) => {
                e.preventDefault();
                setIsResizing(true);
                onTouchStart(e as unknown as TouchEvent<HTMLButtonElement>);
            }}
            onTouchEnd={(e) => {
                e.preventDefault();
                setIsResizing(false);
                onTouchEnd(e);
            }}
            onClick={(e) => {
                e.preventDefault();
                onClick?.(e);
            }}
            onDoubleClick={onDoubleClick}
        >
            <span
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: isResizing ? 4 : 2,
                    backgroundColor: isResizing
                        ? theme.palette.primary.main
                        : theme.palette.divider,
                    transition: "width 0.2s, background-color 0.2s",
                }}
            />
        </span>
    );
};

export default EditorPaneResizer;
