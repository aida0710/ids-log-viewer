'use client';

import {NextUIProvider} from '@nextui-org/react';
import {useRouter} from 'next/navigation';
import {ThemeProvider} from 'next-themes';
import React from 'react';
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function Providers({children}: Readonly<{children: React.ReactNode}>) {
    const router: AppRouterInstance = useRouter();

    return (
        <ThemeProvider
            defaultTheme='default'
            attribute='class'>
            <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
        </ThemeProvider>
    );
}
