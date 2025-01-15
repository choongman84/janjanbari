import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'  // 'smooth'로 하면 부드럽게 스크롤됩니다
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;