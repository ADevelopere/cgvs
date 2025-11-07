import { TabList as MuiTabList } from "@mui/lab";
import { useRef } from "react";

/**
 * Props for WheelTabList component.
 * Extends all props from MUI's TabList.
 */
type WheelTabListProps = React.ComponentProps<typeof MuiTabList>;

/**
 * WheelTabList component
 *
 * A wrapper around MUI's TabList that enables horizontal scrolling with the mouse wheel.
 * When the user scrolls vertically with the mouse wheel, the tab list scrolls horizontally instead.
 *
 * @param props - All props supported by MUI's TabList
 */
export const WheelTabList: React.FC<WheelTabListProps> = props => {
  /**
   * Ref for the tab list container element.
   */
  const listContainer = useRef<HTMLDivElement>(null);

  /**
   * Maps vertical wheel scroll events to horizontal scrolling of the tab list.
   * @param e - The wheel event
   */
  const mapVerticalToHorizontalScroll = (e: React.WheelEvent) => {
    if (listContainer.current) {
      const scrollableElement = listContainer.current.parentElement;
      if (scrollableElement) {
        // Scroll horizontally instead of vertically
        scrollableElement.scrollLeft += e.deltaY;
      }
    }
  };

  return (
    <MuiTabList
      {...props}
      slotProps={{
        ...props.slotProps,
        list: {
          ref: listContainer,
        },
      }}
      /**
       * Intercepts wheel events to enable horizontal scrolling.
       */
      onWheel={(e: React.WheelEvent) => {
        mapVerticalToHorizontalScroll(e);
      }}
    />
  );
};
