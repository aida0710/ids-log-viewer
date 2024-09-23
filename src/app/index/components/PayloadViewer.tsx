import React from 'react';
import {IPacketLog} from '@/app/index/interface/IPacketLog';
import {Accordion, AccordionItem} from '@nextui-org/react';
import {isPayloadEmpty} from '@/app/index/utits/isPayloadEmpty';

const formatPayload = (payload: IPacketLog['payload']): { hexData: string; asciiData: string; utf8Data: string } => {
    const hexData = Buffer.from(payload.data).toString('hex');
    const asciiData = Buffer.from(payload.data)
        .toString('ascii')
        .replace(/[^\x20-\x7E]/g, '.');
    const utf8Data = Buffer.from(payload.data).toString('utf-8');
    return { hexData, asciiData, utf8Data };
};

export const PayloadViewer: React.FC<{ payload: IPacketLog['payload']; protocol: string }> = ({ payload, protocol }) => {
    if (!payload || payload.type !== 'Buffer' || !payload.data) {
        return <p>Payload: Not available</p>;
    }

    const content = Buffer.from(payload.data).toString().trim();

    if (isPayloadEmpty(payload)) {
        return (
            <div>
                <h3 className='font-semibold'>Payload ({protocol}):</h3>
                <p>Empty payload</p>
            </div>
        );
    }

    let description = '';
    if (content === 'AAAAAAAA') {
        description = "Repeating 'A' pattern (possible test data or buffer)";
    } else if (content === 'AAA=') {
        description = 'Possible Base64 encoded data or padding';
    }

    const { hexData, asciiData, utf8Data } = formatPayload(payload);

    return (
        <div className='w-full'>
            <h3 className='font-semibold'>Payload ({protocol}):</h3>
            {description && <p className='mb-2 text-sm text-gray-600'>{description}</p>}
            <Accordion isCompact selectionMode={'multiple'} defaultExpandedKeys={['1']}>
                <AccordionItem title='UTF-8' subtitle={'data length: ' + utf8Data.length} key='1' aria-label='UTF-8'>
                    <div className='overflow-x-auto'>
                        <pre className='whitespace-pre-wrap break-all text-sm'>{utf8Data}</pre>
                    </div>
                </AccordionItem>
                <AccordionItem title='Hex & ASCII' subtitle={'data length: ' + hexData.length} key='2' aria-label='Hex & ASCII'>
                    <div className='overflow-x-auto'>
                        <pre className='whitespace-pre-wrap break-all text-sm'>
                            {hexData
                                .match(/.{1,32}/g)
                                ?.map((line, i) => {
                                    const ascii = asciiData.slice(i * 16, (i + 1) * 16);
                                    return `${line.match(/.{1,2}/g)?.join(' ')}  ${ascii}\n`;
                                })
                                .join('')}
                        </pre>
                    </div>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
