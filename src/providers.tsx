'use client';

import React from 'react';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

type Props = {
  children: React.ReactNode;
};
function Providers({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      disableTransitionOnChange
    >
      <Toaster position="bottom-center" />
      {children}
      <ProgressBar
        height="3px"
        color="#5d6eee"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </ThemeProvider>
  );
}

export default Providers;
