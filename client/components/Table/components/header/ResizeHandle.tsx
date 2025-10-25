import { useAppTheme } from "@/client/contexts";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTableLocale } from "../../contexts";

type ResizeHandleProps = {
  enabled: boolean;
  onResize: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ) => void;
};

const buttonStyle = {
  position: "absolute" as const,
  top: 0,
  height: "100%",
  width: "16px",
  userSelect: "none" as const,
  touchAction: "none" as const,
  padding: 0,
  border: "none",
  background: "transparent",
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  zIndex: 10,
};

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  enabled,
  onResize,
}) => {
  const { isRtl, theme } = useAppTheme();
  const { strings } = useTableLocale();
  const [isResizing, setIsResizing] = useState(false);

  // Start resizing on mousedown or touchstart

  const startResizing = useCallback(
    (
      event:
        | React.MouseEvent<HTMLButtonElement>
        | React.TouchEvent<HTMLButtonElement>
    ) => {
      if (!enabled) return;
      event.preventDefault();
      event.stopPropagation();
      setIsResizing(true);
      onResize(event);
    },
    [onResize, enabled]
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

  const [backgroundColor, setBackgroundColor] = useState(theme.palette.divider);

  useEffect(() => {
    setBackgroundColor(
      isResizing ? theme.palette.primary.main : theme.palette.divider
    );
  }, [isResizing, theme]);

  return (
    <button
      className="resize-handle-wrapper"
      style={{
        ...buttonStyle,
        cursor: enabled ? "col-resize" : "default",
        [isRtl ? "left" : "right"]: "0px",
        transform: isRtl ? "translateX(-50%)" : "translateX(50%)",
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
      <hr
        style={{
          margin: 0,
          height: "100%",
          width: "4px",
          border: "none",
          backgroundColor: backgroundColor,
        }}
      />
    </button>
  );
};
