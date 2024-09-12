'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {IDataResponse} from '@/backend/response/IDataResponse';
import {ResponseStatus} from '@/backend/response/ResponseStatus';
import {IPaginationInfo} from '@/app/index/interface/IPaginationInfo';
import {IPacketLog} from '@/app/index/interface/IPacketLog';
import {Card, CardBody, CardFooter, CardHeader} from '@nextui-org/card';
import {Accordion, AccordionItem, Button, Switch} from '@nextui-org/react';
import {Divider} from '@nextui-org/divider';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    onPageChange: (newPage: number) => void;
}

const PaginationControls: React.FC<PaginationProps> = ({currentPage, totalPages, isLoading, onPageChange}) => (
    <div className='my-2 flex items-center justify-between'>
        <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            color='default'>
            前へ
        </Button>
        <span>
            Page {currentPage} of {totalPages}
        </span>
        <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            color='default'>
            次へ
        </Button>
    </div>
);

const PacketLogViewer: React.FC = () => {
    const [logs, setLogs] = useState<IPacketLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<IPacketLog[]>([]);
    const [pagination, setPagination] = useState<IPaginationInfo>({currentPage: 1, totalPages: 1, totalCount: 0});
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [filterEmptyPayloads, setFilterEmptyPayloads] = useState(false);
    const [isRealTimeUpdateEnabled, setIsRealTimeUpdateEnabled] = useState(true);
    const currentPageRef = useRef(1);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

    const FETCH_INTERVAL = 3000;

    const fetchLogs = useCallback(async (page: number) => {
        setIsLoading(true);
        try {
            const response = await axios.get<IDataResponse>(`/api/packet-logs?page=${page}&limit=50`);
            const {data, error, status, message} = response.data;

            if (error || status !== ResponseStatus.SUCCESS) {
                setError(message || 'データベースからログを取得できませんでした');
            }

            if (page === currentPageRef.current) {
                setLogs(data.logs);
                setPagination(data.pagination);
                setError(null);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Error fetching packet logs:', error);
            setError('データベースからログを取得できませんでした');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const isPayloadEmpty = (payload: IPacketLog['payload']): boolean => {
        if (payload && payload.type === 'Buffer' && payload.data) {
            // すべての空白文字（スペース、タブ、改行など）を削除
            const text = Buffer.from(payload.data).toString().replace(/\s+/g, '');
            // 空白文字を削除した後、文字列が空であるかチェック
            return text === '';
        }
        return true;
    };

    const toggleRealTimeUpdate = () => {
        setIsRealTimeUpdateEnabled(prev => !prev);
    };

    useEffect(() => {
        fetchLogs(currentPageRef.current).then();

        if (isRealTimeUpdateEnabled) {
            intervalIdRef.current = setInterval(() => fetchLogs(currentPageRef.current), FETCH_INTERVAL);
        } else if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
        }

        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [fetchLogs, isRealTimeUpdateEnabled]);

    useEffect(() => {
        if (filterEmptyPayloads) {
            setFilteredLogs(logs.filter((log) => !isPayloadEmpty(log.payload)));
        } else {
            setFilteredLogs(logs);
        }
    }, [logs, filterEmptyPayloads]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== currentPageRef.current) {
            currentPageRef.current = newPage;
            fetchLogs(newPage).then();
        }
    };

    const renderPayload = (payload: IPacketLog['payload'], protocol: string) => {
        if (payload && payload.type === 'Buffer' && payload.data) {
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

            // 16進数表示、ASCII表示、UTF-8表示
            const hexData = Buffer.from(payload.data).toString('hex');
            const asciiData = Buffer.from(payload.data)
                .toString('ascii')
                .replace(/[^\x20-\x7E]/g, '.');
            const utf8Data = Buffer.from(payload.data).toString('utf-8');

            return (
                <div className='w-full'>
                    <h3 className='font-semibold'>Payload ({protocol}):</h3>
                    {description && <p className='mb-2 text-sm text-gray-600'>{description}</p>}
                    <Accordion
                        isCompact
                        selectionMode={'multiple'}
                        defaultExpandedKeys={['1']}>
                        <AccordionItem
                            title='UTF-8'
                            subtitle={'data length: ' + utf8Data.length}
                            key='1'
                            aria-label='UTF-8'>
                            <div className='overflow-x-auto'>
                                <pre className='whitespace-pre-wrap break-all text-sm'>{utf8Data}</pre>
                            </div>
                        </AccordionItem>
                        <AccordionItem
                            title='Hex & ASCII'
                            subtitle={'data length: ' + hexData.length}
                            key='2'
                            aria-label='Hex & ASCII'>
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
        }
        return <p>Payload: Not available</p>;
    };

    if (error) {
        return <div className='text-red-500'>{error}</div>;
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='mb-4'>
                <h1 className='text-2xl font-bold'>Packet Log Viewer</h1>
                {lastUpdated && <p className='text-sm text-default-600'>最終更新: {lastUpdated.toLocaleString()}</p>}
            </div>
            <div className='mb-4 flex items-center space-x-4'>
                <div className='flex items-center'>
                    <Switch
                        checked={filterEmptyPayloads}
                        onChange={(e) => setFilterEmptyPayloads(e.target.checked)}
                    />
                    <span className='ml-2'>空のペイロードを非表示</span>
                </div>
                <Button
                    color={isRealTimeUpdateEnabled ? "primary" : "default"}
                    onClick={toggleRealTimeUpdate}
                >
                    {isRealTimeUpdateEnabled ? "リアルタイム更新停止" : "リアルタイム更新開始"}
                </Button>
            </div>
            <PaginationControls
                currentPage={currentPageRef.current}
                totalPages={pagination.totalPages}
                isLoading={isLoading}
                onPageChange={handlePageChange}
            />
            <div className='space-y-4'>
                {filteredLogs.map((log) => (
                    <Card key={log.id}>
                        <CardHeader>
                            <h2 className='mb-2 text-xl font-semibold'>Packet Log ID: {log.id}</h2>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <div className='grid grid-cols-2'>
                                <p>Arrival Time: {new Date(log.arrival_time).toLocaleString()}</p>
                                <p>Protocol: {log.protocol}</p>
                                <p>IP Version: {log.ip_version}</p>
                                <p>IP Header Length: {log.ip_header_length}</p>
                                <p>Total Length: {log.total_length}</p>
                                <p>TTL: {log.ttl}</p>
                                <p>Fragment Offset: {log.fragment_offset}</p>
                                <p>Source: {`${log.src_ip} : ${log.src_port}`}</p>
                                <p>Destination: {`${log.dst_ip} : ${log.dst_port}`}</p>
                                <p>Application Protocol: {log.application_protocol}</p>
                                <p>TCP State: {log.tcp_state}</p>
                                <p>Stream ID: {log.stream_id}</p>
                                <p>Tcp Seq Num: {log.tcp_seq_num}</p>
                                <p>Tcp Ack Num: {log.tcp_ack_num}</p>
                                <p>Tcp Window Size: {log.tcp_window_size}</p>
                                <p>Tcp Flags: {log.tcp_flags}</p>
                                <p>Tcp Data Offset: {log.tcp_data_offset}</p>
                                <p>Is From Client: {log.is_from_client ? 'Yes' : 'No'}</p>
                            </div>
                        </CardBody>
                        <Divider />
                        <CardFooter>{renderPayload(log.payload, log.protocol)}</CardFooter>
                    </Card>
                ))}
            </div>
            <PaginationControls
                currentPage={currentPageRef.current}
                totalPages={pagination.totalPages}
                isLoading={isLoading}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default PacketLogViewer;