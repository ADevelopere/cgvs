import { useState, useEffect } from "react";

export const useAppBarHeight = () => {
  const [appBarHeight, setAppBarHeight] = useState(0);

  useEffect(() => {
    const appBar = document.getElementById("admin-header-appbar");
    if (appBar) {
      setAppBarHeight(appBar.clientHeight);
    }
  }, []);

  return appBarHeight;
};
