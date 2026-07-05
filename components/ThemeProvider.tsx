'use client';

import { ReactNode, useEffect, useState } from 'react';
import { getSettings, updateSettings } from '@/lib/storage';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const settings = getSettings();
    const theme = settings.theme || 'system';

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // system
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  if (!mounted) return <>{children}</>;

  return <>{children}</>;
}
