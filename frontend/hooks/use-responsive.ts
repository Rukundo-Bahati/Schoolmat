import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type UseResponsiveReturn = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: Breakpoint;
  width: number | undefined;
  height: number | undefined;
};

export function useResponsive(): UseResponsiveReturn {
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set window width/height to state
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);

      // Set breakpoint
      if (window.innerWidth >= breakpoints['2xl']) {
        setBreakpoint('2xl');
      } else if (window.innerWidth >= breakpoints.xl) {
        setBreakpoint('xl');
      } else if (window.innerWidth >= breakpoints.lg) {
        setBreakpoint('lg');
      } else if (window.innerWidth >= breakpoints.md) {
        setBreakpoint('md');
      } else if (window.innerWidth >= breakpoints.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('xs');
      }
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return {
    isMobile: width !== undefined ? width < breakpoints.md : false,
    isTablet: width !== undefined ? width >= breakpoints.md && width < breakpoints.lg : false,
    isDesktop: width !== undefined ? width >= breakpoints.lg : false,
    breakpoint,
    width,
    height,
  };
}