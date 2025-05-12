import { useTheme } from "@mui/system";
import type React from "react";
import { useCallback, useState } from "react";

type ResizeHandleProps = {
  onResizeStart: (
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

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResizeStart }) => {
  const theme = useTheme();
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(
    (
      event:
        | React.MouseEvent<HTMLButtonElement>
        | React.TouchEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();
      event.stopPropagation();
      setIsResizing(true);
      onResizeStart(event);
    },
    [onResizeStart]
  );

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
        [theme.direction === "rtl" ? "left" : "right"]: "0px",
      }}
      onMouseDown={startResizing}
      onTouchStart={startResizing}
      onTouchEnd={endResizing}
      onMouseUp={endResizing}
      onKeyUp={endResizing}
      onBlur={endResizing}
      onFocus={endResizing}
      aria-label="Resize column"
    >
      <hr style={hrStyle} />
    </button>
  );
};

export default ResizeHandle;
