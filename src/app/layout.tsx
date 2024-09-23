import React, {ReactNode, Suspense} from 'react';
import '@/styles/globals.css';
import {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {NextFont} from 'next/dist/compiled/@next/font';
import {Providers} from '@/app/providers';
import Footer from '@/components/layout/footer';
import {NavigationBar} from '@/components/layout/navigation-bar';

const site_name: string = 'NIDS Log Viewer';
const site_description: string = 'idsが取得したログを表示するwebアプリ';

const url: string = 'https://www.aida0710.work';

export const metadata: Metadata = {
    title: {
        default: `${site_name}`,
        template: `%s | ${site_name}`,
    },
    description: site_description,
    metadataBase: new URL(url ?? 'http://localhost:3000'),
};

const inter: NextFont = Inter({subsets: ['latin']});

export default async function RootLayout({children}: Readonly<{children: ReactNode}>) {
    return (
        <html lang='ja'>
            <body className={inter.className}>
                <Suspense>
                    <Providers>
                        <div className='flex h-screen flex-col'>
                            <NavigationBar />
                            <div className='mb-auto'>{children}</div>
                            <Footer />
                        </div>
                    </Providers>
                </Suspense>
            </body>
        </html>
    );
}
