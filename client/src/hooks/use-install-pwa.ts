import { useEffect, useState } from 'react';

const getAppleDeviceType = () => {
  // @ts-ignore
  if ('standalone' in window.navigator && window.navigator.standalone) {
    //user has already installed the app
    return null;
  }

  const { userAgent } = window.navigator;
  if (
    /iPad/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1)
  ) {
    return 'iPad';
  }

  return /iPhone|iPod/i.test(userAgent) ? 'iPhone' : null;
};

export type AppleDevices = 'iPhone' | 'iPad' | null;
export const useInstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = (e: any) => {
    e.preventDefault();
    promptInstall?.prompt?.();
  };

  return {
    appleDevice: getAppleDeviceType() as AppleDevices,
    handleInstall: supportsPWA ? handleInstall : null,
  };
};
