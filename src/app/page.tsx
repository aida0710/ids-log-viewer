import React from 'react';
import dynamic from 'next/dynamic';

const LogViewer: React.ComponentClass<{}> | React.FunctionComponent<{}> = dynamic(() => import('@/app/index/LogViewer'), {ssr: false});

export default function Page() {
    return (
        <div className='text-center'>
            <LogViewer />
        </div>
    );
}
