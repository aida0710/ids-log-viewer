import React from 'react';
import {IPacketLog} from '@/app/index/interface/IPacketLog';
import {Accordion, AccordionItem} from '@nextui-org/react';

export const PayloadViewer: React.FC<{payload: IPacketLog['payload']; protocol: string}> = ({payload}) => {
    if (!payload) {
        return <p>Payload: Not available</p>;
    }

    return (
        <div className='w-full'>
            <Accordion
                isCompact
                selectionMode={'multiple'}
                defaultExpandedKeys={['1']}>
                <AccordionItem
                    title='Payload UTF-8'
                    subtitle={'data length: ' + payload.length}
                    key='1'
                    aria-label='UTF-8'>
                    <div className='overflow-x-auto'>
                        <pre className='whitespace-pre-wrap break-all text-sm'>{payload}</pre>
                    </div>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
