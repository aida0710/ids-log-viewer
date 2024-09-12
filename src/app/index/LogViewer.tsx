'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { IDataResponse } from '@/backend/response/IDataResponse';
import { ResponseStatus } from '@/backend/response/ResponseStatus';
import { IPaginationInfo } from '@/app/index/interface/IPaginationInfo';
import { IPacketLog } from '@/app/index/interface/IPacketLog';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Button } from '@nextui-org/react';
import { Divider } from '@nextui-org/divider';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    onPageChange: (newPage: number) => void;
}

const PaginationControls: React.FC<PaginationProps> = ({ currentPage, totalPages, isLoading, onPageChange }) => (
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
    const [pagination, setPagination] = useState<IPaginationInfo>({ currentPage: 1, totalPages: 1, totalCount: 0 });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const currentPageRef = useRef(1);

    const fetchLogs = useCallback(async (page: number) => {
        setIsLoading(true);
        try {
            const response = await axios.get<IDataResponse>(`/api/packet-logs?page=${page}&limit=50`);
            const { data, error, status, message } = response.data;

            if (error || status !== ResponseStatus.SUCCESS) {
                throw new Error(message || 'Failed to fetch packet logs');
            }

            if (page === currentPageRef.current) {
                setLogs(data.logs);
                setPagination(data.pagination);
                setError(null);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Error fetching packet logs:', error);
            setError('Failed to fetch packet logs. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs(currentPageRef.current).then();
        const intervalId = setInterval(() => fetchLogs(currentPageRef.current), 5000);

        return () => clearInterval(intervalId);
    }, [fetchLogs]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== currentPageRef.current) {
            currentPageRef.current = newPage;
            fetchLogs(newPage).then();
        }
    };

    const renderPayload = (payload: IPacketLog['payload']) => {
        if (payload.type === 'Buffer') {
            const text = String.fromCharCode(...payload.data);
            return (
                <div className="overflow-x-auto">
                    <h3 className='font-semibold'>Payload:</h3>
                    <pre className='whitespace-break-spaces rounded text-sm'>{text}</pre>
                </div>
            );
        }
        return <p>Payload: {JSON.stringify(payload)}</p>;
    };

    if (error) {
        return <div className='text-red-500'>{error}</div>;
    }

    return (
        <div className='container mx-auto p-4'>
            <div className="mb-4">
                <h1 className='text-2xl font-bold'>Packet Log Viewer</h1>
                {lastUpdated && (
                    <p className='text-sm text-default-600'>
                        最終更新: {lastUpdated.toLocaleString()}
                    </p>
                )}
            </div>
            <PaginationControls
                currentPage={currentPageRef.current}
                totalPages={pagination.totalPages}
                isLoading={isLoading}
                onPageChange={handlePageChange}
            />
            <div className='space-y-4'>
                {logs.map((log) => (
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
                        <CardFooter>{renderPayload(log.payload)}</CardFooter>
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
