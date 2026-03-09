import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const lockHorizontalScroll = () => {
      if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
      }
    };

    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    lockHorizontalScroll();

    window.addEventListener("scroll", lockHorizontalScroll, { passive: true });
    window.addEventListener("resize", lockHorizontalScroll);

    return () => {
      window.removeEventListener("scroll", lockHorizontalScroll);
      window.removeEventListener("resize", lockHorizontalScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
