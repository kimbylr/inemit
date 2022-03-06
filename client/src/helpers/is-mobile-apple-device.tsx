export const isMobileAppleDevice = () => {
  const { userAgent } = window.navigator;
  return (
    /iPad/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1) ||
    /iPhone|iPod/i.test(userAgent)
  );
};
