import { useAppTheme } from "@/client/contexts/ThemeContext";
import React, { MouseEvent, TouchEvent, useEffect, useState } from "react";

type ResizerProps = {
  id?: string;
  allowResize: boolean;
  orientation: "vertical" | "horizontal";
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: MouseEvent<HTMLSpanElement>) => void;
  onTouchStart?: (event: TouchEvent<HTMLSpanElement>) => void;
  onTouchEnd?: (event: TouchEvent<HTMLSpanElement>) => void;
  containerStyle?: React.CSSProperties;
  internalStyle?: React.CSSProperties;
  columnResizing?: boolean;
  whileResizingWidth?: number;
  normalWidth?: number;
};

export const Resizer: React.FC<ResizerProps> = props => {
  const [isResizing, setIsResizing] = useState(false);
  const { theme } = useAppTheme();
  const {
    id,
    allowResize,
    orientation,
    className,
    onClick,
    onDoubleClick,
    onMouseDown,
    onTouchEnd,
    onTouchStart,
    containerStyle,
    internalStyle,
    columnResizing,
    whileResizingWidth,
    normalWidth,
  } = props;

  const handleMouseDown = (e: MouseEvent<HTMLSpanElement>) => {
    setIsResizing(true);
    onMouseDown?.(e);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <span
      id={id}
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
        ...containerStyle,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={e => {
        e.preventDefault();
        setIsResizing(true);
        onTouchStart?.(e as unknown as TouchEvent<HTMLButtonElement>);
      }}
      onTouchEnd={e => {
        e.preventDefault();
        setIsResizing(false);
        onTouchEnd?.(e as unknown as TouchEvent<HTMLButtonElement>);
      }}
      onClick={e => {
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
          width:
            isResizing || columnResizing
              ? whileResizingWidth || 4
              : normalWidth || 2,
          backgroundColor:
            isResizing || columnResizing
              ? theme.palette.primary.main
              : theme.palette.divider,
          transition: "width 0.2s, background-color 0.2s",
          ...internalStyle,
        }}
      />
    </span>
  );
};
