'use client';

import React, {useEffect, useRef, useState} from 'react';
import {usePacketLogs} from '@/app/index/hook/usePacketLogs';
import {Button, Switch} from '@nextui-org/react';
import {PaginationControls} from '@/app/index/components/PaginationControls';
import {Spinner} from '@nextui-org/spinner';
import {PacketLogCard} from '@/app/index/components/PacketLogCard';

export default function Page() {
    const {logs, pagination, error, isLoading, isInitialLoading, lastUpdated, filterEmptyPayloads, setFilterEmptyPayloads, fetchLogs, currentPageRef} =
        usePacketLogs(1);

    const [isRealTimeUpdateEnabled, setIsRealTimeUpdateEnabled] = useState(true);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
    const FETCH_INTERVAL = 3000;

    useEffect(() => {
        fetchLogs(currentPageRef.current).then((r) => r);

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

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== currentPageRef.current) {
            currentPageRef.current = newPage;
            fetchLogs(newPage).then((r) => r);
        }
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
                    color={isRealTimeUpdateEnabled ? 'primary' : 'default'}
                    variant='flat'
                    onClick={() => setIsRealTimeUpdateEnabled(!isRealTimeUpdateEnabled)}>
                    {isRealTimeUpdateEnabled ? 'リアルタイム更新停止' : 'リアルタイム更新開始'}
                </Button>
            </div>
            <PaginationControls
                log_length={logs.length}
                currentPage={currentPageRef.current}
                totalPages={pagination.totalPages}
                isLoading={isLoading}
                onPageChange={handlePageChange}
            />
            {isInitialLoading ? (
                <div className='flex h-64 items-center justify-center'>
                    <Spinner size='lg' />
                </div>
            ) : (
                <div className='space-y-4'>
                    {logs.map((log) => (
                        <PacketLogCard
                            key={log.id}
                            log={log}
                        />
                    ))}
                </div>
            )}
            <PaginationControls
                log_length={logs.length}
                currentPage={currentPageRef.current}
                totalPages={pagination.totalPages}
                isLoading={isLoading}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
